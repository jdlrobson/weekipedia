/* globals global, clients */
let {
  self
} = global;

self.addEventListener( 'push', function() {
  var icon = 'https://en.m.wikipedia.org/static/apple-touch/wikipedia.png';
  var tag = 'wikimedia-editor-notification';

  fetch( '/api/web-push/service/trending/' ).then( function ( resp ) {
    if (resp.status !== 200) {
    // Nothing more to do.
      return;
    }
    resp.json().then( function ( results ) {
      var lang = 'en';
      var page = results.pages[0];
      if ( page ) {
        var trendedAt = page.trendedAt;
        var minsAgo = ( new Date() - trendedAt ) / 1000 /  60;
        if ( minsAgo < 60 ) {
          // if it's recent send notification
          self.registration.showNotification( page.title + " is trending on Wikipedia", {
            icon: page.thumbnail ? page.thumbnail.source : icon,
            body: page.terms ? page.terms.description[0] : '',
            tag: tag,
            data: 'https://trending.wmflabs.org/' + lang + '/wiki/' + page.title + '?referrer=push'
          } );
        }
      }
    } );
  } );
} );

self.addEventListener( 'notificationclick', function( ev ) {
  ev.notification.close();
  return clients.openWindow( ev.notification.data );
} );
