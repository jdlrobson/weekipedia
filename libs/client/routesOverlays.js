import React from 'react'

import ImageOverlay from './overlays/ImageOverlay'
import SearchOverlay from './overlays/SearchOverlay'

export default [
  // Image Overlay
  [
    /^#\/media\/(.*)$/,
    function ( info, props ) {
      var overlayProps = Object.assign( {}, props, {
        title: info[1]
      } );
      return {
        overlay: React.createElement( ImageOverlay, overlayProps )
      }
    }
  ],
  // Search Overlay
  [
    /^#\/search$/,
    function ( info, props ) {
      return {
        overlay: React.createElement( SearchOverlay, props )
      }
    },
  ]
];
