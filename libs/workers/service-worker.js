/* globals clients, caches, skipWaiting, process, global, self */
/* eslint-disable no-underscore-dangle */
const version = global.__VERSION__;

import {
	precache, router, cacheFirst, networkOnly, options, networkFirst
} from 'sw-toolbox';

options.cache.name = 'weekipedia-' + version.number;

// Keep in sync with asset names needed for offline in
// webpack/base.webpack.config.js
var staticAssets = [
	'/home-icon.png',
	'/manifest.json',
	'/main-bundle.js',
	'/style.css',
	'/style.rtl.css',
	'/wiki/Special:Shell'
];
const API_PATH = process.env.API_PATH;
const OFFLINE_STRATEGY = process.env.OFFLINE_STRATEGY;

// In addition to the static assets store the last 50 page views
options.cache.maxEntries = 50 + staticAssets.length;

if ( version.wordmark ) {
	staticAssets.push( version.wordmark );
}

// Prefetch static assets
precache( staticAssets );

// Serve static assets from cache first
staticAssets.forEach( ( asset ) => router.get( asset, cacheFirst ) );

// The all offline strategy will cache every page you visit
if ( OFFLINE_STRATEGY === 'all' ) {
	router.get( API_PATH + 'page/(.*)', networkFirst );
}

// Serve API requests from the network
router.get( '/api/(.*)', networkOnly );

// Login must happen via network
router.get( '/auth/(.*)', networkOnly );

// Images (#120)
router.get( '/images/(.*)', cacheFirst );

// Serve any other url with the shell
router.get( '/(.*)/(.*)', () => caches.match( '/wiki/Special:Shell' ) );
// serve homepage with shell
router.get( '/', () => caches.match( '/wiki/Special:Shell' ) );

// Rest of calls go to network
router.default = networkOnly;

// Boilerplate to ensure our service worker takes control of the page as soon as possible.
self.addEventListener( 'install', event => event.waitUntil( skipWaiting() ) );
self.addEventListener( 'activate', event => event.waitUntil( clients.claim() ) );
