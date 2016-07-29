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
    var header;
    var overlayClass = 'overlay' + ( this.props.className ? ' ' + this.props.className : '' );

    if ( this.props.isLightBox ) {
      header = (
        <div className="lightbox-header">
          <Icon glyph='close-gray' className="close" onClick={this.onClose.bind(this)}/>
        </div>);
      overlayClass += ' lightbox';
    } else {
      var icon = (<Icon glyph='close' onClick={this.onClose.bind(this)}/>);
      header = <Header fixed="1" primaryIcon={icon} router={this.props.router}
        main={this.props.header}></Header>;
    }

    return (
      <div className={overlayClass}>
        {header}
        {this.props.children}
      </div>
    )
  }
}
Overlay.defaultProps = {
  isLightBox: false
};

export default Overlay
