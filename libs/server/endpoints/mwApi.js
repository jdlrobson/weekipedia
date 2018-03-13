import oauthFetchJson from 'oauth-fetch-json';
import { SPECIAL_PROJECTS, HOST_SUFFIX } from './../config';

function flatten( pages ) {
	pages.forEach( function ( page ) {
		if ( page.terms && page.terms.description ) {
			page.description = page.terms.description[ 0 ] || '';
			delete page.terms;
		}
		if ( page.coordinates ) {
			page.coordinates = page.coordinates[ 0 ];
		}
	} );
	return pages;
}

export default function ( langOrLanguageProject, params, projectOrOptions, optionsOrSession, session ) {
	var url, fullParams, project, options, s, baseHost,
		baseParams = {
			action: 'query',
			format: 'json',
			formatversion: 2
		};

	if ( langOrLanguageProject.indexOf( '.' ) > -1 ) {
		s = langOrLanguageProject.split( '.' );
		baseHost = SPECIAL_PROJECTS.indexOf( s[ 1 ] ) > -1 ? s[ 1 ] + '.wikimedia' : langOrLanguageProject;
		url = 'https://' + baseHost + HOST_SUFFIX + '/w/api.php';
		options = projectOrOptions;
		session = optionsOrSession;
	} else {
		project = projectOrOptions || 'wikipedia';
		baseHost = SPECIAL_PROJECTS.indexOf( project ) > -1 ? project + '.wikimedia' : langOrLanguageProject + '.' + project;
		url = 'https://' + baseHost + HOST_SUFFIX + '/w/api.php';
		options = optionsOrSession;
	}

	fullParams = Object.assign( {}, baseParams, params );

	return oauthFetchJson( url, fullParams, options, session ? session.oauth : null ).then( function ( json ) {
		if ( json.error ) {
			throw new Error( json.error.code + ': ' + json.error.info );
		} else if ( json.query && json.query.pages ) {
			return { pages: flatten( json.query.pages ),
				'continue': json.continue,
				redirects: json.query.redirects };
		} else if ( params.meta ) {
			return json.query[ params.meta ];
		} else {
			return json;
		}
	} );
}
