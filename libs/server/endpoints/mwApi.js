import fetch from 'isomorphic-fetch'
import param from 'node-jquery-param'

export default function ( lang, params, project ) {
  var baseParams = {
    action: 'query',
    format: 'json',
    formatversion: 2
  };
  project = project || 'wikipedia';

  var url = 'https://' + lang + '.' + project + '.org/w/api.php?' +
    param( Object.assign( {}, baseParams, params ) );

    console.log(url);
  return fetch( url )
    .then( function ( resp ) {
     if ( resp.status === 200 ) {
       return resp.json();
     } else {
       throw Error( resp.status );
     }
    } )
    .then( function ( json ) {
      if ( json.query && json.query.pages ) {
        return json.query.pages;
      } else if ( params.meta ){
        return json.query[params.meta];
      } else {
        return [];
      }
    } );
}
