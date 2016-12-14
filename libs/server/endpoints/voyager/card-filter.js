function cardFilter( oldPages, mustHaveImage, mustHaveCoordinates ) {
  var pages = [];
  var sortNeeded = false;
  // only what places
  var filters = [ 'country', 'county', 'state', 'region', 'city', 'lake',
    'district', 'National Park', 'town', 'village', 'hamlet', 'metropolis',
    'continental', 'continent', 'subregion', 'republic', 'commune', 'area',
    'archipelago',
    'settlement', 'monarchy', 'island', 'capital' ]
  var exceptions = [ 'South Pole', 'North Pole' ];

  function skip( desc ) {
    var skip = true;
    if ( !desc ) {
      return false;
    }
    filters.forEach( function ( filter ) {
      if ( desc.indexOf( filter ) > -1 ) {
        skip = false;
      }
    } );
    return skip;
  }

  function isDestination( assessment ) {
    return assessment.city || assessment.region || assessment.park;
  }

  oldPages.forEach( function ( page ) {
    var skipThisOne;
    var desc = page.description || '';
    if ( page.title.indexOf( '/' ) === -1 &&
      !page.missing &&
      ( !skip( desc ) || exceptions.indexOf( page.title ) > -1 )
    ) {
      if ( page.coordinates && page.coordinates.dist ) {
        sortNeeded = true;
      } else if ( mustHaveCoordinates && !page.coordinates ) {
        skipThisOne = true;
      }
      if ( page.pageassessments && !isDestination( page.pageassessments ) ) {
        skipThisOne = true;
      }
      if ( mustHaveImage && !page.thumbnail ) {
        skipThisOne = true;
      }
      if ( !skipThisOne ) {
        pages.push( page );
      }
    }
  } );

  if ( sortNeeded ) {
    return pages.sort( function ( page, page2 ) {
      var c1 = page.coordinates;
      var c2 = page2.coordinates;
      if ( !c1 ) {
        return 1;
      } else if ( !c2 ) {
        return -1;
      } else {
        return c1.dist < c2.dist ? -1 : 1;
      }
    } );
  } else {
    return pages;
  }
}

export default cardFilter
