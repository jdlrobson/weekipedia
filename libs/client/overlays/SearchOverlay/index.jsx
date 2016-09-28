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
    var props = this.props;
    var proj = props.lang + '.' + props.siteinfo.defaultProject;
    props.router.navigateTo( {
      pathname: '/' + proj + '/Special:Search/' + encodeURIComponent( term ),
      search: ''
    }, 'Search' );
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
    var heading;
    var props = this.props;
    var search = <SearchForm
      msg={props.msg}
      onSearch={this.onSearch} onSearchSubmit={this.onSearchSubmit} focusOnRender="1" />;

    return (
      <Overlay router={props.router} header={heading} search={search}
        siteinfo={props.siteinfo}
        siteoptions={props.siteoptions}
          chromeHeader={true}
        className="component-search-overlay">
        <Content className="overlay-content">
        {this.state.list}
        </Content>
      </Overlay>
    )
  }
} );
