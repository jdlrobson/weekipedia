import mwApi from './mwApi'
import { PAGEIMAGES_API_PROPS } from './consts'
import cardFilter from './voyager/card-filter'

const number_articles = 100;

function random ( lang, ns, project, continueParams ) {
  var params = {
    prop: 'pageterms|pageimages|pageassessments|coordinates',
    generator: 'random',
    wbptterms: 'description',
    palimit: 'max',
    colimit: 'max',
    grnnamespace: ns || 0,
    grnlimit: number_articles
  };

  return mwApi( lang, Object.assign( params,
    PAGEIMAGES_API_PROPS, continueParams || {} ), project )
    .then( function ( data ) {
      data.pages = cardFilter( data.pages, true, true );
      var len = data.pages.length;
      data.pages = data.pages.slice( 0, len - ( len % 3 ) ).sort( function () {
        return 0.5 - Math.random();
      } );
      return data;
    } );
}

export default function ( lang, ns, project, continueParams ) {
  var pages = [];
  var randomQuery = this;

  function randomRecursive() {
    return random( lang, ns, project, continueParams ).then( (data ) => {
        pages = pages.concat( data.pages );
        if ( pages.length < number_articles ) {
          return randomRecursive( continueParams );
        } else {
          data.pages = pages.slice( 0, number_articles );
          return data;
        }
      })
  }

  return randomRecursive( continueParams );
}
