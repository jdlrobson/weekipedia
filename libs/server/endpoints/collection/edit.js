import edit from './../edit'

import lookup from './lookup'

export default function ( lang, project, collection, title, description, profile ) {
  var collectionTitle = lookup( profile.displayName, collection );
  var body = ["'''" + title + "'''", '', description, '' ].join( '\n' );

  return edit( lang, collectionTitle, body, 'Edit collection', "0", project, profile );
}
