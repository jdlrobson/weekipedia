import fetch from 'isomorphic-fetch'
import param from 'node-jquery-param'

export default function ( lang, ns ) {
  var params = {
    action: 'query',
    format: 'json',
    prop: 'pageterms|pageimages',
    generator: 'random',
    wbptterms: 'description',
    formatversion: 2,
    pithumbsize: 120,
    pilimit: 50,
    grnnamespace: ns || 0,
    grnlimit: 50
  };

  var url = 'https://' + lang + '.wikipedia.org/w/api.php?' + param( params );
  return fetch( url )
    .then( function ( resp ) {
     if ( resp.status === 200 ) {
       return resp.json();
     } else {
       throw Error( resp.status );
     }
    } )
    .then( function ( json ) {
      return json.query.pages;
    } );
};