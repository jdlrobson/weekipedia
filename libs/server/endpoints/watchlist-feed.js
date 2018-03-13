import mwApi from './mwApi';

export default function ( lang, project, ns, profile, query ) {
	var params = Object.assign( {
		list: 'watchlist',
		wllimit: 50,
		wlprop: 'ids|title|flags|comment|sizes|timestamp'
	}, query || {} );

	if ( ns !== undefined ) {
		params.wlnamespace = ns;
	}

	return mwApi( lang, params, project, null, profile ).then( function ( data ) {
		return {
			'continue': data.continue,
			pages: data.query.watchlist
		};
	} );
}
