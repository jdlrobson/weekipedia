import React, { Component } from 'react'

import Icon from './../Icon'
import HorizontalList from './../HorizontalList'

import './styles.less'
import './icons.less'

class MainMenu extends Component {
  render(){
    var langPrefix = '/' + this.props.lang;

    return (
      <div className="menu">
        <ul>
          <li>
            <Icon glyph="mf-home-invert" href="/" label="Home" type="before"/>
          </li>
          <li>
            <Icon glyph="mf-random-invert" href={langPrefix + '/wiki/Special:Random'}
              label="Random" type="before"/>
          </li>
          <li>
            <Icon glyph="mf-nearby-invert" href={langPrefix + '/wiki/Special:Nearby'}
              label="Nearby" type="before"/>
          </li>
        </ul>
        <HorizontalList>
          <a href="//github.com/jdlrobson/weekipedia">About Weekipedia</a>
          <a href="/wiki/Wikipedia:General_disclaimer">Disclaimers</a>
        </HorizontalList>
      </div>
    )
  }
}
MainMenu.defaultProps = {
  lang: 'en'
};

export default MainMenu
