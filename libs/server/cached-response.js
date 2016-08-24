import NodeCache from 'node-cache';

import respond from './respond.js'

const shortLifeCache = new NodeCache( { stdTTL: 60 * 10, checkperiod: 60 * 10 } );

function cachedResponse( res, cacheKey, method ){
  res.setHeader('Content-Type', 'application/json');
  if ( !cacheKey ) {
    // no caching requested
    respond( res, method );
  } else {
    shortLifeCache.get( cacheKey, function( err, responseText ) {
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

function invalidate( url ) {
  shortLifeCache.get( url, function( err, responseText ) {
    if ( responseText ) {
      console.log('invalidated', url);
      shortLifeCache.del( url );
    }
  } );
}
export default {
  cachedResponse: cachedResponse,
  invalidate: invalidate
}
