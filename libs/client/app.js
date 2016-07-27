import React from 'react'
import { render } from 'react-dom'
import 'reset-css/reset.css'
import './main.css'
import App from './containers/App'
import router from './router.js'

import routes from './routes.js'
import overlayRoutes from './routesOverlays.js'

import api from './api.js'

var globalProps = {
  api: api,
  router: router
};

// register all the routes
routes.concat( overlayRoutes ).forEach( function ( args ) {
  router.addRoute.apply( router, args );
} );

function renderCurrentRoute() {
  render(
    React.createElement( App,
      router.matchRoute( window.location.pathname, window.location.hash, globalProps )
    ),
    document.getElementById( 'app' )
  )
}

if ( 'onhashchange' in window ) {
  window.onhashchange = renderCurrentRoute;
}
renderCurrentRoute();
