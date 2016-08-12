import mwApi from './mwApi'

export default function ( lang, term, ns, project, isFullTextSearch ) {
  var params = {
    prop: 'pageterms|pageimages|pageprops',
    ppprop: 'displaytitle',
    piprop: 'thumbnail',
    pithumbsize: '80',
    pilimit: 15,
    wbpterms: 'description',
    generator: isFullTextSearch ? 'search' : 'prefixsearch'
  };

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
    var pages = result.pages;
    pages = pages.sort( function ( a, b ) {
      return a.index < b.index ? -1 : 1;
    } );
    return {
      pages: pages
    };
  } );
}
