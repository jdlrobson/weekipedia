require('babel-core/register')

import express from 'express'
import hogan from 'hogan-express'

import trending from './endpoints/trending'
import page from './endpoints/page'
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

app.get('/api/:lang/:title',(req, res, match) => {
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

