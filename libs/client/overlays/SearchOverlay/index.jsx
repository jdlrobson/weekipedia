import React from 'react'

import Overlay from './../../containers/Overlay'
import Content from './../../containers/Content'

import CardList from './../../components/CardList'
import SearchForm from './../../components/SearchForm'

import './styles.less'

export default React.createClass({
  getInitialState() {
    return {
      isSearching: false,
      term: '',
      list: null
    }
  },
  getDefaultProps() {
    return {
      emptyMessage: '',
      loadingMessage: 'Searching',
      api: null,
      lang: 'en'
    }
  },
  showResults( endpoint ) {
    this.setState( {
      list: <CardList {...this.props} apiEndpoint={endpoint} infiniteScroll={false} />
    } );
  },
  onSearchSubmit( term ) {
    var endpoint;
    if ( term ) {
      this.setState( { isSearching: true } );
      endpoint = '/api/search-full/' + this.props.lang + '/' + encodeURIComponent( term );
      this.showResults( endpoint );
    } else {
      this.setState( { list: <CardList emptyMessage={this.props.emptyMessage} /> } );
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
      msg={this.props.msg}
      onSearch={this.onSearch} onSearchSubmit={this.onSearchSubmit} focusOnRender="1" />;

    return (
      <Overlay router={this.props.router} header={main} className="component-search-overlay">
        <Content className="overlay-content">
        {this.state.list}
        </Content>
      </Overlay>
    )
  }
} );
