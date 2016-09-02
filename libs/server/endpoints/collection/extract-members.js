function extractMembers( body ) {
  var lines, members;

  body = body.slice( body.indexOf( '*' ) + 1 );
  lines = body.split( '\n' );
  members = [];

  lines.forEach( function ( line ) {
    var title;
    var m = line.match( /\[\[(.*)\]\]/ );
    if ( m ) {
      title = m[1];
      if ( members.indexOf( title ) === -1 ) {
        members.push( title );
      }
    }
  } );
  return members;
}
export default extractMembers;
