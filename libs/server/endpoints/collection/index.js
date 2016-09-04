import update from './update'
import member from './member'
import members from './members'
import getInfo from './get-info'
import includes from './includes'
import edit from './edit'
import list from './list'

import addProps from './../prop-enricher'

function membersWithProps( lang, project, collection, username ) {
  return members( lang, project, collection, username ).then( function ( titles ) {
    return getInfo( lang, project, collection, username ).then( function ( info ) {
      return addProps( titles, [ 'pageterms', 'pageimages' ], lang, project ).then( function ( pages ) {
        return {
          id: info.id,
          title: info.title,
          description: info.description,
          pages: pages
        }
      } );
    } );
  } );
}

export default {
  edit: edit,
  includes: includes,
  list: list,
  member: member,
  members: membersWithProps,
  update: update
}