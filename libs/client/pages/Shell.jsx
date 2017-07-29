import React from 'react'
import createReactClass from 'create-react-class'

import WikiPage from './WikiPage'

import { IntermediateState } from 'wikipedia-react-components'

export default createReactClass({
  render(){
    return (
      <WikiPage body={<IntermediateState />} />
    )
  }
})

