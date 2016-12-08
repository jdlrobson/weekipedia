import React, { Component } from 'react'

import Content from './../Content'

import './styles.less'
import './icons.less'

class Header extends Component {
  render(){
    var suffix = this.props.fixed ? ' position-fixed' : '';
    var search;
    var secondaryIcon = this.props.secondaryIcon;
    var secondaryIcons = [];

    if ( this.props.search ) {
      search = (
        <Content className="search-header">
          <div className='main'>
            {this.props.search}
          </div>
        </Content>
      );
    }

    if ( secondaryIcon && secondaryIcon.length ) {
      secondaryIcons = secondaryIcon;
    } else {
      secondaryIcons = [ secondaryIcon ];
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
            {
              secondaryIcons.map( function ( icon, i ) {
                return (
                  <div key={'secondary-icon-' + i}>{icon}</div>
                )
              } )
            }
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
