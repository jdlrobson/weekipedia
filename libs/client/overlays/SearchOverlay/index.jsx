import React from 'react'

import Overlay from './../../containers/Overlay'
import Content from './../../containers/Content'
import Panel from './../../containers/Panel'

import CardList from './../../components/CardList'
import SearchForm from './../../components/SearchForm'
import Icon from './../../components/Icon'

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
    var self = this;
    var language_proj = this.props.lang + '.' + project;
    this.props.api.fetch( endpoint ).then( function ( data ) {
      self.setState( { noResults: data.pages.length === 0 } );
    } );
    this.setState( {
      list: <CardList {...this.props} language_project={language_proj} apiEndpoint={endpoint} infiniteScroll={false} />
    } );
  },
  onSearchWithinPages() {
    this.onSearchSubmit( this.state.term );
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
    this.setState( { term: term });

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
    var heading, panel, msg;
    var props = this.props;
    var search = <SearchForm
      msg={props.msg} defaultValue={props.defaultValue}
      onSearch={this.onSearch} onSearchSubmit={this.onSearchSubmit} focusOnRender="1" />;

    if ( this.state.term ) {
      msg = this.state.noResults ?
        <span>No page with this title. <strong>Search within pages</strong> to see if this phrase appears anywhere.</span>
        : 'Search within pages';
      panel = (
        <Panel>
          <Icon glyph="search-content"
            onClick={this.onSearchWithinPages}
            type="before" label={msg} className="without-results" />
        </Panel>
      );
    }

    // FIXME: search-overlay class is added only for consistency with MobileFrontend
    return (
      <Overlay router={props.router} header={heading} search={search}
        siteinfo={props.siteinfo}
        siteoptions={props.siteoptions}
          chromeHeader={true}
        className="component-search-overlay search-overlay">
        <Content className="overlay-content">
        {panel}
        {this.state.list}
        </Content>
      </Overlay>
    )
  }
} );
