import React from 'react'

import CardListPage from './CardListPage'

// Pages
export default React.createClass({
  render(){
    var props = this.props;
    var endpoint = '/api/search-full/' + props.language_project + '/' + encodeURIComponent( props.params );
    var tagline = <p>Showing you all search results for <strong>{decodeURIComponent(props.params)}</strong> on <strong>{props.project}</strong></p>
    return (
      <CardListPage {...this.props} apiEndpoint={endpoint}
      tagline={tagline}
        title='Search' />
    )
  }
})

