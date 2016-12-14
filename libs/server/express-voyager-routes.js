import { DEFAULT_PROJECT } from './config'
import voyager from './endpoints/voyager'
import cachedResponses from './cached-response.js'
const cachedResponse = cachedResponses.cachedResponse

function initRoutes( app ) {
  app.get( '/api/voyager/continents/:lang/', ( req, res ) => {
    cachedResponse( res, req.url, function () {
      var p = req.params;
      return voyager.continents( p.lang, DEFAULT_PROJECT );
    } );
  } );

  app.get( '/api/voyager/page/:lang.:project/:title', ( req, res ) => {
    cachedResponse( res, req.url, function () {
      var p = req.params;
      return voyager.page( p.title, p.lang, p.project ).then( ( data ) => {
        const protocol = req.secure ? 'https' : 'http';
        const newPath = '/api/voyager/page/' + p.lang + '.' + p.project + '/' + data.title;
        if ( data.code && [301, 302].indexOf( data.code ) > -1 ) {
          res.redirect( protocol + '://' + req.headers.host + newPath );
          return false;
        } else {
          return data;
        }
      } );
    } );
  } );

  app.get( '/api/voyager/nearby/:lang.:project/:latitude,:longitude/exclude/:title', ( req, res ) => {
    cachedResponse( res, req.url, function () {
      var p = req.params;
      return voyager.nearby( p.latitude, p.longitude, p.lang, p.title, p.project );
    } );
  } );
}

export default initRoutes
