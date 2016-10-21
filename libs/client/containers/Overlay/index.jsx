import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

import { Icon } from 'wikipedia-react-components'
import Header from './../../components/Header'
import ChromeHeader from './../../components/ChromeHeader'

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
    var header, icon;
    var headerProps = {};
    var props = this.props;
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
      icon = (<Icon glyph='close' onClick={this.onClose.bind(this)} className="cancel" />);
      headerProps = {
        fixed: true,
        primaryIcon: this.props.primaryIcon || icon,
        router: props.router,
        siteoptions: props.siteoptions,
        siteinfo: props.siteinfo,
        search: props.search,
        secondaryIcon: props.secondaryIcon,
        main: props.header
      };
      if ( props.chromeHeader ) {
        header = <ChromeHeader {...headerProps} />
        if ( props.siteoptions.includeSiteBranding ) {
          overlayClass += ' overlay-with-search';
        }
      } else {
        header = <Header {...headerProps} />
      }
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
