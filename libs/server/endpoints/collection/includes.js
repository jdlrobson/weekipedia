import mwApi from './../mwApi'
import extractInfo from './extract-info'
import extractMembers from './extract-members'
import watched from './../watched'

function includes( lang, project, title, profile ) {
  var username = profile.displayName;
  var params = {
    prop: 'revisions',
    generator: 'prefixsearch',
    rvprop: 'content',
    gpssearch: 'User:' + username + '/lists/',
    gpsnamespace: 2
  }

  return mwApi( lang, params, project ).then( function ( json ) {
    var result = { collections: [] };
    json.pages.forEach( function ( page ) {
      var split, members, info,
        revs = page.revisions;

      if ( revs[0] ) {
        split = revs[0].content.split( '==\n' );
        members = split[1] ? extractMembers( split[1] ) : [];
        info = extractInfo( page.title, split[0] );
        info.member = members.indexOf( title ) > -1;
        result.collections.push( info );
      }
    } );
    if ( profile ) {
      return watched( lang, project, [ title ], profile ).then( function ( watchInfo ) {
        result.collections.unshift( {
          id: 0,
          title: 'Watchlist',
          member: watchInfo[title]
        } );
        return result;
      } )
    } else {
      return result;
    }
  } );
}

export default includes;
