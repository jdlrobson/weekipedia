import fetch from 'isomorphic-fetch'

export default function ( title, lang ) {
  // FIXME: Handle this better please. Use better API.
  var url = 'https://' + lang + '.wikipedia.org/api/rest_v1/page/mobile-sections/' +
    encodeURIComponent( title );

  return fetch( url )
    .then( function ( resp ) {
      if ( resp.status === 200 ) {
        return resp.json();
      } else {
        throw Error( resp.status );
      }
    } );
}
