import React from 'react'
import { Button, Input, IntermediateState } from 'wikipedia-react-components'

import CollectionCard from './../../components/CollectionCard'

import Overlay from './../Overlay'

import './styles.less'

export default React.createClass({
  getInitialState() {
    return {
      waiting: true,
      title: null,
      thumbnail: null,
      description: null
    }
  },
  componentDidMount() {
    var props = this.props;
    if ( props.id ) {
      this.loadCollection( props );
    } else {
      this.setState( { title: '', description: '', waiting: false })
      this.loadImage( props );
    }
  },
  loadImage( props ) {
    var self = this;
    props.api.getPage( props.title, props.language_project ).then( function ( data ) {
      var image;
      if ( data.lead && data.lead.image ) {
        image = data.lead.image;
        self.setState( { thumbnail: { source: image.urls['320'], title: 'File:' + image.file } } );
      }
    } );
  },
  loadCollection( props ) {
    var self = this;
    var endpoint = '/api/' + props.lang + '/collection/by/' + props.username + '/' + props.id;
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
          self.setState( { thumbnail: thumbnails[0], _thumbnails: thumbnails, _index: 0 } );
        } else {
          self.loadImage( props );
        }
      }
    } ).catch( function () {
      props.router.back();
    } );
  },
  updateDescription( ev ) {
    this.setState( { description: ev.currentTarget.value } );
  },
  updateTitle( ev ) {
    this.setState( { title: ev.currentTarget.value } );
  },
  exit() {
    this.props.closeOverlay();
  },
  save() {
    var props = this.props;
    var endpoint = '/api/private/' + props.lang + '/collection/';
    var self = this;
    var msg = props.id ? 'Collection was successfully updated' :
      'Collection was successfully created.';

    endpoint += props.id  ? props.id + '/edit' : '_/create';
    this.setState( { waiting: true } );
    props.api.post( endpoint, {
      title: this.state.title,
      image: this.state.thumbnail ? this.state.thumbnail.title : null,
      description: this.state.description
    } ).then( function ( json ) {
      if ( json && json.edit && json.edit.result === 'Success' ) {
        // Annoyingly this timeout doesn't always seem to be enough.
        setTimeout( function () {
          props.api.clearCache();
          props.router.navigateTo( { pathname: window.location.pathname,
            search: 'c=' + Math.random(), hash: '' }, null, true );
          props.showNotification( msg );
        }, 100 );
      } else {
        props.showNotification( 'An error occurred while saving the collection' );
        self.setState( { waiting: false } );
      }
    } );
  },
  updateThumbnail() {
    if ( this.state._thumbnails && this.state._index !== undefined ) {
      var index = this.state._index + 1;
      if ( index > this.state._thumbnails.length - 1 ) {
        index = 0;
      }
      this.setState( { thumbnail: this.state._thumbnails[index], _index: index } )
    }
  },
  render(){
    var body;
    if ( !this.state.waiting && this.state.title !== undefined ) {
      body = (
        <div>
          <CollectionCard key="collection-editor-overlay-preview"
            onClick={this.updateThumbnail}
            thumbnail={this.state.thumbnail} title={this.state.title} description={this.state.description}/>
          <label>Name</label>
          <Input defaultValue={this.state.title} onInput={this.updateTitle} />
          <label>Description</label>
          <Input defaultValue={this.state.description} onInput={this.updateDescription} />
          <Button label="Save" isPrimary={true} onClick={this.save} />
          <Button label="Cancel" onClick={this.exit} />
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
} )

