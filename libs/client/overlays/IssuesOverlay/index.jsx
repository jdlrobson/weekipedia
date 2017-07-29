import React from 'react'
import createReactClass from 'create-react-class'
import { Icon, IntermediateState, Panel } from 'wikipedia-react-components'

import Content from './../../components/Content'

import Overlay from './../Overlay'

import './styles.less'
import './icons.less'

export default createReactClass({
  getInitialState() {
    return {
      error: false,
      issues: null
    };
  },
  componentDidMount(){
    var self = this;
    var source =  this.props.language_project || this.props.lang;
    this.props.api.fetch( '/api/page/' + source + '/' + this.props.title ).then( function ( page ) {
      if ( page.lead.issues ) {
        self.setState( { issues: page.lead.issues } )
      } else {
        self.setState( { error: true } );
      }
    } );
  },
  render(){
    var body;
    var issues = this.state.issues;
    if ( this.state.error ) {
      body = <Panel>This page has no issues.</Panel>;
    } else if ( issues ) {
      body = issues.map( function ( issue ) {
        return (
          <Panel>
            <Icon glyph="issue" className="issue-notice"/>
            <div dangerouslySetInnerHTML={{ __html: issue.text }} />
          </Panel>
        );
      } );
    } else {
      body = <IntermediateState/>;
    }
    return (
      <Overlay router={this.props.router} className="issues-overlay"
        header={<h2><strong>Issues</strong></h2>}>
        <Content className="overlay-content">
          {body}
        </Content>
      </Overlay>
    )
  }
} );
