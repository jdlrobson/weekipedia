import React, { Component } from 'react'

import Icon from './../Icon'
import HorizontalList from './../HorizontalList'

import './styles.less'
import './icons.less'

class MainMenu extends Component {
  onMenuItemClick(){
    if ( this.props.onItemClick ) {
      this.props.onItemClick();
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
           label={username} type="before" onClick={onMenuItemClick} />,
          <Icon glyph="mf-logout-invert" href='/auth/logout'
            label={msg('menu-logout')} onClick={onMenuItemClick} />
        ];
        usertools = [
          <li>
            <Icon glyph="mf-watchlist-invert" href={'/' + this.props.lang + '/wiki/Special:Watchlist' }
              label={msg('menu-watchlist')} type="before" onClick={onMenuItemClick} />
          </li>,
          <li>
            <Icon glyph="mf-contributions-invert" href={'/' + this.props.lang + '/wiki/Special:Contributions/' + username }
              label='Contributions' type="before" onClick={onMenuItemClick} />
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
      <div className="menu">
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
