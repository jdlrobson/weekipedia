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
  showResults( endpoint, project ) {
    var language_proj = this.props.lang + '.' + project;
    this.setState( {
      list: <CardList {...this.props} language_project={language_proj} apiEndpoint={endpoint} infiniteScroll={false} />
    } );
  },
  onSearchSubmit( term ) {
    var props = this.props;
    var proj = props.lang + '.' + props.siteinfo.defaultProject;
    props.router.navigateTo( null, '#' );
    props.router.navigateTo( {
      pathname: '/' + proj + '/Special:Search/' + encodeURIComponent( term ),
      search: ''
    }, 'Search' );
  },
  onSearch( term ){
    var endpoint, lowerTerm;
    var lang = this.props.lang;
    var project = this.props.siteinfo.defaultProject;

    if ( term ) {
      this.setState( { isSearching: true } );
      lowerTerm = term.toLowerCase();
      if ( lowerTerm.indexOf( 'define:' ) === 0 ) {
        project = 'wiktionary';
        term = lowerTerm.split( ':' )[1];
      }
      endpoint = '/api/search/' + lang + '.' + project + '/' + encodeURIComponent( term );
      this.showResults( endpoint, project );
      this.props.router.navigateTo( null, '#/search/' + term, true );
    } else {
      this.setState( { cards: [] } );
    }
  },
  render(){
    var heading;
    var props = this.props;
    var search = <SearchForm
      msg={props.msg} defaultValue={props.defaultValue}
      onSearch={this.onSearch} onSearchSubmit={this.onSearchSubmit} focusOnRender="1" />;

    // FIXME: search-overlay class is added only for consistency with MobileFrontend
    return (
      <Overlay router={props.router} header={heading} search={search}
        siteinfo={props.siteinfo}
        siteoptions={props.siteoptions}
          chromeHeader={true}
        className="component-search-overlay search-overlay">
        <Content className="overlay-content">
        {this.state.list}
        </Content>
      </Overlay>
    )
  }
} );
