import mwApi from './../mwApi'
import extractInfo from './extract-info'
import thumbFromTitle from './thumbnail-from-title.js'

function list( lang, project, username ) {
  var params = {
    prop: 'revisions|images',
    generator: 'prefixsearch',
    rvprop: 'content',
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
        collection = extractInfo( page.title, revs[0].content );
        if ( page.images ) {
          collection.thumbnail = {
            source: thumbFromTitle( page.images[0].title.split( ':' )[1], 200 )
          };
        }
        result.collections.push( collection );
      }
    } );
    return result;
  } );
}

export default list;
