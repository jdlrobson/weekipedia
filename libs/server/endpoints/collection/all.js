import mwApi from './../mwApi'
import extractInfo from './extract-info'
import thumbFromTitle from './thumbnail-from-title.js'

import vars from './vars'

function all( lang, project, query ) {
  var params = {
    generator: 'categorymembers',
    gcmsort: 'timestamp',
    gcmdir: 'descending',
    rvprop: 'content',
    rvsection: 0,
    prop: 'revisions',
    gpsnamespace: 2,
    gcmtitle: vars.category
  };
  if ( query.gcmcontinue || query.continue ) {
    params.continue = query.continue;
    params.gcmcontinue = query.gcmcontinue;
  }

  console.log( params );
  return mwApi( lang, params, project ).then( function ( json ) {
    var result = { collections: [], continue: json.continue };
    json.pages.forEach( function ( page ) {
      var collection,
        revs = page.revisions;

      if ( revs[0] ) {
        collection = extractInfo( page.title, revs[0].content );
        if ( page.images ) {
          collection.thumbnail = {
            source: thumbFromTitle( page.images[0].title.split( ':' )[1], 200 )
          };
        }
        if ( collection.id !== 0 ) {
          result.collections.push( collection );
        }
      }
    } );
    return result;
  } );
}

export default all;
