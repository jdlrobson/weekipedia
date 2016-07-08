import './mediawiki-ui-icon.css'
import React, { Component } from 'react'

const Icon = (props) => (
    <a className={'mw-ui-icon mw-ui-icon-element mw-ui-icon-' + props.glyph}
      onClick={props.onClick} href={props.href}>{props.label}</a>
  )

export default Icon
