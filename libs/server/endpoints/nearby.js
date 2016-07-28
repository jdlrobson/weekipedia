import mwApi from './mwApi'

export default function ( latitude, longitude, lang, ns ) {
  var params = {
    colimit: 'max',
    prop: 'coordinates|pageterms|pageimages',
    generator: 'geosearch',
    ggsradius: 1000,
    ggsnamespace: ns || 0,
    ggslimit: 50,
    pithumbsize: 120,
    pilimit: 50,
    ggscoord: latitude + '|' + longitude
  };

  return mwApi( lang, params );
}
