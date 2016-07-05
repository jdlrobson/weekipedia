require('babel-core/register')

import express from 'express'
import hogan from 'hogan-express'
import NodeCache from 'node-cache';
import WikiSocketCollection from 'WikiSocketCollection'

// Express
const app = express()
app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.use('/', express.static(__dirname + '/../../public/'))
app.set('port', (process.env.PORT || 3000))

const shortLifeCache = new NodeCache( { stdTTL: 60 * 10, checkperiod: 60 * 10 } );
const collection = new WikiSocketCollection( {
  id: 'mysocket',
  project: '*.wikipedia.org',
  minPurgeTime: 20,
  maxLifeSpan: ( 60 * 24 ) * 7,
  maxInactivity: ( 60 * 24 ) * 7,
  minSpeed: 0.1
} );

function calcScore( q ) {
  return ( ( ( q.edits - q.anonEdits - q.reverts ) + ( q.anonEdits * 0.1 ) ) / q.getBias() )
    * ( q.contributors.length / 2 );
}

function getSortedPages() {
  // FIXME: This should be cached for a fixed window e.g. 5 minutes?
  var p = collection.getPages();
  return p.sort( function ( q, r ) {
    return calcScore( q ) > calcScore( r ) ? -1 : 1;
  } );
}

function annotate( p, filter, limit ) {
  var res = [];
  p.some( function ( item, i ) {
    if ( !item.wiki ) {
      item.wiki = 'enwiki';
    }
    if ( i >= limit ) {
      return true;
    } else if ( filter && filter( item ) ) {
      var score =  calcScore( item );
      var speed = item.editsPerMinute();

      item.index = i + 1;
      if ( !item.bestIndex ) {
        item.bestIndex = item.index;
      } else if ( item.index > item.bestIndex ) {
        item.bestIndex = item.index;
      }
      item.bias = item.getBias();
      item.score = score;
      // Mark trending ones as safe until end of lifespan
      // Note: a speed of 0.2 after 5 minutes is equivalent to 1 edit every minute.
      if ( speed > 0.2 && item.bias < 0.6 && item.age() > 5 && item.contributors.length > 2 ) {
        console.log( 'Marked', item.title, 'as safe');
        collection.markSafe( item.id );
      }
      res.push( item );
    }
  } );
  return res;
}

app.get('/api/trending/:wiki?',(req, res) => {
  var fn;
  var wiki = req.params.wiki || 'enwiki';
  var cacheKey = 'trending/' + wiki;

  res.status(200);
  res.setHeader('Content-Type', 'application/json');

  shortLifeCache.get( cacheKey, function( err, responseText ) {
    var responseText;
    if ( err || !responseText ) {
      fn = function ( item ) {
        return wiki === '*' || item.wiki === wiki;
      };
      responseText = JSON.stringify( {
        results: annotate( getSortedPages(), fn, 100 ), ts: new Date()
      } );
      shortLifeCache.set( cacheKey, responseText );
    }
    res.send( responseText );
  } );
} )

app.get('*',(req, res) => {
  // use React Router
  res.status(200).render('index.html')
})

app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))

