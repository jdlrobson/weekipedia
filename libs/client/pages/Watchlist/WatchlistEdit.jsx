import React from 'react';
import { observer, inject } from 'mobx-react';

import CardListPage from './../CardListPage';

class WatchlistEdit extends React.Component {
	render() {
		var emptyProps = {
			ctaMessage: 'Back home',
			ctaLink: '/',
			msg: 'You are not currently watching any pages. Your watchlist helps you keep track of the pages that you are interested in. Watch pages by tapping the star icon.',
			image: '/images/emptywatchlist-page-actions-ltr.png'
		};

		return (
			<CardListPage {...this.props} isWatchable={true}
				emptyProps={emptyProps}
				unordered="1" />
		);
	}
}

export default inject( ( { api } ) => {
	return {
		apiEndpoint: api.getEndpoint( 'private/watchlist' )
	};
} )(
	observer( WatchlistEdit )
);
