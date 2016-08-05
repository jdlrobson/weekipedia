import React, { Component } from 'react'

import SectionContent from './../../components/SectionContent'
import IntermediateState from './../../components/IntermediateState';
import Section from './../../components/Section'
import LastModifiedBar from './../../components/LastModifiedBar'
import Button from './../../components/Button'
import Icon from './../../components/Icon'
import ErrorBox from './../../components/ErrorBox'

import Article from './../../containers/Article'
import CardList from './../../containers/CardList'
import Content from './../../containers/Content'

import './styles.less'
import './tablet.less'
import './icons.less'

const OFFLINE_ERROR_MESSAGE = 'You need an internet connection to view this page';

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      api: null,
      lang: 'en'
    };
  },
  getInitialState() {
    return {
      related: null,
      isExpanded: false,
      lead: {},
      errorMsg: 'This page does not exist.',
      error: false,
      remaining: {}
    };
  },
  // You want to load subscriptions not only when the component update but also when it gets mounted.
  componentWillMount(){
    this.load();
  },
  componentWillReceiveProps(nextProps){
    this.load( nextProps.title, nextProps.lang );
  },
  loadRelatedArticles() {
    var self = this;
    var endpoint = '/api/related/' + this.props.lang + '/' + this.props.title;
    this.props.api.fetchCards( endpoint, this.props ).then( function ( cards ) {
      self.setState( {
        related: cards
      } );
    } );
  },
  load( title, lang ) {
    var self = this;
    title = title || this.props.title;
    lang = lang || this.props.lang;

    if ( window.location.search.indexOf( 'expanded=1' ) > -1 ) {
      this.setState( { isExpanded: true } );
    }
    this.setState( { lead: {} } );
    this.props.api.getPage( title, lang ).then( function ( data ) {
      var ns = data.lead.ns;

      // If talk page or user page auto expand
      if ( ns % 2 === 1 || ns === 2 ) {
        self.setState( { isExpanded: true } );
      }
      self.setState(data);
      self.loadRelatedArticles();
    } ).catch( function ( e ) {
      var msg = error.message.indexOf( 'Failed to fetch' ) > -1 ? OFFLINE_ERROR_MESSAGE : e.toString();
      self.setState({ error: true, errorMsg: msg });
    } );
  },
  expand() {
    this.props.router.navigateTo( window.location.pathname + '?expanded=1', '', true );
    this.setState({
      isExpanded: true
    } );
  },
  getSections() {
    var sections = [];
    var allSections = this.state.remaining.sections;
    var topLevelSection = allSections[0].toclevel;
    var curSection;
    var self = this;

    allSections.forEach( function ( sectionProps ) {
      var id = sectionProps.id;
      if ( sectionProps.toclevel === topLevelSection ) {
        if ( curSection ) {
          sections.push( <Section {...curSection } /> );
        }
        curSection = Object.assign( {}, self.props, sectionProps, {
          key: id,
          subsections: []
        } );
      } else {
        curSection.subsections.push( <Section {...self.props} {...sectionProps} key={id} isCollapsible={false} /> );
      }
    } );
    // push the last one
    sections.push( <Section {...curSection } /> );
    return sections;
  },
  render(){
    var url, leadHtml, related, talkUrl,
      contentBody, iconProps = {},
      sections = [],
      btns = [],
      actions = [],
      self = this,
      lang = this.props.lang,
      title = this.props.title,
      lead = this.state.lead,
      namespace = this.state.lead.ns;

    if ( !lead.displaytitle ) {
      contentBody = this.state.error ? <ErrorBox msg={this.state.errorMsg}></ErrorBox>
      : <IntermediateState></IntermediateState>;

      return (
        <Article>
          <Content>{contentBody}</Content>
        </Article>
      )
    } else {
      leadHtml = lead.sections.length ? lead.sections[0].text : '';
      if ( this.state.error ) {
        sections = [<ErrorBox msg="This page does not exist."></ErrorBox>];
      } else if ( this.state.isExpanded ) {
        sections = this.getSections();
      } else {
        sections.push(<Button key="article-expand" label="Expand" onClick={this.expand}></Button>);
      }

      iconProps = {
        key: 'lang-view',
        glyph: 'language-switcher',
        label: 'Read in another language'
      };
      if ( this.state.lead.languagecount === 0 ) {
        iconProps.className = 'disabled';
        iconProps.onClick = function ( ev ) {
          ev.stopPropagation();
          self.props.showNotification( 'This page is not available in other languages.' );
        };
      } else {
        iconProps.href = '#/languages';
      }
      actions.push(<Icon {...iconProps} />);

      if ( namespace === 0 ) {
        btns.push(<Button key="article-talk" href={'/' + lang + '/wiki/Talk:' + title }
          label="Talk"></Button>);
      }

      if ( this.state.related ) {
        related = <Content key="page-row-related" className="post-content">
          <h2>Read more</h2>
          <CardList unordered="1" cards={this.state.related} />
        </Content>;
      }
      return (
        <Article {...this.props} actions={actions} title={this.state.lead.displaytitle} tagline={this.state.lead.description}>
          <Content key="page-row-1" className="content">
            <SectionContent {...this.props} text={leadHtml}></SectionContent>
            {sections}
          </Content>
          <Content key="page-row-2" className="post-content">{btns}</Content>
          <LastModifiedBar editor={lead.lastmodifier} lang={this.props.lang}
            title={this.props.title} timestamp={lead.lastmodified} />
          {related}
        </Article>
      )
    }
  }
} );
