import React from 'react'

import { Button, ErrorBox, IntermediateState } from 'wikipedia-react-components';
import LastModifiedBar from './LastModifiedBar'
import ReadMore from './ReadMore'
import TableOfContents from './TableOfContents'

import Content from './../../components/Content'

import WikiPage from './../WikiPage'
import UserPage from './../UserPage'

import { getSections } from './../../react-helpers'

import './styles.less'
import './tablet.less'

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
      jsEnabled: false,
      fragment: null,
      isExpanded: false,
      lead: null,
      user: {},
      errorMsg: NOT_FOUND_MESSAGE,
      error: false,
      remaining: null
    };
  },
  // You want to load subscriptions not only when the component update but also when it gets mounted.
  componentDidMount(){
    var fragment = window.location.hash;
    this.load();
    if ( fragment ) {
      this.setState( { fragment: fragment.replace(/ /i, '_' ).substr( 1 ) } );
    }
    this.setState( { jsEnabled: true } );
  },
  componentWillUnmount() {
    this.setState( { lead: null } );
  },
  componentWillMount() {
    this.setState( this.props );
    this.checkExpandedState();
  },
  componentWillReceiveProps(nextProps){
    this.load( nextProps.title, nextProps.lang, nextProps.revision );
  },
  checkExpandedState() {
    var expandQuery = this.props.query && this.props.query.expanded;
    if ( expandQuery || this.props.siteoptions.expandArticlesByDefault ) {
      this.setState( { isExpanded: true } );
    }
  },
  load( title, lang, revision ) {
    var source, project,
      rev = revision || this.props.revision,
      self = this;

    title = title || this.props.title;
    lang = lang || this.props.lang;
    project = this.props.project;
    source = project ? lang + '.' + project : lang;

    this.checkExpandedState();
    this.props.api.getPage( title, source, null, rev ).then( function ( data ) {
      var ns = data.lead.ns;

      // If talk page or user page auto expand
      if ( ns === undefined || ns % 2 === 1 || ns === 2 ) {
        self.setState( { isExpanded: true } );
      }
      self.setState(data);
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
    var qs = window.location.search;
    qs = !qs ? qs + '?expanded=1' : qs + '&expanded=1';
    this.props.router.navigateTo( {
      pathname: window.location.pathname,
      search: qs
    }, '', true );
    this.setState({
      isExpanded: true
    } );
  },
  getLocalUrl( title, params ) {
    var source = this.props.language_project || this.props.lang + '/wiki';
    title = title ? encodeURIComponent( title ).replace( '%3A', ':' ) : '';
    params = params ? '/' + encodeURIComponent( params ) : '';

    return '/' + source + '/' + title + params;
  },
  getFooter( lead ) {
    var footer = [];
    var props = this.props;
    var ns = lead.ns;
    if ( !lead ) {
      return footer;
    } else {
      footer = [
        <LastModifiedBar editor={lead.lastmodifier} lang={props.lang}
          language_project={props.language_project}
          onClickInternalLink={props.onClickInternalLink}
          title={props.title} timestamp={lead.lastmodified} key="page-last-modified" />
      ];
      if ( ns === 0 ) {
        footer.push( (
          <Content key="page-read-more">
            <ReadMore {...props} namespace={ns} key="page-read-more" />
          </Content>
        ) );
      }
      return footer;
    }
  },
  render(){
    var lead = this.state.lead || this.props.lead || {};
    if ( this.state && this.state.error ) {
      return <Content><ErrorBox key="article-error" msg={this.state.errorMsg} /></Content>;
    } else if ( !lead || !lead.sections ) {
      return (
        <Content>
          <IntermediateState key="article-loading" msg="Loading page"/>
        </Content>
      );
    } else {
      return this.renderPage();
    }
  },
  renderPage(){
    var leadHtml, toc,
      wikiPageProps = {},
      props = this.props,
      state = this.state,
      siteOptions = props.siteoptions,
      sections = [],
      secondaryActions = [],
      title = this.props.title,
      lead = this.state.lead || this.props.lead || {},
      ns = lead && lead.ns || 0,
      footer = this.getFooter( lead ),
      remaining = this.state.remaining || this.props.remaining || {},
      allSections = remaining.sections || [],
      remainingSections = getSections( allSections, props, this.state.fragment );

    leadHtml = lead.sections && lead.sections.length ? lead.sections[0].text : undefined;
    lead.text = leadHtml;
    if ( !lead.displaytitle ) {
      lead.displaytitle = decodeURIComponent( title.replace( /_/gi, ' ' ) );
    }

    if ( leadHtml !== undefined ) {
      if ( this.state.isExpanded ) {
        toc = <TableOfContents sections={remainingSections} />;
        if ( remainingSections.length && siteOptions.includeTableOfContents ) {
          sections.push( toc );
        }
        sections = sections.concat( remainingSections );
      } else {
        sections.push(<Button key="article-expand" label="Expand" onClick={this.expand} />);
      }
    } else {
      if ( this.state.error ) {
        sections.push( <ErrorBox msg={this.state.errorMsg} key="article-error" /> );
        sections.push( (
          <p key="404-search">Why not search for <a
            onClick={this.props.onClickInternalLink}
            href={this.getLocalUrl( 'Special:Search', title )}>{title}</a>?</p>
        ) );
      } else {
        sections.push( <IntermediateState key="article-loading" /> );
      }
    }

    if ( ns === 0 && siteOptions.showTalkToAnons ) {
      secondaryActions.push(<Button className="talk"
        key="article-talk" href={ state.jsEnabled ? '#/talk' : this.getLocalUrl( 'Talk:' + title ) }
        label="Talk" />);
    }

    wikiPageProps = Object.assign( {}, this.props, {
      lead: lead,
      toc: toc,
      body: sections,
      secondaryActions: secondaryActions,
      footer: footer
    } );

    if ( ns === 2 ) {
      return <UserPage {...wikiPageProps} />;
    } else {
      return (
        <WikiPage {...wikiPageProps} />
      );
    }
  }
} );
