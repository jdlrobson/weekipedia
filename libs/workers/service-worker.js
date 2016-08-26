/* globals clients, caches, skipWaiting */
const version = global.__VERSION__;

import {
  precache, router, cacheFirst, networkOnly, options
} from 'sw-toolbox'

options.cache.name = 'weekipedia-' + version

// Keep in sync with asset names needed for offline in
// webpack/base.webpack.config.js
const staticAssets = [
  '/home-icon.png',
  '/manifest.json',
  '/main-bundle.js',
  '/style.css',
  '/style.rtl.css',
  '/wiki/Special:SplashScreen'
]

// Prefetch static assets
precache(staticAssets)

// Serve static assets from cache first
staticAssets.forEach((asset) => router.get(asset, cacheFirst))

// Serve API requests from the network
router.get('/api/(.*)', networkOnly)

// Login must happen via network
router.get('/auth/(.*)', () => networkOnly)

// Don't cache the workers.
router.get('/sw-bundle.js', () => networkOnly)
router.get('/push-bundle.js', () => networkOnly)

// Serve any other url with the shell
router.get('/(.*)', () => caches.match('/wiki/Special:SplashScreen'))

// Rest of calls go to network
router.default = networkOnly

// Boilerplate to ensure our service worker takes control of the page as soon as possible.
addEventListener('install', event => event.waitUntil(skipWaiting()))
addEventListener('activate', event => event.waitUntil(clients.claim()))