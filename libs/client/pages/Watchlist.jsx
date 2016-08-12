import React from 'react'

import CardListPage from './CardListPage'

// Pages
export default React.createClass({
  render(){
    return (
      <CardListPage {...this.props} unordered="1" apiEndpoint={'/api/private/watchlist/' + this.props.lang}
        title='Watchlist' tagline="Pages on your watchlist">
      </CardListPage>
    )
  }
})

