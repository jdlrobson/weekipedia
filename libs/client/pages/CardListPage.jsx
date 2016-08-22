import React from 'react'

import CardList from './../components/CardList'

import Article from './../containers/Article'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      CardClass: null,
      api: null,
      apiEndpoint: null,
      title: null,
      tagline: null,
      lang: 'en'
    };
  },
  getInitialState() {
    return {
      errorMsg: 'Something went wrong when trying to render the list. Please refresh and try again.',
      error: false,
      list: null
    };
  },
  render(){
    var body = [ <CardList key="card-list-page-card-list" {...this.props} /> ]
      .concat( this.props.children );

    return (
      <Article {...this.props} isSpecialPage="1" body={body} />
    )
  }
})

