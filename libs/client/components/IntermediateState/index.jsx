import React from 'react'
import './styles.less'

const IntermediateState = (props) => (
    <div className="pending">{props.msg || 'Loading'}</div>
  )

export default IntermediateState
