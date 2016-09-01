import addProps from './../prop-enricher'
import visits from './../visits'

import collection from './collection'
import calcScore from './scoring'

const MIN_BYTES_CHANGED = 100;

function scorePages( halflife, visitData ) {
  var p = collection.getPages();
  p.forEach( function ( item ) {
    item.views = visitData[item.title] || 0;
    item.score = calcScore( item, halflife );
  } );
  return p;
}

function sortScoredPages( pages ) {
  return pages.sort( function ( q, r ) {
    return q.score > r.score ? -1 : 1;
  } );
}

function annotate( p, filter, limit ) {
  var res = [];
  p.some( function ( item ) {
    if ( !item.wiki ) {
      item.wiki = 'enwiki';
      item.lang = 'en';
    } else if ( !item.lang ) {
      item.lang = item.wiki.replace( 'wiki', '' )
    }

    if ( res.length >= limit ) {
      return true;
    } else if ( filter && filter( item ) ) {
      item.lastIndex = item.index ? item.index : limit;
      item.index = res.length + 1;
      if ( !item.bestIndex ) {
        item.bestIndex = item.index;
      } else if ( item.index < item.bestIndex ) {
        item.bestIndex = item.index;
      }
      item.bias = item.getBias();
      res.push( item );
    }
  } );
  return res;
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

  return new Promise( function ( resolve, reject ) {
    var fn = function ( item ) {
      return title ? item.title === title :
        item.contributors.length + item.anons.length > 2 && ( wiki === '*' || item.wiki === wiki ) &&
        item.bytesChanged > MIN_BYTES_CHANGED &&
      ( item.lastUpdated() / 60 ) < ( halflife * 2 ) &&
        item.score > 0;
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
      var pages = scorePages( halflife, visitLookup );
      var results = annotate( sortScoredPages( pages ), fn, 50 );
      if ( !results.length ) {
        resolve( {
          pages: [], ts: new Date()
        } );
      } else {
        addProps( results, [ 'pageimages','pageterms' ], lang, project ).then( function( results ) {
          resolve( {
            pages: results, ts: new Date()
          } );
        })
      }
    } );
  })
}

export default trending