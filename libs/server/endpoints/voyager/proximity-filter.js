import cardFilter from './card-filter'

function proximityFilter( oldPages, exclude ) {
  var pages = [];
  exclude = exclude || [];

  oldPages.forEach( function ( page ) {
    if ( page.coordinates &&
         // below 120km please
         page.coordinates.dist > 140000
     ) {
      return false;
    } else if ( exclude && exclude.length && exclude.indexOf( page.title ) > -1 ) {
      return false;
    } else {
      pages.push( page );
    }
  } );

  return cardFilter( pages );
}

export default proximityFilter
