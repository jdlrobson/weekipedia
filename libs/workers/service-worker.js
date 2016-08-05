// Keeps the file changing every time we bump the app version.
// Will re-fetch this script, re-install the SW and re-cache the assets.
console.log('Service worker version', global.__VERSION__)

import {
  precache, router, cacheFirst, networkOnly, options
} from 'sw-toolbox'

let {
  caches, addEventListener, skipWaiting, clients
} = global

options.cache.name = 'weekipedia'

// Keep in sync with asset names needed for offline in
// webpack/base.webpack.config.js
const staticAssets = [
  '/home-icon.png',
  '/manifest.json',
  '/main-bundle.js',
  '/style.css',
  '/shell'
]

// Prefetch static assets
precache(staticAssets)

// Serve static assets from cache first
staticAssets.forEach((asset) => router.get(asset, cacheFirst))

// Serve API requests from the network
router.get('/api/(.*)', networkOnly)

// Serve any other url with the shell
router.get('/(.*)', (request, values) => caches.match('/wiki/Special:SplashScreen'))

// Rest of calls go to network
router.default = networkOnly

// Boilerplate to ensure our service worker takes control of the page as soon as possible.
addEventListener('install', event => event.waitUntil(skipWaiting()))
addEventListener('activate', event => event.waitUntil(clients.claim()))