import './mediawiki-ui-icon.css'
import React, { Component } from 'react'

const Icon = (props) => (
    <a className={(props.className || '') + ' mw-ui-icon mw-ui-icon-' + props.glyph + ' mw-ui-icon-' + ( props.type || 'element' )}
      onClick={props.onClick} href={props.href}>{props.label}</a>
  )

export default Icon
