import React from 'react';

import { Button, Overlay } from 'wikipedia-react-components';

class CtaDrawer extends React.Component {
	render() {
		var props = this.props;
		var store = props.store;
		var loginUrl = store.getLocalUrl( 'Special:UserLogin', null, {
			returnto: store.title
		} );
		return (
			<Overlay>
				<p>{props.message}</p>
				<div>
					<Button label='Log in' href={loginUrl} isPrimary="1" />
				</div>
				<p>
					<a href="https://www.mediawiki.org/wiki/Special:CreateAccount">Sign up at MediaWiki.org</a>
				</p>
			</Overlay>
		);
	}
}

CtaDrawer.defaultProps = {
	message: 'You need to sign in to use this feature'
};

export default CtaDrawer;
