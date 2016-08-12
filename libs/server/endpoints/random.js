import mwApi from './mwApi'

const number_articles = 48;

export default function ( lang, ns, project, continueParams ) {
  var params = {
    prop: 'pageterms|pageimages',
    generator: 'random',
    wbptterms: 'description',
    pithumbsize: 120,
    pilimit: number_articles,
    grnnamespace: ns || 0,
    grnlimit: number_articles
  };

  return mwApi( lang, Object.assign( params, continueParams || {} ), project );
}
