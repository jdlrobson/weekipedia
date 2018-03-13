import mwApiToken from './mwApiToken';

export default function ( lang, project, titles, profile, unwatch ) {
	var params = {
		action: 'watch',
		titles: titles.join( '|' )
	};
	if ( unwatch ) {
		params.unwatch = '1';
	}

	return mwApiToken( 'watch', lang, params, project, { method: 'POST' }, profile );
}
