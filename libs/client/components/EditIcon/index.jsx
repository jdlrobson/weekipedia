import React from 'react';

import CtaIcon from './../CtaIcon';

import './icons.less';

export default class EditIcon extends React.Component {
	render() {
		var props = this.props;
		var section = props.section;
		var iconProps = {
			key: 'edit',
			glyph: 'edit',
			label: 'Edit',
			href: '#',
			store: props.store,
			className: 'component-edit-icon',
			router: props.router,
			title: props.title,
			language_project: props.language_project,
			onLoginUrl: section !== undefined ? '#/editor/' + section : '#/editor/',
			ctaMsg: props.msg( 'edit-cta' )
		};

		return (
			<CtaIcon {...iconProps} />
		);
	}
}
