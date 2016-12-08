import React from 'react'

import CtaIcon from './../CtaIcon'

import './icons.less'

export default React.createClass({
  render(){
    var props = this.props;
    var section = props.section;
    var iconProps = {
      key: 'edit',
      glyph: 'edit',
      label: 'Edit',
      href: '#',
      session: props.session,
      showOverlay: props.showOverlay,
      className: 'component-edit-icon',
      router: props.router,
      onLoginUrl: section !== undefined ? '#/editor/' + section : '#/editor/',
      ctaMsg: props.msg( 'edit-cta' )
    };

    return (
      <CtaIcon {...iconProps} />
    )
  }
});
