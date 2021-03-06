import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Input, IntermediateState } from 'wikipedia-react-components';

import CollectionCard from './../../components/CollectionCard';

import Overlay from './../Overlay';

import './styles.less';

class CollectionEditorOverlay extends React.Component {
	constructor() {
		super();
		this.state = {
			waiting: true,
			title: null,
			thumbnail: null,
			description: null
		};
	}
	componentDidMount() {
		var props = this.props;
		if ( props.id ) {
			this.loadCollection( props );
		} else {
			this.setState( { title: '', description: '', waiting: false } );
			this.loadImage( props );
		}
	}
	loadImage( props ) {
		var self = this;
		props.api.getPage( props.title ).then( function ( data ) {
			var image;
			if ( data.lead && data.lead.image ) {
				image = data.lead.image;
				self.setState( { thumbnail: { source: image.urls[ '320' ], title: 'File:' + image.file } } );
			}
		} );
	}
	loadCollection( props ) {
		var self = this;
		var api = props.api;
		var endpoint = api.getEndpoint( 'collection/by/' + props.username + '/' + props.id );
		props.api.fetch( endpoint ).then( function ( data ) {
			var thumbnail = data.thumbnail;
			var thumbnails = [];
			self.setState( data );
			self.setState( { waiting: false } );
			if ( !thumbnail ) {
				if ( data.pages ) {
					data.pages.forEach( function ( page ) {
						if ( page.thumbnail ) {
							thumbnails.push( page.thumbnail );
						}
					} );
					self.setState( { thumbnail: thumbnails[ 0 ], _thumbnails: thumbnails, _index: 0 } );
				} else {
					self.loadImage( props );
				}
			}
		} ).catch( function () {
			self.exit();
		} );
	}
	updateDescription( ev ) {
		this.setState( { description: ev.currentTarget.value } );
	}
	updateTitle( ev ) {
		this.setState( { title: ev.currentTarget.value } );
	}
	exit() {
		this.props.onExit();
	}
	save() {
		const self = this;
		const state = this.state;
		const title = state.title;
		const thumb = state.thumbnail ? state.thumbnail.title : null;
		this.setState( { waiting: true } );
		this.props.onSaveCollection( title, thumb, state.description ).then( () => {
			self.setState( { waiting: false } );
		} );
	}
	updateThumbnail() {
		if ( this.state._thumbnails && this.state._index !== undefined ) {
			var index = this.state._index + 1;
			if ( index > this.state._thumbnails.length - 1 ) {
				index = 0;
			}
			this.setState( { thumbnail: this.state._thumbnails[ index ], _index: index } );
		}
	}
	render() {
		var body;
		if ( !this.state.waiting && this.state.title !== undefined ) {
			body = (
				<div>
					<CollectionCard key="collection-editor-overlay-preview"
						onClick={this.updateThumbnail.bind( this )}
						thumbnail={this.state.thumbnail} title={this.state.title} description={this.state.description}/>
					<label>Name</label>
					<Input defaultValue={this.state.title} onInput={this.updateTitle.bind( this )} />
					<label>Description</label>
					<Input defaultValue={this.state.description} onInput={this.updateDescription.bind( this )} />
					<Button label="Save" isPrimary={true} onClick={this.save.bind( this )} />
					<Button label="Cancel" onClick={this.exit.bind( this )} />
				</div>
			);
		} else {
			body = <IntermediateState />;
		}
		return (
			<Overlay {...this.props} className="collection-editor-overlay" isDrawer={true}>
				{body}
			</Overlay>
		);
	}
}

export default inject( ( { api, store }, { id, onCollectionSave } ) => (
	{
		api,
		onSaveCollection: function ( title, thumbnail, description ) {
			let path = 'private/collection';
			path += id ? '/' + id + '/edit' : '/_/create';
			return api.post( api.getEndpoint( path ), {
				title: title,
				image: thumbnail,
				description
			} ).then( function ( json ) {
				if ( json && json.edit && json.edit.result === 'Success' ) {
					// Annoyingly this timeout doesn't always seem to be enough.
					setTimeout( function () {
						api.clearCache();
						onCollectionSave( id );
					}, 5000 );
				} else {
					store.setUserNotification( 'An error occurred while saving the collection' );
				}
			} );
		}
	}
) )(
	observer( CollectionEditorOverlay )
);
