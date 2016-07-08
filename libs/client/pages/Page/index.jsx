import React, { Component } from 'react'
import IntermediateState from './../../components/IntermediateState';
import Section from './../../components/Section'
import Button from './../../components/Button'
import Article from './../../containers/Article'
import Content from './../../containers/Content'

import './styles.css'
import './tablet.css'

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
    var url, leadHtml,
      sections = [],
      btns = [],
      lead = this.state.lead;

    if ( !lead.displaytitle ) {
      return (
        <Article>
          <Content><IntermediateState></IntermediateState></Content>
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
        btns.push( <Button href={'#expanded=1'} label="Expand" onClick={this.expand}></Button> );
      }
      btns.push(<Button href={url} label="View on Wikipedia"></Button>);

      return (
        <Article title={this.state.lead.displaytitle} tagline={this.state.lead.description}>
          <Content key="page-row-1" className="content">
            <div dangerouslySetInnerHTML={{ __html: leadHtml}}></div>
            {sections}
          </Content>
          <Content key="page-row-2" className="post-content">{btns}</Content>
        </Article>
      )
    }
  }
} );
