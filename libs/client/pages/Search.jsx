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
  getTerm() {
    var props = this.props;
    return props.query.search ? props.query.search : props.params;
  },
  getTabs() {
    var proj = this.props.project;
    var term = this.getTerm();
    var self = this;
    var prefix = '/' + this.props.lang + '.';
    return this.props.supportedProjects.map( function ( project, i ) {
      return <a key={'search-tab' + i}
        onClick={self.navigateTo}
        className={proj === project ? 'active' : ''}
        title={'Search ' + project + ' for ' + term}
        href={prefix + project + '/Special:Search/' + term}>{project}</a>
    } );
  },
  render(){
    var props = this.props;
    var term = this.getTerm();
    var endpoint = '/api/search-full/' + props.language_project + '/' + encodeURIComponent( term );
    var tagline = <p>Showing you all search results for <strong>{decodeURIComponent(term)}</strong> on <strong>{props.project}</strong></p>
    return (
      <CardListPage {...this.props} apiEndpoint={endpoint}
        tabs={this.getTabs()}
        tagline={tagline}
        title='Search' />
    )
  }
})

