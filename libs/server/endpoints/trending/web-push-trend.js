import subscriber from 'web-push-subscriber'

import collection from './collection'
import Evaluator from './evaluator'

import addProps from './../prop-enricher'
import cachedResponse from './../../cached-response.js'

const EDITS_PER_MIN = process.env.TREND_EDITS_PER_MIN || 20 / 60;
const BIAS = process.env.TREND_BIAS || 0.6;
const MIN_AGE = process.env.TREND_MIN_AGE || 5;
const MAX_AGE = process.env.TREND_MAX_AGE || 50;
const MIN_EDITS = process.env.TREND_MIN_TOTAL_EDITS || 20;
const MIN_CONTRIBUTORS = process.env.TREND_MIN_CONTRIBUTORS || 2;
const TREND_MIN_ANON_EDITS = process.env.TREND_MIN_ANON_EDITS || 1;

var evaluator = new Evaluator( {
  minEdits: MIN_EDITS,
  minContributors: MIN_CONTRIBUTORS,
  maxSpeed: EDITS_PER_MIN,
  minBias: BIAS,
  minAnonEdits: 1,
  minAge: MIN_AGE,
  maxAge: MAX_AGE
} );

if ( collection ) {
  console.log( '# Trending setup:', EDITS_PER_MIN, BIAS, MIN_AGE,
    MAX_AGE, MIN_EDITS, MIN_CONTRIBUTORS, TREND_MIN_ANON_EDITS );

  collection.on( 'edit', function ( item, collection ) {
    if ( item.wiki === 'enwiki' ) {

      if ( evaluator.isTrending( item ) ) {
        collection.markSafe( item.id );
        if ( !item.trendedAt ) {
          // tell me
          console.log( 'Trended', item.title, item.editsPerMinute(), item.getBias(), item.age(), item.contributors );
          item.trendedAt = new Date();
          cachedResponse.invalidate( '/api/web-push/service/trending/' );
          // ping people
          subscriber.broadcast( 'trending' );
        }
      } else if ( evaluator.mightTrend( item ) ) {
        collection.markSafe( item.id );
      }
    }
  } );
}

function trend() {
  function trendSort( pages ) {
    return pages.sort( function ( a, b ) {
      return a.trendedAt > b.trendedAt ? -1 : 1;
    } );
  }

  return new Promise( function ( resolve, reject ) {
    var pages, trended;
    if ( !collection ) {
      reject( 'Trending is disabled. A site admin should enable it via TREND_ENABLED.' );
      return;
    }

    pages = collection.getPages();
    trended = [];
    pages.forEach( function ( page ) {
      if ( page.trendedAt ) {
        if ( typeof page.trendedAt === 'string' ) {
          page.trendedAt = new Date( page.trendedAt );
        }
        trended.push( Object.assign( {}, page, { trendIndex: undefined } ) );
      }
    } );
    trended = trendSort( trended ).slice( 0, 50 );

    // It's always getting less interesting as it gets older so assume the best and last position was 1.
    trended.forEach( function ( trend, i ) {
      trend.lastIndex = i === 0 ? 2 : 1;
      trend.index = i + 1;
    } );

    if ( trended.length ) {
      addProps(  trended, [ 'pageimages','pageterms' ] ).then( function ( pages ) {
        pages = trendSort( pages );
        resolve( {
          // for old workers:
          page: pages[0],
          pages: pages,
          ts: new Date()
        } );
      } );
    } else {
      reject();
    }
  } );
}

export default trend
