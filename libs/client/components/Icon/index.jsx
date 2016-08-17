import React from 'react'

import './mediawiki-ui-icon.css'

const Icon = (props) => {
  var iconProps = {
    className: (props.className || '') + ' mw-ui-icon mw-ui-icon-' + props.glyph + ' mw-ui-icon-' +
      ( props.type || 'element' ),
    href: props.href,
    onClick: props.onClick
  };
  if ( props.small ) {
    iconProps.className += ' mw-ui-icon-small'
  }

  return iconProps.href ? <a {...iconProps}>{props.label}</a> :
    <div {...iconProps}>{props.label}</div>;
}

export default Icon
