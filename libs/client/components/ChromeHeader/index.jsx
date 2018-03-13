import React, { Component } from 'react';

import { Icon, Header } from 'wikipedia-react-components';

import './styles.less';

class ChromeHeader extends Component {
	render() {
		var heading, project, icon, siteinfo, content;
		var props = this.props;
		var search = props.search;
		var useSiteBranding = props.includeSiteBranding;
		var secondaryIcons = useSiteBranding ? [ <Icon /> ] : null;
		if ( props.secondaryIcons ) {
			secondaryIcons = props.secondaryIcons;
		}
		if ( useSiteBranding ) {
			siteinfo = props.siteinfo;
			content = siteinfo.wordmark ?
				<img src={siteinfo.wordmark} alt={siteinfo.title} height="15" width="97" /> :
				siteinfo.title;

			project = props.project;

			if ( project !== siteinfo.defaultProject ) {
				icon = <div className={'project-icon project-' + project}>{project}</div>;
			}
			heading = [
				<div className="branding-box" key="chrome-header-heading">
					<h1>
						<span>
							{content}
						</span>
						<sup>{icon}</sup>
					</h1>
				</div>,
				search
			];
		} else {
			heading = search;
		}

		return <Header key="header-bar" primaryIcon={props.primaryIcon} className="chrome-header"
			fixed={props.fixed}
			secondaryIcons={secondaryIcons}>{heading}</Header>;
	}
}

export default ChromeHeader;
