import React, { Component } from 'react'

import './styles.css'

export default (props) => (
  <div className={"card-list" + ( props.unordered ? ' card-list-unordered' : '' ) }>{props.cards}</div>
)
