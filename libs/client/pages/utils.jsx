import React from 'react';
import ReferenceDrawer from './../overlays/ReferenceDrawer';

import withInterAppLinks from './withInterAppLinks';

export const onClickInternalLink = ( {
	router, store, api
} ) => {
	return ( ev ) => {
		var href, parts, match, refId, title, path;
		var lang = store.lang;
		var supportedProjects = store.projects;
		var allowForeignProjects = store.isFeatureEnabled( 'allowForeignProjects' );
		var link = ev.currentTarget;
		var childNode = link.firstChild;
		var parentNode = link.parentNode;
		var HijackedRefDrawer = withInterAppLinks(
			ReferenceDrawer, {
				router, store, api
			}
		);

		if ( parentNode.className === 'mw-ref' ) {
			ev.preventDefault();
			ev.stopPropagation();
			refId = link.getAttribute( 'href' ).split( '#' )[ 1 ];
			store.showOverlay( <HijackedRefDrawer
				title={store.title}
				language_project={store.getLangProject()}
				api={api}
				refId={refId} />, false );

		} else if ( childNode && childNode.nodeName === 'IMG' ) {
			href = link.getAttribute( 'href' ) || '';
			match = href.match( /\.\/File\:(.*)|^File\:(.*)$/ );
			if ( match ) {
				ev.preventDefault();
				ev.stopPropagation();
				path = match[ 1 ] || match[ 2 ];
				router.navigateTo( { hash: '#/media/' + path } );
			}
		} else {
			href = link.getAttribute( 'href' ) || '';
			title = link.getAttribute( 'title' ) || '';

			if ( href.substr( 0, 5 ) !== '/auth' ) {
				if ( href.indexOf( '//' ) === -1 ) {
					parts = href.split( '?' );
					router.navigateTo( {
						pathname: parts[ 0 ],
						search: parts[ 1 ]
					}, title );
					ev.preventDefault();
				} else if ( allowForeignProjects ) {
					supportedProjects.forEach( function ( project ) {
						var reg = new RegExp( '\/\/([a-z\-]*)\.' + project + '\.org\/wiki\/(.*)|\/\/' + project + '\.wikimedia\.org\/wiki\/(.*)|\/\/' );
						var m = href.match( reg );
						if ( m && m[ 1 ] && m[ 2 ] ) {
							router.navigateTo( {
								pathname: '/' + m[ 1 ] + '.' + project + '/' + m[ 2 ]
							}, m[ 2 ] );
							ev.preventDefault();
						} else if ( m && m[ 3 ] ) {
							router.navigateTo( {
								pathname: '/' + lang + '.' + project + '/' + m[ 3 ]
							}, m[ 2 ] );
							ev.preventDefault();
						}
					} );
				}
			}
		}
	};
};
