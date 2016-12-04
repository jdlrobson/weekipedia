import mwApi from './../mwApi'

import extractInfo from './extract-info'
import extractMembers from './extract-members'
import thumbFromTitle from './thumbnail-from-title.js'
import lag from './lag'
import vars from './vars'

function list( lang, project, username, title, query, profile ) {
  var params = {
    prop: 'revisions|images',
    rvprop: 'content|timestamp',
    gpslimit: 500,
    gpsnamespace: 2
  };

  if ( username ) {
    params.gpssearch = 'User:' + username + '/lists/';
    params.generator = 'prefixsearch';
  } else {
    params.generator = 'categorymembers';
    params.gcmdir = 'descending';
    params.gcmsort = 'timestamp';
    params.gcmtitle = vars.category;
  }

  if ( query ) {
    if ( query.gcmcontinue || query.continue ) {
      params.continue = query.continue;
      params.gcmcontinue = query.gcmcontinue;
    }
  }

  if ( !title ) {
    params.rvsection = 0;
  }

  return mwApi( lang, params, project ).then( function ( json ) {
    var result = { collections: [],
      continue: json.continue };
    var pages = json.pages || [];
    pages.forEach( function ( page ) {
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
            title: page.images[0].title,
            source: thumbFromTitle( page.images[0].title.split( ':' )[1], 200 )
          };
        }

        // id=0 is reserved for watchlist so don't treat it as collection
        if ( collection.id !== 0 ) {
          result.collections.push( collection );
        }
      }
    } );
    if ( profile ) {
      result = lag( result, username, profile );
    }
    if ( username ) {
      result.owner = username;
    }
    result.collections = result.collections.sort( function ( a, b ) {
      return a.updated > b.updated ? -1 : 1;
    } );
    return result;
  } );
}

export default list;
