import mwApi from './mwApi'
import { PAGEIMAGES_API_PROPS } from './consts'

import cardFilter from './voyager/card-filter'

export default function ( lang, term, ns, project, isFullTextSearch ) {
  var params = Object.assign( {
    prop: 'pageterms|pageimages|pageprops|pageassessments',
    ppprop: 'displaytitle',
    redirects: '',
    piprop: 'thumbnail',
    wbpterms: 'description',
    generator: isFullTextSearch ? 'search' : 'prefixsearch'
  }, PAGEIMAGES_API_PROPS );

  if ( isFullTextSearch ) {
    params.gsrlimit = 50;
    params.gsrqiprofile = 'classic_noboostlinks';
    params.gsrwhat = 'text';
    params.gsrsearch = term;
  } else {
    params.gpssearch = term;
    params.gpsnamespace = ns || 0
  }

  return mwApi( lang, params, project ).then( function ( result ) {
    var pages = result.pages || [];
    pages = pages.sort( function ( a, b ) {
      return a.index < b.index ? -1 : 1;
    } );
    return {
      pages: cardFilter( pages )
    };
  } );
}
