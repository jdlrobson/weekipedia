import mwApiToken from './mwApiToken';

export default function ( lang, title, body, summary, section, project, profile, method ) {
	var params = {
		action: 'edit',
		title: title,
		basetimestamp: null, // revision timestamp
		starttimestamp: null,
		summary: summary || ''
	};
	if ( method ) {
		params[ method ] = body;
	} else {
		params.text = body;
	}
	if ( section !== undefined ) {
		params.section = section;
	}

	if ( profile && profile.dummy ) {
		return new Promise( function ( resolve ) {
			resolve( { edit: { result: 'Success',
				title: title,
				newrevid: 762310093,
				newtimestamp: new Date().toISOString() } } );
		} );
	} else {
		return mwApiToken( 'csrf', lang, params, project, { method: 'POST' }, profile ).then( function ( data ) {
			return new Promise( function ( resolve ) {
				// TODO: Request revision
				// Blocked on https://phabricator.wikimedia.org/T146836
				resolve( data );
			} );
		} );
	}
}
