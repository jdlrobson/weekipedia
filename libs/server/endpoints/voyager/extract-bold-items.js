import { extractElements } from './domino-utils'

function extractBoldItems( html ) {
  var items = [];
  var ext = extractElements( html, 'li b:first-child' );
  Array.prototype.forEach.call( ext.extracted, function ( item ) {
    items.push( item.textContent );
  } );
  if ( items.length === 0 ) {
    ext = extractElements( html, 'p b' );
    Array.prototype.forEach.call( ext.extracted, function ( item ) {
      var text = item.textContent;
      // drop any lower case items
      // e.g. http://localhost:8142/wiki/Santiago%20de%20Chile?action=orientation
      // central university building..
      if ( text.match( /[A-Z]/ ) ) {
        items.push( text );
      }
    } );
  }
  return items;
}

export default extractBoldItems;
