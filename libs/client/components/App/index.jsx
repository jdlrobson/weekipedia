import React from 'react';
import { Icon, SearchForm, Header, Toast } from 'wikipedia-react-components';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import './styles.less';
import './icons.less';

import MainMenu from './../MainMenu';
import TransparentShield from './../TransparentShield';
import BrandingBox from './../BrandingBox';

import initOffline from './../../offline';

import SVGFilter from './SVGFilter.jsx';

import { onClickInternalLink } from './../../pages/utils.jsx';

const passPropsToChildren = ( children, propsToSend ) => {
	return React.Children.map( children, ( child ) => React.cloneElement( child, propsToSend ) );
};

const mergeFunctions = ( actions ) => {
	return function () {
		actions.forEach( ( action ) => {
			action.apply( action, arguments );
		} );
	};
};

// Main component
class App extends React.Component {
	constructor( props ) {
		super( props );
	}
	clearSession() {
		this.props.store.clearSession( this.props.storage );
	}
	renderCurrentRoute() {
		var store = this.props.store;
		var path = window.location.pathname;
		var hash = window.location.hash;
		var route = this.props.router.matchRoute( path, hash,
			Object.assign( {}, this.props ) );

		if ( route.overlay ) {
			store.showOverlay( route.overlay );
		} else {
			store.setPage( route.title, route.language, route.children[ 0 ] );
		}
	}
	componentDidMount() {
		var props = this.props;
		var msg = this.props.msg;
		var store = props.store;
		var renderCurrentRoute = this.renderCurrentRoute.bind( this );
		if ( this.props.offlineVersion ) {
			initOffline( function () {
				store.setUserNotification( msg( 'offline-ready' ) );
			} );
		}

		if ( 'onpopstate' in window ) {
			window.onpopstate = renderCurrentRoute;
			props.router.on( 'onpushstate', renderCurrentRoute );
			props.router.on( 'onreplacestate', renderCurrentRoute );
		}

		store.setPage( props.title, props.lang, null );
		store.loadSession( props.api, props.storage );
	}
	closePrimaryNav() {
		this.props.store.closeMainMenu();
	}
	openPrimaryNav( ev ) {
		this.props.store.openMainMenu();
		ev.preventDefault();
		ev.stopPropagation();
	}
	onClickSearch( ev ) {
		this.props.router.navigateTo( '#/search' );
		ev.stopPropagation();
	}
	getLocalUrl( title, params ) {
		var source = this.props.language_project || this.props.lang + '/wiki';
		title = title ? encodeURIComponent( title ).replace( '%3A', ':' ) : '';
		params = params ? '/' + encodeURIComponent( params ).replace( /%2F/g, '/' ) : '';

		return '/' + source + '/' + title + params;
	}
	render() {
		var props = this.props;
		var store = props.store;
		var secondaryIcons = [];
		var actionClickSearch = this.onClickSearch.bind( this );
		var actionOpenPrimaryNav = this.openPrimaryNav.bind( this );
		var actionClosePrimaryNav = this.closePrimaryNav.bind( this );
		var actionClickLink = onClickInternalLink( props );
		var actionOnUpdateLoginStatus = this.clearSession.bind( this );

		// clone each child and pass them the notifier
		var childProps = typeof document !== 'undefined' ? {
			store: props.store,
			onClickInternalLink: actionClickLink,
			getLocalUrl: this.getLocalUrl.bind( this )
		} : {};
		if ( store.pageviews === 0 ) {
			Object.assign( childProps, props.fallbackProps || {} );
		}

		var search = ( <SearchForm key="chrome-search-form"
			placeholder={props.msg( 'search' )}
			language_project={props.language_project}
			onClickSearch={actionClickSearch} /> );

		var navigationClasses = this.props.store.isMenuOpen ?
			'primary-navigation-enabled navigation-enabled' : '';

		// FIXME: link should point to Special:MobileMenu
		var icon = <Icon glyph="mainmenu" label="Home"
			id="mw-mf-main-menu-button"
			href={this.getLocalUrl( 'Special:MobileMenu' )}
			onClick={actionOpenPrimaryNav}/>;
		var shield = this.props.store.isMenuOpen ? <TransparentShield /> : null;

		var toast,
			overlay = store.isOverlayEnabled ? store.overlay : null;

		if ( overlay ) {
			navigationClasses += store.isOverlayFullScreen ? 'overlay-enabled' : '';
		}

		if ( store.notification ) {
			toast = <Toast>{store.notification}</Toast>;
		}

		if ( store.session ) {
			secondaryIcons.push(
				<Icon glyph="notifications"
					onClick={actionClickLink}
					href={'/' + this.props.language_project + '/Special:Notifications'}/>
			);
		}

		if ( props.showMenuNoJavaScript ) {
			navigationClasses += ' navigation-full-screen';
		}

		secondaryIcons.unshift(
			<Icon glyph="search" onClick={actionClickSearch}/>
		);
		var page = store.page ? [
			store.page
		] : props.children;

		return (
			<div id="mw-mf-viewport" className={navigationClasses}
				lang={this.props.lang} dir={store.isRTL ? 'rtl' : 'ltr'}>
				<nav id="mw-mf-page-left">
					<MainMenu {...this.props}
						onItemClick={mergeFunctions( [ actionClickLink, actionClosePrimaryNav ] )}
						onLogoutClick={actionOnUpdateLoginStatus}
						onLoginClick={actionOnUpdateLoginStatus}
						session={store.session}/>
				</nav>
				<div id="mw-mf-page-center" onClick={actionClosePrimaryNav}>
					<Header {...props} primaryIcon={icon}
						className="chrome-header"secondaryIcons={secondaryIcons}>
						{<BrandingBox {...props} />}
						{search}
					</Header>
					{
						store.devTools && ( <DevTools /> )
					}
					{passPropsToChildren( page, childProps )}
					{shield}
				</div>
				{ overlay }
				{ toast }
				<SVGFilter />
			</div>
		);
	}
}

App.defaultProps = {
	lang: 'en',
	isOverlayFullScreen: true,
	isOverlayEnabled: false
};

export default observer( App );
