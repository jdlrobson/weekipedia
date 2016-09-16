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
    var langProject = this.props.language_project;
    var lang = this.props.lang;
    var source = langProject || lang;

    var endpoint = '/api/pagehistory/' + source + '/' + this.props.params;
    var title = decodeURIComponent( this.props.params ).replace( /_/gi, ' ' );
    var tagline = (<h2><a href={"/" + lang + "/wiki/" + title}
      onClick={this.props.onClickInternalLink}>{title}</a></h2>);

    var props = Object.assign( {}, this.props, {
      isDiffCardList: true,
      apiEndpoint: endpoint,
      title: 'Page History',
      tagline: tagline,
      CardClass: DiffCard
    } );

    return (
      <CardListPage {...props} />
    )
  }
})

