import React from 'react';

import EditorOverlay from './overlays/EditorOverlay';
import CollectionEditorOverlay from './overlays/CollectionEditorOverlay';
import ImageOverlay from './overlays/ImageOverlay';
import LanguageOverlay from './overlays/LanguageOverlay';
import SearchOverlay from './overlays/SearchOverlay';
import TalkOverlay from './overlays/TalkOverlay';
import IssuesOverlay from './overlays/IssuesOverlay';

export default [
	// Talk Overlay
	[
		/^#\/talk\/?([^\/]*)$/,
		function ( info, props ) {
			var overlayProps = Object.assign( {}, props, {
				section: info[ 1 ]
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
				image: info[ 1 ]
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
				id: info[ 2 ]
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
			return {
				overlay: React.createElement( LanguageOverlay, props )
			};
		}
	],
	// Issues
	[
		/^#\/issues$/,
		function ( info, props ) {
			return {
				overlay: React.createElement( IssuesOverlay, props )
			};
		}
	],
	// Search Overlay
	[
		/^#\/search\/?(.*)$/,
		function ( info, props ) {
			return {
				overlay: React.createElement( SearchOverlay, Object.assign( props, { defaultValue: info[ 1 ] } ) )
			};
		}
	]
];
