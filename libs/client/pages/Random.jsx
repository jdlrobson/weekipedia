import React from 'react';

import CardListPage from './CardListPage';

// Pages
class Random extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<CardListPage {...this.props} unordered="1" apiEndpoint={'/api/random/' + this.props.lang}
				title='Random' tagline="Random pages from across the wiki" />
		);
	}
}

Random.defaultProps = {
	api: null,
	lang: 'en'
};

export default Random;
