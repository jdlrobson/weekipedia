import React from 'react'

import DiffCard from './../../components/CardDiff'

import CardListPage from './../CardListPage'

// Pages
export default React.createClass({
  render() {
    var ns;
    var endpoint = '/api/private/watchlist-feed/' + this.props.lang + '/';

    if ( this.props.query && this.props.query.filter ) {
      ns = this.props.query.filter;
    }

    if ( ns ) {
      endpoint += '/' + ns;
    }

    return (
      <CardListPage {...this.props} apiEndpoint={endpoint}
        CardClass={DiffCard} isDiffCardList={true} />
    )
  }
})

