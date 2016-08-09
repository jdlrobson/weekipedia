import addProps from './../prop-enricher'
import collection from './../collection'

const MIN_BYTES_CHANGED = 100;

function calcScore( q, hrs ) {
  const MIN_EDITS = 8;
  return ( (-2 * q.volatileFlags ) + ( q.edits - q.anonEdits - q.reverts - MIN_EDITS ) + ( q.anonEdits * 0.2 ) ) /
    q.getBias() *
    ( q.contributors.length / 2 ) *
    Math.pow( 0.5, q.age() / ( hrs * 60 ) );
}

function scorePages( halflife ) {
  var p = collection.getPages();
  p.forEach( function ( item ) {
    item.score = calcScore( item, halflife );
  } );
  return p;
}

function sortScoredPages( pages ) {
  return pages.sort( function ( q, r ) {
    return q.score > r.score ? -1 : 1;
  } );
}

function annotate( p, filter, limit, hrs ) {
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
 */
function trending( wiki, halflife, project ) {
  var lang = wiki.replace( 'wiki', '' );
  project = project || 'wikipedia';

  return new Promise( function ( resolve, reject ) {
    var fn = function ( item ) {
      return item.contributors.length + item.anons.length > 2 && ( wiki === '*' || item.wiki === wiki )
        && item.bytesChanged > MIN_BYTES_CHANGED
        && item.score > 0;
    };

    var pages = scorePages( halflife );
    var results = annotate( sortScoredPages( pages ), fn, 50 );
    if ( !results.length ) {
      reject();
    } else {
      addProps( results, [ 'pageimages','pageterms' ], lang, project ).then( function( results ) {
        resolve( {
          results: results, ts: new Date()
        } );
      })
    }
  })
}

export default trending