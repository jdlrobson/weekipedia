import mwApi from './mwApi'

export default function ( lang, term, ns ) {
  var params = {
    prop: 'pageterms|pageimages|pageprops',
    ppprop: 'displaytitle',
    piprop: 'thumbnail',
    pithumbsize: '80',
    pilimit: 15,
    wbpterms: 'description',
    gpssearch: term,
    generator: 'prefixsearch',
    gpsnamespace: ns || 0
  };

  return mwApi( lang, params );
};
