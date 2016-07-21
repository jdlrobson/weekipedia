import NodeCache from 'node-cache';

const shortLifeCache = new NodeCache( { stdTTL: 60 * 10, checkperiod: 60 * 10 } );

function respond( res, method ) {
  return method().then( function ( data ) {
    var responseText = JSON.stringify( data );
    res.status( 200 );
    res.send( responseText );
    return responseText;
  }).catch( function (a) {
    res.status( 404 );
    res.send( JSON.stringify( {
      msg: '404'
    } ) );
  });
}

function cachedResponse( res, cacheKey, method ){
  res.setHeader('Content-Type', 'application/json');
  if ( !cacheKey ) {
    // no caching requested
    respond( res, method );
  } else {
    shortLifeCache.get( cacheKey, function( err, responseText ) {
      var responseText;
      if ( err || !responseText ) {
        respond( res, method ).then( function ( newResponseText ) {
          shortLifeCache.set( cacheKey, newResponseText );
        } );
      } else {
        res.status( 200 );
        res.send( responseText );
      }
    } );
  }
}

export default cachedResponse
