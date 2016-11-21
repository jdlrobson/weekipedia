import mwApi from './mwApi'
import { PAGEIMAGES_API_PROPS } from './consts'

export default function ( latitude, longitude, lang, ns, project ) {
  var params = Object.assign( {
    colimit: 'max',
    prop: 'coordinates|pageterms|pageimages',
    codistancefrompoint: latitude + '|' + longitude,
    generator: 'geosearch',
    ggsradius: 1000,
    ggsnamespace: ns || 0,
    ggslimit: 50,
    ggscoord: latitude + '|' + longitude
  }, PAGEIMAGES_API_PROPS );

  return mwApi( lang, params, project ).then( function ( data ) {
    data.pages = data.pages ? data.pages.sort( function ( a, b ) {
      return a.coordinates.dist < b.coordinates.dist ? -1 : 1;
    } ) : [];
    return data;
  } )
}
