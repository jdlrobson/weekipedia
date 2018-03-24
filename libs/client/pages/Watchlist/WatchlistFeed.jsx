import React from 'react';
import { observer, inject } from 'mobx-react';

import { CardDiff } from 'wikipedia-react-components';

import CardListPage from './../CardListPage';

class WatchlistFeed extends React.Component {
	render() {
		var emptyProps = {
			msg: 'There are no pages with recent changes.',
			image: ''
		};

		return (
			<CardListPage {...this.props} emptyProps={emptyProps}
				CardClass={CardDiff} isDiffCardList={true} />
		);
	}
}

export default inject( ( { api }, props ) => {
	let apiEndpoint = api.getEndpoint( 'private/watchlist-feed/' );
	let ns;
	if ( props.query && props.query.filter ) {
		ns = props.query.filter;
	}
	if ( ns ) {
		apiEndpoint += '/' + ns;
	}
	return {
		apiEndpoint
	};
} )(
	observer( WatchlistFeed )
);
