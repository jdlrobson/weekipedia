import EventEmitter from 'events'

const events = new EventEmitter();
var routes = [];

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
  navigateTo: function ( pathOrLocation, hashOrTitle, useReplaceState ) {
    var path, hash, search, title, url;
    if ( !pathOrLocation || typeof pathOrLocation === 'string' ) {
      path = pathOrLocation;
      hash = hashOrTitle;
      search = window.location.search;
    } else {
      hash = pathOrLocation.hash;
      path = pathOrLocation.pathname;
      search = pathOrLocation.search;
      title = hashOrTitle;
    }

    var currentPath = window.location.pathname,
      state = {
        scrollY: window.scrollY
      };

    if ( search ) {
      currentPath += '?' + search;
    }
    if ( hash === undefined ) {
      hash = path.split( '#' );
      path = hash[0];
      hash = hash[1] ? '#' + hash[1] : '';
    }
    if ( path ) {
      url = search ? path + '?' + search : path;

      if ( useReplaceState ) {
        // TODO: older browser support
        history.replaceState( {}, null, url );
      } else {
        // replace the existing state with information about the scroll position
        history.replaceState( state, null, currentPath );
        // navigate to new page
        history.pushState( {}, null, url );
      }
      events.emit( 'onpushstate' );
    }
    if ( hash ) {
      if ( window.location.hash ) {
        history.replaceState( {}, null, hash );
        events.emit( 'onreplacestate' );
      } else {
        // record the scroll position in current path
        history.replaceState( state, null, window.location.pathname );
        window.location.hash = hash;
      }
    }
    if ( title && typeof document !== undefined ) {
      document.title = title;
    }
  }
};

function matchRouteInternal( routes, path, props, query ) {
  var chosenRoute;
  props = props || {};
  props.router = router;
  routes.some( function ( route ) {
    var res = path.match( route[0] );
    if ( res ) {
      chosenRoute = route[1]( res, props, query );
      return true;
    } else {
    }
  } );
  return chosenRoute;
}

function matchFragment( fragment, props ) {
  return matchRouteInternal( routes, fragment, props, false );
}

function matchRoute( path, fragment, props, query ) {
  if ( query === undefined ) {
    var i, vals,
      args = window.location.search.substr( 1 ).split( '&' );

    query = {};
    for ( i = 0; i < args.length; i++ ) {
      vals = args[i].split( '=' );
      query[vals[0]] = vals[1];
    }
  }
  props.query = query;

  var route = matchRouteInternal( routes, path || window.location.pathname, props, query );
  var childProps = Object.assign( {}, route );
  // avoid chaos
  delete childProps.children;
  delete childProps.key;

  var fragmentRoute = matchFragment( fragment || window.location.hash || '#', childProps );
  return Object.assign( {}, route, fragmentRoute );
}

export default router