import React from 'react'
import Home from './pages/Home.jsx'
import api from './api.js'

function matchRoute( path ) {
  var chosenRoute;
  var routes = [
    // Home page / Hot
    [
      /^\/?$|\/hot\/(.*)$/,
      function( info ) {
        var filter = info[1];
        return {
          title: filter ? 'Hot (' + filter + ')' : 'Hot',
          children: [
            React.createElement(Home, {
              api: api
            })
          ]
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
