function respond( res, method ) {
  return method().then( function ( data ) {
    var responseText = JSON.stringify( data );
    res.status( 200 );
    res.send( responseText );
    return responseText;
  }).catch( function () {
    res.status( 404 );
    res.send( JSON.stringify( {
      msg: '404'
    } ) );
  });
}

export default respond
