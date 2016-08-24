import React from 'react'

import EditorOverlay from './overlays/EditorOverlay'
import CollectionEditorOverlay from './overlays/CollectionEditorOverlay'
import ImageOverlay from './overlays/ImageOverlay'
import LanguageOverlay from './overlays/LanguageOverlay'
import SearchOverlay from './overlays/SearchOverlay'
import TalkOverlay from './overlays/TalkOverlay'
import IssuesOverlay from './overlays/IssuesOverlay'
import MapOverlay from './overlays/MapOverlay'

export default [
  // Talk Overlay
  [
    /^#\/talk\/?([^\/]*)$/,
    function ( info, props ) {
      var overlayProps = Object.assign( {}, props, {
        section: info[1]
      } );
      return {
        overlay: React.createElement( TalkOverlay, overlayProps )
      }
    }
  ],
  // Random map Overlay
  [
    /^#\/explore\/$/,
    function ( info, props ) {
      var lang = props.lang || 'en';
      var overlayProps = Object.assign( {}, props, {
        explorable: true,
        continue: false,
        apiEndpoint: '/api/random/' + lang
      } );
      return {
        overlay: React.createElement( MapOverlay, overlayProps )
      }
    }
  ],
  // Map Collection Overlay
  [
    /^#\/collection-map\/(.*)\/(.*)\/$/,
    function ( info, props ) {
      var lang = props.lang || 'en';
      var overlayProps = Object.assign( {}, props, {
        explorable: false,
        apiEndpoint: '/api/' + lang + '/collection/by/' + info[1] + '/' + info[2]
      } );
      return {
        overlay: React.createElement( MapOverlay, overlayProps )
      }
    }
  ],
  // Map Overlay
  [
    /^#\/map\/(.*)\/(.*)\/(.*)\/$/,
    function ( info, props ) {
      var overlayProps = Object.assign( {}, props, {
        lat: parseFloat( info[1], 10 ),
        lon: parseFloat( info[2], 10 ),
        zoom: parseInt( info[3], 10 )
      } );
      return {
        overlay: React.createElement( MapOverlay, overlayProps )
      };
    }
  ],
  // Edit Overlay
  [
    /^#\/editor\/?([^\/]*)\/?(.*)$/,
    function ( info, props ) {
      var overlayProps = Object.assign( {}, props, {
        section: info[1]
      } );
      if ( info[2] ) {
        overlayProps.wikitext = atob( info[2] );
      }
      return {
        overlay: React.createElement( EditorOverlay, overlayProps )
      }
    }
  ],
  // Edit Overlay
  [
    /^#\/note-editor\/(.*)$/,
    function ( info, props ) {
      var overlayProps = Object.assign( {}, props, {
        displayTitle: 'public note',
        placeholder: 'Write down ideas, dates, todo\'s.\nAnything you write here is public.\nPlease don\'t share too much.',
        title: decodeURIComponent( 'User:' + info[1] + '/notes/' + props.title ),
        section: 0
      } );
      return {
        overlay: React.createElement( EditorOverlay, overlayProps )
      }
    }
  ],
  // Image Overlay
  [
    /^#\/media\/(.*)$/,
    function ( info, props ) {
      var overlayProps = Object.assign( {}, props, {
        image: info[1]
      } );
      return {
        overlay: React.createElement( ImageOverlay, overlayProps )
      }
    }
  ],
  // collections
  [
    /^#\/edit-collection\/(.*)\/(.*)$/,
    function ( info, props ) {
      var overlayProps = Object.assign( {}, props, {
        username: info[1],
        id: info[2]
      } );
      return {
        overlay: React.createElement( CollectionEditorOverlay, overlayProps )
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
    }
  ],
  // Issues
  [
    /^#\/issues$/,
    function ( info, props ) {
      return {
        overlay: React.createElement( IssuesOverlay, props )
      }
    }
  ],
  // Search Overlay
  [
    /^#\/search\/?(.*)$/,
    function ( info, props ) {
      return {
        overlay: React.createElement( SearchOverlay, Object.assign( props, { defaultValue: info[1] } ) )
      }
    }
  ]
];
