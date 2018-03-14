import React from 'react';

import { Icon } from 'wikipedia-react-components';

import CtaDrawer from './../../overlays/CtaDrawer';

export default class CtaIcon extends React.Component {
	dispatch( ev ) {
		var props = this.props;
		var store = props.store;
		ev.stopPropagation();
		ev.preventDefault();
		if ( store.session ) {
			props.onClick( ev );
		} else {
			store.showOverlay( <CtaDrawer {...props} message={props.ctaMsg} />, false );
		}
	}
	render() {
		return (
			<Icon {...this.props} onClick={this.dispatch.bind( this )} />
		);
	}
}
