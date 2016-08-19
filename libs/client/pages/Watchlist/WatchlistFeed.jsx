import React from 'react'

import DiffCard from './../../components/CardDiff'

import CardListPage from './../CardListPage'

// Pages
export default React.createClass({
  render() {
    var ns, match;
    var endpoint = '/api/private/watchlist-feed/' + this.props.lang + '/';

    if ( window.location.search.indexOf( 'filter=' ) ) {
      match = window.location.search.match( /filter\=([0-9])/ );
      if ( match ) {
        ns = match[1];
      }
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

