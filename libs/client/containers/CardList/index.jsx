import React, { Component } from 'react'

import './styles.less'

export default (props) => (
  <div className={"card-list" + ( props.unordered ? ' card-list-unordered' : '' ) }>{props.cards}</div>
)
