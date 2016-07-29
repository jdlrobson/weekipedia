import React from 'react'

import Content from './../../containers/Content'

import './styles.css'

export default (props) => {
  return <div className="panel"><Content>{props.children}</Content></div>
}

