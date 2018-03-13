import React, { Component } from 'react';

import { Icon, HorizontalList } from 'wikipedia-react-components';

import './styles.less';
import './icons.less';

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
	getUserMenu() {
		var login, username, usertools,
			props = this.props,
			store = props.store,
			msg = this.props.msg,
			prefix = this.getUrlPrefix(),
			onMenuItemClick = this.onMenuItemClick.bind( this );

		if ( this.props.canAuthenticate ) {
			if ( store.session ) {
				username = store.session.username;
				login = [
					<Icon glyph="mf-profile" href={prefix + '/User:' + username }
						key="menu-item-profile"
						label={username} type="before" onClick={onMenuItemClick} />,
					<Icon glyph="mf-logout" href='/auth/logout'
						key="menu-item-logout"
						label={msg( 'menu-logout' )} onClick={this.onLogoutClick.bind( this )} />
				];
				usertools = [
					<li key="menu-item-watchlist">
						<Icon glyph="mf-watchlist" href={prefix + '/Special:Watchlist' }
							label={msg( 'menu-watchlist' )} type="before" onClick={onMenuItemClick} />
					</li>,
					<li key="menu-item-contribs">
						<Icon glyph="mf-contributions" href={prefix + '/Special:Contributions/' + username }
							label={msg( 'menu-contributions' )} type="before" onClick={onMenuItemClick} />
					</li>
				];
			} else {
				login = <Icon glyph="mf-anonymous"
					href={prefix + '/Special:UserLogin?returnto=' + props.title}
					label={msg( 'menu-login' )} type="before" onClick={this.onLoginClick.bind( this )} />;
			}
			return (
				<ul>
					<li>
						{login}
					</li>
					{usertools}
				</ul>
			);
		} else {
			return null;
		}
	}
	getUrlPrefix() {
		return '/' + this.props.language_project;
	}
	render() {
		var onMenuItemClick = this.onMenuItemClick.bind( this );
		var collectionMenuItem, nearbyMenuItem, settingsMenuItem,
			props = this.props,
			langPrefix = this.getUrlPrefix(),
			options = props.siteoptions,
			msg = props.msg;

		if ( options.collectionsEnabled ) {
			collectionMenuItem = (
				<li>
					<Icon glyph="mf-collections" href={langPrefix + '/Special:Collections/' }
						label={msg( 'menu-collections' )} type="before" onClick={onMenuItemClick} />
				</li>
			);
		}
		if ( options.nearby ) {
			nearbyMenuItem = (
				<li>
					<Icon glyph="mf-nearby" href={langPrefix + '/Special:Nearby'}
						onClick={onMenuItemClick}
						label={msg( 'menu-nearby' )} type="before"/>
				</li>
			);
		}
		if ( options.settingsEnabled ) {
			settingsMenuItem = (
				<li>
					<Icon glyph="mf-settings" href={langPrefix + '/Special:MobileOptions' }
						label={msg( 'menu-settings' )} type="before" onClick={onMenuItemClick} />
				</li>
			);
		}
		return (
			<div className="component-main-menu menu">
				<ul>
					<li>
						<Icon glyph="mf-home" href="/" label={msg( 'menu-home' )} type="before"
							onClick={onMenuItemClick} />
					</li>
					<li>
						<Icon glyph="mf-random" href={langPrefix + '/Special:Random'}
							onClick={onMenuItemClick}
							label={msg( 'menu-random' )} type="before"/>
					</li>
					{nearbyMenuItem}
					{collectionMenuItem}
				</ul>
				{this.getUserMenu()}
				<ul>
					{settingsMenuItem}
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

export default MainMenu;
