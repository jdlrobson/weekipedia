import mwApi from './mwApi'

export default function ( lang, ns ) {
  var params = {
    prop: 'pageterms|pageimages',
    generator: 'random',
    wbptterms: 'description',
    pithumbsize: 120,
    pilimit: 50,
    grnnamespace: ns || 0,
    grnlimit: 50
  };

  return mwApi( lang, params );
}
