import React from 'react'

import Overlay from './../Overlay'

import './styles.less'

export default React.createClass({
  render(){
    return (
      <Overlay router={this.props.router} isDrawer="1" className="mw-notification">
        <div className="content">
          {this.props.children}
        </div>
      </Overlay>
    )
  }
} );
