function init( callback ) {
  // Initialize service worker if available
  if ( 'serviceWorker' in navigator ) {
    navigator.serviceWorker.register( '/sw-bundle.js' ).then( ( reg ) => {
      // registration worked
      console.log( 'ServiceWorker: Registration succeeded. Scope is ' + reg.scope )
      reg.addEventListener( 'updatefound', () => onUpdateFound( reg, function () {
        callback( true );
      } ) )
      callback();
    } ).catch( ( error ) =>
      // registration failed
      console.log( 'ServiceWorker: Registration failed with ' + error )
    )
  }
}

function onUpdateFound( registration, callback ) {
  let newWorker = registration.installing

  registration.installing.addEventListener( 'statechange',
    () => onStateChange( newWorker, callback ) )
}

function onStateChange( newWorker, callback ) {
  if ( newWorker.state === 'activated' ) {
    onFirstLoad( callback )
    if ( navigator.serviceWorker.controller ) {
      onClaimed()
    }
  } else if (
    newWorker.state === 'installed' &&
    navigator.serviceWorker.controller
  ) {
    onInstalled()
  }
}

function onFirstLoad( callback ) {
  console.log( 'Service Worker: ready to work offline' )
  callback();
}

function onClaimed() {
  console.log( 'Service Worker: claimed' )
  // Here we can send messages to the service worker about DOM stuff like webp
  // support and things like that.
  // navigator.serviceWorker.controller.postMessage({
  //   type: 'supportsWebp',
  //   value: supportsWebp()
  // });
}

function onInstalled() {
  console.log( 'Service Worker: installed' )
  // Here we can query stuff on indexedDB that service worker has written on
  // installation (like the version for example).
}

export default init
