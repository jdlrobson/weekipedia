import thumbFromTitle from './thumbnail-from-title.js';

function info( pageTitle, body, timestamp, image ) {
	var title,
		lines = body.split( '\n' ),
		m = lines[ 0 ].match( /'''(.*)'''/ ),
		args = pageTitle.split( '/' );

	if ( m ) {
		title = m[ 1 ];
	} else {
		title = 'Unnamed collection';
	}

	return {
		updated: timestamp,
		id: parseInt( args[ 2 ], 10 ),
		title: title,
		thumbnail: image ? {
			title: image,
			source: thumbFromTitle( image.split( ':' )[ 1 ], 200 )
		} : image,
		owner: args[ 0 ].split( ':' )[ 1 ],
		description: lines[ 2 ]
	};
}

export default info;
