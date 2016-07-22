import React, { Component } from 'react'
import './styles.css'

import Icon from './../../components/Icon'
import Header from './../../components/Header'

// Main component

class Overlay extends Component {
  onClose(){
    this.props.router.back();
  }
  render(){
    var icon = (<Icon glyph='close' onClick={this.onClose.bind(this)}/>);

    return (
      <div className="overlay">
        <Header fixed="1" primaryIcon={icon} router={this.props.router}
          main={this.props.header}></Header>
        {this.props.children}
      </div>
    )
  }
}
export default Overlay
