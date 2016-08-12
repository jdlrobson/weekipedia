import mwApi from './mwApi';

// request/lib/oauth.js
export default function ( lang, project, ns, profile ) {
  var params = {
    prop: 'pageterms|pageimages',
    generator: 'watchlistraw',
    wbptterms: 'description',
    pithumbsize: 120,
    pilimit: 48,
    gwrnamespace: ns || 0,
    gwrlimit: 48
  };
  return mwApi( lang, params, project, null, profile );
};
