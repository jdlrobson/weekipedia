import React from 'react'

import SearchOverlay from './overlays/SearchOverlay'

import Home from './pages/Home'
import Page from './pages/Page'
import SpecialPage from './pages/SpecialPage'
import Random from './pages/Random'
import Nearby from './pages/Nearby'

import api from './api.js'

var router = {
  back: function () {
    window.history.back();
  },
  navigateTo: function ( path, hash ) {
    if ( hash ) {
      window.location.pathname = path;
      window.location.hash = hash;
    } else {
      window.location.hash = path;
      matchRoute();
    }
  }
};

function matchRouteInternal( routes, path ) {
  var chosenRoute;
  routes.some( function ( route ) {
    var res = path.match( route[0] );
    if ( res ) {
      chosenRoute = route[1](res, router);
      chosenRoute.router = router;
      return true;
    }
  } );
  return chosenRoute;
}

function matchFragment( fragment, mainRoute ) {
	var chosenRoute;
  var routes = [
    // Search Overlay
    [
      /#\/search$/,
      function ( info ) {
        return {
          overlay: React.createElement(SearchOverlay, {
            lang: mainRoute.lang,
            router: mainRoute.router,
            api: api
          })
        }
      },
    ],
    // no fragment
    [
      /(.*)/,
      function ( info ) {
        return {}
      }
    ]
  ];
  return matchRouteInternal( routes, fragment );
}

function matchRoute( path, fragment ) {
  var routes = [
    // Random
    [
      /^\/([a-z]*)\/wiki\/Special:Random\/?(.*)|^\/wiki\/Special:Random$/,
      function( info ) {
        var lang = info[1] || 'en';

        return {
          lang: lang,
          children: [
            React.createElement(Random, {
              key: 'page-special-random',
              lang: lang,
              api: api
            })
          ]
        }
      }
    ],
    // Nearby
    [
      /^\/([a-z]*)\/wiki\/Special:Nearby\/?(.*)|^\/wiki\/Special:Nearby\/?(.*)$/,
      function( info ) {
        var props = {
          key: 'page-special-nearby',
          api: api
        };
        var lang = info[1] || 'en';
        if ( info[2] ) {
          var coords = info[2].split( ',' );
          props.latitude = coords[0];
          props.longitude = coords[1];
        }
        props.lang = lang

        return {
          lang: lang,
          children: [
            React.createElement(Nearby, props)
          ]
        }
      }
    ],
    [
      // Home page / Hot
      /^\/?$|\/hot\/(.*)$/,
      function( info ) {
        var filter = info[1] || '';
        var args = filter = filter.split( '/' );

        return {
          children: [
            React.createElement(Home, {
              title: 'Hot',
              halflife: args[1],
              wiki: args[0] || 'enwiki',
              key: 'home-' + filter,
              api: api
            })
          ]
        }
      }
    ],
    // View a page
    [
      /^\/([a-z]*)\/wiki\/(.*)|^\/wiki\/(.*)/,
      function ( info ) {
        var title = info[2] || info[3],
          titleSansPrefix = title.substr(title.indexOf( ':' ) + 1),
          lang = info[1] || 'en';

        // FIXME: i18n
        if ( title.indexOf( 'Special:' ) === 0 ) {
          return {
            lang: lang,
            children: [
              React.createElement(SpecialPage, {
                key: 'page-' + titleSansPrefix,
                lang: lang,
                title: titleSansPrefix
              })
            ]
          }
        } else {
          return {
            lang: lang,
            children: [
              React.createElement(Page, {
                key: 'page-' + title,
                api: api,
                lang: lang,
                title: title
              })
            ]
          }
        }
      }
    ],
    // 404
    [
      /(.*)/,
      function ( info ) {
        return {
          lang: lang,
          title: '404 - Page Not Found',
          children: React.DOM.p({},'The path ' + info[1] + ' is not the path you are looking for.')
        }
      }
    ]
  ];

  var route = matchRouteInternal( routes, path || window.location.pathname );
  var fragmentRoute = matchFragment( fragment || window.location.hash, route );
  return Object.assign( {}, route, fragmentRoute );
}

export default matchRoute
