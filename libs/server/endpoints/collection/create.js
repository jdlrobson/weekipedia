import edit from './../edit';

import lookup from './lookup';
import list from './list';
import extractInfo from './extract-info';

export default function ( lang, project, title, description, image, profile ) {
	return list( lang, project, profile.displayName, null, null, profile ).then( function ( result ) {
		var id = 1;
		result.collections.forEach( function ( collection ) {
			if ( collection.id >= id ) {
				id = collection.id + 1;
			}
		} );

		var imageString = image ? '[[' + image + '|320px]]' : '';
		var collectionTitle = lookup( profile.displayName, id );
		title = title || 'Unnamed collection';
		var body = [ '\'\'\'' + title + '\'\'\'', '', description, '', imageString,
			'== Items ==', '' ].join( '\n' );

		return edit( lang, collectionTitle, body, 'Create collection', '0', project, profile ).then( function ( resp ) {
			var collection;
			if ( resp.edit.result === 'Success' ) {
				// workaround lag
				collection = extractInfo( collectionTitle, body, resp.edit.newtimestamp, image );
				profile.collections = profile.collections || [];
				profile.collections.unshift( collection );
			}
			return resp;
		} );
	} );
}
