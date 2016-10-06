import React from 'react'

import IntermediateState from './../../components/IntermediateState';
import Button from './../../components/Button'
import ErrorBox from './../../components/ErrorBox'
import LastModifiedBar from './../../components/LastModifiedBar'
import ReadMore from './../../components/ReadMore'
import UserPageCta from './../../components/UserPageCta'
import TableOfContents from './../../components/TableOfContents'

import Article from './../../containers/Article'
import Content from './../../containers/Content'

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
      showTableOfContents: false,
      lang: 'en'
    };
  },
  getInitialState() {
    return {
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
    this.load();
  },
  componentWillMount() {
    this.setState( this.props );
    this.checkExpandedState();
  },
  componentWillReceiveProps(nextProps){
    this.load( nextProps.title, nextProps.lang );
  },
  checkExpandedState() {
    var expandQuery = this.props.query && this.props.query.expanded;
    if ( expandQuery || this.props.siteoptions.expandArticlesByDefault ) {
      this.setState( { isExpanded: true } );
    }
  },
  load( title, lang ) {
    var source, project,
      self = this;

    title = title || this.props.title;
    lang = lang || this.props.lang;
    project = this.props.project;
    source = project ? lang + '.' + project : lang;

    this.checkExpandedState();
    this.props.api.getPage( title, source ).then( function ( data ) {
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
    this.props.router.navigateTo( window.location.pathname + '?expanded=1', '', true );
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
  getTabs( lead ){
    var ns = lead.ns,
      props = this.props,
      baseUrl = this.getLocalUrl();

    if ( this.props.tabs ) {
      return this.props.tabs;
    } else if ( ns === 2 ) {
      return [
        <a href={baseUrl + 'User talk:' + this.props.titleSansPrefix}
          onClick={this.props.onClickInternalLink}
          key="page-talk-tab">Talk</a>,
        <a href={baseUrl + 'Special:Collections/by/' + this.props.titleSansPrefix }
          onClick={this.props.onClickInternalLink}
          key="page-collections-tab">{props.msg( 'menu-collections' )}</a>,
        <a href={baseUrl + 'Special:Contributions/' + this.props.titleSansPrefix }
          onClick={this.props.onClickInternalLink}
          key="page-contrib-tab">Contributions</a>,
        <a href={baseUrl + 'Special:Uploads/' + this.props.titleSansPrefix }
          onClick={this.props.onClickInternalLink}
          key="page-upload-tab">Uploads</a>
      ];
    } else {
      return [];
    }
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
    var leadHtml, toc,
      props = this.props,
      sections = [],
      secondaryActions = [],
      title = this.props.title,
      lead = this.state.lead || this.props.lead || {},
      footer = this.getFooter( lead ),
      remaining = this.state.remaining || this.props.remaining || {},
      allSections = remaining.sections || [],
      remainingSections = getSections( allSections, props );

    leadHtml = lead.sections && lead.sections.length ? lead.sections[0].text : undefined;
    lead.text = leadHtml;
    if ( !lead.displaytitle ) {
      lead.displaytitle = decodeURIComponent( title.replace( /_/gi, ' ' ) );
    }

    if ( leadHtml !== undefined ) {
      if ( lead.ns === 2 && !leadHtml ) {
        sections.push( <UserPageCta user={title} key="page-user-cta"
          isReaderOwner={props.session && props.session.username === props.titleSanPrefix } /> );
      } else if ( this.state.isExpanded ) {
        toc = <TableOfContents sections={remainingSections} />;
        if ( remainingSections.length && props.showTableOfContents ) {
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

    if ( lead.ns === 0 ) {
      secondaryActions.push(<Button
        onClick={this.props.onClickInternalLink}
        key="article-talk" href={ this.getLocalUrl( 'Talk:' + title ) }
        label="Talk" />);
    }

    return (
      <Article {...this.props} isWikiPage={true} tabs={this.getTabs(lead)}
        toc={toc}
        lead={lead}
        body={sections}
        secondaryActions={secondaryActions}
        footer={footer} />
    )
  }
} );
