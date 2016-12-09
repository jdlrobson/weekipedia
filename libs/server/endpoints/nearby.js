import mwApi from './mwApi'
import { PAGEIMAGES_API_PROPS } from './consts'

export default function ( latitude, longitude, lang, ns, project, params ) {
  latitude = typeof latitude === 'string' ? parseFloat( latitude, 10 ) : latitude;
  longitude = typeof longitude === 'string' ? parseFloat( longitude, 10 ) : longitude;
  while ( latitude < -90 ) {
    latitude += 180;
  }
  while ( longitude > 180 ) {
    longitude -= 180;
  }
  while ( longitude < -180 ) {
    longitude += 360;
  }
  params = Object.assign( {
    colimit: 'max',
    prop: 'coordinates|pageterms|pageimages|info|pageassessments',
    codistancefrompoint: latitude + '|' + longitude,
    generator: 'geosearch',
    ggsradius: 20000,
    ggsnamespace: ns || 0,
    ggslimit: 50,
    ggscoord: latitude + '|' + longitude
  }, PAGEIMAGES_API_PROPS, params || {} );

  return mwApi( lang, params, project ).then( function ( data ) {
    data.pages = data.pages ? data.pages.sort( function ( a, b ) {
      return a.coordinates && b.coordinates && a.coordinates.dist < b.coordinates.dist ? -1 : 1;
    } ).filter( function ( page ) {
      var notRegion = page.pageassessments ? page.pageassessments.region === undefined : true;
      return page.title.indexOf( '/' ) === -1 && notRegion;
    } ) : [];
    return data;
  } )
}
