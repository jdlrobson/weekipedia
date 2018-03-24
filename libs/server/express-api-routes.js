import uploads from './endpoints/uploads';
import wikitext from './endpoints/wikitext';
import watchlistfeed from './endpoints/watchlist-feed';
import watchlist from './endpoints/watchlist';
import watched from './endpoints/watched';
import watch from './endpoints/watch';
import visits from './endpoints/visits';
import webPushTrend from './endpoints/push-notifications/web-push-trend.js';
import subscribe from './endpoints/subscribe';
import search from './endpoints/search';
import references from './endpoints/references';
import random from './endpoints/random';
import pagehistory from './endpoints/page-history';
import page from './endpoints/page';
import nearby from './endpoints/nearby';
import languages from './endpoints/languages';
import edit from './endpoints/edit';
import diff from './endpoints/diff';
import contributions from './endpoints/contributions';
import collection from './endpoints/collection';
import categories from './endpoints/categories';

import messages from './messages';
import respond from './respond';
import cachedResponses from './cached-response.js';
import { DEFAULT_PROJECT, API_PATH, ALLOWED_PROJECTS, DUMMY_SESSION, COLLECTIONS_INCLUDE_WATCHLIST } from './config';

import initApiProxy from 'express-wikimedia-api-proxy';
import oauthFetchJson from 'oauth-fetch-json';

const TRENDING_HOST = 'http://wikipedia-trending.wmflabs.org';
const RESPONSE_OKAY = JSON.stringify( { msg: 'OK' } );
const cachedResponse = cachedResponses.cachedResponse;
const invalidate = cachedResponses.invalidate;

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated( req, res, next ) {
	if ( req.isAuthenticated() || DUMMY_SESSION ) {
		return next();
	} else {
		res.status( 401 );
		res.send( 'Login required for this endpoint' );
	}
}

function getProject( req ) {
	var proj = { project: DEFAULT_PROJECT };
	if ( req.params.lang ) {
		proj.lang = req.params.lang;
		proj.project = req.params.project;
		if ( req.params.lang.indexOf( '.' ) > -1 ) {
			var tmp = req.params.lang.split( '.' );
			proj.lang = tmp[ 0 ];
			proj.project = tmp[ 1 ];
		}
	}
	proj.project = proj.project || DEFAULT_PROJECT;
	if ( ALLOWED_PROJECTS.indexOf( proj.project ) === -1 ) {
		throw 'The `' + proj.project + '` project is not supported by the web app.';
	}
	return proj;
}

function checkReqParams( req, res, required ) {
	var missing = [];
	required.forEach( function ( param ) {
		if ( req.body && req.body[ param ] === undefined ) {
			missing.push( param );
		}
	} );
	if ( missing.length ) {
		res.status( 400 );
		res.send( 'The following parameters are required: ' + missing.join( ',' ) );
		return false;
	} else {
		return true;
	}
}

