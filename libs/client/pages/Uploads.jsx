import React from 'react';
import { observer, inject } from 'mobx-react';

import CardListPage from './CardListPage';

class Uploads extends React.Component {
	render() {
		return (
			<CardListPage {...this.props} title='Uploads' />
		);
	}
}

export default inject( ( { store, api, onClickInternalLink }, props ) => {
	// FIXME: what if no param set?
	const username = props.params;
	const apiEndpoint = api.getEndpoint( 'uploads/' + username );
	const tagline = (
		<p>Files uploaded by <a href={store.getLocalUrl( 'User:' + username )}
			onClick={onClickInternalLink}>{username}</a></p>
	);
	return {
		tagline,
		apiEndpoint
	};
} )(
	observer( Uploads )
);
