/* global console */
import React from 'react';
import { observable } from 'mobx';

import isRTL from './is-rtl';

const APP_SESSION_KEY = 'app-session';

const store = observable( {
	siteoptions: {},
	projects: [],
	// Developers can enable this for debugging
	devTools: false,
	pageviews: 0,
	page: null,
	isMenuOpen: false,
	notification: '',
	isRTL: false,
	lang: 'en',
	session: null,
	isOverlayFullScreen: true,
	isOverlayEnabled: false
} );

let loginRequest;

store.isFeatureEnabled = function ( featureName ) {
	return this.siteoptions && this.siteoptions[ featureName ];
};

store.addProjects = function ( projects ) {
	this.projects = projects;
};

store.loadSiteOptions = function ( options ) {
	this.siteoptions = options;
};

store.showOverlay = function ( overlay, fullScreen = true ) {
	// In future we won't do this as part of this method.
	this.overlay = false;
	this.isOverlayEnabled = false;
	this.overlay = React.cloneElement( overlay, {
		store: this
	} );
	this.isOverlayEnabled = true;
	this.isOverlayFullScreen = fullScreen;
};

store.clearUserNotification = function () {
	this.notification = null;
};

store.setUserNotification = function ( msg ) {
	var self = this;
	this.notification = msg;
	if ( msg ) {
		clearTimeout( this.pendingToast );
		this.pendingToast = setTimeout( function () {
			self.setUserNotification( null );
		}, 5000 );
	}
};

store.closeMainMenu = function () {
	this.isMenuOpen = false;
	this.hideOverlays();
};

store.openMainMenu = function () {
	this.isMenuOpen = true;
	this.hideOverlays();
};

store.hideOverlays = function () {
	if ( this.isOverlayEnabled ) {
		this.isOverlayEnabled = false;
		if ( window.location.hash && window.location.hash !== '#' ) {
			window.location.hash = '#';
		}
	}
	this.setUserNotification( null );
};

function getLocalSession( storage ) {
	var localSession = storage.get( APP_SESSION_KEY );
	localSession = localSession === 'false' ? null : JSON.parse( localSession );
	if ( localSession && localSession.timestamp ) {
		// is it greater than 1 hours old?
		if ( ( new Date() - new Date( localSession.timestamp ) ) / 1000 > 60 * 60 ) {
			localSession = null;
		}
	} else if ( localSession && !localSession.timestamp ) {
		localSession = null;
	}
	return localSession;
}

store.clearSession = function ( storage ) {
	this.session = null;
	storage.remove( APP_SESSION_KEY );
};

store.loadSession = function ( api, storage ) {
	var session = getLocalSession( storage );
	if ( this.session === undefined && session ) {
		this.session = session;
	} else {
		this.login( api, storage );
	}
};

store.getLangProject = function () {
	if ( !this.project ) {
		throw new Error( 'Project not set' );
	}
	if ( !this.lang ) {
		throw new Error( 'Language not set' );
	}
	return this.lang + '.' + this.project;
};

store.setProject = function ( project ) {
	if ( project ) {
		this.project = project;
	} else {
		/* eslint-disable no-console */
		console.log( 'Attempt to set project as undefined' );
		/* eslint-enable no-console */
	}
};

store.setLanguage = function ( langCode ) {
	this.lang = langCode;
	this.isRTL = isRTL( langCode );
};

store.setPage = function ( title, langCode, project, page ) {
	this.hideOverlays();
	this.title = title;
	this.setLanguage( langCode );
	this.setProject( project );
	this.page = page;
	this.pageviews++;
};

store.getForeignUrl = function ( title, lang ) {
	var project = this.project;
	var source = lang + '.' + project;
	return '/' + source + '/' + title;
};

store.getLocalUrl = function ( title, params, query = {} ) {
	var project = this.project;
	var lang = this.lang;
	var source = project && lang ? lang + '.' + project : lang + '/wiki';
	title = title ? encodeURIComponent( title ).replace( '%3A', ':' ) : '';
	params = params ? '/' + encodeURIComponent( params ).replace( /%2F/g, '/' ) : '';
	var qs = Object.keys( query )
		.map( ( key ) => `${key}=${encodeURIComponent( query[ key ] )}` ).join( '&' );
	if ( qs ) {
		qs = '?' + qs;
	}

	return '/' + source + '/' + title + params + qs;
};

store.login = function ( api, storage ) {
	var self = this;
	if ( !loginRequest ) {
		loginRequest = api.fetch( '/auth/whoamithistime', {
			credentials: 'include'
		} );
	}
	return loginRequest.then( function ( session ) {
		// cache for next session
		session.timestamp = new Date();
		storage.set( APP_SESSION_KEY, JSON.stringify( session ) );
		self.session = session;
	} ).catch( function () {
		storage.set( APP_SESSION_KEY, 'false' );
		loginRequest = null;
		self.session = null;
	} );
};

export default store;
