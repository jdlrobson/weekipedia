import React from 'react'

import DiffCard from './../components/CardDiff'

import CardListPage from './CardListPage'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      api: null
    };
  },
  getInitialState() {
    return {
      error: false
    };
  },
  render(){
    var lang = this.props.lang;
    var endpoint = '/api/pagehistory/' + lang + '/' + this.props.params;
    var title = decodeURIComponent( this.props.params ).replace( /_/gi, ' ' );
    var tagline = (<h2><a href={"/" + lang + "/wiki/" + title}>{title}</a></h2>);
    return (
      <CardListPage {...this.props} apiEndpoint={endpoint} isDiffCardList={true}
        title='Page History' tagline={tagline} CardClass={DiffCard} />
    )
  }
})

