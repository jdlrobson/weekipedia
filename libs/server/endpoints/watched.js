import mwApi from './mwApi';

// request/lib/oauth.js
export default function ( lang, project, titles, profile ) {
	var params = {
		prop: 'info',
		inprop: 'watched',
		titles: titles.join( '|' )
	};
	return mwApi( lang, params, project, null, profile ).then( function ( data ) {
		var watched = {};
		data.pages.forEach( function ( page ) {
			watched[ page.title ] = page.watched;
		} );
		return watched;
	} );
}
