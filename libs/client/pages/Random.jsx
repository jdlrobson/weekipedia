import React from 'react';

import CardListPage from './CardListPage';

// Pages
export default class Thing extends React.Component {
	constructor() {
		super();
		this.state = {
			error: false,
			cards: null
		};
	}
	render() {
		return (
			<CardListPage {...this.props} unordered="1" apiEndpoint={'/api/random/' + this.props.lang}
				title='Random' tagline="Random pages from across the wiki" />
		);
	}
}

Thing.defaultProps = {
	api: null,
	lang: 'en'
};
