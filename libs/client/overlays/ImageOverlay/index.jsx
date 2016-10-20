import React from 'react'

import './styles.less'

import Overlay from './../../containers/Overlay'
import TruncatedText from './../../containers/TruncatedText'

import IntermediateState from './../../components/IntermediateState';
import { Button } from 'wikipedia-react-components';
import HorizontalList from './../../components/HorizontalList';

export default React.createClass({
  getInitialState() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      img: null
    }
  },
  getDefaultProps() {
    return {
      api: null,
      lang: 'en'
    }
  },
  componentDidMount(){
    var w = this.state.width;
    var h = this.state.height;
    var route = '/api/file/' + this.props.lang + '/' + w + ',' + h + '/' + encodeURIComponent( this.props.title );
    var self = this;

    this.props.api.fetch( route ).then( function ( imgData ) {
      var img = new Image();
      function updateState() {
        self.setState( { img: imgData } );
      }

      img.addEventListener( 'load', updateState );
      img.addEventListener( 'complete', updateState );
      img.src = imgData.thumburl;
    } );
  },
  render(){
    var content, footer, meta, isLandscape,
      licenseUrl = '', licenseName = '',
      description = '', artist = '',
      img = this.state.img;
    if ( img ) {
      isLandscape = img.thumbwidth > img.thumbheight;
      var imgStyle = {
        maxHeight: this.state.height,
        maxWidth: this.state.width,
        width: 'auto',
        height: 'auto'
      }
      content = <img src={img.thumburl} style={imgStyle} />;
      if ( img.extmetadata ) {
        meta = img.extmetadata;
        artist = meta.Artist ? meta.Artist.value : null;
        description = meta.ImageDescription ? meta.ImageDescription.value : null;
        licenseName = meta.LicenseShortName ? meta.LicenseShortName.value : null;
        licenseUrl = meta.LicenseUrl ? meta.LicenseUrl.value : null;
      }

      footer = (
        <div className="details">
          <Button isPrimary="1" label="Details" href={img.descriptionurl}/>
          <TruncatedText><p dangerouslySetInnerHTML={{ __html: description }}></p></TruncatedText>
          <HorizontalList isSeparated="1" className="license">
            <span dangerouslySetInnerHTML= {{ __html: artist }}></span>
            <a href={licenseUrl}>{licenseName}</a>
          </HorizontalList>
        </div>
      )
    } else {
      content = <IntermediateState />;
    }

    return (
      <Overlay router={this.props.router} isLightBox="1">
        <div className="image-wrapper">
          <div>{content}</div>
        </div>
        {footer}
      </Overlay>
    )
  }
} );
