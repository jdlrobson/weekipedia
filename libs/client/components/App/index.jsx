import React from 'react';
import { Icon, SearchForm, Header, Toast } from 'wikipedia-react-components';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import './styles.less';
import './icons.less';

import MainMenu from './MainMenu';
import TransparentShield from './TransparentShield';
import BrandingBox from './BrandingBox';

import initOffline from './../../offline';

import SVGFilter from './SVGFilter.jsx';

const passPropsToChildren = ( children, propsToSend ) => {
	return React.Children.map( children, ( child ) => React.cloneElement( child, propsToSend ) );
};

const mergeFunctions = ( actions ) => {
	return function () {
		actions.forEach( ( action ) => {
			action.apply( null, arguments );
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
	componentDidMount() {
		var props = this.props;
		var msg = this.props.msg;
		var store = props.store;
		if ( this.props.offlineVersion ) {
			initOffline( function () {
				store.setUserNotification( msg( 'offline-ready' ) );
			} );
		}
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
	render() {
		var props = this.props;
		var store = props.store;
		var secondaryIcons = [];
		var onClickInternalLink = props.onClickInternalLink;
		var actionClickSearch = this.onClickSearch.bind( this );
		var actionOpenPrimaryNav = this.openPrimaryNav.bind( this );
		var actionClosePrimaryNav = this.closePrimaryNav.bind( this );
		var actionOnUpdateLoginStatus = this.clearSession.bind( this );

		if ( store.pageviews === 0 ) {
			Object.assign( {}, props.fallbackProps || {} );
		}

		var search = ( <SearchForm key="chrome-search-form"
			placeholder={props.msg( 'search' )}
			onClickSearch={actionClickSearch} /> );

		var navigationClasses = this.props.store.isMenuOpen ?
			'primary-navigation-enabled navigation-enabled' : '';

		// FIXME: link should point to Special:MobileMenu
		var icon = <Icon glyph="mainmenu" label="Home"
			id="mw-mf-main-menu-button"
			href={store.getLocalUrl( 'Special:MobileMenu' )}
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
					onClick={onClickInternalLink}
					href={store.getLocalUrl('Special:Notifications')}/>
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
						onItemClick={mergeFunctions( [ onClickInternalLink, actionClosePrimaryNav ] )}
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
					{passPropsToChildren( page, { store, onClickInternalLink } )}
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

export default inject( function( stores ){
	return {
		onClickInternalLink: stores.onClickInternalLink,
		api: stores.api,
		store: stores.store,
	};
} )(observer( App ));
