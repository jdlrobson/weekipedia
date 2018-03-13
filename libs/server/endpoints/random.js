import mwApi from './mwApi';
import { PAGEIMAGES_API_PROPS } from './consts';

const NUMBER_ARTICLES = 48;

export default function ( lang, ns, project, continueParams ) {
	var params = {
		prop: 'pageterms|pageimages',
		generator: 'random',
		wbptterms: 'description',
		grnnamespace: ns || 0,
		grnlimit: NUMBER_ARTICLES
	};

	return mwApi( lang, Object.assign( params,
		PAGEIMAGES_API_PROPS, continueParams || {} ), project );
}
