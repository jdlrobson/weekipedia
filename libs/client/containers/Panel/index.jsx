import React from 'react'

import Content from './../../containers/Content'

import './styles.less'

export default (props) => {
  var className = 'panel';
  if ( props.isHeading ) {
    className += ' panel-heading';
  }
  return <div className={className}><Content>{props.children}</Content></div>
}

