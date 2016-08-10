import React from 'react'

import CardList from './CardList'

const ReadMore = (props) => (
  <div className="container-read-more">
    <h2>Read more</h2>
    <CardList unordered="1" cards={props.cards} />
  </div>
)

export default ReadMore