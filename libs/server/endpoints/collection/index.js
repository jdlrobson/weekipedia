import update from './update';
import member from './member';
import members from './members';
import getInfo from './get-info';
import includes from './includes';
import edit from './edit';
import list from './list';
import create from './create';
import all from './all';

import addProps from './../prop-enricher';

function membersWithProps( lang, project, collection, username, query ) {
	return members( lang, project, collection, username ).then( function ( titles ) {
		var offset = query.offset ? parseInt( query.offset, 10 ) : 0;
		var nextOffset;

		return getInfo( lang, project, collection, username ).then( function ( info ) {
			if ( titles.length - offset > 50 ) {
				nextOffset = offset + 50;
			}
			titles = titles.slice( offset, offset + 50 );

			return addProps( titles, [ 'pageterms', 'pageimages', 'coordinates' ], lang, project ).then( function ( pages ) {
				return Object.assign( info, {
					pages: pages,
					'continue': nextOffset ? {
						offset: nextOffset
					} : undefined
				} );
			} );
		} );
	} );
}

export default {
	all: all,
	create: create,
	edit: edit,
	includes: includes,
	list: list,
	member: member,
	members: membersWithProps,
	update: update
};
