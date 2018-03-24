import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { Icon, HorizontalList } from 'wikipedia-react-components';

import './styles.less';
import './icons.less';

function menuItem( { id, href }, { onMenuItemClick, msg } ) {
	return (
		<li key={'menu-item-' + id}>
			<Icon glyph={'mf-' + id} href={href}
				onClick={onMenuItemClick}
				label={msg( 'menu-' + id )} type="before"/>
		</li>
	);
}
class MainMenu extends Component {
	onMenuItemClick( ev ) {
		if ( this.props.onItemClick ) {
			this.props.onItemClick( ev );
		}
	}
	onLoginClick( ev ) {
		if ( this.props.onLoginClick ) {
			this.props.onLoginClick( ev );
		}
		this.onMenuItemClick( ev );
	}
	onLogoutClick( ev ) {
		if ( this.props.onLogoutClick ) {
			this.props.onLogoutClick( ev );
		}
		this.onMenuItemClick( ev );
	}
	getLoginItem() {
		var props = this.props,
			msg = this.props.msg,
			onMenuItemClick = this.onMenuItemClick.bind( this );

		if ( this.props.canAuthenticate ) {
			if ( props.userPage ) {
				return [
					<Icon glyph="mf-profile" href={props.userPage.href}
						key="menu-item-profile"
						label={props.userPage.name} type="before" onClick={onMenuItemClick} />,
					<Icon glyph="mf-logout" href={props.logoutUrl}
						key="menu-item-logout"
						label={msg( 'menu-logout' )} onClick={this.onLogoutClick.bind( this )} />
				];
			} else {
				return <Icon glyph="mf-anonymous"
					href={props.loginUrl}
					label={msg( 'menu-login' )} type="before" onClick={this.onLoginClick.bind( this )} />;
			}
		} else {
			return null;
		}
	}
	render() {
		var onMenuItemClick = this.onMenuItemClick.bind( this );
		var props = this.props,
			msg = props.msg;

		const menuItemProps = { msg, onMenuItemClick };
		return (
			<div className="component-main-menu menu">
				<ul>
					{props.explore.map( ( data )=>menuItem( data, menuItemProps ) )}
				</ul>
				<ul>
					<li>{this.getLoginItem()}</li>
					{props.usertools.map( ( data )=>menuItem( data, menuItemProps ) )}
				</ul>
				<ul>
					{menuItem( props.settings, menuItemProps )}
				</ul>
				<HorizontalList>
					<a href="//github.com/jdlrobson/weekipedia">{msg( 'menu-about' )}</a>
					<a href="/wiki/Wikipedia:General_disclaimer" onClick={onMenuItemClick}>{msg( 'menu-disclaimers' )}</a>
				</HorizontalList>
			</div>
		);
	}
}
MainMenu.defaultProps = {
	lang: 'en'
};

export default inject( ( { store }, { title, canAuthenticate } ) => {
	let settings;
	let usertools = [];
	let loginUrl;
	let userPage;
	let explore = [
		{ href: '/', id: 'home' },
		{ href: store.getLocalUrl( 'Special:Random' ), id: 'random' }
	];
	if ( store.isFeatureEnabled( 'collectionsEnabled' ) ) {
		explore.push( { href: store.getLocalUrl( 'Special:Collections' ), id: 'collections' } );
	}
	if ( store.isFeatureEnabled( 'settingsEnabled' ) ) {
		settings = { href: store.getLocalUrl( 'Special:MobileOptions' ), id: 'settings' };
	}
	if ( store.isFeatureEnabled( 'nearby' ) ) {
		explore.push( { href: store.getLocalUrl( 'Special:Nearby' ), id: 'nearby' } );
	}
	if ( canAuthenticate ) {
		if ( store.session ) {
			const username = store.session.username;
			userPage = {
				name: username,
				href: store.getLocalUrl( 'User:' + username )
			};
			usertools = usertools.concat( [
				{ id: 'watchlist', href: store.getLocalUrl( 'Special:Watchlist' ) },
				{ id: 'contributions', href: store.getLocalUrl( 'Special:Contributions/' + username ) }
			] );
		} else {
			loginUrl = store.getLocalUrl( 'Special:UserLogin?returnto=' + title );
		}
	}
	return {
		userPage,
		usertools,
		loginUrl,
		logoutUrl: '/auth/logout',
		settings,
		explore
	};
} )( observer( MainMenu ) );
