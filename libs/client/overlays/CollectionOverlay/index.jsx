import React from 'react';
import { observer, inject } from 'mobx-react';

import Overlay from './../Overlay';
import { Icon } from 'wikipedia-react-components';

import './styles.less';
import './icons.less';

class CollectionOverlay extends React.Component {
	constructor() {
		super();
		this.state = {
			collections: null
		};
	}
	componentDidMount() {
		this.props.getAsyncState().then( ( state ) => this.setState( state ) );
	}
	toggleCollectionState( id ) {
		var props = this.props;
		var collections = this.state.collections;

		collections.forEach( function ( col ) {
			if ( col.id === parseInt( id, 10 ) ) {
				props.onToggleMember( id, props.title, col.member );
				// update local state
				col.member = !col.member;
			}
		} );
		this.setState( collections );
	}
	watch( ev ) {
		var id = ev.currentTarget.getAttribute( 'data-id' );

		ev.stopPropagation();
		this.toggleCollectionState( id );
	}
	render() {
		var watch = this.watch.bind( this );
		var props = this.props;
		var collections = this.state.collections;
		var emptyMsg;

		if ( collections ) {
			if ( collections.length === 0 ) {
				emptyMsg = <p>{props.msg( 'collections-empty' )}</p>;
			}
			return (
				<Overlay {...props} className="collection-overlay" isDrawer={true}>
					<h2>{props.msg( 'collection-title' )}</h2>
					<a key='edit-collection-cancel' className="cancel"
						onClick={props.onExit}>Cancel</a>
					<ul key="collection-overlay-list">
						{
							collections.map( function ( collection, i ) {
								var glyph = collection.member ? 'tick' : 'blank-tick';
								return (
									<li onClick={watch}
										key={'collection-overlay-list-' + i }
										data-id={collection.id}>{collection.title}<Icon glyph={glyph} className="status-indicator"/></li>
								);
							} )
						}
					</ul>
					{emptyMsg}
					<div className="collection-actions" key="collection-overlay-actions">
						<a key='edit-collection-create'
							href={'#/edit-collection/' + props.username + '/'}>{props.msg( 'collection-create' )}</a>
					</div>
				</Overlay>
			);
		} else {
			return <div style={{ display: 'none' }} />;
		}
	}
}

export default inject( function ( { api, store }, { title } ) {
	const username = store.session.username;

	return {
		username,
		getAsyncState: function () {
			var endpoint = api.getEndpoint( 'private/collection/all/with/' + title );
			return api.fetch( endpoint );
		},
		onToggleMember: function ( collectionId, title, isMember ) {
			let endpoint = 'private/collection/' + collectionId;
			endpoint += isMember ? '/remove/' : '/add/';
			endpoint += encodeURIComponent( title );
			store.setUserNotification( isMember ?
				'Page removed from collection.' : 'Page added to collection.' );
			api.post( api.getEndpoint( endpoint ) ).then( function () {
				api.clearCache();
			} );
			api.clearCache();
		}
	};
} )( observer( CollectionOverlay ) );
