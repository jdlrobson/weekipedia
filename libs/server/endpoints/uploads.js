import mwApi from './mwApi';
import { PAGEIMAGES_API_PROPS } from './consts';

// request/lib/oauth.js
export default function ( langProject, username, query ) {
	var params = Object.assign( {
		prop: 'pageterms|pageimages|pageprops',
		ppprop: 'displaytitle',
		wbpterms: 'description',
		piprop: 'thumbnail',
		iiurlwidth: 150,
		generator: 'allimages',
		gaiuser: username,
		gaisort: 'timestamp',
		gaidir: 'descending',
		gailimit: 50
	}, PAGEIMAGES_API_PROPS, query || {} );

	return mwApi( langProject, params );
}
