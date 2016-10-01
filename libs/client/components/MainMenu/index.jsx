import React, { Component } from 'react'

import Icon from './../Icon'
import HorizontalList from './../HorizontalList'

import './styles.less'
import './icons.less'

class MainMenu extends Component {
  onMenuItemClick(){
    if ( this.props.onItemClick ) {
      this.props.onItemClick();
      this.props.onClickInternalLink.apply( this, arguments );
    }
  }
  onLoginClick() {
    if ( this.props.onLoginClick ) {
      this.props.onLoginClick();
    }
    this.onMenuItemClick();
  }
  onLogoutClick() {
    if ( this.props.onLogoutClick ) {
      this.props.onLogoutClick();
    }
    this.onMenuItemClick();
  }
  getUserMenu() {
    var login, username, usertools,
      msg = this.props.msg,
      prefix = '/' + this.props.lang + '/wiki/',
      onMenuItemClick = this.onMenuItemClick.bind(this);

    if ( this.props.canAuthenticate ) {
      if ( this.props.session ) {
        username = this.props.session.username;
        login = [
          <Icon glyph="mf-profile-invert" href={prefix + 'User:' + username }
            key="menu-item-profile"
           label={username} type="before" onClick={onMenuItemClick} />,
          <Icon glyph="mf-logout-invert" href='/auth/logout'
            key="menu-item-logout"
            label={msg('menu-logout')} onClick={this.onLogoutClick.bind(this)} />
        ];
        usertools = [
          <li key="menu-item-watchlist">
            <Icon glyph="mf-watchlist-invert" href={prefix + 'Special:Watchlist' }
              label={msg('menu-watchlist')} type="before" onClick={onMenuItemClick} />
          </li>,
          <li key="menu-item-contribs">
            <Icon glyph="mf-contributions-invert" href={prefix + 'Special:Contributions/' + username }
              label={msg('menu-contributions')} type="before" onClick={onMenuItemClick} />
          </li>
        ];
      } else {
        login = <Icon glyph="mf-anonymous-invert" href={prefix + 'Special:UserLogin'}
          label={msg('menu-login')} type="before" onClick={this.onLoginClick.bind(this)} />;
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
  render(){
    var onMenuItemClick = this.onMenuItemClick.bind(this);
    var langPrefix = '/' + this.props.lang,
      msg = this.props.msg;

    return (
      <div className="component-main-menu menu">
        <ul>
          <li>
            <Icon glyph="mf-home-invert" href="/" label={msg('menu-home')} type="before"
              onClick={onMenuItemClick} />
          </li>
          <li>
            <Icon glyph="mf-random-invert" href={langPrefix + '/wiki/Special:Random'}
              onClick={onMenuItemClick}
              label={msg('menu-random')} type="before"/>
          </li>
          <li>
            <Icon glyph="mf-nearby-invert" href={langPrefix + '/wiki/Special:Nearby'}
              onClick={onMenuItemClick}
              label={msg('menu-nearby')} type="before"/>
          </li>
          <li>
            <Icon glyph="mf-collections-invert" href={'/' + this.props.lang + '/wiki/Special:Collections/' }
              label={msg('menu-collections')} type="before" onClick={onMenuItemClick} />
          </li>
        </ul>
        {this.getUserMenu()}
        <ul>
          <li>
            <Icon glyph="mf-settings-invert" href={'/' + this.props.lang + '/wiki/Special:MobileOptions' }
              label={msg('menu-settings')} type="before" onClick={onMenuItemClick} />
          </li>
        </ul>
        <HorizontalList>
          <a href="//github.com/jdlrobson/weekipedia">{msg('menu-about')}</a>
          <a href="/wiki/Wikipedia:General_disclaimer" onClick={onMenuItemClick}>{msg('menu-disclaimers')}</a>
        </HorizontalList>
      </div>
    )
  }
}
MainMenu.defaultProps = {
  lang: 'en'
};

export default MainMenu
