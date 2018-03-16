import React, { Component } from 'react';

import './styles.less';

class SectionContent extends Component {
	render() {
		var divId;
		var id = this.props.id;
		if ( id && typeof id === 'number' ) {
			// For consistency with MobileFrontend the id uses the section number - the lead section
			divId = 'content-collapsible-block-' + ( id - 1 );
		}
		var classSuffix = this.props.className ? ' ' + this.props.className : '';
		if ( this.props.id ) {
			classSuffix += ' section-' + id;
		}
		return (
			<div data-section={id}
				id={divId}
				className={'component-section-content content' + classSuffix}
				dangerouslySetInnerHTML={{ __html: this.props.text }}></div>
		);
	}
}

export default SectionContent;
