/* globals clients, caches, skipWaiting */
const version = global.__VERSION__;

import {
  precache, router, cacheFirst, networkOnly, options, networkFirst
} from 'sw-toolbox'

import offlinePages from './libs/offline-pages'

const DEFAULT_CACHE = 'weekipedia-' + version.number;
const PAGE_CACHE = 'weekipedia-pages';
const COLLECTION_CACHE = {
  maxEntries: 50,
  name: 'weekipedia-collections',
  networkTimeoutSeconds: 5
};

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

if ( version.wordmark ) {
  staticAssets.push( version.wordmark );
}

// Prefetch static assets
precache( staticAssets )

// Serve static assets from cache first
staticAssets.forEach( ( asset ) => router.get( asset, cacheFirst ) )

router.get( API_PATH + 'page/([^\:]*)', networkFirst, {
  cache: {
    maxEntries: 50,
    name: PAGE_CACHE,
    networkTimeoutSeconds: 5
  }
} );

router.get( '/api/wikitext/(.*)/User%3A(.*)', networkFirst, {
  cache: {
    maxEntries: 50,
    name: 'notes-cache',
    networkTimeoutSeconds: 5
  }
} );

// for undo purposes
var undoRemoval = {};

const SUCCESS = new Response( JSON.stringify( { edit: { result: 'Success' } } ), {
    headers: { 'Content-Type': 'application/json' }
  } );

const READING_LIST_COLLECTION = {
  id: -1,
  owner: '~your device',
  title: 'Offline pages (private)',
  private: true,
  description: 'These pages are available offline'
};

const JSON_HEADERS = {
  headers: { 'Content-Type': 'application/json' }
};

router.post( '/api/private/en/collection/-1/(.*)/(.*)', ( r, p ) => {
  var pcache;
  var title = decodeURIComponent( p[1] ).replace( /_/g, ' ' );
  var action = p[0];
  if ( action === 'remove' ) {
    return caches.open( PAGE_CACHE ).then( ( cache ) => {
      pcache = cache;
      return offlinePages( cache )
        .then( ( pages ) => {

          pages.forEach( function ( page ) {
            if (
              page.title === title
            ) {
              // store it incase we want to add it again
              undoRemoval[title] = page._key;
              pcache.delete( page._key );
            }
          } );
          return SUCCESS.clone();
        } );
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
  return caches.open( PAGE_CACHE ).then(
      ( cache )=>offlinePages( cache )
    ).then( ( pages ) => {
      var collection = Object.assign( {}, READING_LIST_COLLECTION );
      collection.pages = pages.map( ( p ) => {
        // remove the private variable
        return Object.assign( p, { _key: undefined } );
      } ).sort( function ( a, b ) {
        return a.modified < b.modified ? 1 : -1;
      } );
      return new Response( JSON.stringify( collection ), {
        headers: { 'Content-Type': 'application/json' }
      } );
    } );
} );

router.get( '/api/en/collection/', networkFirst, {
  cache: COLLECTION_CACHE
} );

router.get( '/api/en/collection/by/(.*)/', networkFirst, {
  cache: COLLECTION_CACHE
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
