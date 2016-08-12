import React from 'react'

import Home from './pages/Home'
import Page from './pages/Page'
import SplashScreen from './pages/SplashScreen'
import SpecialPage from './pages/SpecialPage'
import MostRead from './pages/MostRead'
import Random from './pages/Random'
import Nearby from './pages/Nearby'

import utils from './utils'

var routes = [
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
        titleParts = titleSansPrefix.split( '/' ),
        lang = info[1] || 'en';

      props.lang = lang;
      titleSansPrefix = titleParts[0];
      props.mobileUrl = utils.getAbsoluteUrl( title, lang, 'm.' + props.project + '.org' );
      props.desktopUrl = utils.getAbsoluteUrl( title, lang, props.project + '.org' );

      // FIXME: i18n
      if ( title.indexOf( 'Special:' ) === 0 ) {
        props.children = [
          React.createElement( SpecialPage,
            Object.assign( {}, props, {
              key: 'page-' + titleSansPrefix,
              title: titleSansPrefix,
              params: titleParts.slice( 1 )
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
  ]
];
function addSpecialPage( title, Class, handler ) {
  routes.push( [
    new RegExp( '^\/([a-z\-]*)\/wiki\/Special:' + title + '\/?(.*)|^\/wiki\/Special:' + title + '$' ),
    function ( info, props ) {
      var lang = info[1] || 'en';
      props.lang = lang;

      props.children = [
        React.createElement( Class,
          Object.assign( {}, props, {
            key: 'page-special-' + title
          } )
        )
      ];

      return handler ? handler( info, props ) : props;
    }
  ] );
}

function initSpecialPages() {
  addSpecialPage( 'MostRead', MostRead );
  addSpecialPage( 'SplashScreen', SplashScreen );
  addSpecialPage( 'Random', Random );
  addSpecialPage( 'Nearby', Nearby,
    function( info, props ) {
      if ( info[2] ) {
        var coords = info[2].split( ',' );
        props.latitude = coords[0];
        props.longitude = coords[1];
      }
      return props;
    }
  );
}

initSpecialPages();

export default routes;
