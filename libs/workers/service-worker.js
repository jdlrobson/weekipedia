/* globals clients, caches, skipWaiting */
const version = global.__VERSION__;

import {
  precache, router, cacheFirst, networkOnly, options, networkFirst
} from 'sw-toolbox'

const DEFAULT_CACHE = 'weekipedia-' + version.number;
const PAGE_CACHE = 'weekipedia-pages';

options.cache.name = DEFAULT_CACHE;

// Keep in sync with asset names needed for offline in
// webpack/base.webpack.config.js
var staticAssets = [
  '/home-icon.png',
  '/manifest.json',
  '/main-bundle.js',
  '/style.css',
  '/style.rtl.css',
  '/wiki/Special:Shell'
]
const API_PATH = process.env.API_PATH || '/api/'
const OFFLINE_STRATEGY = process.env.OFFLINE_STRATEGY

if ( version.wordmark ) {
  staticAssets.push( version.wordmark );
}

// Prefetch static assets
precache( staticAssets )

// Serve static assets from cache first
staticAssets.forEach( ( asset ) => router.get( asset, cacheFirst ) )

// The all offline strategy will cache every page you visit
if ( OFFLINE_STRATEGY === 'all' ) {
  router.get( API_PATH + 'page/([^\:]*)', networkFirst, {
    cache: {
      maxEntries: 50,
      name: PAGE_CACHE,
      networkTimeoutSeconds: 5
    }
  } );
}

// for undo purposes
var undoRemoval = {};

const SUCCESS = new Response( JSON.stringify( { edit: { result: 'Success' } } ), {
    headers: { 'Content-Type': 'application/json' }
  } );

const READING_LIST_COLLECTION = {
  id: -1,
  owner: '~your device',
  title: 'Reading history (private)',
  private: true,
  description: 'Available offline: Pages you have recently read'
};

const JSON_HEADERS = {
  headers: { 'Content-Type': 'application/json' }
};

router.post( '/api/private/en/collection/-1/(.*)/(.*)', ( r, p ) => {
  var pcache;
  var title = p[1];
  var action = p[0];
  if ( action === 'remove' ) {
    return caches.open( PAGE_CACHE )
      .then( ( cache ) => {
        pcache = cache;
        return cache.keys()
      } )
      .then( ( keys ) => {

        keys.forEach( function ( req ) {
          var url = req.url.split( '?' );
          var folders = url[0].split( '/' );
          if ( folders.indexOf( title ) > -1 ||
            folders.indexOf( title.replace( /%20/gi, '_' ) ) > -1
          ) {
            // store it incase we want to add it again
            undoRemoval[title] = req;
            pcache.delete( req );
          }
        } );
        return SUCCESS.clone();
      } );
  } else if ( action === 'add' && undoRemoval[title] ) {
    return caches.open( PAGE_CACHE )
      .then( ( cache ) => {
        cache.add( undoRemoval[title] );
        return SUCCESS.clone();
      } );
  }
} );

router.get( '/api/en/collection/by/~your%20device/', () => {
  return new Response(
    JSON.stringify(
      {
        collections: [ READING_LIST_COLLECTION ],
        owner: '~your device'
      }
    ), JSON_HEADERS );
} );

router.get( '/api/en/collection/by/~me/', ( request, values, options ) => {
  return networkFirst( request, values, options ).then( ( resp ) => {
    return resp.json();
  } ).then( ( json ) => {
    json.collections.unshift( READING_LIST_COLLECTION );
    return new Response( JSON.stringify( json ), JSON_HEADERS );
  } );
} );

router.get( '/api/en/collection/by/(.*)/-1', () => {
  return caches.open( PAGE_CACHE )
    .then( function ( cache ) {
      return cache.matchAll();
    } )
    .then( function ( keys ) {
      var pages = [];
      var pending = 0;
      var collection = Object.assign( {}, READING_LIST_COLLECTION );

      return new Promise( function ( resolve ) {
        function whenDone( resolve ) {
          pending--;
          if ( pending <= 0 ) {
            collection.pages = pages.sort( function ( a, b ) {
              return a.modified < b.modified ? 1 : -1;
            } );
            resolve(
              new Response( JSON.stringify( collection ), {
                headers: { 'Content-Type': 'application/json' }
              } )
            );
          }
        }

        // run through all the pages in the page cache to construct a collection
        keys.forEach( function ( res ) {
          var modified = new Date( res.headers.get( 'date' ) );
          pending++;
          res.json().then( function ( json ) {
            var lead = json.lead;
            var page = {
              title: lead.displaytitle,
              description: lead.description,
              modified: modified,
              coordinates: lead.coordinates
            };
            if ( lead.image ) {
              page.thumbnail = {
                source: lead.image.urls[320],
                width: 320
              };
            }
            pages.push( page );
            whenDone( resolve );
          } ).catch( () => {
            whenDone( resolve );
          } );
        } );

        // might be empty..
        whenDone( resolve );
      } )
    } );
} );

// Serve API requests from the network
router.get( '/api/(.*)', networkOnly );

// Login must happen via network
router.get( '/auth/(.*)', networkOnly )

// Images (#120)
router.get( '/images/(.*)', cacheFirst );

// Serve any other url with the shell
router.get( '/(.*)\/(.*)', () => caches.match( '/wiki/Special:Shell' ) )
// serve homepage with shell
router.get( '/', () => caches.match( '/wiki/Special:Shell' ) )

// voyager specific
router.get( 'https://maps.wikimedia.org/osm-intl/(.*)/(.*)/(.*)', () => cacheFirst );

// Rest of calls go to network
router.default = networkOnly

// Boilerplate to ensure our service worker takes control of the page as soon as possible.
addEventListener( 'install', event => event.waitUntil( skipWaiting() ) )
addEventListener( 'activate', event => event.waitUntil( clients.claim() ) )
