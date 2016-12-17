function offlinePages( cache ) {
  return cache.keys().then( function ( keys ) {
      var pages = [];
      var pending = 0;
      return new Promise( function ( resolve ) {
        function whenDone( resolve ) {
          if ( pending <= 0 ) {
            resolve( pages );
          }
        }

        // run through all the pages in the page cache to construct a collection
        keys.forEach( function ( key ) {
          var modified;
          pending++;
          cache.match( key ).then( ( res )=> {
            modified = new Date( res.headers.get( 'date' ) );
            return res.json()
          } ).then( function ( json ) {
            var lead = json.lead;
            var page = {
              title: lead.displaytitle,
              description: lead.description,
              modified: modified,
              coordinates: lead.coordinates,
              _key: key
            };
            if ( lead.image ) {
              page.thumbnail = {
                source: lead.image.urls[320],
                width: 320
              };
            }
            // Only surface pages with coordinates and in main namespace
            if ( lead.ns === 0 && lead.coordinates ) {
              pages.push( page );
            }
            pending--;
            whenDone( resolve );
          } ).catch( () => {
            pending--;
            whenDone( resolve );
          } );
        } );

        // might be empty..
        whenDone( resolve );
      } )
    } );
}

export default offlinePages;
