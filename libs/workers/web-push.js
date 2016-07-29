/* globals self */
let {
  self
} = global;

self.addEventListener( 'push', function( ev ) {
  var icon = 'https://en.m.wikipedia.org/static/apple-touch/wikipedia.png';
  var tag = 'wikimedia-editor-notification';

  fetch( '/api/web-push/service/trending/' ).then( function ( resp ) {
    if (resp.status !== 200) {
    // Nothing more to do.
      return;
    }
    resp.json().then( function ( results ) {
      var lang = 'en';
      var page = results.page;
      self.registration.showNotification( page.title + " is trending on Wikipedia", {
        icon: page.thumbnail ? page.thumbnail.source : icon,
        data: 'https://trending.wmflabs.org/' + lang + '/wiki/' + page.title + '?referrer=push'
      } );
    } );
  } );
} );

self.addEventListener( 'notificationclick', function( ev ) {
  ev.notification.close();
  return clients.openWindow( ev.notification.data );
} );
