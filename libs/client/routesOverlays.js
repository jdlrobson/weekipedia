import React from 'react'

import ImageOverlay from './overlays/ImageOverlay'
import LanguageOverlay from './overlays/LanguageOverlay'
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
  // Languages
  [
    /^#\/languages$/,
    function ( info, props ) {
      return {
        overlay: React.createElement( LanguageOverlay, props )
      }
    },
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
