require('babel-core/register')

import express from 'express'
import hogan from 'hogan-express'
import NodeCache from 'node-cache';
import fetch from 'isomorphic-fetch'

import trending from './endpoints/trending'

// Express
const app = express()
app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.use('/', express.static(__dirname + '/../../public/'))
app.set('port', (process.env.PORT || 3000))

const shortLifeCache = new NodeCache( { stdTTL: 60 * 10, checkperiod: 60 * 10 } );

app.get('/api/trending/:wiki?/:halflife?',(req, res) => {
  var wiki = req.params.wiki || 'enwiki';
  var halflife = parseFloat( req.params.halflife ) || 5;
  var cacheKey = 'trending/' + wiki + '/' + halflife;

  res.setHeader('Content-Type', 'application/json');

  shortLifeCache.get( cacheKey, function( err, responseText ) {
    var responseText;
    if ( err || !responseText ) {
      trending( wiki, halflife ).then( function ( data ) {
        responseText = JSON.stringify( data );
        shortLifeCache.set( cacheKey, responseText );
        res.status( 200 );
        res.send( responseText );
      }).catch( function () {
        res.status( 404 );
        res.send( JSON.stringify( {
          msg: 'No results'
        } ) );
      });
    } else {
      res.status( 200 );
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
      return resp.status === 404 ? false : resp.json();
    } )
    .then( function ( data ) {
      // FIXME... the API endpoint doesn't return the last modifier username
      res.status( data ? 200 : 404 );
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

