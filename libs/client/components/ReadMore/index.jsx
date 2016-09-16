import React from 'react'

import CardList from './../CardList'

import './styles.less'

export default React.createClass({
  render(){
    var props = this.props;
    var langProject = props.language_project;
    var lang = props.lang;
    var source = langProject || lang;
    var endpoint = '/api/related/' + source + '/' + props.title;

    return (
      <div className="container-read-more">
        <h2>Read more</h2>
        <CardList unordered="1" apiEndpoint={endpoint} api={this.props.api} lang={lang}
          language_project={langProject}
          infiniteScroll={false}
          router={this.props.router} />
      </div>
    )
  }
} );
