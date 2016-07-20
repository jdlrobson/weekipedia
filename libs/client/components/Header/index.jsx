import React, { Component } from 'react'
import Icon from './../Icon'
import Content from './../../containers/Content'
import './styles.css'
import './icons.css'

class Header extends Component {
  render(){
    var suffix = this.props.fixed ? ' position-fixed' : '';

    return (
      <div className={"header-container" + suffix}>
        <Content className="header">
          <div>
            {this.props.primaryIcon}
          </div>
        </Content>
      </div>
    )
  }
}

Header.defaultProps = {
  fixed: false,
  primaryIcon: (
    <Icon glyph="mainmenu" href="/" label="Home"/>
  )
};

export default Header
