function respond( res, method ) {
  return method().then( function ( data ) {
    var responseText = JSON.stringify( data );
    res.status( 200 );
    res.send( responseText );
    return responseText;
  }).catch( function ( error ) {
    var msg = error.toString();
    res.status( msg.indexOf( '404' ) > -1 ? 404 : 500 );
    res.send( JSON.stringify( {
      msg: msg
    } ) );
  });
}

export default respond
