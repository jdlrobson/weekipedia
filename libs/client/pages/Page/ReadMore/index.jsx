import React from 'react'
import createReactClass from 'create-react-class'

import CardList from './../../../components/CardList'

import './styles.less'

export default createReactClass({
  getInitialState() {
    return {};
  },
  onEmpty() {
    this.setState( { isEmpty: true } );
  },
  render(){
    var props = this.props;
    var langProject = props.language_project;
    var lang = props.lang;
    var source = langProject || lang;
    var endpoint = '/api/' + source + '.org/rest_v1/page/related/'
      + encodeURIComponent( props.title.replace( / /g, '_' ) );

    if ( this.state.isEmpty ) {
      return (
        <div className="container-read-more empty"></div>
      );
    } else {
      return (
        <div className="container-read-more">
          <h2>Read more</h2>
          <CardList unordered="1" apiEndpoint={endpoint} api={this.props.api} lang={lang}
          language_project={langProject} onEmpty={this.onEmpty}
            infiniteScroll={false}
            router={this.props.router} />
        </div>
      );
    }
  }
} );
