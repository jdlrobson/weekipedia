import React from 'react'

import { Button, ErrorBox, IntermediateState } from 'wikipedia-react-components';

import LastModifiedBar from './LastModifiedBar'
import TableOfContents from './TableOfContents'

import ImageSlideshow from './../../components/ImageSlideshow'
import ImageBubbles from './../../components/ImageBubbles'
import Climate from './../../components/Climate'
import CardList from './../../components/CardList'
import Infobox from './../../components/Infobox'

import GoNext from './../../components/GoNext'
import Note from './../../components/Note'
import MakeNote from './../../components/MakeNote'

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
      action: 'view',
      isExpanded: false,
      lead: null,
      orientation: [],
      vcards: [],
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
    this.setState( { action: nextProps.query ? nextProps.query.action : 'view' } );
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

    this.setState( { action: this.props.action || 'view' } );
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
  getSections() {
    var props = this.props;
    var remaining = this.state.remaining || this.props.remaining || {};
    var allSections = remaining.sections || [];
    if ( this.isOrientationView() ) {
      allSections = this.state.orientation || [];
    } else if ( this.isLogisticsView() ) {
      allSections = this.state.logistics || [];
    }

    var sections = getSections( allSections, props, this.state.fragment );

    return sections;
  },
  getLocalUrl( title, params ) {
    var source = this.props.language_project || this.props.lang + '/wiki';
    title = title ? encodeURIComponent( title ).replace( '%3A', ':' ) : '';
    params = params ? '/' + encodeURIComponent( params ) : '';

    return '/' + source + '/' + title + params;
  },
  getPageAction() {
    return this.state.action || this.props.action;
  },
  isOrientationView() {
    return this.getPageAction() === 'orientation';
  },
  isLogisticsView() {
    return this.getPageAction() === 'logistics';
  },
  switchView( ev ) {
    var action = ev.currentTarget.getAttribute( 'data-action' );
    this.setState( { action: action } );
    this.props.router.navigateTo( {
      pathname: window.location.pathname,
      search: 'action=' + action
    }, this.props.title + ' (' + action + ')', true );
    ev.preventDefault();
  },
  getTabs( lead ){
    var tabs;
    var props = this.props,
      isOrientationView = this.isOrientationView(),
      isLogisticsView = this.isLogisticsView(),
      isDefaultView = !isOrientationView && !isLogisticsView,
      baseUrl = this.getLocalUrl();

    if ( isDefaultView && ( !lead || !lead.text ) ) {
      return [];
    }

    // Tabs are not shown on content from wikipedia
    if ( lead.project_source ) {
      tabs = [];
    } else {
      tabs = [
        <a href={baseUrl + props.title }
          key="tab-default"
          className={isDefaultView ? 'active' : '' }
          data-action="view"
          onClick={this.switchView}>Dream</a>,
        <a href={baseUrl + props.title + '?action=logistics'}
          key="tab-logistics"
          className={isLogisticsView ? 'active' : '' }
          data-action="logistics"
          onClick={this.switchView}>Arrive</a>,
        <a href={baseUrl + props.title + '?action=orientation'}
          key="tab-orientation"
          className={isOrientationView ? 'active' : '' }
          data-action="orientation"
          onClick={this.switchView}>Explore</a>
      ];
    }

    return tabs;
  },
  getFooter( lead ) {
    var footer = [];
    var props = this.props;
    if ( !lead ) {
      return footer;
    } else {
      if ( lead.project_source ) {
        return null;
      }
      footer = [
        <LastModifiedBar editor={lead.lastmodifier} lang={props.lang}
          language_project={props.language_project}
          onClickInternalLink={props.onClickInternalLink}
          title={props.title} timestamp={lead.lastmodified} key="page-last-modified" />
      ];
      return footer;
    }
  },
  getBlankLeadSection( lead ) {
    return Object.assign( {}, lead, {
      text: '',
      paragraph: ''
    });
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
      endpoint, isRegion,
      props = this.props,
      state = this.state,
      session = props.session,
      siteOptions = props.siteoptions,
      sections = [],
      secondaryActions = [],
      title = this.props.title,
      lead = Object.assign( {}, this.state.lead || this.props.lead || {} ),
      ns = lead && lead.ns || 0,
      sights = lead.sights ? lead.sights : [],
      foreign = lead.project_source,
      footer = this.getFooter( lead ),
      lang = this.props.lang,
      coords = lead ? lead.coordinates : null,
      remainingSections = this.getSections();

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

    var col3 = [ <IntermediateState key="page-loading" /> ];
    if ( lead ) {
      col3 = [];
    }

    if ( lead && lead.images && lead.images.length ) {
      col3.push( <ImageSlideshow images={lead.images} router={this.props.router} key="image-slideshow" /> );
    }

    if ( lead.infobox ) {
      col3.push( <Infobox {...this.props} text={lead.infobox} key="page-infobox" /> );
    }
    if ( lead.climate ) {
      col3.push( <Climate key="page-climate" climate={lead.climate} /> );
    }

    if ( lead.destinations && lead.destinations.length ) {
      lead.destinations.forEach( function ( section ) {
        col3.push( <h2
          dangerouslySetInnerHTML={ {__html: section.line }} key={"section-heading-" + section.id}></h2> );
        col3.push( <CardList key={"page-destinations-" + section.id }
          {...props} pages={section.destinations} /> );
        if ( session ) {
          col3.push( <a key={"editor-link-" + section.id}
            className="editor-link" href={"#/editor/"+ section.id}>Edit original source</a> );
        }
      } );
    } else {
      if ( coords && !lead.isRegion && !lead.isCountry && !lead.isSubPage ) {
        endpoint = '/api/voyager/nearby/' + props.language_project + '/' + coords.lat + ',' + coords.lon + '/exclude/' + title;
        col3.push(
          <h2 key="nearby-widget-heading">Nearby</h2>
        );
        col3.push(
          <GoNext apiEndpoint={endpoint} api={props.api} lang={lang}
            session={session}
            language_project={props.language_project}
            foreign={lead.project_source}
            key="nearby-widget-card-list" section={lead.destinations_id}
            router={props.router} />
        );
      }
    }
    if ( foreign ) {
      sections.push( <div className="editor-link">Content from <a
        href={'/' + props.lang + '/' + foreign + '/Special:History/' + props.title}>Wikipedia</a></div> );
    }

    lead.text = leadHtml;
    isRegion = lead.isRegion;

    if ( this.isOrientationView() ) {
      lead = this.getBlankLeadSection( lead );
      col3 = [];
      if ( lead.maps && lead.maps.length ) {
        col3.push( <h2 key="map-images-section-heading">Maps</h2> );
        col3.push( <ImageBubbles images={lead.maps} router={props.router} key="map-images-bubbles" /> );
      }
    } else if ( this.isLogisticsView() ) {
      lead = this.getBlankLeadSection( lead );
      col3 = [];
    }

    // Show sights on both orientation and plan view
    if ( !this.isLogisticsView() ) {
      if ( sights.length ) {
        col3.push( <h2 key="sights-section-heading">Sights</h2> );
        col3.push( <CardList key={"page-sights"}
          {...props} pages={sights} />
        );
      }
    } else {
      col3.push( <h2 key="sights-section-heading">Notes</h2> );
      if ( session && session.username ) {
        col3.push( <Note key={"page-note"} {...props} /> );
      } else {
        col3.push(
          <div>
            <MakeNote {...props} />
            <p>Write and share notes about <strong>{props.title}</strong>.</p>
          </div>
        );
      }
    }

    if ( sections.length === 0 && !lead.text ) {
      sections = [
        <div>We don't have any information for this place.</div>
      ];
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
      Object.assign( wikiPageProps, {
        tabs: this.getTabs(lead),
        column_three: col3,
        key: 'article-tab-' + this.getPageAction()
      } );
      return (
        <WikiPage {...wikiPageProps}/>
      );
    }
  }
} );
