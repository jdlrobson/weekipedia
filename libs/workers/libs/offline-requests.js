function offlineRequests( cache ) {
  return cache.keys().then( function ( keys ) {
      var result = [];
      var pending = 0;
      return new Promise( function ( resolve ) {
        function whenDone( resolve ) {
          if ( pending <= 0 ) {
            resolve( result );
          }
        }

        // run through all the pages in the page cache to construct a collection
        keys.forEach( function ( key ) {
          var response;
          pending++;
          cache.match( key ).then( ( res )=> {
            response = res;
            return res.json()
          } ).then( function ( json ) {
            result.push( {
              request: key,
              response: response,
              content: json
            } );
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

export default offlineRequests;
