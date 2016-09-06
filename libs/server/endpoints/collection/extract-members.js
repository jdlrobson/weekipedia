function extractMembers( body, expand ) {
  var lines, members,
    memberPages = [];

  body = body.slice( body.indexOf( '*' ) + 1 );
  lines = body.split( '\n' );
  members = [];

  lines.forEach( function ( line ) {
    var title, m2;
    var m = line.match( /\[\[(.*)\]\]/ );
    if ( m ) {
      title = m[1];
      if ( members.indexOf( title ) === -1 ) {
        members.push( title );

        // extract description
        m2 = line.match(/\[\[.*\]\] - (.+)/ );
        if ( m2 && m2[1] !== undefined ) {
          memberPages.push( { title: title, description: m[2] } );
        } else {
          memberPages.push( { title: title } );
        }
      }
    }
  } );
  return expand ? memberPages : members;
}
export default extractMembers;
