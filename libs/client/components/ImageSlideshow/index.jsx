import React from 'react'
import { Icon } from 'wikipedia-react-components'

import './styles.less'

export default React.createClass({
  getInitialState() {
    return {
      numImages: 0,
      loop: false,
      activeImage: 0
    }
  },
  onClick( ev ) {
    ev.preventDefault();
    this.props.router.navigateTo( '#/media/' +
      ev.currentTarget.getAttribute( 'href' ).replace( './File:', '' ) );
  },
  _normalize( active ) {
    if ( active < 0 ) {
      active = this.state.numImages - 1;
    } else if ( active > this.state.numImages - 1 ) {
      active = 0;
    }
    this.setState( { activeImage: active } );
  },
  next() {
    this._normalize( this.state.activeImage + 1 );
  },
  prev() {
    this._normalize( this.state.activeImage - 1 );
  },
  componentWillMount() {
    this.setState( { numImages: this.props.images.length } );
  },
  render() {
    var props = this.props;
    var self = this;
    var active = this.state.activeImage;
    var prev = active === 0 ? null :
      <Icon glyph="arrow-invert" small={true} className="arrow-left" onClick={this.prev} />;
    var next = active > this.state.numImages - 2 ? null :
      <Icon glyph="arrow-invert" small={true} className="arrow-right" onClick={this.next} />

    return (
      <div className="component-image-slideshow">
        {prev}
        <ul> {
           props.images.map( function( img, i ){
             var src = img.src;
             var className = i === active ? 'active' : '';
             return (
               <li className={className} key={"image-slide-" + i}>
                 <a href={img.href} onClick={self.onClick}>
                   <img src={src} alt={img.caption} />
                  </a>
                </li>
             );
           } )
         }
        </ul>
        {next}
      </div>
    );
  }
} );
