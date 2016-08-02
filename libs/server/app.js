require('babel-core/register')

import express from 'express'
import hogan from 'hogan-express'

import visits from './endpoints/visits'
import trending from './endpoints/trending'
import search from './endpoints/search'
import related from './endpoints/related'
import random from './endpoints/random'
import page from './endpoints/page'
import nearby from './endpoints/nearby'
import file from './endpoints/file'

import cachedResponse from './cached-response'

// Express
const app = express()
const https = process.env.USE_HTTPS;

app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.use('/', express.static( __dirname + '/../../public/' ) )
app.set('port', (process.env.PORT || 3000))

if ( https ) {
  app.enable('trust proxy');
  app.use(function (req, res, next) {
    if ( https && !req.secure ) {
      res.redirect('https://' + req.headers.host + req.url);
    } else {
      next();
    }
  });
}

app.get('/api/trending/:wiki/:halflife',(req, res) => {
  var wiki = req.params.wiki;
  var halflife = parseFloat( req.params.halflife );

  cachedResponse( res, req.url, function() {
    return trending( wiki, halflife );
  } );
} )

app.get('/api/random/:lang/',(req, res) => {
  return cachedResponse( res, null, function () {
    return random( req.params.lang );
  } );
} );

app.get('/api/file/:lang/:width,:height/:title/',(req, res) => {
  return cachedResponse( res, null, function () {
    var p = req.params;
    return file( p.lang, p.title, p.width, p.height );
  } );
} );

app.get('/api/related/:lang/:title',(req, res) => {
  return cachedResponse( res, null, function () {
    return related( req.params.lang, req.params.title );
  } );
} );

app.get('/api/search/:lang/:term',(req, res) => {
  return cachedResponse( res, null, function () {
    return search( req.params.lang, req.params.term );
  } );
} );

app.get('/api/nearby/:lang/:latitude,:longitude',(req, res) => {
  return cachedResponse( res, req.url, function () {
    return nearby( req.params.latitude, req.params.longitude, req.params.lang );
  } );
} );

app.get('/api/page/:lang/:title',(req, res) => {
  cachedResponse( res, req.url, function () {
    return page( req.params.title, req.params.lang )
  });
} );

app.get('/api/visits/:lang/',(req, res) => {
  cachedResponse( res, req.url, function () {
    return visits( req.params.lang )
  });
} );

app.get('*',(req, res) => {

  // use React Router
  res.status(200).render('index.html')
})

app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))

