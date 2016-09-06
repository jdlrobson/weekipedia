import edit from './../edit'

import lookup from './lookup'
import vars from './vars'

export default function ( lang, project, collection, title, description, profile ) {
  var collectionTitle = lookup( profile.displayName, collection );
  var body = ["'''" + title + "'''", '', description, '', '[[' + vars.category + ']]' ].join( '\n' );

  return edit( lang, collectionTitle, body, 'Edit collection', "0", project, profile );
}
