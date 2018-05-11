import React from 'react';
import { observer, inject } from 'mobx-react';

import { Icon, CtaDrawer } from 'wikipedia-react-components';

class CtaIcon extends React.Component {
	dispatch( ev ) {
		var props = this.props;
		ev.stopPropagation();
		ev.preventDefault();
		if ( !props.showCta ) {
			props.onClick( ev );
		} else {
			props.showCta( props );
		}
	}
	render() {
		return (
			<Icon {...this.props} onClick={this.dispatch.bind( this )} />
		);
	}
}

export default inject( ( { store } ) => {
	if ( !store.session ) {
		return {
			showCta: ( props ) => {
				const loginUrl = store.getLocalUrl( 'Special:UserLogin', null, {
					returnto: store.title
				} );
				store.showOverlay(
					<CtaDrawer {...props} message={props.ctaMsg}
						loginUrl={loginUrl} />, false
				);
			}
		};
	} else {
		return {};
	}
} )(
	observer( CtaIcon )
);
