import NodeCache from 'node-cache';

const shortLifeCache = new NodeCache( { stdTTL: 60 * 10, checkperiod: 60 * 10 } );

function cachedResponse( res, cacheKey, method ){
  res.setHeader('Content-Type', 'application/json');
  shortLifeCache.get( cacheKey, function( err, responseText ) {
    var responseText;
    if ( err || !responseText ) {
      method().then( function ( data ) {
        responseText = JSON.stringify( data );
        shortLifeCache.set( cacheKey, responseText );
        res.status( 200 );
        res.send( responseText );
      }).catch( function () {
        res.status( 404 );
        res.send( JSON.stringify( {
          msg: '404'
        } ) );
      });
    } else {
      res.status( 200 );
      res.send( responseText );
    }
  } );
}

export default cachedResponse
