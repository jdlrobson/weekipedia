import mwApi from './../mwApi'
import extractInfo from './extract-info'
import thumbFromTitle from './thumbnail-from-title.js'

function list( lang, project, username ) {
  var params = {
    prop: 'revisions|images',
    generator: 'prefixsearch',
    rvprop: 'content|timestamp',
    rvsection: 0,
    gpssearch: 'User:' + username + '/lists/',
    gpsnamespace: 2
  }

  return mwApi( lang, params, project ).then( function ( json ) {
    var result = { collections: [] };
    json.pages.forEach( function ( page ) {
      var collection,
        revs = page.revisions;

      if ( revs[0] ) {
        collection = extractInfo( page.title, revs[0].content, revs[0].timestamp );
        if ( page.images ) {
          collection.thumbnail = {
            source: thumbFromTitle( page.images[0].title.split( ':' )[1], 200 )
          };
        }
        // id=0 is reserved for watchlist so don't treat it as collection
        if ( collection.id !== 0 ) {
          result.collections.push( collection );
        }
      }
    } );
    result.collections = result.collections.sort( function ( a, b ) {
      return a.updated > b.updated ? -1 : 1;
    } );
    return result;
  } );
}

export default list;
