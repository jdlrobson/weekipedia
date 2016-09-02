function info( pageTitle, body ) {
  var title,
    lines = body.split( '\n' ),
    m = lines[0].match( /'''(.*)'''/ ),
    args = pageTitle.split( '/' );

  if ( m ) {
    title = m[1];
  } else {
    title = 'Unnamed collection';
  }

  return {
    id: parseInt( args[2], 10 ),
    title: title,
    owner: args[0].split( ':' )[1],
    description: lines[2]
  }
}

export default info;
