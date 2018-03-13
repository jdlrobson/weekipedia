import mwApi from './mwApi';
import { PAGEIMAGES_API_PROPS } from './consts';

// request/lib/oauth.js
export default function ( lang, title, project, query ) {
	var params = Object.assign( {
		prop: 'pageterms|pageimages',
		wbptterms: 'description'
	}, PAGEIMAGES_API_PROPS, query || {} );
	if ( title ) {
		params.gcmtitle = 'Category:' + title;
		params.generator = 'categorymembers';
		params.gcmlimit = 50;
	} else {
		params.generator = 'allcategories';
		params.gaclimit = 50;
	}

	return mwApi( lang, params, project ).then( function ( data ) {
		return {
			'continue': data.continue,
			pages: data.pages
		};
	} );
}
