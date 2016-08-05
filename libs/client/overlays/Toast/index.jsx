import React, { Component } from 'react'

import Overlay from './../../containers/Overlay'

import './styles.css'

export default React.createClass({
  render(){
    return (
      <Overlay router={this.props.router} isDrawer="1" className="toast">
        <div className="content">
          {this.props.children}
        </div>
      </Overlay>
    )
  }
} );
