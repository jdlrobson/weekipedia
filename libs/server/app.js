require('babel-core/register')

import express from 'express'
import hogan from 'hogan-express'
import bodyParser from 'body-parser'
import { OAuthStrategy } from 'passport-mediawiki-oauth'
import passport from 'passport'
import session from 'express-session'
import connect from 'connect-memcached'
import fs from 'fs'
import ReactDOMServer from 'react-dom/server'

import shared from './../shared'
import routes from './../client/routes'

import wikitext from './endpoints/wikitext'
import watchlistfeed from './endpoints/watchlist-feed'
import watchlist from './endpoints/watchlist'
import watched from './endpoints/watched'
import watch from './endpoints/watch'
import visits from './endpoints/visits'
import webPushTrend from './endpoints/trending/web-push-trend.js'
import trending from './endpoints/trending/trending'
import subscribe from './endpoints/subscribe'
import search from './endpoints/search'
import related from './endpoints/related'
import random from './endpoints/random'
import parse from './endpoints/parse'
import pagehistory from './endpoints/page-history'
import page from './endpoints/page'
import nearby from './endpoints/nearby'
import languages from './endpoints/languages'
import file from './endpoints/file'
import edit from './endpoints/edit'
import diff from './endpoints/diff'
import contributions from './endpoints/contributions'
import collection from './endpoints/collection'
import categories from './endpoints/categories'

import respond from './respond'
import cachedResponses from './cached-response.js'
import isRTL from './../client/is-rtl'

const API_PATH = '/api/'
const cachedResponse = cachedResponses.cachedResponse
const invalidate = cachedResponses.invalidate
const DEFAULT_PROJECT = process.env.PROJECT || 'wikipedia';
const EN_MESSAGE_PATH = './i18n/en.json';

const ALL_PROJECTS = [ 'wikipedia', 'wikivoyage', 'wiktionary',
  'wikisource', 'wikiquote', 'wikinews', 'wikibooks', 'wikiversity' ];

const SITE_ALLOW_FOREIGN_PROJECTS = Boolean( process.env.SITE_ALLOW_FOREIGN_PROJECTS );
const ALLOWED_PROJECTS = SITE_ALLOW_FOREIGN_PROJECTS ?
  ( process.env.SITE_ALLOWED_PROJECTS ? process.env.SITE_ALLOWED_PROJECTS.split( '|' ) :  ALL_PROJECTS )
  : [ DEFAULT_PROJECT ];

const SITE_WORDMARK_PATH = process.env.SITE_WORDMARK_PATH
const SITE_TITLE = process.env.SITE_TITLE || 'Weekipedia'
const CONSUMER_SECRET = process.env.MEDIAWIKI_CONSUMER_SECRET;
const CONSUMER_KEY = process.env.MEDIAWIKI_CONSUMER_KEY

const LANGUAGE_CODE = process.env.DEFAULT_LANGUAGE || 'en'
const SIGN_IN_SUPPORTED = CONSUMER_SECRET && CONSUMER_KEY

const SITE_EXPAND_SECTIONS = process.env.SITE_EXPAND_SECTIONS ?
  Boolean( parseInt( process.env.SITE_EXPAND_SECTIONS, 10 ) ) : false;

const SITE_EXPAND_ARTICLE = process.env.SITE_EXPAND_ARTICLE ?
  Boolean( process.env.SITE_EXPAND_ARTICLE ) : SITE_EXPAND_SECTIONS;

const SERVER_SIDE_RENDERING = Boolean( process.env.SERVER_SIDE_RENDERING );

console.log( 'The default project is: ', DEFAULT_PROJECT );

// Express
const app = express()
const https = process.env.USE_HTTPS;
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
  gcm_sender_id: process.env.GCM_SENDER_ID
};

app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.use('/', express.static( __dirname + '/../../public/' ) )
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('port', (process.env.PORT || 3000))

