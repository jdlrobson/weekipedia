import React from 'react';
import { observer, inject } from 'mobx-react';

import WatchListEdit from './WatchlistEdit';
import WatchListFeed from './WatchlistFeed';

// Pages
class Watchlist extends React.Component {
	render() {
		var props = this.props;
		var isEditWatchlist = props.title === 'EditWatchlist';

		var editLink = <a
			key="watchlist-list-tab"
			className={isEditWatchlist ? 'active' : '' }
			onClick={props.onClickInternalLink}
			href={props.listUrl}>List</a>;

		var modLink = <a
			key="watchlist-modifier-tab"
			className={isEditWatchlist ? '' : 'active' }
			onClick={props.onClickInternalLink}
			href={props.feedUrl}>Modified</a>;

		var newProps = Object.assign( {}, props, {
			tabs: [ editLink, modLink ],
			tagline: 'Pages on your watchlist',
			title: 'Watchlist'
		} );

		if ( isEditWatchlist ) {
			return ( <WatchListEdit {...newProps} /> );
		} else {
			return ( <WatchListFeed {...newProps} /> );
		}
	}
}

export default inject( ( { store, onClickInternalLink } ) => {
	return {
		onClickInternalLink,
		listUrl: store.getLocalUrl( 'Special:EditWatchlist' ),
		feedUrl: store.getLocalUrl( 'Special:Watchlist' )
	};
} )(
	observer( Watchlist )
);
