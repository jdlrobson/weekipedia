import React from 'react'

import IntermediateState from './IntermediateState'

import CardList from './../containers/CardList'

export default React.createClass({
  getInitialState() {
    return {
      related: null
    };
  },
  componentDidMount(){
    this.loadRelatedArticles( this.props.title, this.props.lang, this.props.namespace );
  },
  componentWillReceiveProps(nextProps){
    this.loadRelatedArticles( nextProps.title, nextProps.lang, nextProps.namespace );
  },
  loadRelatedArticles( title, lang, namespace ) {
    var self = this;
    var endpoint = '/api/related/' + lang + '/' + title;
    this.props.api.fetchCards( endpoint, this.props ).then( function ( cards ) {
      self.setState( {
        related: cards
      } );
    } );
  },
  render(){
    var body;

    if ( this.state.related ) {
      body = <CardList unordered="1" cards={this.state.related} />
    } else {
      body = <IntermediateState />
    }

    return (
      <div className="container-read-more">
        <h2>Read more</h2>
        {body}
      </div>
    )
  }
} );
