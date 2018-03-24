import React from 'react';

import { CardDiff } from 'wikipedia-react-components';

import CardListPage from './CardListPage';

// Pages
export default class History extends React.Component {
	render() {
		var api = this.props.api;
		var store = this.props.store;

		var endpoint = api.getEndpoint('pagehistory/' + this.props.params);
		var title = decodeURIComponent( this.props.params ).replace( /_/gi, ' ' );
		var tagline = ( <h2><a href={store.getLocalUrl(title)}
			onClick={this.props.onClickInternalLink}>{title}</a></h2> );

		var props = Object.assign( {}, this.props, {
			isDiffCardList: true,
			apiEndpoint: endpoint,
			title: 'Page History',
			tagline: tagline,
			CardClass: CardDiff
		} );

		return (
			<CardListPage {...props} />
		);
	}
}
