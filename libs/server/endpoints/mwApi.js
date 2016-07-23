import fetch from 'isomorphic-fetch'
import param from 'node-jquery-param'

export default function ( lang, params ) {
  var baseParams = {
    action: 'query',
    format: 'json',
    formatversion: 2
  };

  var url = 'https://' + lang + '.wikipedia.org/w/api.php?'
    + param( Object.assign( {}, baseParams, params ) );

  return fetch( url )
    .then( function ( resp ) {
     if ( resp.status === 200 ) {
       return resp.json();
     } else {
       throw Error( resp.status );
     }
    } )
    .then( function ( json ) {
      return json.query ? json.query.pages : [];
    } );
};