import React from 'react';
import { observer, inject } from 'mobx-react';
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
		this.props.getAsyncState().then( ( state ) => this.setState( state ) );
	}
	render() {
		var body;
		var issues = this.state.issues;

		if ( this.state.error ) {
			body = <Panel>This page has no issues.</Panel>;
		} else if ( issues ) {
			body = issues.map( function ( issue, i ) {
				return (
					<Panel key={'issue-' + i}>
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

export default inject( ( { api }, { title } ) => {
	return {
		getAsyncState: () => {
			return api.getPage( title ).then( function ( page ) {
				if ( page.lead.issues ) {
					return { issues: page.lead.issues };
				} else {
					return { error: true };
				}
			} );
		}
	};
} )( observer( IssuesOverlay ) );
