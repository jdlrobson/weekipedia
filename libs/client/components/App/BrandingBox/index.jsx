import React from 'react';

import './styles.less';

const BrandingBox = ( { siteinfo, project } ) => {
	var icon, content;
	content = siteinfo.wordmark ?
		<img src={siteinfo.wordmark} alt={siteinfo.title} height="15" width="97" /> :
		siteinfo.title;

	if ( project !== siteinfo.defaultProject ) {
		icon = <div className={'project-icon project-' + project}>{project}</div>;
	}
	return (
		<div className="branding-box" key="chrome-header-heading">
			<h1>
				<span>
					{content}
				</span>
				<sup>{icon}</sup>
			</h1>
		</div>
	);
};

export default BrandingBox;
