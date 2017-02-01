import { render } from 'react-dom'

import 'reset-css/reset.less'
import './main.less'

import shared from './../shared'

import overlayRoutes from './routesOverlays.js'
import Api from './api.js'
import mwStorage from './mediawiki-storage'

var config = JSON.parse( document.body.getAttribute( 'data-config' ) || '{}' );
// add user opt in options if settings are enabled by app
if ( config.settingsEnabled ) {
  Object.assign( config.siteoptions, JSON.parse( mwStorage.get( 'mobile-options' ) || '{}' ) );
}

var api = new Api( config.siteinfo.apiPath );

// Add client side specific properties.
config.storage = mwStorage;
config.api = api;
if ( config.fallbackPath ) {
  api.prefetch( config.fallbackPath, config.fallbackProps );
}
var query = shared.router.queryStringToObject( window.location.search );
config.uselang = query.uselang || 'en';
shared.init( config, overlayRoutes );

document.body.className += ' client-js';

render(
  shared.render( window.location.pathname, window.location.hash, {} ),
  document.getElementById( 'app' )
)
