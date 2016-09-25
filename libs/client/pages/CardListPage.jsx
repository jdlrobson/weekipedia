import React from 'react'

import CardList from './../components/CardList'
import PreviewCard from './../components/PreviewCard'

import Article from './../containers/Article'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      CardClass: PreviewCard,
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
    var props = this.props;
    var body = [ <CardList key={"card-list-page-card-list-" + props.language_project} {...props} /> ]
      .concat( props.children );

    return (
      <Article {...this.props} isSpecialPage="1" body={body} />
    )
  }
})

