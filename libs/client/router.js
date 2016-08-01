import React from 'react'
import EventEmitter from 'events'

import Content from './containers/Content'
import ErrorBox from './components/ErrorBox'

var routes = [
  // no fragment
  [
    /^#(.*)/,
    function () {
      return {}
    }
  ],
  // 404
  [
    /(.*)/,
    function ( info, props ) {
      return Object.assign( {}, props, {
        title: '404 - Page Not Found',
        children: Content({ children:
          ErrorBox( { msg: 'The path ' + info[1] + ' is not the path you are looking for.' } )
        })
      } )
    }
  ]
];

const events = new EventEmitter();

var router = {
  on: function ( eventName, handler ) {
    events.on( eventName, handler );
  },
  back: function () {
    window.history.back();
  },
  addRoute: function ( regExp, handler ) {
    // new routes get added to front
    routes.unshift( [ regExp, handler ] );
  },
  matchRoute: matchRoute,
  navigateTo: function ( path, hash, useReplaceState ) {
    var currentPath = window.location.pathname + window.location.search,
      state = {
        scrollY: window.scrollY
      };

    if ( hash === undefined ) {
      hash = path.split( '#' );
      path = hash[0];
      hash = hash[1] ? '#' + hash[1] : '';
    }
    if ( path ) {
      if ( useReplaceState ) {
        // TODO: older browser support
        history.replaceState( {}, null, path );
      } else {
        // replace the existing state with information about the scroll position
        history.replaceState( state, null, currentPath );
        // navigate to new page
        history.pushState( {}, null, path );
      }
      events.emit( 'onpushstate' );
    }
    if ( hash ) {
      if ( window.location.hash ) {
        history.replaceState( {}, null, hash );
        events.emit( 'onreplacestate' );
      } else {
        window.location.hash = hash;
      }
    }
  }
};

function matchRouteInternal( routes, path, props ) {
  var chosenRoute;
  props = props || {};
  props.router = router;
  routes.some( function ( route ) {
    var res = path.match( route[0] );
    if ( res ) {
      chosenRoute = route[1]( res, props );
      return true;
    } else {
    }
  } );
  return chosenRoute;
}

function matchFragment( fragment, props ) {
  return matchRouteInternal( routes, fragment, props );
}

function matchRoute( path, fragment, props ) {
  var route = matchRouteInternal( routes, path || window.location.pathname, props );
  var childProps = Object.assign( {}, route );
  // avoid chaos
  delete childProps.children;
  delete childProps.key;

  var fragmentRoute = matchFragment( fragment || window.location.hash || '#', childProps );
  return Object.assign( {}, route, fragmentRoute );
}

export default router