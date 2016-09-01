import subscriber from 'web-push-subscriber'

import collection from './collection'
import addProps from './prop-enricher'
import cachedResponse from './../cached-response.js'

const EDITS_PER_MIN = process.env.TREND_EDITS_PER_MIN || 20 / 60;
const BIAS = process.env.TREND_BIAS || 0.6;
const MIN_AGE = process.env.TREND_MIN_AGE || 5;
const MAX_AGE = process.env.TREND_MAX_AGE || 50;
const MIN_EDITS = process.env.TREND_MIN_TOTAL_EDITS || 20;
const MIN_CONTRIBUTORS = process.env.TREND_MIN_CONTRIBUTORS || 2;

console.log( '# Trending setup:', EDITS_PER_MIN, BIAS, MIN_AGE,
  MAX_AGE, MIN_EDITS, MIN_CONTRIBUTORS );

function mightTrend( item ) {
  var age = item.age();
  return age > MIN_AGE && item.edits > ( MIN_EDITS / 2 ) &&
    age < MAX_AGE;
}

function isTrending( item ) {
  return mightTrend( item ) && item.contributors.length >= MIN_CONTRIBUTORS &&
    item.editsPerMinute() > EDITS_PER_MIN && item.getBias() <= BIAS;
}

collection.on( 'edit', function ( item, collection ) {
  if ( item.wiki === 'enwiki' ) {

    if ( isTrending( item ) ) {
      collection.markSafe( item.id );
      if ( !item.trendedAt ) {
        // tell me
        console.log( 'Trended', item.title, item.editsPerMinute(), item.getBias(), item.age(), item.contributors );
        item.trendedAt = new Date();
        cachedResponse.invalidate( '/api/web-push/service/trending/' );
        // ping people
        subscriber.broadcast( 'trending' );
      }
    } else if ( mightTrend( item ) ) {
      collection.markSafe( item.id );
    }
  }
} );

function trend() {
  function trendSort( pages ) {
    return pages.sort( function ( a, b ) {
      return a.trendedAt > b.trendedAt ? -1 : 1;
    } );
  }

  return new Promise( function ( resolve, reject ) {
    var pages = collection.getPages();
    var trended = [];
    pages.forEach( function ( page ) {
      if ( page.trendedAt ) {
        if ( typeof page.trendedAt === 'string' ) {
          page.trendedAt = new Date( page.trendedAt );
        }
        trended.push( page );
      }
    } );
    trended = trendSort( trended ).slice( 0, 10 );

    if ( trended.length ) {
      addProps(  trended, [ 'pageimages','pageterms' ] ).then( function( pages ) {
        pages = trendSort( pages );
        resolve( {
          // for old workers:
          page: pages[0],
          pages: pages, ts: new Date()
        } );
      } );
    } else {
      reject();
    }
  } );
}

export default trend
