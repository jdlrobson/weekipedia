import React, { Component } from 'react'

import SectionContent from './../../components/SectionContent'
import IntermediateState from './../../components/IntermediateState';
import Section from './../../components/Section'
import LastModifiedBar from './../../components/LastModifiedBar'
import Button from './../../components/Button'
import ErrorBox from './../../components/ErrorBox'

import Article from './../../containers/Article'
import Content from './../../containers/Content'
import utils from './../../utils'

import './styles.css'
import './tablet.css'

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
    this.load();
  },
  load() {
    var self = this;
    if ( window.location.search.indexOf( 'expanded=1' ) > -1 ) {
      this.setState( { isExpanded: true } );
    }
    this.props.api.getPage( this.props.title, this.props.lang ).then( function ( data ) {
      self.setState(data);
    } ).catch( function () {
      self.setState({ error: true, errorMsg: e });
    } );
  },
  expand() {
     this.props.router.navigateTo( window.location.pathname + '?expanded=1', '', true );
     this.setState({
      isExpanded: true
    } );
  },
  render(){
    var url, leadHtml,
      contentBody,
      sections = [],
      btns = [],
      self = this,
      lead = this.state.lead;

    if ( !lead.displaytitle ) {
      contentBody = this.state.error ? <ErrorBox msg={this.state.errorMsg}></ErrorBox>
      : <IntermediateState></IntermediateState>;

      return (
        <Article>
          <Content>{contentBody}</Content>
        </Article>
      )
    } else {
      url = utils.getAbsoluteUrl( this.props.title, this.props.lang );
      leadHtml = lead.sections.length ? lead.sections[0].text : '';
      if ( this.state.error ) {
        sections = [<ErrorBox msg="This page does not exist."></ErrorBox>];
      } else if ( this.state.isExpanded ) {
        sections = this.state.remaining.sections.map( function ( sectionProps ) {
          return <Section {...self.props} {...sectionProps} key={sectionProps.id}></Section>
        } );
      } else {
        sections.push(<Button key="article-expand" label="Expand" onClick={this.expand}></Button>);
      }
      btns.push(<Button key="article-view" href={url} label="View on Wikipedia"></Button>);

      return (
        <Article title={this.state.lead.displaytitle} tagline={this.state.lead.description}>
          <Content key="page-row-1" className="content">
            <SectionContent {...this.props} text={leadHtml}></SectionContent>
            {sections}
          </Content>
          <Content key="page-row-2" className="post-content">{btns}</Content>
          <LastModifiedBar lang={this.props.lang}
            title={this.props.title} timestamp={lead.lastmodified} />
        </Article>
      )
    }
  }
} );
