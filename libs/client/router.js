import React from 'react'

var routes = [
  // no fragment
  [
    /^#(.*)/,
    function ( info ) {
      return {}
    }
  ],
  // 404
  [
    /(.*)/,
    function ( info, props ) {
      return Object.assign( {}, props, {
        title: '404 - Page Not Found',
        children: React.DOM.p({},'The path ' + info[1] + ' is not the path you are looking for.')
      } )
    }
  ]
];

var router = {
  back: function () {
    window.history.back();
  },
  addRoute: function ( regExp, handler ) {
    // new routes get added to front
    routes.unshift( [ regExp, handler ] );
  },
  matchRoute: matchRoute,
  navigateTo: function ( path, hash ) {
    if ( hash ) {
      window.location.pathname = path;
      window.location.hash = hash;
    } else {
      window.location.hash = path;
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