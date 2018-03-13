import mwApi from './mwApi';

export default function ( lang, title, query, project ) {
	var params = Object.assign( {
		prop: 'revisions',
		titles: title,
		rvprop: 'ids|timestamp|comment|size|flags|sizediff|user',
		rvlimit: 50
	}, query || {} );

	return mwApi( lang, params, project ).then( function ( data ) {
		return {
			'continue': data.continue,
			pages: data.pages.length ? data.pages[ 0 ].revisions : []
		};
	} );
}
