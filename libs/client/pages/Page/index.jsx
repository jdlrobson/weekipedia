import React from 'react'

import IntermediateState from './../../components/IntermediateState';
import Section from './../../components/Section'
import Button from './../../components/Button'
import ErrorBox from './../../components/ErrorBox'
import LanguageIcon from './../../components/LanguageIcon'
import EditIcon from './../../components/EditIcon'
import WatchIcon from './../../components/WatchIcon'
import LastModifiedBar from './../../components/LastModifiedBar'
import ReadMore from './../../components/ReadMore'
import UserPageCta from './../../components/UserPageCta'
import TableOfContents from './../../components/TableOfContents'

import Article from './../../containers/Article'
import Content from './../../containers/Content'

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
    if ( expandQuery || this.props.siteinfo.expandArticlesByDefault ) {
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
  getSections() {
    var sections = [];
    var remaining = this.state.remaining || this.props.remaining || {};
    var allSections = remaining.sections || [];
    var topLevelSection = allSections.length ? allSections[0].toclevel : 2;
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
        curSection.subsections.push( <Section {...self.props}
          {...sectionProps} key={id} isCollapsible={false} /> );
      }
    } );
    if ( allSections.length ) {
      // push the last one
      sections.push( <Section {...curSection } /> );
    }
    return sections;
  },
  getLocalUrl( title ) {
    var source = this.props.language_project || this.props.lang + '/wiki';
    title = title || '';

    return '/' + source + '/' + title;
  },
  getTabs( lead ){
    var ns = lead.ns,
      baseUrl = this.getLocalUrl();

    if ( this.props.tabs ) {
      return this.props.tabs;
    } else if ( ns === 2 ) {
      return [
        <a href={baseUrl + 'User talk:' + this.props.titleSansPrefix}
          onClick={this.props.onClickInternalLink}
          key="page-talk-tab">Talk</a>,
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
    var leadHtml,
      props = this.props,
      sections = [],
      actions = [],
      secondaryActions = [],
      title = this.props.title,
      lang = this.props.lang,
      lead = this.state.lead || this.props.lead || {},
      footer = this.getFooter( lead ),
      remainingSections = this.getSections();

    leadHtml = lead.sections && lead.sections.length ? lead.sections[0].text : undefined;
    lead.text = leadHtml;
    if ( !lead.displaytitle ) {
      lead.displaytitle = decodeURIComponent( title.replace( /_/gi, ' ' ) );
    }

    if ( leadHtml !== undefined ) {
      if ( lead.ns === 2 && !leadHtml ) {
        sections.push( <UserPageCta user={title}
          isReaderOwner={props.session && props.session.username === props.titleSanPrefix } /> );
      } else if ( this.state.isExpanded ) {
        if ( remainingSections.length && props.showTableOfContents ) {
          sections.push( <TableOfContents sections={remainingSections} /> );
        }
        sections = sections.concat( remainingSections );
      } else {
        sections.push(<Button key="article-expand" label="Expand" onClick={this.expand} />);
      }
    } else {
      if ( this.state.error ) {
        sections.push( <ErrorBox msg={this.state.errorMsg} key="article-error" /> );
      } else {
        sections.push( <IntermediateState key="article-loading" /> );
      }
    }

    actions.push(<LanguageIcon key="article-page-action-language"
      showNotification={this.props.showNotification}
      disabled={lead.languagecount === 0} />);

    if ( this.props.canAuthenticate ) {
      actions.push(<EditIcon {...this.props} key="page-action-edit"/>);
      actions.push(<WatchIcon {...this.props} key="page-action-watch"/>);
    }

    if ( lead.ns === 0 ) {
      secondaryActions.push(<Button
        onClick={this.props.onClickInternalLink}
        key="article-talk" href={ this.getLocalUrl( 'Talk:' + title ) }
        label="Talk" />);
    }

    return (
      <Article {...this.props} actions={actions} tabs={this.getTabs(lead)}
        lead={lead}
        body={sections}
        secondaryActions={secondaryActions}
        footer={footer} />
    )
  }
} );
