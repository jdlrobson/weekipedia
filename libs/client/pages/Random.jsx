import React from 'react'

import Content from './../containers/Content'

import CardListPage from './CardListPage'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      api: null,
      lang: 'en'
    };
  },
  getInitialState() {
    return {
      error: false,
      cards: null
    };
  },
  render(){
    return (
      <CardListPage {...this.props} unordered="1" apiEndpoint={'/api/random/' + this.props.lang}
        title='Random' tagline="Random pages from across the wiki">
      <Content className="post-content">
        Nothing of interest? <a href="/wiki/Special:Random">Try again</a>.
      </Content>
    </CardListPage>
    )
  }
})

