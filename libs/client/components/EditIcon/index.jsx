import React from 'react'

import { Icon } from 'wikipedia-react-components'

import CtaDrawer from './../../overlays/CtaDrawer'

import './icons.less'

export default React.createClass({
  launchEditor() {
    var section = this.props.section;
    var endpoint = section !== undefined ? '#/editor/' + section : '#/editor/';
    this.props.router.navigateTo( null, endpoint );
  },
  dispatch( ev ) {
    ev.stopPropagation();
    ev.preventDefault();
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
      href: '#',
      className: 'component-edit-icon',
      onClick: this.dispatch
    };

    return (
      <Icon {...iconProps} />
    )
  }
});
