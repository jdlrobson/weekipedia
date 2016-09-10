import React from 'react'
import { render } from 'react-dom'
import messages, { msg } from 'mediawiki-messages'

import 'reset-css/reset.less'
import './main.less'

import App from './containers/App'

import router from './router.js'
import routes from './routes.js'
import overlayRoutes from './routesOverlays.js'
import api from './api.js'
import mwStorage from './mediawiki-storage'

var config = JSON.parse( document.body.getAttribute( 'data-config' ) || '{}' );

var globalProps = Object.assign( {}, config, {
  api: api,
  router: router,
  storage: mwStorage,
  msg: msg,
  messages: messages
} );

messages.load( config.i18n || {} );

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

if ( 'onpopstate' in window ) {
  window.onpopstate = renderCurrentRoute;
  router.on( 'onpushstate', renderCurrentRoute );
  router.on( 'onreplacestate', renderCurrentRoute );
}

renderCurrentRoute();
