import React from 'react';
import { Header, Overlay,
	Icon, IntermediateState, Panel } from 'wikipedia-react-components';

import './styles.less';
import './icons.less';

class IssuesOverlay extends React.Component {
	constructor() {
		super();
		this.state = {
			error: false,
			issues: null
		};
	}
	componentDidMount() {
		var self = this;
		var api = this.props.api;
		api.getPage( this.props.title ).then( function ( page ) {
			if ( page.lead.issues ) {
				self.setState( { issues: page.lead.issues } );
			} else {
				self.setState( { error: true } );
			}
		} );
	}
	render() {
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
			<Overlay onExit={this.props.onExit} className="issues-overlay">
				<Header>
					<h2><strong>Issues</strong></h2>
				</Header>
				{body}
			</Overlay>
		);
	}
}

export default IssuesOverlay;
