require('babel-core/register')

import express from 'express'
import hogan from 'hogan-express'
import NodeCache from 'node-cache';
import WikiSocketCollection from 'WikiSocketCollection'
import fetch from 'isomorphic-fetch'
import addProps from './prop-enricher'

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
  maxLifespan: ( 60 * 24 ) * 7,
  maxInactivity: ( 60 * 24 ) * 7,
  minSpeed: 0.1
} );

function calcScore( q, hrs ) {
  return ( ( q.edits - q.anonEdits - q.reverts ) + ( q.anonEdits * 0.2 ) )
    / q.getBias()
    * ( q.contributors.length / 2 )
    * Math.pow(0.5, q.age() / (hrs * 60));
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
  p.some( function ( item, i ) {
    if ( !item.wiki ) {
      item.wiki = 'enwiki';
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

app.get('/api/trending/:wiki?/:timeframe?',(req, res) => {
  var fn, results;
  var wiki = req.params.wiki || 'enwiki';
  var timeframe = parseFloat(req.params.timeframe) || 5;
  var cacheKey = 'trending/' + wiki + '/' + timeframe;

  res.status(200);
  res.setHeader('Content-Type', 'application/json');

  shortLifeCache.get( cacheKey, function( err, responseText ) {
    var responseText;
    if ( err || !responseText ) {
      fn = function ( item ) {
        return item.contributors.length > 1 && ( wiki === '*' || item.wiki === wiki );
      };

      results = annotate( getSortedPages(timeframe), fn, 50 );
      addProps(results, ['pageimages','pageterms']).then(function(results) {
        responseText = JSON.stringify( {
          results: results, ts: new Date()
        } );
        shortLifeCache.set( cacheKey, responseText );
        res.send( responseText );
      })
    } else {
      res.send( responseText );
    }
  } );
} )

app.get('/api/:lang/:title',(req, res, match) => {
  // FIXME: Handle this better please. Use better API.
  var lang = req.params.lang;
  var url = 'https://' + lang + '.wikipedia.org/api/rest_v1/page/mobile-sections/' + encodeURIComponent( req.params.title );
  fetch( url )
    .then( function ( resp ) {
      return resp.json();
    } )
    .then( function ( data ) {
      // FIXME... the API endpoint doesn't return the last modifier username
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.send( JSON.stringify( data ) );
    } );
} );

app.get('*',(req, res) => {
  // use React Router
  res.status(200).render('index.html')
})

app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))

