import React, { Component } from 'react'
import './styles.css'

const IntermediateState = (props) => (
    <div className="pending">{props.msg || 'Loading'}</div>
  )

export default IntermediateState
