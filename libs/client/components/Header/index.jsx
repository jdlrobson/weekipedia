import React, { Component } from 'react'
import Icon from './../Icon'
import Content from './../../containers/Content'
import './styles.css'
import './icons.css'

class Header extends Component {
  render(){

    return (
      <div className="header-container">
        <Content className="header">
          <div>
            <Icon glyph="mainmenu" href="/" label="Home"/>
          </div>
        </Content>
      </div>
    )
  }
}

export default Header
