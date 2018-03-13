import mwApi from './mwApi';
import { PAGEIMAGES_API_PROPS } from './consts';

// request/lib/oauth.js
export default function ( lang, project, ns, profile, query ) {
	var params = Object.assign( {
		prop: 'pageterms|pageimages',
		generator: 'watchlistraw',
		wbptterms: 'description',
		gwrnamespace: ns || 0,
		gwrlimit: 48
	}, PAGEIMAGES_API_PROPS, query || {} );
	return mwApi( lang, params, project, null, profile );
}
