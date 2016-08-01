import WikiSocketCollection from 'WikiSocketCollection'

import addProps from './../prop-enricher'

const collection = new WikiSocketCollection( {
  id: 'mysocket',
  project: '*.wikipedia.org',
  minPurgeTime: 20,
  maxLifespan: ( 60 * 24 ) * 7,
  maxInactivity: ( 60 * 24 ) * 7,
  minSpeed: 0.1
} );

function calcScore( q, hrs ) {
  return ( ( q.edits - q.anonEdits - q.reverts ) + ( q.anonEdits * 0.2 ) ) /
    q.getBias() *
    ( q.contributors.length / 2 ) *
    Math.pow( 0.5, q.age() / ( hrs * 60 ) );
}

function getSortedPages( hrs ) {
  // FIXME: This should be cached for a fixed window e.g. 5 minutes?
  var p = collection.getPages();
  return p.sort( function ( q, r ) {
    return calcScore( q, hrs ) > calcScore( r, hrs ) ? -1 : 1;
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
      var score =  calcScore( item );
      var speed = item.editsPerMinute();

      item.lastIndex = item.index ? item.index : limit;
      item.index = res.length + 1;
      if ( !item.bestIndex ) {
        item.bestIndex = item.index;
      } else if ( item.index < item.bestIndex ) {
        item.bestIndex = item.index;
      }
      item.bias = item.getBias();
      item.score = score;
      // Mark trending ones as safe until end of lifespan
      // Note: a speed of 0.2 after 5 minutes is equivalent to 1 edit every minute.
      if ( speed > 0.2 && item.bias < 0.75 && item.age() > 5 && item.contributors.length > 2 ) {
        console.log( 'Marked', item.title, 'as safe');
        collection.markSafe( item.id );
      }
      res.push( item );
    }
  } );
  return res;
}

/**
 * @param {String} wiki name of wiki to generate a list of trending articles for
 * @param {Float} halflife in hours at which pages become less trending
 */
function trending( wiki, halflife ) {
  return new Promise( function ( resolve, reject ) {
    var fn = function ( item ) {
      return item.contributors.length + item.anons.length > 2 && ( wiki === '*' || item.wiki === wiki );
    };
    var results = annotate( getSortedPages( halflife ), fn, 50 );
    if ( !results.length ) {
      reject();
    } else {
      addProps( results, [ 'pageimages','pageterms' ] ).then( function( results ) {
        resolve( {
          results: results, ts: new Date()
        } );
      })
    }
  })
}

export default trending