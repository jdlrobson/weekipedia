import React, { Component } from 'react'

import Content from './../Content'

import './styles.less'
import './icons.less'

class Header extends Component {
  render(){
    var suffix = this.props.fixed ? ' position-fixed' : '';
    var search;

    if ( this.props.search ) {
      search = (
        <Content className="search-header">
          <div className='main'>
            {this.props.search}
          </div>
        </Content>
      );
    }

    // FIXME: overlay-title is used for consistency with MobileFrontend but not needed
    return (
      <div className={"header-container" + suffix}>
        <Content className="header toolbar">
          <div>
            {this.props.primaryIcon}
          </div>
          <div className='main overlay-title'>
            {this.props.main}
          </div>
          <div>
            {this.props.secondaryIcon}
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
