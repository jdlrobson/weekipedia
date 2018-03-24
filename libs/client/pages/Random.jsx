import React from 'react';

import CardListPage from './CardListPage';

// Pages
class Random extends React.Component {
	constructor() {
		super();
	}
	render() {
		var endpoint = this.props.api.getEndpoint( 'random' );
		return (
			<CardListPage {...this.props} unordered="1" apiEndpoint={endpoint}
				title='Random' tagline="Random pages from across the wiki" />
		);
	}
}

Random.defaultProps = {
	api: null,
	lang: 'en'
};

export default Random;
