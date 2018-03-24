import React from 'react';
import { observer, inject } from 'mobx-react';

import CardListPage from './CardListPage';

// Pages
class Random extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<CardListPage {...this.props} unordered="1"
				title='Random' tagline="Random pages from across the wiki" />
		);
	}
}

Random.defaultProps = {
	lang: 'en'
};

export default inject( ( { api } ) => (
	{ apiEndpoint: api.getEndpoint( 'random' ) }
) )(
	observer( Random )
);
