import React from 'react';
import { Button, Overlay } from 'wikipedia-react-components';

class CtaDrawer extends React.Component {
	render() {
		var props = this.props;
		return (
			<Overlay>
				<p>{props.message}</p>
				<div>
					<Button label='Log in' href={props.loginUrl} isPrimary="1" />
				</div>
				<p>
					<a href={props.signupUrl}>Sign up at MediaWiki.org</a>
				</p>
			</Overlay>
		);
	}
}

CtaDrawer.defaultProps = {
	signupUrl: 'https://www.mediawiki.org/wiki/Special:CreateAccount',
	message: 'You need to sign in to use this feature'
};

export default CtaDrawer;
