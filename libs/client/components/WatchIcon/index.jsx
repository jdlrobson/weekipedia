import React from 'react';

import { observer, inject } from 'mobx-react';
import CtaIcon from '../CtaIcon';

import CollectionOverlay from './../../overlays/CollectionOverlay';

import './icons.less';

class WatchIcon extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			collections: null
		};
	}
	componentWillMount() {
		var props = this.props;
		if ( props.isLoggedIn && props.isWatched === undefined ) {
			this.loadWatchInfo();
		}
	}
	componentDidMount() {
		if ( this.props.isWatched ) {
			this.setState( { isWatched: this.props.isWatched } );
		}
	}
	loadWatchInfo() {
		this.props.getAsyncState().then( ( state )=>this.setState( state ) )
			.catch( () => this.setState( { isError: true } ) );
	}
	watch( ev ) {
		var props = this.props;
		var state = this.state;

		ev.stopPropagation();
		this.setState( { isWatched: !state.isWatched } );
		this.props.onWatch( props.collection, props.title, state.isWatched );
	}
	dispatch( ev ) {
		var props = this.props;
		var collections = this.state.collections || [];

		if ( !props.collection && collections.length > 1 && props.onAddToCollection ) {
			props.onAddToCollection();
		} else {
			this.watch( ev );
		}
	}
	render() {
		var state = this.state;
		var props = this.props;
		var isWatched = state.isWatched;

		var iconProps = {
			key: 'watch',
			glyph: isWatched ? 'watched' : 'watch',
			label: 'Watch this page',
			title: props.title,
			ctaMsg: props.msg( 'watch-cta' ),
			onClick: this.dispatch.bind( this )
		};

		if ( this.state.isError ) {
			iconProps.className = 'disabled';
		}

		return (
			<CtaIcon {...iconProps} />
		);
	}
}

WatchIcon.defaultProps = {
	collection: 0
};

export default inject( ( { api, store }, props ) => (
	{
		isLoggedIn: !!store.session,
		onAddToCollection: store.isFeatureEnabled( 'collectionsEnabled' ) ? () => {
			store.showOverlay( <CollectionOverlay {...props}
				onExit={store.hideOverlays.bind( store )} /> );
		} : undefined,
		onWatch: ( collection, title, isWatched ) => {
			let endpoint = 'private/collection/' + collection;
			endpoint += isWatched ? '/remove/' : '/add/';
			endpoint += encodeURIComponent( title );

			// do it
			api.post( api.getEndpoint( endpoint ) );
			api.clearCache();
			store.setUserNotification( isWatched ?
				'Page removed from watchlist.' : 'Page added to watchlist.' );
		},
		getAsyncState: () => {
			const title = props.title;
			const endpoint = api.getEndpoint( 'private/collection/all/with/' + encodeURIComponent( title ) );
			return api.fetch( endpoint ).then( function ( data ) {
				var isWatched = false;
				var collections = data.collections;
				collections.forEach( ( collection ) => { isWatched = isWatched || collection.member; } );
				return { collections: collections, isWatched: isWatched };
			} );
		}
	}
) )(
	observer( WatchIcon )
);
