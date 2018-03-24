import React from 'react';
import { observer, inject } from 'mobx-react';
import { CardDiff } from 'wikipedia-react-components';

import CardListPage from './CardListPage';

class History extends React.Component {
	render() {
		var props = Object.assign( {}, this.props, {
			isDiffCardList: true,
			title: 'Page History',
			CardClass: CardDiff
		} );

		return (
			<CardListPage {...props} />
		);
	}
}

export default inject( ( { api, store, onClickInternalLink }, { params } ) => {
	const title = decodeURIComponent( params ).replace( /_/gi, ' ' );
	return {
		tagline: ( <h2><a href={store.getLocalUrl( title )}
			onClick={onClickInternalLink}>{title}</a></h2> ),
		apiEndpoint: api.getEndpoint( 'pagehistory/' + params )
	};
} )( observer( History ) );
