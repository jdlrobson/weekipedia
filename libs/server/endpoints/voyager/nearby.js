import nearby from './../nearby'

import proximityFilter from './proximity-filter'

// Nearby is restricted to 20km. This extends the search by an additional 20km.
export default function ( latitude, longitude, lang, excludeTitle, project ) {
  var delta = 20;
  latitude = parseFloat( latitude, 10 );
  longitude = parseFloat( longitude, 10 );
  var north = latitude + delta / 111;
  var south = latitude - delta / 111;

  var east = longitude + delta / 111;
  var west = longitude - delta / 111;
  var lookup = {};
  var pages = [];
  var params = {
    codistancefrompoint: latitude + '|' + longitude
  };

  function getNearby( lat, lng ) {
    return nearby( lat, lng, lang, 0, project, params ).then( function ( data ) {
      // increment as necessary
      data.pages.forEach( function ( page ) {
        if ( !lookup[page.title] ) {
          pages.push( page );
          lookup[page.title] = true;
        }
      } )
      data.pages = pages;
      return data;
    } );
  }

  return getNearby( latitude, longitude, 0 ).then( function () {
    return getNearby( south, longitude, delta );
  } ).then( function () {
    return getNearby( latitude, east, delta );
  } ).then( function () {
    return getNearby( latitude, west, delta );
  } ).then( function () {
    return getNearby( north, longitude, delta );
  } ).then( function ( data ) {
    data.pages = proximityFilter( data.pages, [ excludeTitle ] );
    return data;
  } );
}
