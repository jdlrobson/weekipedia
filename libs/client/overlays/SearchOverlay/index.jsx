import React from 'react'

import Overlay from './../../containers/Overlay'
import Content from './../../containers/Content'

import ChromeHeader from './../../components/ChromeHeader'
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
    var siteinfo = this.props.siteinfo;
    var heading = siteinfo.includeSiteBranding ? <ChromeHeader {...this.props} /> : null;
    var search = <SearchForm
      msg={this.props.msg}
      onSearch={this.onSearch} onSearchSubmit={this.onSearchSubmit} focusOnRender="1" />;

    if ( !heading ) {
      heading = search;
      search = null;
    }
    return (
      <Overlay router={this.props.router} header={heading} search={search} className="component-search-overlay">
        <Content className="overlay-content">
        {this.state.list}
        </Content>
      </Overlay>
    )
  }
} );
