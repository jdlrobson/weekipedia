import edit from './../edit'

import lookup from './lookup'
import list from './list'

export default function ( lang, project, title, description, profile ) {
  return list( lang, project, profile.displayName ).then( function ( result ) {
    var id = 0;
    result.collections.forEach( function ( collection ) {
      if ( collection.id === id ) {
        id += 1;
      }
    } );

    var collectionTitle = lookup( profile.displayName, id );
    title = title || 'Unnamed collection';
    var body = ["'''" + title + "'''", '', description, '', '== Items ==', '' ].join( '\n' );

    return edit( lang, collectionTitle, body, 'Create collection', null, project, profile );
  } );
}

