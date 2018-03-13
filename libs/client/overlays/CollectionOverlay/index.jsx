import React from 'react';

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
		var self = this;
		var endpoint = '/api/private/' + this.props.lang + '/collection/all/with/' + this.props.title;
		this.props.api.fetch( endpoint ).then( function ( data ) {
			self.setState( data );
		} );
	}
	toggleCollectionState( id ) {
		var endpoint;
		var props = this.props;
		var collections = this.state.collections;

		collections.forEach( function ( col ) {
			if ( col.id === parseInt( id, 10 ) ) {
				endpoint = '/api/private/' + props.lang + '/collection/' + id;
				endpoint += col.member ? '/remove/' : '/add/';
				endpoint += encodeURIComponent( props.title );
				props.store.setUserNotification( col.member ?
					'Page removed from collection.' : 'Page added to collection.' );

				// do it
				col.member = !col.member;
				props.api.post( endpoint ).then( function () {
					props.api.clearCache();
				} );
				props.api.clearCache();
			}
		} );
		props.api.clearCache();
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
		var store = props.store;
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
						onClick={store.hideOverlays}>Cancel</a>
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
							href={'#/edit-collection/' + store.session.username + '/'}>{props.msg( 'collection-create' )}</a>
					</div>
				</Overlay>
			);
		} else {
			return <div style={{ display: 'none' }} />;
		}
	}
}

export default CollectionOverlay;
