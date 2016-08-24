import React from 'react'

import './styles.less'

export default React.createClass({
  onClick( ev ) {
    ev.preventDefault();
    this.props.router.navigateTo( '#/media/' +
      ev.currentTarget.getAttribute( 'href' ).replace( '/wiki/File:', '' ) );
  },
  render() {
    var props = this.props;
    var self = this;

    return (
      <ul className="component-image-bubbles"> {
         props.images.map( function( img, i ){
           var src = img.src;
           return (
             <li key={"bubble-" + i}>
               <a href={img.href} onClick={self.onClick}>
                 <img src={src} alt={img.caption} />
                </a>
              </li>
           );
         } )
       } </ul>
    );
  }
} );
