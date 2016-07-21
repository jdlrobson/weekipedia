import React, { Component } from 'react'

import Icon from './../Icon'
import HorizontalList from './../HorizontalList'

import './styles.css'
import './icons.css'

class MainMenu extends Component {
  render(){
    return (
      <div className="menu">
        <ul>
          <li>
            <Icon glyph="mf-home-invert" href="/" label="Home" type="before"/>
          </li>
          <li>
            <Icon glyph="mf-random-invert" href="/wiki/Special:Random" label="Random" type="before"/>
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

export default MainMenu
