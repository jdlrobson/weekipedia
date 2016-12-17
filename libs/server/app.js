require( 'babel-core/register' )

import express from 'express'
import hogan from 'hogan-cached'
import bodyParser from 'body-parser'
import { OAuthStrategy } from 'passport-mediawiki-oauth'
import passport from 'passport'
import session from 'express-session'
import connect from 'connect-memcached'
import ReactDOMServer from 'react-dom/server'

import shared from './../shared'

import initApiRoutes from './express-api-routes'
import messages from './messages'
import respond from './respond'

import initVoyagerRoutes from './express-voyager-routes'

import isRTL from './../client/is-rtl'

import { API_PATH, DEFAULT_PROJECT, MEDIAWIKI_COMPATIBILITY_MODE,
  GCM_SENDER_ID, SITE_HOME_PATH, TABLE_OF_CONTENTS, SHOW_TALK_ANONS,
  SITE_ALLOW_FOREIGN_PROJECTS, ALLOWED_PROJECTS,
  SITE_WORDMARK_PATH, SITE_TITLE, LANGUAGE_CODE, SIGN_IN_SUPPORTED,
  SITE_EXPAND_SECTIONS, SITE_EXPAND_ARTICLE, SITE_EXPAND_SECTIONS_TABLET,
  CONSUMER_SECRET, CONSUMER_KEY, DUMMY_SESSION,
  SERVER_SIDE_RENDERING, USE_HTTPS, APP_PORT,
  ENABLE_COLLECTIONS, ENABLE_NEARBY, DISABLE_SETTINGS,
  OFFLINE_VERSION, SITE_TERMS_OF_USE, SITE_PRIVACY_URL,
} from './config'

console.log( 'The default project is: ', DEFAULT_PROJECT );

// Express
const app = express()
const manifest = {
  name: SITE_TITLE,
  short_name: SITE_TITLE,
  start_url: './',
  display: 'standalone',
  icons: [
    {
      src: '/home-icon.png',
      sizes: '48x48',
      type: 'image/png'
    },
    {
      src: '/home-icon.png',
      sizes: '192x192',
      type: 'image/png'
    }
  ],
  theme_color: 'white',
  gcm_sender_id: GCM_SENDER_ID
};

app.engine( 'html', hogan )
app.set( 'views', __dirname + '/views' )
app.use( '/', express.static( __dirname + '/../../public/' ) )
app.use( bodyParser.json() ); // support json encoded bodies
app.use( bodyParser.urlencoded( {     // to support URL-encoded bodies
  extended: true
} ) );

app.set( 'port', ( APP_PORT ) )

if ( USE_HTTPS ) {
  app.enable( 'trust proxy' );
  app.use( function ( req, res, next ) {
    if ( USE_HTTPS && !req.secure ) {
      res.redirect( 'https://' + req.headers.host + req.url );
    } else {
      next();
    }
  } );
}

if ( SIGN_IN_SUPPORTED && !DUMMY_SESSION ) {
  const MemcachedStore = connect( session );

  passport.serializeUser( function ( user, done ) {
    done( null, user );
  } );

  passport.deserializeUser( function ( obj, done ) {
    done( null, obj );
  } );

  app.use( session( {
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30
    },
    store: new MemcachedStore( {
      hosts: ['127.0.0.1:11211'],
      secret: CONSUMER_SECRET
    } ),
    secret: CONSUMER_SECRET
  } ) );
  app.use( passport.initialize() );
  app.use( passport.session() );
  passport.use(
    new OAuthStrategy( {
      baseURL: 'https://en.wikipedia.org/',
      consumerKey: CONSUMER_KEY,
      consumerSecret: CONSUMER_SECRET
    },
    function ( token, tokenSecret, profile, done ) {
      // [ADDED] Twitter extended API calls using 'request' and 'querystring'
      profile.oauth = {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        token: token,
        token_secret: tokenSecret
      }
      return done( null, profile );
    } )
  );
} else if ( DUMMY_SESSION ) {
  app.use( function ( req, res, next ) {
    req.user = DUMMY_SESSION;
    next();
  } );
}

/*
 *******************************************************
 * Begin GET routes
 *******************************************************
*/

function getUserSession( req ) {
  return req.user && req.user.displayName !== '0' ? {
      username: req.user.displayName
    } : null;
}

app.get( '/auth/whoamithistime', function ( req, res ) {
  var user = getUserSession( req );
  respond( res, function () {
    return new Promise( function ( resolve ) {
      if ( user ) {
        resolve( user );
      } else {
        throw 'Not logged in';
      }
    } );
  } );
} );

function authCallback( req, res ) {
  // Successful authentication, do redirect.
  res.redirect( req.session.returnto || '/' );
  delete req.session.returnTo;
}

