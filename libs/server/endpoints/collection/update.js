import edit from './../edit';
import watch from './../watch';

import members from './members';
import lookup from './lookup';
import vars from './vars';

export default function ( lang, project, collection, titles, profile, unwatch ) {
	function addToWatchlist() {
		return watch( lang, project, titles, profile, unwatch );
	}

	function updateCollection() {
		return members( lang, project, collection, profile.displayName ).then( function ( items ) {
			var existingTitles = items.map( function ( item ) {
				return item.title;
			} );
			titles.forEach( function ( title ) {
				if ( unwatch ) {
					var index = existingTitles.indexOf( title );
					if ( index > -1 ) {
						items.splice( index, 1 );
					}
				} else {
					if ( existingTitles.indexOf( title ) === -1 ) {
						items.push( { title: title } );
					}
				}
			} );

			var section = 1;
			var collectionTitle = lookup( profile.displayName, collection );
			var body = '== Items ==\n* ' + items.map( function ( item ) {
				var link = '[[' + item.title + ']]';
				return item.description ? link + ' - ' + item.description : link;
			} ).join( '\n* ' );

			if ( items.length > 3 ) {
				body += '[[' + vars.category + ']]';
			}
			return edit( lang, collectionTitle, body, 'Update collection', section, project, profile );
		} );
	}

	return collection === 0 ? addToWatchlist() : updateCollection();
}
