import React from 'react'

import Content from './../../containers/Content'

import './styles.less'

export default (props) => {
  return <div className="panel"><Content>{props.children}</Content></div>
}

