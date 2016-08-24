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

router.get( '/api/en/collection/by/(.*)/-1', () => {
  return caches.open( PAGE_CACHE )
    .then( function ( cache ) {
      return cache.matchAll();
    } )
    .then( function ( keys ) {
      var pages = [];
      var pending = 0;
      var collection = {
        id: -1,
        title: 'Offline pages',
        description: 'Pages that are available to you offline'
      };

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
