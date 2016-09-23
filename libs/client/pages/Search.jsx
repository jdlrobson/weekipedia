import React from 'react'

import CardListPage from './CardListPage'

// Pages
export default React.createClass({
  navigateTo( ev ) {
    var link = ev.currentTarget;
    var href = link.getAttribute( 'href' );
    var title = link.getAttribute( 'title' );
    if ( href ) {
      ev.preventDefault();
      this.props.router.navigateTo( { pathname: href }, title );
    }
  },
  getTabs() {
    var term = this.props.params;
    var self = this;
    var prefix = '/' + this.props.lang + '.';
    return this.props.supportedProjects.map( function ( project, i ) {
      return <a key={'search-tab' + i}
        onClick={self.navigateTo}
        title={'Search ' + project + ' for ' + term}
        href={prefix + project + '/Special:Search/' + term}>{project}</a>
    } );
  },
  render(){
    var props = this.props;
    var endpoint = '/api/search-full/' + props.language_project + '/' + encodeURIComponent( props.params );
    var tagline = <p>Showing you all search results for <strong>{decodeURIComponent(props.params)}</strong> on <strong>{props.project}</strong></p>
    return (
      <CardListPage {...this.props} apiEndpoint={endpoint}
        tabs={this.getTabs()}
        tagline={tagline}
        title='Search' />
    )
  }
})

