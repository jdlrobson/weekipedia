import edit from './../edit'

import lookup from './lookup'
import list from './list'
import vars from './vars'

export default function ( lang, project, title, description, profile ) {
  return list( lang, project, profile.displayName ).then( function ( result ) {
    var id = 1;
    result.collections.forEach( function ( collection ) {
      if ( collection.id >= id ) {
        id = collection.id + 1;
      }
    } );

    var collectionTitle = lookup( profile.displayName, id );
    title = title || 'Unnamed collection';
    var body = ["'''" + title + "'''", '', description, '', '[[' + vars.category + ']]',
      '== Items ==', '' ].join( '\n' );

    return edit( lang, collectionTitle, body, 'Create collection', '0', project, profile );
  } );
}

