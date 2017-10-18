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
    return resp.json().then( function ( result ) {
      showPageNotifications( result.pages || [] );
    } );
  } );

  function showPageNotifications( pages ) {
    var promises = pages.map( function ( page ) {
      if ( page ) {
        console.log( 'Got page', page );
        var trendedAt = page.trendedAt;
        var title = page.title;
        var minsAgo = ( new Date() - new Date( trendedAt ) ) / 1000 /  60;
        console.log( 'Trended', minsAgo, 'mins ago' );
        if ( minsAgo < 360 ) {
          console.log( 'send notification' );
          var data = {
            icon: page.thumbnail ? page.thumbnail.source : icon,
            tag: 'weekipedia-f-' + title,
            body: page.description,
            data: 'https://trending.wmflabs.org/wiki/' + title + '?referrer=push'
          };
          console.log( 'send', title, data );
          // if it's recent send notification
          return self.registration.showNotification( title + ' is trending on Wikipedia', data )
        }
      }
    } );
    return Promise.all( promises );
  }
}

self.addEventListener( 'notificationclick', function ( ev ) {
  ev.notification.close();
  return clients.openWindow( ev.notification.data );
} );
