import React from 'react'

import Icon from './../Icon'

import CtaDrawer from './../../overlays/CtaDrawer'

import './icons.less'

export default React.createClass({
  launchEditor() {
    var endpoint = this.props.section ? '#/edit/' + this.props.section : '#/edit/';
    this.props.navigateTo( null, endpoint );
  },
  dispatch( ev ) {
    ev.stopPropagation();
    if ( this.props.session ) {
      this.launchEditor();
    } else {
      this.props.showOverlay( <CtaDrawer {...this.props} message='You will need to sign in to edit' /> );
    }
  },
  render(){
    var iconProps = {
      key: 'edit',
      glyph: 'edit',
      label: 'Edit',
      className: 'component-edit-icon',
      onClick: this.dispatch
    };

    return (
      <Icon {...iconProps} />
    )
  }
});
