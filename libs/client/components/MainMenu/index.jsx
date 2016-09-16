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
  getUserMenu() {
    var login, username, usertools,
      msg = this.props.msg,
      onMenuItemClick = this.onMenuItemClick.bind(this);

    if ( this.props.canAuthenticate ) {
      if ( this.props.session ) {
        username = this.props.session.username;
        login = [
          <Icon glyph="mf-profile-invert" href={'/' + this.props.lang + '/wiki/User:' + username }
            key="menu-item-profile"
           label={username} type="before" onClick={onMenuItemClick} />,
          <Icon glyph="mf-logout-invert" href='/auth/logout'
            key="menu-item-logout"
            label={msg('menu-logout')} onClick={onMenuItemClick} />
        ];
        usertools = [
          <li key="menu-item-watchlist">
            <Icon glyph="mf-watchlist-invert" href={'/' + this.props.lang + '/wiki/Special:Watchlist' }
              label={msg('menu-watchlist')} type="before" onClick={onMenuItemClick} />
          </li>,
          <li key="menu-item-contribs">
            <Icon glyph="mf-contributions-invert" href={'/' + this.props.lang + '/wiki/Special:Contributions/' + username }
              label={msg('menu-contributions')} type="before" onClick={onMenuItemClick} />
          </li>
        ];
      } else {
        login = <Icon glyph="mf-anonymous-invert" href={'/auth/mediawiki' }
          label={msg('menu-login')} type="before" onClick={onMenuItemClick} />;
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
