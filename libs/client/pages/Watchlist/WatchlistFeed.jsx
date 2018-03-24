import React from 'react';

import { CardDiff } from 'wikipedia-react-components';

import CardListPage from './../CardListPage';

// Pages
export default class Thing extends React.Component {
	render() {
		var ns;
		var props = this.props;
		var emptyProps = {
			msg: 'There are no pages with recent changes.',
			image: ''
		};
		var endpoint = 'private/watchlist-feed/';

		if ( this.props.query && this.props.query.filter ) {
			ns = this.props.query.filter;
		}

		if ( ns ) {
			endpoint += '/' + ns;
		}

		return (
			<CardListPage {...props} apiEndpoint={props.api.getEndpoint( endpoint )} emptyProps={emptyProps}
				CardClass={CardDiff} isDiffCardList={true} />
		);
	}
}
