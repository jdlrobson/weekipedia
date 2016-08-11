import fetch from 'isomorphic-fetch'
import param from 'node-jquery-param'

export default function ( lang, params, project, options ) {
  var baseParams = {
    action: 'query',
    format: 'json',
    formatversion: 2
  };
  project = project || 'wikipedia';

  var url = 'https://' + lang + '.' + project + '.org/w/api.php?' +
    param( Object.assign( {}, baseParams, params ) );

  return fetch( url, options )
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
      } else if ( params.meta ) {
        return json.query[params.meta];
      } else if ( params.list ) {
        return json;
      } else {
        return [];
      }
    } );
}
