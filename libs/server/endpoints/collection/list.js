import mwApi from './../mwApi'
import extractInfo from './extract-info'
import extractMembers from './extract-members'
import thumbFromTitle from './thumbnail-from-title.js'

function list( lang, project, username, title ) {
  var params = {
    prop: 'revisions|images',
    generator: 'prefixsearch',
    rvprop: 'content|timestamp',
    gpslimit: 500,
    gpssearch: 'User:' + username + '/lists/',
    gpsnamespace: 2
  };
  if ( !title ) {
    params.rvsection = 0;
  }

  return mwApi( lang, params, project ).then( function ( json ) {
    var result = { collections: [] };
    json.pages.forEach( function ( page ) {
      var collection, split, head,
        members = [],
        revs = page.revisions;

      if ( revs[0] ) {
        head = revs[0].content;
        if ( title ) {
          split = head.split( '==\n' );
          members = split[1] ? extractMembers( split[1] ) : [];
          head = split[0];
        }

        collection = extractInfo( page.title, head, revs[0].timestamp );
        if ( title ) {
          collection.member = members.indexOf( title ) > -1;
        }

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
