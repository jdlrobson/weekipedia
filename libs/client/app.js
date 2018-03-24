import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import React from 'react';
import { onClickInternalLink as onClickInternalLinkMaker } from './pages/utils.jsx';

import 'reset-css/reset.less';
import './main.less';

import shared from './../shared';

import overlayRoutes from './routesOverlays.js';
import Api from './api.js';
import mwStorage from './mediawiki-storage';
import store from './store';

var config = JSON.parse( document.body.getAttribute( 'data-config' ) || '{}' );
// add user opt in options if settings are enabled by app
if ( config.settingsEnabled ) {
	Object.assign( config.siteoptions, JSON.parse( mwStorage.get( 'mobile-options' ) || '{}' ) );
}

var api = new Api( config.siteinfo.apiPath, store );

// Add client side specific properties.
config.storage = mwStorage;
config.api = api;
if ( config.fallbackPath ) {
	api.prefetch( config.fallbackPath, config.fallbackProps );
}
var router = shared.router;
var query = router.queryStringToObject( window.location.search );
var userOptions = JSON.parse( mwStorage.get( 'mobile-options' ) || '{}' );

store.setProject(config.project);
store.loadSiteOptions(
	Object.assign( {}, config.siteoptions, userOptions )
);

store.addProjects( config.supportedProjects );

config.store = store;

// Config will be passed down as properties so remove things that are not needed before that happens
delete config.siteoptions;
delete config.project;
delete config.supportedProjects;

var props = shared.init( config, overlayRoutes );

// Cleanup
delete config.i18n;

document.body.className += ' client-js';

const onClickInternalLink = onClickInternalLinkMaker( { router, store, api } );

render(
	// Setup a Provider with the store
	React.createElement( Provider, { api, store, a: 1,  onClickInternalLink },
		shared.render( window.location.pathname, window.location.hash )
	),
	document.getElementById( 'app' )
);

const renderCurrentRoute = () => {
	var path = window.location.pathname;
	var hash = window.location.hash;
	var route = router.matchRoute( path, hash, props );

	store.setPage( route.title, route.lang, route.project, route.children[ 0 ] );
	if ( route.overlay ) {
		store.showOverlay( route.overlay );
	}
};

if ( 'onpopstate' in window ) {
	window.onpopstate = renderCurrentRoute;
	router.on( 'onpushstate', renderCurrentRoute );
	router.on( 'onreplacestate', renderCurrentRoute );
}
renderCurrentRoute();
