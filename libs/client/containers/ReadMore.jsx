import React from 'react'

import Content from './Content'
import CardList from './CardList'

const ReadMore = (props) => (
  <Content key="page-row-related" className="post-content">
    <h2>Read more</h2>
    <CardList unordered="1" cards={props.cards} />
  </Content>
)

export default ReadMore