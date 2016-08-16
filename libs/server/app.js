require('babel-core/register')

import express from 'express'
import hogan from 'hogan-express'
import bodyParser from 'body-parser'
import { OAuthStrategy } from 'passport-mediawiki-oauth'
import passport from 'passport'
import session from 'express-session'

import watchlist from './endpoints/watchlist'
import watched from './endpoints/watched'
import watch from './endpoints/watch'
import visits from './endpoints/visits'
import trending from './endpoints/trending'
import subscribe from './endpoints/subscribe'
import search from './endpoints/search'
import related from './endpoints/related'
import random from './endpoints/random'
import webPushTrend from './endpoints/web-push-trend.js'
import page from './endpoints/page'
import nearby from './endpoints/nearby'
import languages from './endpoints/languages'
import file from './endpoints/file'

import cachedResponse from './cached-response'

const project = process.env.PROJECT || 'wikipedia';

const SITE_WORDMARK_PATH = process.env.SITE_WORDMARK_PATH
const SITE_TITLE = process.env.SITE_TITLE || 'Weekipedia'
const CONSUMER_SECRET = process.env.MEDIAWIKI_CONSUMER_SECRET;
const CONSUMER_KEY = process.env.MEDIAWIKI_CONSUMER_KEY
const OAUTH_CALLBACK_URL = 'http://localhost:8142/auth/mediawiki/callback'

const SIGN_IN_SUPPORTED = CONSUMER_SECRET && CONSUMER_KEY

console.log( 'Init for project', project );
// Express
const app = express()
const https = process.env.USE_HTTPS;
const manifest = {
  name: 'Weekipedia',
  short_name: 'Weekipedia',
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
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: CONSUMER_SECRET
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new OAuthStrategy({
      consumerKey: CONSUMER_KEY,
      consumerSecret: CONSUMER_SECRET,
      callbackURL: OAUTH_CALLBACK_URL,
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

  app.get('/api/private/watchlist/:lang/:title?', ensureAuthenticated, function(req, res){
    var callback = function ( data ) {
      res.setHeader('Content-Type', 'application/json');
      res.status( 200 );
      res.send( JSON.stringify( data ) );
    };
    if ( req.params.title ) {
      watched( req.params.lang, project, [ req.params.title ], req.user ).then( callback );
    } else {
      watchlist( req.params.lang, project, 0, req.user, req.query ).then( callback );
    }
  });

  app.post('/api/private/watch/:lang/:title', function(req, res){
    watch( req.params.lang, project, [ req.params.title ], req.user ).then( function ( data ) {
      res.setHeader('Content-Type', 'application/json');
      res.status( 200 );
      res.send( JSON.stringify( data ) );
    } );
  });

  app.post('/api/private/unwatch/:lang/:title', function(req, res){
    watch( req.params.lang, project, [ req.params.title ], req.user, true ).then( function ( data ) {
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

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/*
 *******************************************************
 * Begin POST routes
 *******************************************************
*/

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
  passport.authenticate('mediawiki'));

app.get('/auth/mediawiki/callback',
  passport.authenticate( 'mediawiki', { failureRedirect: '/login' } ),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/manifest.json',(req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send( JSON.stringify( manifest ) );
} );

app.get('/api/trending/:wiki/:halflife',(req, res) => {
  var wiki = req.params.wiki;
  var halflife = parseFloat( req.params.halflife );

  cachedResponse( res, req.url, function() {
    return trending( wiki, halflife, project );
  } );
} )

app.get('/api/trending-debug/:wiki/:title',(req, res) => {
  cachedResponse( res, req.url, function() {
    return trending( req.params.wiki, 0.1, project, req.params.title );
  } );
} )

app.get('/api/random/:lang/',(req, res) => {
  return cachedResponse( res, null, function () {
    return random( req.params.lang, 0, project, { continue: req.query.continue || '' } );
  } );
} );

app.get('/api/file/:lang/:width,:height/:title/',(req, res) => {
  return cachedResponse( res, null, function () {
    var p = req.params;
    return file( p.lang, p.title, p.width, p.height, project );
  } );
} );

app.get('/api/related/:lang/:title',(req, res) => {
  return cachedResponse( res, null, function () {
    return related( req.params.lang, req.params.title, project );
  } );
} );

app.get('/api/search/:lang/:term',(req, res) => {
  return cachedResponse( res, null, function () {
    return search( req.params.lang, req.params.term, 0, project );
  } );
} );

app.get('/api/search-full/:lang/:term',(req, res) => {
  return cachedResponse( res, null, function () {
    return search( req.params.lang, req.params.term, 0, project, true );
  } );
} );

app.get('/api/nearby/:lang/:latitude,:longitude',(req, res) => {
  return cachedResponse( res, req.url, function () {
    return nearby( req.params.latitude, req.params.longitude, req.params.lang, 0, project );
  } );
} );

app.get('/api/page/:lang/:title',(req, res) => {
  cachedResponse( res, req.url, function () {
    return page( req.params.title, req.params.lang, project )
  });
} );

app.get('/api/visits/:lang/',(req, res) => {
  cachedResponse( res, req.url, function () {
    return visits( req.params.lang, project )
  } );
} );

app.get('/api/page-languages/:lang/:title',(req, res) => {
  cachedResponse( res, req.url, function () {
    return languages( req.params.title, req.params.lang, project );
  });
} );

app.get('/api/web-push/service/trending/',(req, res) => {
  cachedResponse( res, req.url, function() {
    return webPushTrend();
  } );
} );

app.get('*',(req, res) => {

  var user = req.user ? req.user : {};

  // use React Router
  res.status(200).render('index.html', {
    config: JSON.stringify( {
      siteinfo: {
        wordmark: SITE_WORDMARK_PATH,
        title: SITE_TITLE,
        privacyUrl: process.env.SITE_PRIVACY_URL,
        termsUrl: process.env.SITE_TERMS_OF_USE
      },
      username: user.displayName,
      SIGN_IN_SUPPORTED: Boolean( SIGN_IN_SUPPORTED ),
      PROJECT: process.env.PROJECT,
      OFFLINE_VERSION: process.env.OFFLINE_VERSION
    } )
  })
})

app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))
