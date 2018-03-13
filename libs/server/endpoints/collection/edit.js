import edit from './../edit';

import lookup from './lookup';

export default function ( lang, project, collection, title, description, image, profile ) {
	var collectionTitle = lookup( profile.displayName, collection );
	var imageString = image ? '[[' + image + '|320px]]' : '';
	var body = [ '\'\'\'' + title + '\'\'\'', '', description, '', imageString ].join( '\n' );

	return edit( lang, collectionTitle, body, 'Edit collection', '0', project, profile );
}
