/* globals clients, self */
function pushTrendNotification() {
	var icon = 'https://en.m.wikipedia.org/static/apple-touch/wikipedia.png';

	function showPageNotifications( pages ) {
		var promises = pages.map( function ( page ) {
			if ( page ) {
				var trendedAt = page.trendedAt;
				var title = page.title;
				var minsAgo = ( new Date() - new Date( trendedAt ) ) / 1000 / 60;
				if ( minsAgo < 360 ) {
					var data = {
						icon: page.thumbnail ? page.thumbnail.source : icon,
						tag: 'weekipedia-f-' + title,
						body: page.description,
						data: 'https://trending.wmflabs.org/wiki/' + title + '?referrer=push'
					};
					// if it's recent send notification
					return self.registration.showNotification( title + ' is trending on Wikipedia', data );
				}
			}
		} );
		return Promise.all( promises );
	}

	return fetch( '/api/web-push/service/trending/' ).then( function ( resp ) {
		if ( resp.status !== 200 ) {
			// Nothing more to do.
			return;
		}
		return resp.json().then( function ( result ) {
			showPageNotifications( result.pages || [] );
		} );
	} );
}

self.addEventListener( 'notificationclick', function ( ev ) {
	ev.notification.close();
	return clients.openWindow( ev.notification.data );
} );

self.addEventListener( 'push', function ( event ) {

	event.waitUntil(
		pushTrendNotification()
	);
} );
