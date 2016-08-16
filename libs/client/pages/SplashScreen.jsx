import React from 'react'

import IntermediateState from './../components/IntermediateState';

import Content from './../containers/Content'
import Article from './../containers/Article'

// Pages
export default React.createClass({
  render(){
    var body = (
      <Content>
        <IntermediateState msg='Launching web app'/>
      </Content>
    );
    return (
      <Article body={body} />
    )
  }
})

