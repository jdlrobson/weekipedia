import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Icon, Header, Overlay } from 'wikipedia-react-components'
import BrandingBox from './../../components/BrandingBox'

import './styles.less'

// Main component

class WOverlay extends Component {
  render(){
    var headerProps, secondaryIcons, header;
    var props = this.props;
    var headerChildren = [];
    var onExit = props.onExit || function () {
      this.props.router.back();
    }.bind( this );
    var closeIcon= <Icon glyph='close'
      className="close" onClick={onExit}/>;

    if ( !props.isDrawer && !props.isLightBox ) {
      headerProps = {
        fixed: true,
        secondaryIcons: props.secondaryIcon ? [ props.secondaryIcon ] : [],
        className: props.chromeHeader ? 'chrome-header' : ''
      };
      if ( props.chromeHeader ) {
        headerProps.secondaryIcons = [ closeIcon ]
        headerChildren.push( props.search );
      }
      headerChildren.push( props.header );
      header = (
        <Header {...headerProps}>
          {headerChildren}
        </Header>
      );
    }

    return (
      <Overlay className={props.className} onExit={onExit}>
        {header}
        {this.props.children}
      </Overlay>
    )
  }
}
Overlay.defaultProps = {
  isLightBox: false,
  isDrawer: false
};

export default WOverlay