app.get( '/auth/mediawiki',
  function ( req, res, next ) {
    if ( !req.isAuthenticated() && !req.query.oauth_verifier ) {
      if ( req.query.returnto && req.query.project ) {
        req.session.returnto = '/' + req.query.project + '/' + req.query.returnto;
      } else {
        req.session.returnto = req.get( 'Referrer' );
      }
    }
    next();
  }, passport.authenticate( 'mediawiki' ) );

// The default auth callback if configured in MediaWiki as '/'
// This one only works if the user has logged in already
app.get( '/auth/mediawiki',
  function ( req, res ) {
    authCallback( req, res );
  } );

app.get( '/auth/mediawiki/callback',
  passport.authenticate( 'mediawiki', { failureRedirect: '/login' } ), authCallback );

app.get( '/manifest.json', ( req, res ) => {
  res.setHeader( 'Content-Type', 'application/json' );
  res.send( JSON.stringify( manifest ) );
} );

initApiRoutes( app, SIGN_IN_SUPPORTED );
initVoyagerRoutes( app )

app.get( '/:lang?/*', ( req, res ) => {
  var config = {
    siteoptions: {
      showTalkToAnons: SHOW_TALK_ANONS,
      includeTableOfContents: TABLE_OF_CONTENTS,
      allowForeignProjects: SITE_ALLOW_FOREIGN_PROJECTS,
      expandSectionsByDefault: SITE_EXPAND_SECTIONS,
      expandSectionsByDefaultTablet: SITE_EXPAND_SECTIONS_TABLET,
      expandArticlesByDefault: SITE_EXPAND_ARTICLE,
      nearby: ENABLE_NEARBY,
      settingsEnabled: !DISABLE_SETTINGS,
      collectionsEnabled: ENABLE_COLLECTIONS
    },
    siteinfo: {
      defaultProject: DEFAULT_PROJECT,
      home: SITE_HOME_PATH,
      apiPath: API_PATH,
      wordmark: SITE_WORDMARK_PATH,
      title: SITE_TITLE,
      privacyUrl: SITE_PRIVACY_URL,
      termsUrl: SITE_TERMS_OF_USE,
      license: {
        url: '//creativecommons.org/licenses/by-sa/3.0/',
        name: 'CC BY-SA 3.0'
      }
    },
    i18n: messages( req.query.uselang || req.params.lang || LANGUAGE_CODE ),
    canAuthenticate: Boolean( SIGN_IN_SUPPORTED ),
    project: DEFAULT_PROJECT,
    supportedProjects: ALLOWED_PROJECTS,
    offlineVersion: OFFLINE_VERSION
  };

  shared.init( config );
  var route = shared.router.matchRoute( req.path, '#', config, req.query );

  function render( data ) {
    var lead,
      desc = '',
      noIndex = true,
      title = SITE_TITLE,
      image = '/home-icon.png';

    data = data || {};

    if ( data.fallbackProps && data.fallbackProps.lead ) {
      lead = data.fallbackProps.lead;
      desc = lead.description;
      noIndex = data.fallbackProps.noIndex;
      title = lead.normalizedtitle || lead.displaytitle || '';
      title += ' - ' + SITE_TITLE;
      if ( lead.image && lead.image.urls ) {
        image = lead.image.urls['1024'] || lead.image.urls['320'];
      }
    }

    // not ideal. Duplicates HTML content of article in config. Relying on gzip
    Object.assign( config, data );
    res.setHeader( 'Vary', 'Cookie' );
    res.status( 200 ).render( 'index.html', {
      isMediaWikiCompatibilityMode: MEDIAWIKI_COMPATIBILITY_MODE,
      noIndex: noIndex,
      touch_icon: '/home-icon.png',
      url: req.url,
      image: image,
      description: desc,
      page_title: title,
      isRTL: isRTL( req.params.lang ),
      config: JSON.stringify( config ),
      body: !req.user && SERVER_SIDE_RENDERING ?
        ReactDOMServer.renderToString(
          shared.render( req.path, '#', data, req.query )
        ) : ''
    } );
  }
  if ( route.fallback && SERVER_SIDE_RENDERING ) {
    var fallbackUrl = req.protocol + '://' + req.get( 'host' ) + route.fallback;
    fetch( fallbackUrl ).then( function ( resp ) {
      if ( resp.status === 200 ) {
        return resp.json();
      } else {
        throw 'Error';
      }
    } ).then( function ( data ) {
      render( { fallbackProps: data,
        fallbackPath: route.fallback } );
    } ).catch( () => render() );
  } else {
    render();
  }
} );

app.listen( app.get( 'port' ) )
console.info( '==> Go to http://localhost:%s', app.get( 'port' ) )
