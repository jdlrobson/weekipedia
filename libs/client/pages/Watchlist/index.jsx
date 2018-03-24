import React from 'react';

import WatchListEdit from './WatchlistEdit';
import WatchListFeed from './WatchlistFeed';

// Pages
export default class Thing extends React.Component {
	render() {
		var props = this.props;
		var isEditWatchlist = props.title === 'EditWatchlist';
		var store = props.store;

		var editLink = <a
			key="watchlist-list-tab"
			className={isEditWatchlist ? 'active' : '' }
			onClick={props.onClickInternalLink}
			href={store.getLocalUrl( 'Special:EditWatchlist' )}>List</a>;

		var modLink = <a
			key="watchlist-modifier-tab"
			className={isEditWatchlist ? '' : 'active' }
			onClick={props.onClickInternalLink}
			href={store.getLocalUrl( 'Special:Watchlist' )}>Modified</a>;

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
