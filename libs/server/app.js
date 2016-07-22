require('babel-core/register')

import express from 'express'
import hogan from 'hogan-express'

import trending from './endpoints/trending'
import search from './endpoints/search'
import random from './endpoints/random'
import page from './endpoints/page'
import nearby from './endpoints/nearby'

import cachedResponse from './cached-response'

// Express
const app = express()
app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.use('/', express.static(__dirname + '/../../public/'))
app.set('port', (process.env.PORT || 3000))

app.get('/api/trending/:wiki?/:halflife?',(req, res) => {
  var wiki = req.params.wiki || 'enwiki';
  var halflife = parseFloat( req.params.halflife ) || 5;

  cachedResponse( res, req.url, function() {
    return trending( wiki, halflife );
  } );
} )

app.get('/api/random/:lang/',(req, res, match) => {
  return cachedResponse( res, null, function () {
    return random( req.params.lang );
  } );
} );

app.get('/api/file/:lang/:width,:height/:title/',(req, res, match) => {
  return cachedResponse( res, null, function () {
    var p = req.params;
    return file( p.lang, p.title, p.width, p.height );
  } );
} );

app.get('/api/search/:lang/:term',(req, res, match) => {
  return cachedResponse( res, null, function () {
    return search( req.params.lang, req.params.term );
  } );
} );

app.get('/api/nearby/:lang/:latitude,:longitude',(req, res, match) => {
  return cachedResponse( res, req.url, function () {
    return nearby( req.params.latitude, req.params.longitude, req.params.lang );
  } );
} );

app.get('/api/page/:lang/:title',(req, res, match) => {
  var title = req.params.title;
  var lang = req.params.lang;

  cachedResponse( res, req.url, function () {
    return page( req.params.title, req.params.lang )
  });
} );

app.get('*',(req, res) => {

  // use React Router
  res.status(200).render('index.html')
})

app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))

