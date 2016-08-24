export default function ( pages ) {
  var bounds = [180,360,-180,-360];
  var zoom = 2;
  pages.forEach( function ( page ) {
    var c = page.coordinates;
    if ( c ) {
      if ( c.lat < bounds[0] ) {
        bounds[0] = c.lat;
      }
      if ( c.lon < bounds[1] ) {
        bounds[1] = c.lon;
      }
      if ( c.lat > bounds[2] ) {
        bounds[2] = c.lat;
      }
      if ( c.lon > bounds[3] ) {
        bounds[3] = c.lon;
      }
    }
  } );
  var clat = bounds[0] + bounds[2];
  var clng = bounds[1] + bounds[3];
  clat = clat === 0 ? clat : clat / 2;
  clng = clng === 0 ? clng : clng / 2;

  return {
    northEast: [ bounds[0], bounds[1]],
    southWest: [ bounds[2], bounds[3] ],
    lat: clat,
    lon: clng,
    zoom: zoom
  }
}
