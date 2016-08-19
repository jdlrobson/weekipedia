import React from 'react'

import CardListPage from './CardListPage'

import DiffCard from './../components/CardDiff'

// Pages
export default React.createClass({
  render(){
    var endpoint = '/api/private/watchlist-feed/' + this.props.lang + '/';

    return (
      <CardListPage {...this.props} apiEndpoint={endpoint} isDiffCardList={true}
        title="Watchlist" CardClass={DiffCard} />
    )
  }
})

