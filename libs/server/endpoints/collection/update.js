import edit from './../edit'
import watch from './../watch'

import members from './members'
import lookup from './lookup'

export default function ( lang, project, collection, titles, profile, unwatch ) {
  function addToWatchlist() {
    return watch( lang, project, titles, profile, unwatch );
  }

  function updateCollection() {
    return members( lang, project, collection, profile.displayName ).then( function ( items ) {
      titles.forEach( function ( title ) {
        if ( unwatch ) {
          var index = items.indexOf( title );
          if ( index > -1 ) {
            items.splice( index, 1 );
          }
        } else {
          if ( items.indexOf( title ) === -1 ) {
            items.push( title );
          }
        }
      } );


      var section = 1;
      var collectionTitle = lookup( profile.displayName, collection );
      var body = '== Items ==\n* ' + items.map( function ( item ) {
          return '[[' + item + ']]';
        } ).join( '\n* ' );

      return edit( lang, collectionTitle, body, 'Update collection', section, project, profile );
    } );
  }

  return collection === 0 ? addToWatchlist() : updateCollection();
}
