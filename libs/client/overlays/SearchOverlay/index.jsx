import React from 'react'
import { Icon, SearchForm, Panel } from 'wikipedia-react-components'

import CardList from './../../components/CardList'

import Overlay from './../Overlay'

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
    var props = this.props;
    var language_proj = this.props.lang + '.' + project;
    clearTimeout( this._timeout );
    // account for fast key presses before firing off an api request
    this._timeout = setTimeout( function () {
      props.api.fetch( endpoint ).then( function ( data ) {
        self.setState( {
          noResults: data.pages.length === 0,
          list: <CardList {...props} language_project={language_proj}
            apiEndpoint={endpoint} infiniteScroll={false} />
        } );
      } );
    }, 200 );
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
      // causes redraw of overlay breaking it
      //this.props.router.navigateTo( null, '#/search/' + term, true );
    } else {
      this.setState( { cards: [] } );
    }
  },
  render(){
    var heading, panel, msg;
    var results = this.state && this.state.list ? this.state.list : '';
    var props = this.props;
    var search = <SearchForm
      placeholder={props.msg( 'search' )}
      defaultValue={props.defaultValue}
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
        primaryIcon={false}
        siteoptions={props.siteoptions}
          chromeHeader={true}
        className="component-search-overlay search-overlay">
        <div className="overlay-content">
          {panel}
          {results}
        </div>
      </Overlay>
    )
  }
} );
