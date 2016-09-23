import React, { Component } from 'react'

import Content from './../../containers/Content'
import Icon from './../Icon'

import './styles.less'
import './icons.less'

class Header extends Component {
  render(){
    var suffix = this.props.fixed ? ' position-fixed' : '';
    var search;
    var secondaryIcon = this.props.secondaryIcon || <Icon />

    if ( this.props.search ) {
      search = (
        <Content className="search-header">
          <div className='main'>
            {this.props.search}
          </div>
        </Content>
      );
    }

    return (
      <div className={"header-container" + suffix}>
        <Content className="header toolbar">
          <div>
            {this.props.primaryIcon}
          </div>
          <div className='main'>
            {this.props.main}
          </div>
          <div>
            {secondaryIcon}
          </div>
        </Content>
        {search}
      </div>
    )
  }
}

Header.defaultProps = {
  fixed: false,
  main: null,
  primaryIcon: null
};

export default Header
