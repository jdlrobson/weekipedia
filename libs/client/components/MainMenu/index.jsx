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
