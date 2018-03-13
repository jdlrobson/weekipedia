// FIXME: Will soon be available in formatted/ endpoint and can be removed
import page from './page';

export default function ( title, lang, project ) {
	return page( title, lang, project, true ).then( function ( data ) {
		if ( data.code && data.code === 301 ) {
			// assume this is the only redirect we have to deal with
			return page( data.title, lang, project, true );
		} else {
			return data;
		}
	} ).then( ( data ) => {
		var sections = data.remaining ? data.remaining.sections : [];
		var references = [];

		sections.forEach( function ( section ) {
			if ( section.isReferenceSection ) {
				references.push( section );
			}
		} );
		return {
			references: {
				sections: references
			}
		};
	} );
}