if ( https ) {
  app.enable('trust proxy');
  app.use(function (req, res, next) {
    if ( https && !req.secure ) {
      res.redirect('https://' + req.headers.host + req.url);
    } else {
      next();
    }
  });
}

function getProject( req ) {
  var proj = { project: DEFAULT_PROJECT };
  if ( req.params.lang ) {
    proj.lang = req.params.lang;
    if ( req.params.lang.indexOf( '.' ) > -1 ) {
      var tmp = req.params.lang.split( '.' );
      proj.lang = tmp[0];
      proj.project = tmp[1];
      if ( ALLOWED_PROJECTS.indexOf( proj.project ) === -1 ) {
        throw "The `" + proj.project + "` project is not supported by the web app.";
      }
    }
  }
  return proj;
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status( 401 );
    res.send( 'Login required for this endpoint' );
  }
}


if ( SIGN_IN_SUPPORTED ) {
  const MemcachedStore = connect(session);

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  app.use(session({
    resave: false,
    saveUninitialized: true,
    store: new MemcachedStore({
      hosts: ['127.0.0.1:11211'],
      secret: CONSUMER_SECRET
    }),
    secret: CONSUMER_SECRET
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new OAuthStrategy({
      consumerKey: CONSUMER_KEY,
      consumerSecret: CONSUMER_SECRET
    },
    function(token, tokenSecret, profile, done) {
      // [ADDED] Twitter extended API calls using 'request' and 'querystring'
      profile.oauth = {
        consumer_key : CONSUMER_KEY,
        consumer_secret : CONSUMER_SECRET,
        token : token,
        token_secret : tokenSecret
      }
      return done(null, profile);
    } )
  );

  /*
   *******************************************************
   * Begin routes which require authenticated
   *******************************************************
  */
  app.get('/auth/logout', ensureAuthenticated, function( req, res ) {
    req.logout();
    res.redirect('/');
  } );

  app.post('/api/private/edit/:lang/:title/:section?',(req, res) => {
    var p = req.params;
    var body = req.body;
    respond( res, function () {
      var proj = getProject( req );
      return edit( proj.lang, p.title, body.text, body.summary, p.section, proj.project, req.user )
        .then( function ( data ) {
          return new Promise( function ( resolve ) {
            setTimeout( function () {
              invalidate( API_PATH + 'page/' + p.lang + '/' + encodeURIComponent( p.title ) );
              setTimeout( function () {
                resolve( data );
              }, 1000 );
            }, 8000 );
          } );
        } );
    } );
  } );

  app.get('/api/private/watchlist-feed/:lang/:ns?', ensureAuthenticated, function(req, res){
    var callback = function ( data ) {
      res.setHeader('Content-Type', 'application/json');
      res.status( 200 );
      res.send( JSON.stringify( data ) );
    };
    watchlistfeed( req.params.lang, DEFAULT_PROJECT, req.params.ns, req.user, req.query ).then( callback );
  });

  app.all('/api/private/:lang/collection/:id/:action/:title?', ensureAuthenticated, function(req, res){
    var id = parseInt( req.params.id, 10 ) || 0
    var action = req.params.action;
    var lang = req.params.lang;
    var profile = req.user;
    var title = req.params.title;

    respond( res, function () {
      if ( action === 'create' ) {
        return collection.create( lang, DEFAULT_PROJECT, req.body.title, req.body.description, profile );
      } if ( action === 'edit' ) {
        return collection.edit( lang, DEFAULT_PROJECT, id, req.body.title, req.body.description, profile );
      } else if ( action === 'with' ) {
        return collection.includes( lang, DEFAULT_PROJECT, title, profile );
      } else if ( action === 'has' ) {
        return collection.member( lang, DEFAULT_PROJECT, id, [ title ], profile );
      } else {
        return collection.update( lang, DEFAULT_PROJECT, id, [ title ], profile, action === 'remove' );
      }
    } );
  });

  app.get('/api/private/watchlist/:lang/:title?', ensureAuthenticated, function(req, res){
    var callback = function ( data ) {
      res.setHeader('Content-Type', 'application/json');
      res.status( 200 );
      res.send( JSON.stringify( data ) );
    };
    if ( req.params.title ) {
      watched( req.params.lang, DEFAULT_PROJECT, [ req.params.title ], req.user ).then( callback );
    } else {
      watchlist( req.params.lang, DEFAULT_PROJECT, 0, req.user, req.query ).then( callback );
    }
  });

  app.post('/api/private/watch/:lang/:title', function(req, res){
    watch( req.params.lang, DEFAULT_PROJECT, [ req.params.title ], req.user ).then( function ( data ) {
      res.setHeader('Content-Type', 'application/json');
      res.status( 200 );
      res.send( JSON.stringify( data ) );
    } );
  });

  app.post('/api/private/unwatch/:lang/:title', function(req, res){
    watch( req.params.lang, DEFAULT_PROJECT, [ req.params.title ], req.user, true ).then( function ( data ) {
      res.setHeader('Content-Type', 'application/json');
      res.status( 200 );
      res.send( JSON.stringify( data ) );
    } );
  });
}


function checkReqParams( req, res, required ) {
  var missing = [];
  required.forEach( function ( param ) {
    if ( req.body && req.body[param] === undefined ) {
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

/*
 *******************************************************
 * Begin POST routes
 *******************************************************
*/
app.post('/api/:lang_project/parse/:section?', function( req, res ) {
  if ( checkReqParams( req, res, [ 'title', 'wikitext' ] ) ) {
    res.status( 200 );
    respond( res, function () {
      return parse( req.params.lang_project, req.body.title, req.body.wikitext );
    } );
  }
} );

app.post('/api/web-push/test', function( req, res ) {
  if ( checkReqParams( req, res, [ 'feature', 'token', 'browser' ] ) ) {
    res.status( 200 );
    subscribe.ping( req.body.browser, req.body.feature, req.body.token );
    res.send( 'OK' );
  }
} );

app.post('/api/web-push/subscribe', function( req, res ) {
  if ( checkReqParams( req, res, [ 'feature', 'token', 'browser' ] ) ) {
    res.status( 200 );
    subscribe.add( req.body.browser, req.body.feature, req.body.token );
    res.send( 'OK' );
  }
} );

app.post('/api/web-push/unsubscribe', function( req, res ) {
  if ( checkReqParams( req, res, [ 'feature', 'token', 'browser' ] ) ) {
    res.status( 200 );
    subscribe.remove( req.body.browser, req.body.feature, req.body.token );
    res.send( 'OK' );
  }
} );

/*
 *******************************************************
 * Begin GET routes
 *******************************************************
*/

app.get('/auth/mediawiki',
  function (req, res, next) {
    req.session.returnto = req.query.returnto || req.get( 'Referrer' );
    next();
  }, passport.authenticate('mediawiki') );

app.get('/auth/mediawiki/callback',
  passport.authenticate( 'mediawiki', { failureRedirect: '/login' } ),
  function(req, res) {
    // Successful authentication, do redirect.
    res.redirect(req.session.returnto || '/');
    delete req.session.returnTo;
  });

app.get('/manifest.json',(req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send( JSON.stringify( manifest ) );
} );

app.get('/api/trending/:wiki/:halflife',(req, res) => {
  var wiki = req.params.wiki;
  var halflife = parseFloat( req.params.halflife );

  cachedResponse( res, req.url, function() {
    return trending( wiki, halflife, DEFAULT_PROJECT );
  } );
} )

app.get('/api/trending-debug/:wiki/:title',(req, res) => {
  cachedResponse( res, req.url, function() {
    return trending( req.params.wiki, 0.1, DEFAULT_PROJECT, req.params.title );
  } );
} )

app.get('/api/random/:lang/',(req, res) => {
  return cachedResponse( res, null, function () {
    var param,
      params = {};
    for ( param in [ 'picontinue', 'continue' ] ) {
      if ( req.query[param] ) {
        params[param] = req.query[param];
      }
    }

    return random( req.params.lang, 0, DEFAULT_PROJECT, params );
  } );
} );

app.get('/api/categories/:lang/:title?/',(req, res) => {
  return cachedResponse( res, null, function () {
    var p = req.params;
    return categories( p.lang, p.title, DEFAULT_PROJECT, req.query );
  } );
} );

app.get('/api/file/:lang/:width,:height/:title/',(req, res) => {
  return cachedResponse( res, null, function () {
    var p = req.params;
    return file( p.lang, p.title, p.width, p.height, DEFAULT_PROJECT );
  } );
} );

app.get('/api/related/:lang/:title',(req, res) => {
  return cachedResponse( res, null, function () {
    var p = getProject( req );
    return related( p.lang, req.params.title, p.project );
  } );
} );

app.get('/api/search/:lang/:term',(req, res) => {
  return cachedResponse( res, null, function () {
    return search( req.params.lang, req.params.term, 0, DEFAULT_PROJECT );
  } );
} );

app.get('/api/search-full/:lang/:term',(req, res) => {
  return cachedResponse( res, null, function () {
    return search( req.params.lang, req.params.term, 0, DEFAULT_PROJECT, true );
  } );
} );

app.get('/api/nearby/:lang/:latitude,:longitude',(req, res) => {
  return cachedResponse( res, req.url, function () {
    return nearby( req.params.latitude, req.params.longitude, req.params.lang, 0, DEFAULT_PROJECT );
  } );
} );

app.get('/api/diff/:lang/:revId',(req, res) => {
  cachedResponse( res, req.url, function () {
    var p = getProject( req );
    return diff( p.lang, req.params.revId, p.project )
  });
} );


app.get('/api/page/:lang.:project/:title',(req, res) => {
  cachedResponse( res, req.url, function () {
    return page( req.params.title, req.params.lang, req.params.project );
  });
} );

app.get('/api/page/:lang/:title',(req, res) => {
  var proj = getProject(req);
  cachedResponse( res, req.url, function () {
    return page( req.params.title, proj.lang, proj.project )
  });
} );

app.get('/api/visits/:lang/',(req, res) => {
  cachedResponse( res, req.url, function () {
    return visits( req.params.lang, DEFAULT_PROJECT )
  } );
} );

app.get('/api/page-languages/:lang/:title',(req, res) => {
  var proj = getProject(req);
  cachedResponse( res, req.url, function () {
    return languages( req.params.title, proj.lang, proj.project );
  });
} );

app.get('/api/:lang/collection/by/:user/:id?', function(req, res){
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
      collection.list( lang, DEFAULT_PROJECT, user );
  } );
});

app.get('/api/:lang/collection/', function(req, res){
  var lang = req.params.lang;

  respond( res, function () {
    return collection.all( lang, DEFAULT_PROJECT, req.query );
  } );
});

app.get('/api/contributions/:lang/:ns/:username?',(req, res) => {
  cachedResponse( res, req.url, function() {
    var p = req.params;
    var pr = getProject( req );
    return contributions( pr.lang, p.username, p.ns, req.query, pr.project );
  } );
} );

app.get('/api/pagehistory/:lang/:title',(req, res) => {
  cachedResponse( res, req.url, function() {
    var proj = getProject( req );
    var p = req.params;
    return pagehistory( proj.lang, p.title, req.query, proj.project );
  } );
} );

app.get('/api/web-push/service/trending/',(req, res) => {
  cachedResponse( res, req.url, webPushTrend );
} );

app.get('/api/wikitext/:lang/:title/:section?',(req, res) => {
  var p = req.params;
  var proj = getProject( req );
  respond( res, function () {
    return wikitext( proj.lang, p.title, p.section, proj.project );
  } );
} );

function getMessages( language ) {
  var i, messages, jsonPath, enMessages,
    qqx = language === 'qqx';

  if ( qqx ) {
    jsonPath = EN_MESSAGE_PATH;
  } else {
    jsonPath = './i18n/' + language + '.json'
  }

  try {
    messages = JSON.parse( fs.readFileSync( jsonPath, 'utf8' ) );
  } catch ( e ) {
    messages = {};
  }

  enMessages = JSON.parse( fs.readFileSync( EN_MESSAGE_PATH, 'utf8' ) );
  messages = Object.assign( {}, enMessages, messages );

  for ( i in messages ) {
    if ( messages.hasOwnProperty( i ) ) {
      if ( qqx ) {
        messages[i] = '{' + i + '}';
      } else {
        messages[i] = messages[i].replace( '{{SITENAME}}', SITE_TITLE );
      }
    }
  }
  return messages;
}
app.get('/api/messages/:lang',(req, res) => {
  cachedResponse( res, req.url, function() {
    return new Promise( function ( resolve ) {
      resolve( getMessages( req.params.lang ) );
    } );
  } );
} );

app.get('/:lang?/*',(req, res) => {
  var session = req.user ? {
      username: req.user.displayName,
    } : null;

  var config = {
    siteinfo: {
      apiPath: API_PATH,
      allowForeignProjects: SITE_ALLOW_FOREIGN_PROJECTS,
      home: process.env.HOME_PAGE_PATH || '/wiki/Main Page',
      expandSectionsByDefault: SITE_EXPAND_SECTIONS,
      expandArticlesByDefault: SITE_EXPAND_ARTICLE,
      wordmark: SITE_WORDMARK_PATH,
      title: SITE_TITLE,
      privacyUrl: process.env.SITE_PRIVACY_URL,
      termsUrl: process.env.SITE_TERMS_OF_USE,
      license: {
        url: '//creativecommons.org/licenses/by-sa/3.0/',
        name: 'CC BY-SA 3.0'
      }
    },
    session: session,
    i18n: getMessages( req.query.uselang || req.params.lang || LANGUAGE_CODE ),
    canAuthenticate: Boolean( SIGN_IN_SUPPORTED ),
    project: DEFAULT_PROJECT,
    offlineVersion: process.env.OFFLINE_VERSION
  };

  shared.init( config, routes );
  var route = shared.router.matchRoute( req.path, '#', config, req.query );

  function render( data ) {
    var lead,
      desc = '',
      title = SITE_TITLE,
      image = '/home-icon.png';

    data = data || {};

    if ( data.fallbackProps && data.fallbackProps.lead ) {
      lead = data.fallbackProps.lead;
      desc = lead.description;
      title = lead.displaytitle || '';
      title += ' - ' + SITE_TITLE;
      if ( lead.image && lead.image.urls ) {
        image = lead.image.urls['1024'] || lead.image.urls['320'];
      }
    }

    // not ideal. Duplicates HTML content of article in config. Relying on gzip
    Object.assign( config, data );
    res.setHeader('Vary', 'Cookie');
    res.status(200).render('index.html', {
      touch_icon: '/home-icon.png',
      url: req.url,
      image: image,
      description: desc,
      page_title: title,
      isRTL: isRTL( req.params.lang ),
      config: JSON.stringify( config ),
      body: !session && SERVER_SIDE_RENDERING ? ReactDOMServer.renderToString( shared.render( req.path, '#', data, req.query ) ) : ''
    });
  }
  if ( route.fallback && SERVER_SIDE_RENDERING ) {
    var fallbackUrl = req.protocol + '://' + req.get('host') + route.fallback;
    fetch( fallbackUrl ).then( function ( resp ) {
      return resp.json();
    } ).then( function ( data ) {
      render( { fallbackProps: data, fallbackPath: route.fallback } );
    } );
  } else {
    render();
  }
});

app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))
