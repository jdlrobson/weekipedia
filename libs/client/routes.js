import React from 'react'

import Home from './pages/Home'
import Page from './pages/Page'
import SpecialPage from './pages/SpecialPage'
import MostRead from './pages/MostRead'
import Random from './pages/Random'
import Nearby from './pages/Nearby'

import utils from './utils'

export default [
  [
    // Home page / Hot
    /^\/?$|^\/hot\/(.*)$/,
    function( info, props ) {
      var filter = info[1] || '';
      var args = filter.split( '/' );

      return Object.assign( {}, props, {
        children: [
          React.createElement( Home,
            Object.assign( {}, props, {
              title: 'Hot',
              halflife: args[1],
              wiki: args[0] || 'enwiki',
              key: 'home-' + filter
            } )
          )
        ]
      } );
    }
  ],
  // View a page
  [
    /^\/([a-z\-]*)\/wiki\/(.*)|^\/wiki\/(.*)/,
    function ( info, props ) {
      var title = info[2] || info[3],
        titleSansPrefix = title.substr(title.indexOf( ':' ) + 1),
        lang = info[1] || 'en';

      props.lang = lang;
      props.mobileUrl = utils.getAbsoluteUrl( title, lang, 'm.wikipedia.org' );
      props.desktopUrl = utils.getAbsoluteUrl( title, lang, 'wikipedia.org' );

      // FIXME: i18n
      if ( title.indexOf( 'Special:' ) === 0 ) {
        props.children = [
          React.createElement( SpecialPage,
            Object.assign( {}, props, {
              key: 'page-' + titleSansPrefix,
              title: titleSansPrefix
            } )
          )
        ];
      } else {
        props.title = decodeURIComponent( title );
        props.children = [
          React.createElement( Page,
            Object.assign( {}, props, {
              key: 'page-' + title,
              title: title
            } )
          )
        ];
      }
      return props;
    }
  ],
  // Random
  [
    /^\/([a-z\-]*)\/wiki\/Special:MostRead\/?(.*)|^\/wiki\/Special:MostRead$/,
    function( info, props ) {
      var lang = info[1] || 'en';
      props.lang = lang;

      props.children = [
        React.createElement( MostRead,
          Object.assign( {}, props, {
            key: 'page-special-most-read'
          } )
        )
      ];
      return props;
    }
  ],
  // Random
  [
    /^\/([a-z\-]*)\/wiki\/Special:Random\/?(.*)|^\/wiki\/Special:Random$/,
    function( info, props ) {
      var lang = info[1] || 'en';
      props.lang = lang;

      props.children = [
        React.createElement( Random,
          Object.assign( {}, props, {
            key: 'page-special-random'
          } )
        )
      ];
      return props;
    }
  ],
  // Nearby
  [
    /^\/([a-z\-]*)\/wiki\/Special:Nearby\/?(.*)|^\/wiki\/Special:Nearby\/?(.*)$/,
    function( info, props ) {
      var lang = info[1] || 'en';

      props.key = 'page-special-nearby';

      if ( info[2] ) {
        var coords = info[2].split( ',' );
        props.latitude = coords[0];
        props.longitude = coords[1];
      }
      props.lang = lang

      return Object.assign( {}, props, {
        children: [
          React.createElement( Nearby, props )
        ]
      } );
    }
  ]
];