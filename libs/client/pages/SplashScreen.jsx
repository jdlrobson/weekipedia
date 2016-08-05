import React, { Component } from 'react'

import IntermediateState from './../components/IntermediateState';

import Content from './../containers/Content'
import Article from './../containers/Article'

// Pages
export default React.createClass({
  render(){
    return (
      <Article>
      <Content>
        <IntermediateState msg='Launching web app'/>
      </Content>
    </Article>
    )
  }
})

