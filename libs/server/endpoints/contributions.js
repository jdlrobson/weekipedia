import mwApi from './mwApi';

// request/lib/oauth.js
export default function ( lang, username, ns, query, project ) {
	var params = Object.assign( {
		list: username ? 'usercontribs' : 'recentchanges'
	}, query || {} );

	var feedProps = 'ids|title|timestamp|comment|size|flags|sizediff';

	if ( username ) {
		params.uclimit = 50;
		params.ucprop = feedProps;
		params.ucuser = username;
		params.ucnamespace = ns;
	} else {
		params.rclimit = 50;
		params.rcprop = feedProps + '|sizes|user';
		params.rcnamespace = ns;
	}

	return mwApi( lang, params, project ).then( function ( data ) {
		return {
			'continue': data.continue,
			pages: data.query[ params.list ]
		};
	} );
}
