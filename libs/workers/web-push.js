/* globals clients, self */

console.log( 'worker installed' );
self.addEventListener( 'push', function ( event ) {
  console.log( 'received push' );

  event.waitUntil(
    pushTrendNotification()
  );
} );

function pushTrendNotification() {
  var icon = 'https://en.m.wikipedia.org/static/apple-touch/wikipedia.png';

  return fetch( '/api/web-push/service/trending/' ).then( function ( resp ) {
    console.log( 'got', resp );
    if ( resp.status !== 200 ) {
      // Nothing more to do.
      return;
    }
    return resp.json().then( function ( results ) {
      var lang = 'en';
      var page = results.pages[0];
      if ( page ) {
        console.log( 'Got page', page );
        var trendedAt = page.trendedAt;
        var minsAgo = ( new Date() - new Date( trendedAt ) ) / 1000 /  60;
        console.log( 'Trended', minsAgo, 'mins ago' );
        if ( minsAgo < 360 ) {
          console.log( 'send notification' );
          // if it's recent send notification
          return self.registration.showNotification( page.title + ' is trending on Wikipedia', {
            icon: page.thumbnail ? page.thumbnail.source : icon,
            body: page.description,
            data: 'https://trending.wmflabs.org/' + lang + '/wiki/' + page.title + '?referrer=push'
          } )
        }
      }
    } );
  } );
}

self.addEventListener( 'notificationclick', function ( ev ) {
  ev.notification.close();
  return clients.openWindow( ev.notification.data );
} );
