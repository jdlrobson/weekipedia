import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

import Icon from './../../components/Icon'
import Header from './../../components/Header'

// Main component

class Overlay extends Component {
  onClose(){
    if ( this.props.onExit ) {
      this.props.onExit();
    } else {
      this.props.router.back();
    }
  }
  componentDidMount() {
    var node = ReactDOM.findDOMNode( this );
    setTimeout( function () {
      node.className += ' visible';
    }, 0 );
  }
  render(){
    var header;
    var baseClass = this.props.isDrawer ? 'drawer' : 'overlay visible'
    var overlayClass = baseClass +
      ( this.props.className ? ' ' + this.props.className : '' );
    var closeIconGray = <Icon glyph='close-gray'
      className="close" onClick={this.onClose.bind(this)}/>;

    if ( this.props.isDrawer ) {
      header = null;
    } else if ( this.props.isLightBox ) {
      header = (
        <div className="lightbox-header">
         {closeIconGray}
        </div>);
      overlayClass += ' lightbox';
    } else {
      var icon = (<Icon glyph='close' onClick={this.onClose.bind(this)}/>);

      header = <Header fixed="1" primaryIcon={this.props.primaryIcon || icon} router={this.props.router}
        search={this.props.search}
        secondaryIcon={this.props.secondaryIcon}
        main={this.props.header}></Header>;
    }
    if ( this.props.search ) {
      overlayClass += ' overlay-with-search';
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
  isLightBox: false,
  isDrawer: false
};

export default Overlay
