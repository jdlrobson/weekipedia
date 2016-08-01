import React, { Component } from 'react'
import './styles.css'

const Content = (props) => (
    <div className={'content-container ' + ( props.className ? props.className : '' ) }>{props.children}</div>
  )

export default Content