function initLoginRoutes( app ) {
	/*
   *******************************************************
   * Begin routes which require authenticated
   *******************************************************
  */
	app.get( '/auth/logout', ensureAuthenticated, function ( req, res ) {
		req.logout();
		res.redirect( '/' );
	} );

	function doEdit( req, res, action ) {
		var p = req.params;
		var body = req.body;
		respond( res, function () {
			var proj = getProject( req );
			return edit( proj.lang, p.title, body.text, body.summary, p.section, proj.project, req.user, action )
				.then( function ( data ) {
					invalidate( API_PATH + 'page/' + proj.lang + '.' + proj.project + '/' + encodeURIComponent( p.title ) );
					invalidate( API_PATH + 'page/' + p.lang + '/' + encodeURIComponent( p.title ) );
					return data;
				} );
		} );
	}

	app.post( '/api/private/edit/:lang/:title/:section?', ( req, res ) => {
		return doEdit( req, res );
	} );

	app.post( '/api/private/edit-append/:lang/:title/:section?', ( req, res ) => {
		return doEdit( req, res, 'appendtext' );
	} );

	app.get( '/api/private/watchlist-feed/:lang/:ns?', ensureAuthenticated, function ( req, res ) {
		var callback = function ( data ) {
			res.setHeader( 'Content-Type', 'application/json' );
			res.status( 200 );
			res.send( JSON.stringify( data ) );
		};
		watchlistfeed( req.params.lang, DEFAULT_PROJECT, req.params.ns, req.user, req.query ).then( callback );
	} );

	app.all( '/api/private/:lang/collection/:id/:action/:title?', ensureAuthenticated, function ( req, res ) {
		var id = parseInt( req.params.id, 10 ) || 0;
		var action = req.params.action;
		var lang = req.params.lang;
		var profile = req.user;
		var title = req.params.title;

		respond( res, function () {
			if ( action === 'create' ) {
				return collection.create( lang, DEFAULT_PROJECT, req.body.title, req.body.description, req.body.image, profile );
			} if ( action === 'edit' ) {
				return collection.edit( lang, DEFAULT_PROJECT, id, req.body.title,
					req.body.description, req.body.image, profile );
			} else if ( action === 'with' ) {
				return collection.includes( lang, DEFAULT_PROJECT, title, COLLECTIONS_INCLUDE_WATCHLIST, profile );
			} else if ( action === 'has' ) {
				return collection.member( lang, DEFAULT_PROJECT, id, [ title ], profile );
			} else {
				return collection.update( lang, DEFAULT_PROJECT, id, [ title ], profile, action === 'remove' );
			}
		} );
	} );

	app.get( '/api/private/watchlist/:lang/:title?', ensureAuthenticated, function ( req, res ) {
		var callback = function ( data ) {
			res.setHeader( 'Content-Type', 'application/json' );
			res.status( 200 );
			res.send( JSON.stringify( data ) );
		};
		if ( req.params.title ) {
			watched( req.params.lang, DEFAULT_PROJECT, [ req.params.title ], req.user ).then( callback );
		} else {
			watchlist( req.params.lang, DEFAULT_PROJECT, 0, req.user, req.query ).then( callback );
		}
	} );

	app.post( '/api/private/watch/:lang/:title', function ( req, res ) {
		watch( req.params.lang, DEFAULT_PROJECT, [ req.params.title ], req.user ).then( function ( data ) {
			res.setHeader( 'Content-Type', 'application/json' );
			res.status( 200 );
			res.send( JSON.stringify( data ) );
		} );
	} );

	app.post( '/api/private/unwatch/:lang/:title', function ( req, res ) {
		watch( req.params.lang, DEFAULT_PROJECT, [ req.params.title ], req.user, true ).then( function ( data ) {
			res.setHeader( 'Content-Type', 'application/json' );
			res.status( 200 );
			res.send( JSON.stringify( data ) );
		} );
	} );
}

function initPostMethods( app ) {
	/*
   *******************************************************
   * Begin POST routes
   *******************************************************
  */
	app.post( '/api/web-push/test', function ( req, res ) {
		if ( checkReqParams( req, res, [ 'feature', 'token', 'browser' ] ) ) {
			res.status( 200 );
			subscribe.ping( req.body.browser, req.body.feature, req.body.token );
			res.send( RESPONSE_OKAY );
		}
	} );

	app.post( '/api/web-push/subscribe', function ( req, res ) {
		if ( checkReqParams( req, res, [ 'feature', 'token', 'browser' ] ) ) {
			res.status( 200 );
			subscribe.add( req.body.browser, req.body.feature, req.body.token );
			res.send( RESPONSE_OKAY );
		}
	} );

	app.post( '/api/web-push/unsubscribe', function ( req, res ) {
		if ( checkReqParams( req, res, [ 'feature', 'token', 'browser' ] ) ) {
			res.status( 200 );
			subscribe.remove( req.body.browser, req.body.feature, req.body.token );
			res.send( RESPONSE_OKAY );
		}
	} );
}

