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
      onMenuItemClick = this.onMenuItemClick.bind(this);

    if ( this.props.canAuthenticate ) {
      if ( this.props.session ) {
        username = this.props.session.username;
        login = [
          <Icon glyph="mf-profile-invert" href={'/' + this.props.lang + '/wiki/User:' + username }
           label={username} type="before" onClick={onMenuItemClick} />,
          <Icon glyph="mf-logout-invert" href='/auth/logout'
            label="Log out" onClick={onMenuItemClick} />
        ];
        usertools = [
          <li>
            <Icon glyph="mf-watchlist-invert" href={'/' + this.props.lang + '/wiki/Special:Watchlist' }
              label='Watchlist' type="before" onClick={onMenuItemClick} />
          </li>,
          <li>
            <Icon glyph="mf-contributions-invert" href={'/' + this.props.lang + '/wiki/Special:Contributions/' + username }
              label='Contributions' type="before" onClick={onMenuItemClick} />
          </li>
        ];
      } else {
        login = <Icon glyph="mf-anonymous-invert" href={'/auth/mediawiki' }
          label='Log in' type="before" onClick={onMenuItemClick} />;
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
    var langPrefix = '/' + this.props.lang;

    return (
      <div className="menu">
        <ul>
          <li>
            <Icon glyph="mf-home-invert" href="/" label="Home" type="before"
              onClick={onMenuItemClick} />
          </li>
          <li>
            <Icon glyph="mf-random-invert" href={langPrefix + '/wiki/Special:Random'}
              onClick={onMenuItemClick}
              label="Random" type="before"/>
          </li>
          <li>
            <Icon glyph="mf-nearby-invert" href={langPrefix + '/wiki/Special:Nearby'}
              onClick={onMenuItemClick}
              label="Nearby" type="before"/>
          </li>
        </ul>
        {this.getUserMenu()}
        <HorizontalList>
          <a href="//github.com/jdlrobson/weekipedia">About Weekipedia</a>
          <a href="/wiki/Wikipedia:General_disclaimer" onClick={onMenuItemClick}>Disclaimers</a>
        </HorizontalList>
      </div>
    )
  }
}
MainMenu.defaultProps = {
  lang: 'en'
};

export default MainMenu
