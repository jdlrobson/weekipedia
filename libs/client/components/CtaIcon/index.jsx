import React from 'react'
import createReactClass from 'create-react-class'

import { Icon } from 'wikipedia-react-components'

import CtaDrawer from './../../overlays/CtaDrawer'

export default createReactClass({
  dispatch( ev ) {
    var props = this.props;
    ev.stopPropagation();
    ev.preventDefault();
    if ( props.session ) {
      if ( props.onLoginUrl ) {
        props.router.navigateTo( null, props.onLoginUrl );
      } else if ( props.onLoginClick ) {
        props.onLoginClick( ev );
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
