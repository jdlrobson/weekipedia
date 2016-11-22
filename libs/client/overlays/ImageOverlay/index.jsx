import React from 'react'
import { Button, HorizontalList, IntermediateState, TruncatedText, Icon } from 'wikipedia-react-components'

import './styles.less'

import Overlay from './../../containers/Overlay'

export default React.createClass({
  getInitialState() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      images: null,
      img: null
    }
  },
  getDefaultProps() {
    return {
      api: null,
      lang: 'en'
    }
  },
  componentDidMount() {
    this.loadCurrentImage( this.props.image );
    this.loadGallery().then( (media) => this.setState( { media: media } ) );
  },
  componentWillReceiveProps( newProps ) {
    this.loadCurrentImage( newProps.image );
  },
  loadCurrentImage( image ){
    var w = this.state.width;
    var h = this.state.height;
    var route = '/api/file/' + this.props.lang + '/' + w + ',' + h + '/' + encodeURIComponent( image );
    var self = this;
    this.setState( { img: null } );

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
  loadGallery() {
    var props = this.props;
    return props.api.getPage( props.title,
      props.langOrLanguageProject
    ).then( function ( page ) {
      return page.lead.media || [];
    } );
  },
  findImage: function( image, offset ) {
    return this.loadGallery().then( function( media ) {
      var index = media.indexOf( 'File:' + image );
      var newIndex = index + offset;
      if ( newIndex < 0 ) {
        newIndex = media.length - 1;
      }
      if ( newIndex >= media.length ) {
        newIndex = 0;
      }
      return media[newIndex].replace( 'File:', '' );
    } );
  },
  previousImage() {
    this.findImage( this.props.image, -1 )
      .then( ( path ) => this.props.router.navigateTo( { hash: '#/media/' + path },
        null, true ) );
  },
  nextImage() {
    this.findImage( this.props.image, 1 )
      .then( ( path ) => this.props.router.navigateTo( { hash: '#/media/' + path },
        null, true ) );
  },
  render(){
    var content, footer, meta, isLandscape,
      leftGutter, rightGutter,
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

    if ( this.state.media ) {
      leftGutter = (
        <div className="gutter">
          <Icon glyph="arrow-invert" onClick={this.previousImage} />
        </div>
      );
      rightGutter = (
        <div className="gutter">
          <Icon glyph="arrow-invert" onClick={this.nextImage}/>
        </div>
      );
    }
    return (
      <Overlay router={this.props.router} isLightBox="1">
        {leftGutter}
        <div className="image-wrapper">
          <div>{content}</div>
        </div>
        {footer}
        {rightGutter}
      </Overlay>
    )
  }
} );
