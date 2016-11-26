import React from 'react'

import { Icon } from 'wikipedia-react-components'

import CtaDrawer from './../../overlays/CtaDrawer'

export default React.createClass({
  dispatch( ev ) {
    var props = this.props;
    ev.stopPropagation();
    ev.preventDefault();
    if ( props.session ) {
      if ( props.onLoginUrl ) {
        props.router.navigateTo( null, props.onLoginUrl );
      } else if ( props.onLoginClick ) {
        props.onLoginClick();
      }
    } else {
      props.showOverlay( <CtaDrawer {...this.props} message={props.ctaMsg} /> );
    }
  },
  render(){
    return (
      <Icon {...this.props} onClick={this.dispatch} />
    )
  }
});
