import subscriber from 'web-push-subscriber'

import collection from './../collection'
import addProps from './../prop-enricher'

var trendList = [];
const MAX_HISTORY = 100;
const EDITS_PER_MIN = process.env.TREND_EDITS_PER_MIN || 20 / 60;
const BIAS = process.env.TREND_BIAS || 0.6;
const MIN_AGE = process.env.TREND_MIN_AGE || 5;
const MAX_AGE = process.env.TREND_MAX_AGE || 50;
const MIN_EDITS = process.env.TREND_MIN_TOTAL_EDITS || 20;
const MIN_CONTRIBUTORS = process.env.TREND_MIN_CONTRIBUTORS || 2;

function isTrending( item ) {
  var age = item.age();

  // If older than 10 minutes
  return item.editsPerMinute() > EDITS_PER_MIN && item.getBias() <= BIAS && age > MIN_AGE &&
    age < MAX_AGE && item.edits > MIN_EDITS &&
    item.contributors.length >= MIN_CONTRIBUTORS;
}

collection.on( 'edit', function ( item, collection ) {
  if ( item.wiki === 'enwiki' && isTrending( item ) && trendList.indexOf( item.title ) === -1 ) {
    trendList = trendList.slice( trendList.length - MAX_HISTORY, trendList.length );
    collection.markSafe( item.id );
    trendList.push( item.title );

    // tell me
    console.log( 'Trended', item.title, item.editsPerMinute(), item.getBias(), item.age(), item.contributors );
    // ping people
    subscriber.broadcast( 'trending' );
  }
} );

function trend() {
  return new Promise( function ( resolve, reject ) {
    if ( trendList.length ) {
      addProps( [ { title: trendList[trendList.length - 1] } ], [ 'pageimages','pageterms' ] ).then( function( pages ) {
        resolve( {
          page: pages[0], ts: new Date()
        } );
      } );
    } else {
      reject();
    }
  } );
}

export default trend
