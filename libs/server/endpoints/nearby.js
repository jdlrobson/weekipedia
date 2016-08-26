import mwApi from './mwApi'

export default function ( latitude, longitude, lang, ns, project ) {
  var params = {
    colimit: 'max',
    prop: 'coordinates|pageterms|pageimages',
    codistancefrompoint: latitude + '|' + longitude,
    generator: 'geosearch',
    ggsradius: 1000,
    ggsnamespace: ns || 0,
    ggslimit: 50,
    pithumbsize: 120,
    pilimit: 50,
    ggscoord: latitude + '|' + longitude
  };

  return mwApi( lang, params, project ).then( function( data ) {
    data.pages = data.pages.sort( function ( a, b ) {
      return a.coordinates.dist < b.coordinates.dist ? -1 : 1;
    } );
    return data;
  } )
}
