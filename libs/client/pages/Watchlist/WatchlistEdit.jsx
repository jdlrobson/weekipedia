import React from 'react'
import createReactClass from 'create-react-class'

import CardListPage from './../CardListPage'

// Pages
export default createReactClass({
  render(){
    var emptyProps = {
      ctaMessage: 'Back home',
      ctaLink: '/',
      msg: 'You are not currently watching any pages. Your watchlist helps you keep track of the pages that you are interested in. Watch pages by tapping the star icon.',
      image: '/images/emptywatchlist-page-actions-ltr.png'
    };

    return (
      <CardListPage {...this.props}
        emptyProps={emptyProps}
        unordered="1" apiEndpoint={'/api/private/watchlist/' + this.props.lang} />
    )
  }
})

