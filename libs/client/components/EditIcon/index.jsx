import React from 'react';

import CtaIcon from './../CtaIcon';

import './icons.less';

export default class EditIcon extends React.Component {
	render() {
		var props = this.props;
		var iconProps = {
			key: 'edit',
			glyph: 'edit',
			label: 'Edit',
			href: '#',
			store: props.store,
			className: 'component-edit-icon',
			onClick: function () {
				props.router.navigateTo( '#/editor/' + props.section );
			},
			ctaMsg: props.msg( 'edit-cta' )
		};

		return (
			<CtaIcon {...iconProps} />
		);
	}
}
