import React, { Component } from 'react'
import './styles.less'

const Content = (props) => (
    <div className={'content-container ' + ( props.className ? props.className : '' ) }>{props.children}</div>
  )

export default Content
