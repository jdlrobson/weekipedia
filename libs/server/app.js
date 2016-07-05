require('babel-core/register')

import express from 'express'
import hogan from 'hogan-express'

// Express
const app = express()
app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.use('/', express.static(__dirname + '/../../public/'))
app.set('port', (process.env.PORT || 3000))


app.listen(app.get('port'))

app.get('*',(req, res) => {
  // use React Router
  res.status(200).render('index.html')
})

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))

