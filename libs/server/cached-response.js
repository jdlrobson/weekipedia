import NodeCache from 'node-cache';

import respond from './respond.js'

const shortLifeCache = new NodeCache( { stdTTL: 60 * 10, checkperiod: 60 * 10 } );

let blacklist = [];

function cachedResponse( res, cacheKey, method ){
  res.setHeader('Content-Type', 'application/json');
  if ( !cacheKey || blacklist.indexOf( cacheKey ) > -1 ) {
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
      blacklist.push( url );
      shortLifeCache.del( url );
      // give 1s for cache to warm up
      setTimeout( function () {
        var i = blacklist.indexOf( url );
        if ( i > -1 ) {
          blacklist.splice( i , 1 );
        }
      }, 1000 );
    } else {
      console.log( 'failed to invalidate', url );
    }
  } );
}
export default {
  cachedResponse: cachedResponse,
  invalidate: invalidate
}
