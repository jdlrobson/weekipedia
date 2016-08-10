import React from 'react'

import SectionContent from './../../components/SectionContent'
import IntermediateState from './../../components/IntermediateState';
import Section from './../../components/Section'
import LastModifiedBar from './../../components/LastModifiedBar'
import Button from './../../components/Button'
import ErrorBox from './../../components/ErrorBox'
import LanguageIcon from './../../components/LanguageIcon'

import Article from './../../containers/Article'
import Content from './../../containers/Content'
import ReadMore from './../../containers/ReadMore'

import './styles.less'
import './tablet.less'
import './icons.less'

const OFFLINE_ERROR_MESSAGE = 'You need an internet connection to view this page';

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

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
      user: {},
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
      self.props.hijackLinks();
    } ).catch( function ( error ) {
      var msg = error.message.indexOf( 'Failed to fetch' ) > -1 ? OFFLINE_ERROR_MESSAGE : error.toString();
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
    var leadHtml, related, registered,
      contentBody,
      sections = [],
      btns = [],
      actions = [],
      lang = this.props.lang,
      title = this.props.title,
      lead = this.state.lead,
      tagline = lead.description,
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

      actions.push(<LanguageIcon
        showNotification={this.props.showNotification}
        disabled={this.state.lead.languagecount === 0} />);

      if ( namespace === 0 ) {
        btns.push(<Button key="article-talk" href={'/' + lang + '/wiki/Talk:' + title }
          label="Talk"></Button>);
      } else if ( namespace === 2 ) {
        if ( this.state.user.registration ) {
          registered = new Date( this.state.user.registration );
          tagline = 'Member since ' + MONTHS[ registered.getMonth() ] + ', ' + registered.getFullYear();
        }
      }

      if ( this.state.related ) {
        related = <ReadMore cards={this.state.related} />;
      }

      return (
        <Article {...this.props} actions={actions} title={this.state.lead.displaytitle} tagline={tagline}>
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
