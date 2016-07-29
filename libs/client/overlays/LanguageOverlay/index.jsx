import React, { Component } from 'react'

import Overlay from './../../containers/Overlay'
import Content from './../../containers/Content'
import CardList from './../../containers/CardList'
import LinkList from './../../containers/LinkList'

import Card from './../../components/Card'
import Panel from './../../components/Panel'
import IntermediateState from './../../components/IntermediateState';
import SearchInput from './../../components/SearchInput'

import './styles.css'

export default React.createClass({
  getInitialState() {
    return {
      term: null,
      isLoading: true,
      languages: []
    }
  },
  getDefaultProps() {
    return {
      api: null,
      lang: 'en'
    }
  },
  componentDidMount(){
    var self = this;
    this.props.api.fetch( '/api/page-languages/' + this.props.lang + '/' + this.props.title ).then( function ( languages ) {
      self.setState( { isLoading: false, languages: languages } )
    } );
  },
  navigateTo( ev ) {
    var link = ev.currentTarget;
    var href = link.getAttribute( 'href' ) || '';

    this.props.router.navigateTo( href, '' );
    ev.preventDefault();
  },
  filterLanguages( value ) {
    this.setState( { term: value } );
  },
  getLanguagesForDisplay() {
    var langs = [];
    var term = this.state.term;
    // filter
    if ( term ) {
      this.state.languages.forEach( function ( lang ) {
        if (
          ( lang.langname && lang.langname.indexOf( term ) > -1 ) ||
          ( lang.autonym && lang.autonym.indexOf( term ) > -1 )
        ) {
          langs.push( lang );
        }
      } );
    } else {
      langs = this.state.languages;
    }

    // search
    return langs.sort( function ( a, b ) {
      return a.autonym < b.autonym ? -1 : 1;
    } );
  },
  render(){
    var self = this;
    var state = this.state;
    var content;
    if ( state.isLoading ) {
      content = <IntermediateState msg="Loading languages" />;
    } else {
      content = <LinkList>
        {
          this.getLanguagesForDisplay().map( function( language, i ){
            var code = language.lang;
            return (
              <a href={'/' + code + '/wiki/' + language.title}
                key={"lang-item-" + code}
                onClick={self.navigateTo}
                hrefLang={language.lang} lang={language.lang}>
                <strong className="autonym">{language.autonym}</strong>
                <span className="title">{language.title}</span>
              </a>
            )
          } )
        }
      </LinkList>;
    }

    var count = this.state.isLoading ? null : this.state.languages.length;
    var listHeader = this.state.term ? null : <h3 className="list-header">All languages <span>{count}</span></h3>;

    return (
      <Overlay router={this.props.router} className="language-overlay"
        header={<h2><strong>Languages</strong></h2>}>
        <Panel>
          <SearchInput onSearch={this.filterLanguages} placeholder="Search for a language" />
        </Panel>
        <div className="overlay-content">
          <Content>
            {listHeader}
            {content}
          </Content>
        </div>
      </Overlay>
    )
  }
} );
