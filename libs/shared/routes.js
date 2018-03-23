import React from 'react';
import { ErrorBox, Content } from 'wikipedia-react-components';

import Categories from './../client/pages/Categories';
import Collections from './../client/pages/Collections';
import Contributions from './../client/pages/Contributions';
import History from './../client/pages/History';
import Feed from './../client/pages/Feed';
import Page from './../client/pages/Page';
import PageInfo from './../client/pages/PageInfo';
import SpecialPage from './../client/pages/SpecialPage';
import MobileDiff from './../client/pages/MobileDiff';
import MobileMenu from './../client/pages/MobileMenu';
import MobileOptions from './../client/pages/MobileOptions';
import MostRead from './../client/pages/MostRead';
import Random from './../client/pages/Random';
import Search from './../client/pages/Search';
import Shell from './../client/pages/Shell';
import Nearby from './../client/pages/Nearby';
import Watchlist from './../client/pages/Watchlist';
import UserLogin from './../client/pages/UserLogin';
import Uploads from './../client/pages/Uploads';

import utils from './utils';

function getCardClickHandler( router ) {
	return ( ev, href, title ) => {
		var target;
		ev.preventDefault();
		// This can be used as on an onClick handler
		if ( !href ) {
			target = ev.currentTarget;
			href = target.getAttribute( 'href' );
			title = target.getAttribute( 'title' );
		}
		router.navigateTo( href, title );
	};
}

var routes = [
	// 404
	[
		/(.*)/,
		function ( info, props ) {
			return Object.assign( {}, props, {
				title: '404 - Page Not Found',
				children: Content( { children:
          ErrorBox( { msg: 'The path ' + info[ 1 ] + ' is not the path you are looking for.' } )
				} )
			} );
		}
	],
	// no fragment
	[
		/^#(.*)/,
		function () {
			return {};
		}
	],
	// View a page
	[
		// regex 1: /:lang/wiki/:title [1, 2]
		// regex 2: /wiki/:title [3]
		// regex3: /:lang.:project/:title [4,5,6]
		/^\/([a-z\-]*)\/wiki\/([^\/]*)$|^\/wiki\/([^\/]*$)|^\/(.*)\.([^\/]*)\/(.*)$/,
		function ( info, props, query ) {
			var View,
				title = info[ 2 ] || info[ 3 ] || info[ 6 ],
				titleDecoded = decodeURIComponent( title ),
				titleSansPrefix = titleDecoded.substr( titleDecoded.indexOf( ':' ) + 1 ),
				titleParts = titleSansPrefix.split( '/' ),
				project = info[ 5 ],
				action = props.query && props.query.action || 'view',
				lang = info[ 1 ] || info[ 4 ] || 'en',
				articleSource = project ? lang + '.' + project : lang;

			props.lang = lang;
			titleSansPrefix = titleParts[ 0 ];
			props.project = project || props.project;
			props.language_project = lang + '.' + props.project;
			props.desktopUrl = utils.getAbsoluteUrl( title, lang, props.project );
			props.revision = query.oldid;

			// FIXME: i18n
			if ( title.indexOf( 'Special:' ) === 0 ) {
				props.children = [
					React.createElement( SpecialPage,
						Object.assign( {}, props, {
							key: 'page-' + titleSansPrefix,
							title: titleSansPrefix,
							params: decodeURIComponent( titleParts.slice( 1 ) )
						} )
					)
				];
			} else {
				if ( action === 'info' ) {
					View = PageInfo;
				} else {
					View = Page;
				}
				props.title = titleDecoded;
				props.fallback = '/api/page/' + articleSource + '/' + title;
				props.children = [
					React.createElement( View,
						Object.assign( {}, props, {
							i18n: undefined,
							siteinfo: undefined,
							onClickLink: getCardClickHandler( info.router ),
							onExpand: function () {
								var qs = window.location.search;
								qs = !qs ? qs + '?expanded=1' : qs + '&expanded=1';
								info.router.navigateTo( {
									pathname: window.location.pathname,
									search: qs
								}, '', true );
							},
							// FIXME: Needed because of withInterAppLinks
							router: info.router,
							key: 'page-' + title,
							titleSansPrefix: titleSansPrefix,
							title: titleDecoded
						} )
					)
				];
			}
			return props;
		}
	]
];

