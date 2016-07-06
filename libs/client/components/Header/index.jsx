import React, { Component } from 'react'
import Icon from './../Icon'
import './styles.css'
import './icons.css'

class Header extends Component {
  render(){

    return (
      <div className="header-container">
        <div className="header">
          <div>
            <Icon glyph="mainmenu" href="/" label="Home"/>
          </div>
        </div>
      </div>
    )
  }
}

export default Header
