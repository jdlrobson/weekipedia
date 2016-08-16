import React from 'react'
import { render } from 'react-dom'
import 'reset-css/reset.less'
import './main.less'
import App from './containers/App'
import router from './router.js'

import routes from './routes.js'
import overlayRoutes from './routesOverlays.js'

import api from './api.js'
import mwStorage from './mediawiki-storage'
import initOffline from './offline'

var config = JSON.parse( document.body.getAttribute( 'data-config' ) || '{}' );

var globalProps = {
  api: api,
  router: router,
  storage: mwStorage,
  canAuthenticate: config.SIGN_IN_SUPPORTED,
  siteinfo: config.siteinfo,
  username: config.username,
  project: config.PROJECT || 'wikipedia'
};

// register all the routes
routes.concat( overlayRoutes ).forEach( function ( args ) {
  router.addRoute.apply( router, args );
} );

function renderCurrentRoute( ev ) {
  var props = Object.assign( {}, globalProps, ev ? ev.state : {} );

  render(
    React.createElement( App,
      router.matchRoute( window.location.pathname, window.location.hash, props )
    ),
    document.getElementById( 'app' )
  )
}

if ( 'onhashchange' in window ) {
  window.onhashchange = renderCurrentRoute;
}

if ( 'onpopstate' in window ) {
  window.onpopstate = renderCurrentRoute;
  router.on( 'onpushstate', renderCurrentRoute );
  router.on( 'onreplacestate', renderCurrentRoute );
}

renderCurrentRoute();
if ( config.OFFLINE_VERSION ) {
  initOffline();
}
