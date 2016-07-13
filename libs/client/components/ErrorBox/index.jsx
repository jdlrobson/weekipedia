import './styles.css'
import React, { Component } from 'react'

const ErrorBox = (props) => {
  return <div className="errorbox">{props.msg}</div>
}

export default ErrorBox
