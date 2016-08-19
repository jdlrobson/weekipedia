import React from 'react'

import CardListPage from './CardListPage'

// Pages
export default React.createClass({
  render(){
    return (
      <CardListPage {...this.props} apiEndpoint={'/api/visits/' + this.props.lang}
        title='Most read' tagline="Pages that others are reading" />
    )
  }
})

