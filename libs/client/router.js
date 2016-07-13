import React from 'react'
import Home from './pages/Home'
import Page from './pages/Page'
import SpecialPage from './pages/SpecialPage'
import api from './api.js'

function matchRoute( path ) {
  var chosenRoute;
  var routes = [
    // Home page / Hot
    [
      /^\/?$|\/hot\/(.*)$/,
      function( info ) {
        var filter = info[1] || '';
        return {
          children: [
            React.createElement(Home, {
              title: filter ? 'Hot (' + filter + ')' : 'Hot',
              filter: filter,
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
          title: '404 - Page Not Found',
          children: React.DOM.p({},'The path ' + info[1] + ' is not the path you are looking for.')
        }
      }
    ]
  ];

  routes.some( function ( route ) {
    var res = path.match( route[0] );
    if ( res ) {
      chosenRoute = route[1](res);
      return true;
    }
  } );
  return chosenRoute;
}

export default matchRoute
