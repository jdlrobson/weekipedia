import React from 'react'
import createReactClass from 'create-react-class'

import CardListPage from './CardListPage'

// Pages
export default createReactClass({
  render(){
    return (
      <CardListPage {...this.props} apiEndpoint={'/api/visits/' + this.props.lang}
        title='Most read' tagline="Pages that others are reading" />
    )
  }
})

