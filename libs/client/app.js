import { render } from 'react-dom'

import 'reset-css/reset.less'
import './main.less'

import shared from './../shared'

import routes from './routes.js'
import overlayRoutes from './routesOverlays.js'
import Api from './api.js'
import mwStorage from './mediawiki-storage'

var config = JSON.parse( document.body.getAttribute( 'data-config' ) || '{}' );
// add user opt in options
Object.assign( config.siteinfo, JSON.parse( mwStorage.get( 'mobile-options' ) || '{}' ) );

var api = new Api( config.siteinfo.apiPath );

// Add client side specific properties.
config.storage = mwStorage;
config.api = api;
if ( config.fallbackPath ) {
  api.prefetch( config.fallbackPath, config.fallbackProps );
}
shared.init( config, routes.concat( overlayRoutes ) );

function renderCurrentRoute( ev ) {
  var props = ev ? ev.state : {};

  render(
    shared.render( window.location.pathname, window.location.hash, props ),
    document.getElementById( 'app' )
  )
}

if ( 'onpopstate' in window ) {
  window.onpopstate = renderCurrentRoute;
  shared.router.on( 'onpushstate', renderCurrentRoute );
  shared.router.on( 'onreplacestate', renderCurrentRoute );
}

renderCurrentRoute();
