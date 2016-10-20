import React from 'react'

import WikiPage from './../containers/WikiPage'

import IntermediateState from './../components/IntermediateState'

export default React.createClass({
  render(){
    return (
      <WikiPage body={<IntermediateState />} />
    )
  }
})

