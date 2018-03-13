import mwApi from './mwApi';

export default function ( token, lang, params, project, options, session ) {
	var tokenParams = { action: 'query',
		meta: 'tokens',
		type: token };
	return mwApi( lang, tokenParams, project, null, session ).then( function ( data ) {
		params.token = data[ token + 'token' ];
		return mwApi( lang, params, project, { method: 'POST' }, session );
	} );
}
