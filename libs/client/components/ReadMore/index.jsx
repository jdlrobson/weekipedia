import React from 'react'

import CardList from './../CardList'

import './styles.less'

export default React.createClass({
  render(){
    var lang = this.props.lang;
    var endpoint = '/api/related/' + lang + '/' + this.props.title;

    return (
      <div className="container-read-more">
        <h2>Read more</h2>
        <CardList unordered="1" apiEndpoint={endpoint} api={this.props.api} lang={lang}
          infiniteScroll={false}
          router={this.props.router} />
      </div>
    )
  }
} );