function addSpecialPage( title, Class, handler ) {
	var regex = [
		// regex 1: /:lang/wiki/Special\::title [1, 2]
		'^\/([a-z\-]*)\/wiki\/Special:' + title + '\/?(.*)',
		// regex 2: /wiki/Special\::title [3]
		'^\/wiki\/Special:' + title + '\/?(.*)$',
		// // regex3: /:lang.:project/:title [4,5,6]
		'^\/([^\.]*)\.(.*)\/Special:' + title + '\/?(.*)$'
	];
	routes.push( [
		new RegExp( regex.join( '|' ) ),
		function ( info, props ) {
			var lang = info[ 1 ] || info[ 4 ] || 'en';
			var project = info[ 5 ] || props.project;
			var params = info[ 3 ] || info[ 2 ] || info[ 6 ];
			var suffix = params ? '/' + params : '';
			var langProject = lang + '.' + project;
			var key = 'page-special-' + lang + '-' + project + '-' + title;
			props = handler ? handler( info, props ) : props;

			Object.assign( props, {
				project: project,
				params: params,
				noIndex: true,
				language_project: langProject,
				lang: lang,
				mobileUrl: utils.getAbsoluteUrl( 'Special:' + title + suffix,
					lang, props.project, true ),
				desktopUrl: utils.getAbsoluteUrl( 'Special:' + title + suffix,
					lang, props.project ),
				title: 'Special:' + title
			} );
			props.children = [
				React.createElement( Class,
					Object.assign( {}, props, {
						title: title,
						key: key,
						// FIXME: Needed because of withInterAppLinks
						router: info.router,
						params: params ? decodeURIComponent( params ).replace( /%2F/gi, '/' ) : params,
						children: []
					} )
				)
			];

			return props;
		}
	] );
}

function addCardClickHandler( info, props ) {
	props.onCardClick = getCardClickHandler( info.router );
	return props;
}

function initSpecialPages() {
	addSpecialPage( 'Categories', Categories, addCardClickHandler );
	addSpecialPage( 'Feed', Feed, ( info, props ) => {
		props.noIndex = false;
		return addCardClickHandler( info, props );
	} );
	addSpecialPage( 'History', History, addCardClickHandler );
	addSpecialPage( 'RecentChanges', Contributions, addCardClickHandler );
	addSpecialPage( 'Contributions', Contributions, addCardClickHandler );
	addSpecialPage( 'Watchlist', Watchlist, addCardClickHandler );
	addSpecialPage( 'EditWatchlist', Watchlist, addCardClickHandler );
	addSpecialPage( 'MobileDiff', MobileDiff );
	addSpecialPage( 'MobileOptions', MobileOptions );
	addSpecialPage( 'MostRead', MostRead, addCardClickHandler );
	addSpecialPage( 'Random', Random, function ( info, props ) {
		props.fallback = '/api/random/' + props.lang;
		props.noIndex = false;
		return addCardClickHandler( info, props );
	} );
	addSpecialPage( 'Search', Search, function ( info, props ) {
		var query = props.query.search;
		if ( query ) {
			props.fallback = '/api/search-full/' + props.language_project + '/' + query;
		}
		return addCardClickHandler( info, props );
	} );
	addSpecialPage( 'Shell', Shell );
	addSpecialPage( 'MobileMenu', MobileMenu, function ( info, props ) {
		props.showMenuNoJavaScript = true;
		return props;
	} );
	addSpecialPage( 'Nearby', Nearby, addCardClickHandler );
	addSpecialPage( 'UserLogin', UserLogin );
	addSpecialPage( 'Collections', Collections, function ( info, props ) {
		props.fallback = '/api/' + props.lang + '/collection/';
		props.noIndex = false;
		if ( props.params ) {
			props.fallback += props.params;
		}
		return addCardClickHandler( info, props );
	} );
	addSpecialPage( 'Uploads', Uploads );
}

initSpecialPages();

export default routes;
