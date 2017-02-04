export default function ( text ) {
  var res;
  var match = text.trim().match( /^[^ ]*[\.\—\–] (.*)|^[\.\—] (.*)/ );
  if ( match && ( match[1] || match[2] ) ) {
    return match[1] || match[2];
  }

  match = text.match( / [-\,]+ (.*)/ );
  if ( match && match[1] ) {
    res = match[1];
  } else {
    match = text.match( / [-—\.]* (.*)|[-—](.*)|^[-](.*)/ );
  }
  if ( match && match[1] ) {
    res = match[1];
  } else if ( match && match[2] ) {
    res = match[2];
  } else {
    // check for full stops
    match = text.match( /[^\.\,\:]*[\.\,\:] (.*)/ );
    if ( match && match[1] ) {
      res = match[1].trim();
    } else {
      console.log( `WARNING extraction-destination-from-text failed with ${text}`);
    }
  }
  return res;
}
