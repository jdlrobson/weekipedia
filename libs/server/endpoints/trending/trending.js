import scorer from 'wikipedia-edits-scorer'

import addProps from './../prop-enricher'
import visits from './../visits'

import collections from './collection'

const MIN_BYTES_CHANGED = 100;

function calcScore( edits, halflife ) {
  return scorer.calculateScore(
    new Date(),
    {
      title: edits.title,
      edits: edits.edits,
      anonEdits: edits.anonEdits,
      reverts: edits.reverts,
      start: edits.start,
      isNew: edits.isNew,
      numberContributors: edits.anons.length + edits.contributors.length,
      distribution: edits.distribution,
      views: edits.views,
      bytesChanged: edits.bytesChanged,
      flaggedEdits: edits.volatileFlags
    },
    halflife
  );
}

function scorePages( pages, halflife, visitData ) {
  return pages.map( function ( item ) {
    item.views = visitData[item.title] || 0;
    item.trendiness = calcScore( item, halflife );
    return item;
  } );
}

function sortScoredPages( pages ) {
  return pages.sort( function ( q, r ) {
    return q.trendiness > r.trendiness ? -1 : 1;
  } );
}

function annotate( p, filter, limit, key ) {
  var res = [];
  p.some( function ( item ) {
    var trendIndex, curPosition, lastIndex;

    if ( !item.wiki ) {
      item.wiki = 'enwiki';
      item.lang = 'en';
    } else if ( !item.lang ) {
      item.lang = item.wiki.replace( 'wiki', '' )
    }

    if ( res.length >= limit ) {
      return true;
    } else if ( filter && filter( item ) ) {
      // access the last known position it was at
      if ( item.trendIndex ) {
        trendIndex = item.trendIndex;
      } else {
        trendIndex = {};
      }

      // half life being used for the first time on this page
      if ( !trendIndex[key] ) {
        trendIndex[key] = {};
      }

      // what was the last index and what is the current one?
      curPosition = res.length + 1;
      lastIndex = trendIndex[key].cur || limit + 1;

      trendIndex[key].prev = lastIndex;
      trendIndex[key].cur = curPosition;

      // update the reference on the page entity
      item.trendIndex = trendIndex;
      item.bias = item.getBias();
      // we clone the object to clean out the trendIndex information
      res.push( Object.assign( {},
        item,
        {
          trendIndex: undefined,
          lastIndex: lastIndex,
          index: curPosition
        } )
      );
    }
  } );
  return res;
}

function significantBytesChange( bytesChanged ) {
  return bytesChanged > MIN_BYTES_CHANGED || bytesChanged < -MIN_BYTES_CHANGED;
}

/**
 * @param {String} wiki name of wiki to generate a list of trending articles for
 * @param {Float} halflife in hours at which pages become less trending
 * @param {String} project e.g. wikipedia or wikivoyage
 * @param {String} [title] for debugging purposes
 */
function trending( wiki, halflife, project, title ) {
  var lang = wiki.replace( 'wiki', '' );
  project = project || 'wikipedia';
  var key = wiki + '-' + halflife;
  var collection = collections[lang];

  return new Promise( function ( resolve, reject ) {
    var fn = function ( item ) {
      return title ? item.title === title :
        item.contributors.length + item.anons.length > 2 && ( wiki === '*' || item.wiki === wiki ) &&
        significantBytesChange( item.bytesChanged ) &&
      ( item.age() / 60 ) < ( halflife * 2 ) &&
        item.trendiness > 0;
    };
    if ( !collection ) {
      reject( 'Trending is disabled. A site admin should enable it via TREND_ENABLED.' );
    }

    visits( lang, project ).then( function ( visitedPages ) {
      var visitLookup = {};
      if ( visitedPages && visitedPages.pages ) {
        visitedPages.pages.forEach( function ( page ) {
          visitLookup[page.title] = page.delta;
        } );
      }
      var pages = scorePages( collection.getPages(), halflife, visitLookup );
      var results = annotate( sortScoredPages( pages ), fn, 50, key );
      if ( !results.length ) {
        resolve( {
          pages: [],
          ts: new Date()
        } );
      } else {
        addProps( results,
          [ 'pageimages','pageterms', 'categories' ], lang, project )
        .then( function ( results ) {
          resolve( {
            pages: results,
            ts: new Date()
          } );
        } )
      }
    } );
  } )
}

export default trending
