import React from 'react';

import EditorOverlay from './overlays/EditorOverlay';
import CollectionEditorOverlay from './overlays/CollectionEditorOverlay';
import ImageOverlay from './overlays/ImageOverlay';
import LanguageOverlay from './overlays/LanguageOverlay';
import SearchOverlay from './overlays/SearchOverlay';
import TalkOverlay from './overlays/TalkOverlay';
import IssuesOverlay from './overlays/IssuesOverlay';

import store from './store';

function onExit( router ) {
	return () => {
		router.back();
	};
}

export default [
	// Talk Overlay
	[
		/^#\/talk\/?([^\/]*)$/,
		function ( info, props ) {
			var section = info[ 1 ];
			var overlayProps = Object.assign( {}, props, {
				section: section,
				onExit: onExit( info.router ),
				onSaveComplete: () => {
					store.setUserNotification( 'Your topic was added!' );
					info.router.back();
				}
			} );
			return {
				overlay: React.createElement( TalkOverlay, overlayProps )
			};
		}
	],
	// Edit Overlay
	[
		/^#\/editor\/?([^\/]*)\/?(.*)$/,
		function ( info, props ) {
			var overlayProps = Object.assign( {}, props, {
				onExit: onExit( info.router ),
				onEditSave: function ( newrevid ) {
					info.router.navigateTo( window.location.pathname + '?oldid=' + newrevid );
					store.setUserNotification( 'Your edit was successful!' );
				},
				section: info[ 1 ]
			} );
			if ( info[ 2 ] ) {
				overlayProps.wikitext = atob( info[ 2 ] );
			}
			return {
				overlay: React.createElement( EditorOverlay, overlayProps )
			};
		}
	],
	// Image Overlay
	[
		/^#\/media\/(.*)$/,
		function ( info, props ) {
			var overlayProps = Object.assign( {}, props, {
				image: info[ 1 ],
				onExit: onExit( info.router ),
				onLoadImage: ( path ) => {
					info.router.navigateTo( { hash: '#/media/' + path }, null, true );
				}
			} );
			return {
				overlay: React.createElement( ImageOverlay, overlayProps )
			};
		}
	],
	// collections
	[
		/^#\/edit-collection\/(.*)\/(.*)$/,
		function ( info, props ) {
			var overlayProps = Object.assign( {}, props, {
				username: info[ 1 ],
				id: info[ 2 ],
				onExit: onExit( info.router ),
				onCollectionSave: ( id ) => {
					var msg = id ? 'Collection was successfully updated' :
						'Collection was successfully created.';
					info.router.navigateTo( { pathname: window.location.pathname,
						search: 'c=' + Math.random(), hash: '' }, null, true );
					store.setUserNotification( msg );
				}
			} );
			return {
				overlay: React.createElement( CollectionEditorOverlay, overlayProps )
			};
		}
	],
	// Languages
	[
		/^#\/languages$/,
		function ( info, props ) {
			const languageProps = Object.assign( {}, props, {
				onExit: onExit( info.router ),
				onChooseLanguage: function ( ev, code, href ) {
					info.router.navigateTo( href );
					ev.preventDefault();
				}
			} );
			return {
				overlay: React.createElement( LanguageOverlay, languageProps )
			};
		}
	],
	// Issues
	[
		/^#\/issues$/,
		function ( info, props ) {
			return {
				overlay: React.createElement( IssuesOverlay,
					Object.assign( {}, props, {
						onExit: onExit( info.router )
					} )
				)
			};
		}
	],
	// Search Overlay
	[
		/^#\/search\/?(.*)$/,
		function ( info, props ) {
			var router = info.router;
			return {
				overlay: React.createElement( SearchOverlay, Object.assign( props,
					{
						onExit: onExit( info.router ),
						defaultValue: info[ 1 ],
						onSearchSubmit: function ( term ) {
							router.navigateTo( {
								pathname: '/' + store.getLangProject() + '/Special:Search/' + encodeURIComponent( term ),
								search: ''
							}, 'Search' );
						},
						onSearch: function ( term ) {
							router.navigateTo( null, '#/search/' + term, true );
						}
					} ) )
			};
		}
	]
];
