import fetch from 'isomorphic-fetch'

export default function ( language_project, title, wikitext ) {
  var params = {
    wikitext: wikitext,
    body_only: true,
    title: title
  };
  var url = 'https://' + language_project + '.org/api/rest_v1/' +
    'transform/wikitext/to/html/' + encodeURIComponent( title )

  var headers = new Headers({
    'Content-Type': 'application/json'
  });

  return fetch( url, {  method: 'POST', body: JSON.stringify( params ), headers: headers } ).then( function( resp ) {
    return resp.text();
  } ).then( function ( text ) {
    return {
      text: text
    };
  } );
}
