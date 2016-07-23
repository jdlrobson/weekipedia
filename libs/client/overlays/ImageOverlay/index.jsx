import React, { Component } from 'react'

import './styles.css'

import Overlay from './../../containers/Overlay'

import IntermediateState from './../../components/IntermediateState';
import Button from './../../components/Button';
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

    this.props.api.fetch( route ).then( function ( img ) {
      self.setState( { img: img } );
    } );
  },
  render(){
    var content, footer, meta,
      licenseUrl = '', licenseName = '',
      description = '', artist = '',
      img = this.state.img;
    if ( img ) {
      var imgStyle = {
        width: img.thumbwidth,
        height: img.thumbheight
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
          <p className="truncated-text" dangerouslySetInnerHTML={{ __html: description }}></p>
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
