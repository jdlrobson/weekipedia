import React from 'react'

import './styles.less'

const TruncatedText = (props) => {
  return <span className='truncated-text'>{props.children}</span>
}

export default TruncatedText
