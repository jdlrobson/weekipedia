import './mediawiki-ui-icon.css'
import React, { Component } from 'react'

class Icon extends Component {
  render(){

    return (
      <a className={'mw-ui-icon mw-ui-icon-element mw-ui-icon-' + this.props.glyph}
        onClick={this.props.onClick} href={this.props.href}>{this.props.label}</a>
    )
  }
}

export default Icon
