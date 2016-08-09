import React from 'react'

import './mediawiki-ui-button.css'

const Button = (props) => {
  var modifiers = props.isPrimary ? 'mw-ui-primary' : '';
  modifiers += props.isQuiet ? 'mw-ui-quiet' : '';
  modifiers += props.className ? ' ' + props.className : '';

  return <a className={'mw-ui-button ' + modifiers}
    onClick={props.onClick} href={props.href}>{props.label}</a>
}

export default Button
