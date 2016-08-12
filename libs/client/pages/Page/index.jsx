import React from 'react'

import PageFooter from './../../components/PageFooter'
import IntermediateState from './../../components/IntermediateState';
import Section from './../../components/Section'
import Button from './../../components/Button'
import ErrorBox from './../../components/ErrorBox'
import LanguageIcon from './../../components/LanguageIcon'
import WatchIcon from './../../components/WatchIcon'

import Article from './../../containers/Article'
import Content from './../../containers/Content'

import './styles.less'
import './tablet.less'
import './icons.less'

const OFFLINE_ERROR_MESSAGE = 'You need an internet connection to view this page';
const NOT_FOUND_MESSAGE = 'This page does not exist.';

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
      isExpanded: false,
      lead: {
        languagecount: 0
      },
      user: {},
      errorMsg: NOT_FOUND_MESSAGE,
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
      self.props.hijackLinks();
    } ).catch( function ( error ) {
      var msg = error.message.toString();
      if ( msg.indexOf( 'Failed to fetch' ) > -1 ) {
        msg = OFFLINE_ERROR_MESSAGE;
      } else if ( msg.indexOf( 'Not Found' ) > -1 ) {
        msg = NOT_FOUND_MESSAGE;
      }
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
  getTabs(){
    var ns = this.state.lead.ns,
      baseUrl = '/' + this.props.lang + '/wiki/';

    if ( this.props.tabs ) {
      return this.props.tabs;
    } else if ( ns === 2 ) {
      return [
        <a href={baseUrl + 'User talk:' + this.props.titleSansPrefix} key="page-talk-tab">Talk</a>,
        <a href={baseUrl + 'Special:Contributions/' + this.props.titleSansPrefix } key="page-contrib-tab">Contributions</a>,
        <a href={baseUrl + 'Special:Uploads/' + this.props.titleSansPrefix } key="page-upload-tab">Uploads</a>
      ];
    } else {
      return [];
    }
  },
  render(){
    var leadHtml, footer,
      sections = [],
      actions = [],
      title = this.props.title,
      displayTitle = this.state.lead.displaytitle || decodeURIComponent( title.replace( /_/gi, ' ' ) ),
      lead = this.state.lead,
      tagline = lead.description;

    leadHtml = lead.sections && lead.sections.length ? lead.sections[0].text : '';
    if ( leadHtml ) {
      if ( this.state.isExpanded ) {
        sections = this.getSections();
      } else {
        sections.push(<Button key="article-expand" label="Expand" onClick={this.expand}></Button>);
      }
      footer = <PageFooter {...this.props} lastmodified={lead.lastmodified}
        lastmodifier={lead.lastmodifier} namespace={this.state.lead.ns} />;
    } else {
      if ( this.state.error ) {
        sections.push( <ErrorBox msg={this.state.errorMsg} key="article-error" /> );
      } else {
        sections.push( <IntermediateState key="article-loading" /> );
      }
    }

    actions.push(<LanguageIcon key="article-page-action-language"
      showNotification={this.props.showNotification}
      disabled={this.state.lead.languagecount === 0} />);

    if ( this.props.username ) {
      actions.push(<WatchIcon {...this.props}/>);
    }

    return (
      <Article {...this.props} actions={actions} tabs={this.getTabs()} title={displayTitle} tagline={tagline} lead={leadHtml}>
        <Content key="page-row-1" className="content">
          {sections}
        </Content>
        {footer}
      </Article>
    )
  }
} );
