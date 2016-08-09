import React from 'react'

import './styles.less'

const ErrorBox = (props) => {
  return <div className="errorbox">{props.msg}</div>
}

export default ErrorBox
