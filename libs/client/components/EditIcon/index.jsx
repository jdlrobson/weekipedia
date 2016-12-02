import React from 'react'

import CtaIcon from './../CtaIcon'

import './icons.less'

export default React.createClass({
  render(){
    var section = this.props.section;
    var iconProps = {
      key: 'edit',
      glyph: 'edit',
      label: 'Edit',
      href: '#',
      session: this.props.session,
      className: 'component-edit-icon',
      onLoginUrl: section !== undefined ? '#/editor/' + section : '#/editor/',
      onLoginClick: this.launchEditor(),
      ctaMsg: this.props.msg( 'edit-cta' )
    };

    return (
      <CtaIcon {...iconProps} />
    )
  }
});
