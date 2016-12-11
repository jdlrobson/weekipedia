function extractMembers( body, expand ) {
  var lines, members,
    memberPages = [];

  body = body.slice( body.indexOf( '*' ) + 1 );
  lines = body.split( '\n' );
  members = [];

  lines.forEach( function ( line ) {
    var title;
    var m = line.match( /\[\[([^\:]*)\]\]/ );
    if ( m ) {
      title = m[1];
      if ( members.indexOf( title ) === -1 ) {
        members.push( title );

        // extract description
        m = line.match( /\[\[.*\]\] - (.*)/ );
        if ( m ) {
          memberPages.push( { title: title,
            description: m[1] } );
        } else {
          memberPages.push( { title: title } );
        }
      }
    }
  } );
  return expand ? memberPages : members;
}
export default extractMembers;
