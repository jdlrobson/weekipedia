import React from 'react'
import createReactClass from 'create-react-class'
import { IntermediateState, LinkList, Panel, SearchInput } from 'wikipedia-react-components'

import Content from './../../components/Content'

import Overlay from './../Overlay'

import './styles.less'

export default createReactClass({
  getInitialState() {
    return {
      term: null,
      isLoading: true,
      preferred: {},
      languages: []
    }
  },
  getDefaultProps() {
    return {
      storage: null,
      api: null,
      lang: 'en'
    }
  },
  componentWillMount(){
    var prefs = this.props.storage.get( 'languages-preferred' );
    if ( prefs ) {
      this.setState( { preferred: JSON.parse( prefs ) } );
    }
  },
  componentDidMount(){
    var self = this;
    var source =  this.props.language_project || this.props.lang;
    this.props.api.fetch( '/api/page-languages/' + source + '/' + this.props.title ).then( function ( languages ) {
      self.setState( { isLoading: false, languages: languages } )
    } );
  },
  navigateTo( ev ) {
    var link = ev.currentTarget;
    var href = link.getAttribute( 'href' ) || '';
    var pref = this.state.preferred;
    var code = link.getAttribute( 'lang' );
    if ( code && pref[code] ) {
      pref[code] += 1;
    } else if ( code ) {
      pref[code] = 1;
    }

    this.props.router.navigateTo( href, '' );
    this.props.storage.set( 'languages-preferred', JSON.stringify( pref ) );
    this.setState( { preferred: pref } );
    ev.preventDefault();
  },
  filterLanguages( value ) {
    this.setState( { term: value } );
  },
  getLanguagesForDisplay( preferredOnly ) {
    var langs = [];
    var term = this.state.term || '';
    var prefs = this.state.preferred;
    // filter
    this.state.languages.forEach( function ( lang ) {
      if (
        Boolean( prefs[lang.lang] ) === Boolean( preferredOnly ) && (
          ( lang.langname && lang.langname.indexOf( term ) > -1 ) ||
          ( lang.autonym && lang.autonym.indexOf( term ) > -1 )
       )
      ) {
        langs.push( lang );
      }
    } );

    var sortFn = function ( a, b ) {
      return a.autonym < b.autonym ? -1 : 1;
    };
    if ( preferredOnly ) {
      sortFn = function ( a, b ) {
        return prefs[a.lang] > prefs[b.lang] ? -1 : 1;
      };
    }
    // search
    return langs.sort( sortFn );
  },
  render(){
    var self = this;
    var state = this.state;
    var props = this.props;
    var content, prefLang, preferredLangs, otherLangs;

    function mapLanguage( language ) {
      var code = language.lang;
      var source =  props.project ? code + '.' + props.project + '/' : code + '/wiki/';

      return (
        <a href={'/' + source + language.title.replace( /\//gi, '%2F' ) }
          key={"lang-item-" + code}
          onClick={self.navigateTo}
          hrefLang={language.lang} lang={language.lang}>
          <strong className="autonym">{language.autonym}</strong>
          <span className="title">{language.title}</span>
        </a>
      )
    }

    if ( state.isLoading ) {
      content = <IntermediateState msg="Loading languages" />;
    } else {
      preferredLangs = this.getLanguagesForDisplay( true );
      otherLangs = this.getLanguagesForDisplay();

      prefLang = preferredLangs.length ? <LinkList>{preferredLangs.map( mapLanguage )}</LinkList> : null;
      content = <LinkList className="all-languages">{otherLangs.map( mapLanguage )}</LinkList>;
    }

    var count = this.state.isLoading ? null : otherLangs.length;
    var prefHeader = preferredLangs && preferredLangs.length ?
      <h3 className="list-header">Preferred languages <span>{preferredLangs ? preferredLangs.length : ''}</span></h3> : null;
    var listHeader = this.state.term ? null : <h3 className="list-header">All languages <span>{count}</span></h3>;

    return (
      <Overlay router={this.props.router} className="language-overlay"
        header={<h2><strong>Languages</strong></h2>}>
        <Panel>
          <Content>
            <SearchInput value={this.state.term}
              onSearch={this.filterLanguages} placeholder="Search for a language" />
          </Content>
        </Panel>
        <div className="overlay-content">
          <Content>
            {prefHeader}
            {prefLang}
            {listHeader}
            {content}
          </Content>
        </div>
      </Overlay>
    )
  }
} );
