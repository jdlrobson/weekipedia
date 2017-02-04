import React from 'react'
import { Icon } from 'wikipedia-react-components'

import CtaIcon from './../CtaIcon'

export default React.createClass({
  render(){
    var props = this.props;
    var username = props.session ? props.session.username : null;
    var isOnline = typeof( navigator ) !== 'undefined' && navigator && navigator.onLine !== undefined && navigator.onLine;
    var iconProps = Object.assign({}, props, {
      key: 'page-action-note',
      glyph: 'note',
      className: 'make-note-component'
    });

    var icon = (
      <CtaIcon {...iconProps}
        ctaMsg="Write down some public notes about this place to help you and others plan your trip."
        onLoginUrl={"#/note-editor/" + username }/>
    );
    if ( !isOnline && !username ) {
      icon = <Icon {...iconProps}
        href={"#/note-editor/~"}/>
    }
    return icon;
  }
});

