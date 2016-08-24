import React from 'react'

import CtaIcon from './../CtaIcon'

export default React.createClass({
  render(){
    var props = this.props;
    var username = props.session ? props.session.username : null;
    return (
      <CtaIcon {...props} key="page-action-note" glyph="note" className="make-note-component"
        ctaMsg="Write down some public notes about this place to help you and others plan your trip."
        onLoginUrl={"#/note-editor/" + username }/>
    )
  }
});