function initGetMethods( app ) {
	app.get( new RegExp( '(^\/api\/trending\/.*)$' ), ( req, res ) => {
		cachedResponse( res, req.url, function () {
			console.log( `${TRENDING_HOST}${req.params[ 0 ]}` );
			return oauthFetchJson( `${TRENDING_HOST}${req.params[ 0 ]}` );
		} );
	} );

	app.get( '/api/random/:lang/', ( req, res ) => {
		return cachedResponse( res, null, function () {
			var param,
				params = {};
			for ( param in [ 'picontinue', 'continue' ] ) {
				if ( req.query[ param ] ) {
					params[ param ] = req.query[ param ];
				}
			}

			return random( req.params.lang, 0, DEFAULT_PROJECT, params );
		} );
	} );

	app.get( '/api/categories/:lang/:title?/', ( req, res ) => {
		return cachedResponse( res, null, function () {
			var p = req.params;
			return categories( p.lang, p.title, DEFAULT_PROJECT, req.query );
		} );
	} );

	app.get( '/api/search/:lang/:term', ( req, res ) => {
		return cachedResponse( res, null, function () {
			return search( req.params.lang, req.params.term, 0, DEFAULT_PROJECT );
		} );
	} );

	app.get( '/api/search-full/:lang/:term', ( req, res ) => {
		return cachedResponse( res, null, function () {
			return search( req.params.lang, req.params.term, 0, DEFAULT_PROJECT, true );
		} );
	} );

	app.get( '/api/nearby/:lang/:latitude,:longitude', ( req, res ) => {
		return cachedResponse( res, req.url, function () {
			return nearby( req.params.latitude, req.params.longitude, req.params.lang, 0, DEFAULT_PROJECT );
		} );
	} );

	app.get( '/api/:lang/diff/:revId', ( req, res ) => {
		cachedResponse( res, req.url, function () {
			var p = getProject( req );
			return diff( p.lang, req.params.revId, p.project );
		} );
	} );

	app.get( '/api/page/references/:lang.:project/:title', ( req, res ) => {
		var proj = getProject( req );
		cachedResponse( res, req.url, function () {
			return references( req.params.title, proj.lang, proj.project, true );
		} );
	} );

	function loadPage( req, res ) {
		var proj = getProject( req );
		var project = proj.project;
		var lang = proj.lang;
		var params = req.params;
		var title = params.title;
		var revision = params.revision;
		cachedResponse( res, req.url, function () {
			return page( title, lang, project, false, revision ).then( ( data ) => {
				const protocol = req.secure ? 'https' : 'http';
				const langProject = data.project ? data.project : lang + '.' + project;
				const newPath = '/api/page/' + langProject + '/' + data.title;
				if ( data.code && [ 301, 302 ].indexOf( data.code ) > -1 ) {
					res.redirect( protocol + '://' + req.headers.host + newPath );
					return false;
				} else {
					return data;
				}
			} );
		} );
	}

	app.get( '/api/page/:lang.:project/:title/:revision?', ( req, res ) => {
		loadPage( req, res );
	} );

	app.get( '/api/page/:lang/:title', ( req, res ) => {
		console.log( 'This endpoint was deprecated', req.url, 'Please check the client' );
		loadPage( req, res );
	} );

	app.get( '/api/visits/:lang/', ( req, res ) => {
		cachedResponse( res, req.url, function () {
			return visits( req.params.lang, DEFAULT_PROJECT );
		} );
	} );

	app.get( '/api/:lang/page-languages/:title', ( req, res ) => {
		var proj = getProject( req );
		cachedResponse( res, req.url, function () {
			return languages( req.params.title, proj.lang, proj.project );
		} );
	} );

	app.get( '/api/:lang/collection/by/:user/:id?', function ( req, res ) {
		var id;
		var lang = req.params.lang;
		var user = req.params.user;
		if ( req.params.id ) {
			id = parseInt( req.params.id, 10 );
		}
		if ( id === 0 ) {
			res.status( 400 );
			res.send( 'Not a valid public collection id.' );
		}

		respond( res, function () {
			return id !== undefined ? collection.members( lang, DEFAULT_PROJECT, id, user, req.query ) :
				collection.list( lang, DEFAULT_PROJECT, user, null, null, req.user );
		} );
	} );

	app.get( '/api/:lang/collection/', function ( req, res ) {
		var lang = req.params.lang;

		respond( res, function () {
			return collection.all( lang, DEFAULT_PROJECT, req.query );
		} );
	} );

	app.get( '/api/:lang/contributions/:ns/:username?', ( req, res ) => {
		cachedResponse( res, req.url, function () {
			var p = req.params;
			var pr = getProject( req );
			return contributions( pr.lang, p.username, p.ns, req.query, pr.project );
		} );
	} );

	app.get( '/api/:language_project/uploads/:username', ( req, res ) => {
		cachedResponse( res, req.url, function () {
			var p = req.params;
			return uploads( p.language_project, p.username, req.query );
		} );
	} );

	app.get( '/api/:lang/pagehistory/:title', ( req, res ) => {
		cachedResponse( res, req.url, function () {
			var proj = getProject( req );
			var p = req.params;
			return pagehistory( proj.lang, p.title, req.query, proj.project );
		} );
	} );

	app.get( '/api/web-push/service/trending/', ( req, res ) => {
		cachedResponse( res, req.url, webPushTrend );
	} );

	app.get( '/api/:lang/wikitext/:title/:section?', ( req, res ) => {
		var p = req.params;
		var proj = getProject( req );
		respond( res, function () {
			return wikitext( proj.lang, p.title, p.section, proj.project );
		} );
	} );

	app.get( '/api/messages/:lang', ( req, res ) => {
		cachedResponse( res, req.url, function () {
			return new Promise( function ( resolve ) {
				resolve( messages( req.params.lang ) );
			} );
		} );
	} );
}

function initRoutes( app, canLogin ) {
	if ( canLogin ) {
		initLoginRoutes( app );
	}
	initPostMethods( app );
	initGetMethods( app );
	initApiProxy( app, '/api/' );
}

export default initRoutes;
