import React, { Component } from 'react'
import IntermediateState from './../../components/IntermediateState';
import Section from './../../components/Section'
import Article from './../../containers/Article'

import './styles.css'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      parentContainer: null,
      api: null,
      lang: 'en'
    };
  },
  getInitialState() {
    return {
      isExpanded: false,
      lead: {},
      remaining: {}
    };
  },
  updateTitle(title) {
    window.location.title = title;
    // eek?
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
    this.props.api.getPage( this.props.title, this.props.lang ).then( function ( data ) {
      self.setState(data);
    } );
  },
  expand() {
    this.setState({
      isExpanded: true
    });
  },
  render(){
    var url, leadHtml, sections = [];
    var lead = this.state.lead;

    if ( !lead.displaytitle ) {
      return (
        <Article>
          <IntermediateState></IntermediateState>
        </Article>
      )
    } else {
      url = '//' + this.props.lang + '.m.wikipedia.org/wiki/' + this.props.title;
      leadHtml = lead.sections.length ? lead.sections[0].text : '';
      if ( this.state.isExpanded ) {
        sections = this.state.remaining.sections.map( function ( sectionProps ) {
          return <Section {...sectionProps} key={sectionProps.id}></Section>
        } );
      } else {
        sections = [
          (<hr className="page-fold"/>),
          (<a className='btn btn-default' onClick={this.expand}>Expand</a>),
          (<a className="btn btn-default btn-sm" href={url}>View on Wikipedia</a>)
        ]
      }

      return (
        <Article title={this.state.lead.displaytitle} tagline={this.state.lead.description}>
          <div dangerouslySetInnerHTML={{ __html: leadHtml}}></div>
          {sections}
        </Article>
      )
    }
  }
} );
