import React from 'react'

import './styles.less'

const ListHeader = (props) => {
  return <h2 className='list-header'>{props.children}</h2>;
}

export default ListHeader
