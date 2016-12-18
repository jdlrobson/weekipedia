import offlineRequests from './offline-requests'

function offlinePages( cache ) {
  var members = {};
  var pages = [];

  return offlineRequests( cache ).then( ( reqs ) => {
    reqs.forEach( ( item ) => {
      var lead = item.content.lead;
      var page = {
        title: lead.displaytitle,
        description: lead.description,
        modified: item.response.headers.get( 'date' ),
        coordinates: lead.coordinates,
        _key: item.request
      };

      if ( lead.image ) {
        page.thumbnail = {
          source: lead.image.urls[320],
          width: 320
        };
      }
      // Only surface pages with coordinates and in main namespace
      if ( lead.ns === 0 && lead.coordinates && !members[page.title] ) {
        // Don't repeat pages
        members[page.title] = true;
        pages.push( page );
      }
    } );
    return pages;
  } );
}

export default offlinePages;
