import mwApi from './../mwApi'
import extractInfo from './extract-info'

function list( lang, project, username ) {
  var params = {
    prop: 'revisions',
    generator: 'prefixsearch',
    rvprop: 'content',
    rvsection: 0,
    gpssearch: 'User:' + username + '/lists/',
    gpsnamespace: 2
  }

  return mwApi( lang, params, project ).then( function ( json ) {
    var result = { collections: [] };
    json.pages.forEach( function ( page ) {
      var revs = page.revisions;
      if ( revs[0] ) {
        result.collections.push( extractInfo( page.title, revs[0].content ) );
      }
    } );
    return result;
  } );
}

export default list;
