import fetch from 'isomorphic-fetch'
import param from 'node-jquery-param'

export default function ( latitude, longitude, lang, ns ) {
  var params = {
    action: 'query',
    format: 'json',
    colimit: 'max',
    prop: 'coordinates|pageterms|pageimages',
    generator: 'geosearch',
    ggsradius: 1000,
    ggsnamespace: ns || 0,
    ggslimit: 50,
    pithumbsize: 120,
    pilimit: 50,
    ggscoord: latitude + '|' + longitude,
    formatversion: 2
  };

  var url = 'https://' + lang + '.wikipedia.org/w/api.php?' + param( params );
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
      return json.query ? json.query.pages : [];
    } );
};