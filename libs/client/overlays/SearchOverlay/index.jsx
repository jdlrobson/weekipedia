import React from 'react'

import Overlay from './../../containers/Overlay'
import Content from './../../containers/Content'
import CardList from './../../containers/CardList'

import IntermediateState from './../../components/IntermediateState';
import SearchForm from './../../components/SearchForm'

export default React.createClass({
  getInitialState() {
    return {
      isSearching: false,
      term: '',
      cards: []
    }
  },
  getDefaultProps() {
    return {
      api: null,
      lang: 'en'
    }
  },
  showResults( endpoint ) {
    var self = this;
    this.props.api.fetchCards( endpoint, this.props ).then( function ( cards ) {
      self.setState({
        cards: cards,
        isSearching: false
      } );
    } );
  },
  onSearchSubmit( term ) {
    var endpoint;
    if ( term ) {
      this.setState( { isSearching: true } );
      endpoint = '/api/search-full/' + this.props.lang + '/' + encodeURIComponent( term );
      this.showResults( endpoint );
    } else {
      this.setState( { cards: [] } );
    }
  },
  onSearch( term ){
    var endpoint;
    if ( term ) {
      this.setState( { isSearching: true } );
      endpoint = '/api/search/' + this.props.lang + '/' + encodeURIComponent( term );
      this.showResults( endpoint );
    } else {
      this.setState( { cards: [] } );
    }
  },
  render(){
    var main = <SearchForm
      onSearch={this.onSearch} onSearchSubmit={this.onSearchSubmit} focusOnRender="1"></SearchForm>;

    var state = this.state;
    var content = state.isSearching ? <IntermediateState msg="Searching" />
      : <CardList cards={state.cards} />;
    return (
      <Overlay router={this.props.router} header={main}>
        <Content className="overlay-content">{content}</Content>
      </Overlay>
    )
  }
} );
