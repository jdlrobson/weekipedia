import React from 'react'

import Overlay from './../../containers/Overlay'
import Input from './../../components/Input'
import IntermediateState from './../../components/IntermediateState'
import Button from './../../components/Button'

import './styles.less'

export default React.createClass({
  getInitialState() {
    return {
      waiting: true,
      title: null,
      description: null
    }
  },
  componentWillMount() {
    var props = this.props;
    if ( props.id ) {
      this.loadCollection( props );
    } else {
      this.setState( { title: '', description: '', waiting: false })
    }
  },
  loadCollection( props ) {
    var self = this;
    var endpoint = '/api/' + props.lang + '/collection/by/' + props.username + '/' + props.id;
    props.api.fetch( endpoint ).then( function ( data ) {
      self.setState( data );
      self.setState( { waiting: false } );
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
      description: this.state.description
    } ).then( function ( resp ) {
      if ( resp.status === 200 ) {
        // Annoyingly this timeout doesn't always seem to be enough.
        setTimeout( function () {
          props.router.back();
          props.showNotification( msg );
          props.api.invalidatePath( '/api/' + props.lang + '/collection/by/' + props.username + '/' );
          props.api.invalidatePath( '/api/' + props.lang + '/collection/by/' + props.username + '/' + props.id )
          props.router.navigateTo( window.location.pathname + '?c' + Math.random(), null, true );
        }, 5000 );
      } else {
        props.showNotification( 'An error occurred while saving the collection' );
        self.setState( { waiting: false } );
      }
    } );
  },
  render(){
    var body;
    if ( !this.state.waiting && this.state.title !== undefined ) {
      body = (
        <div>
          <label>Name</label>
          <Input defaultValue={this.state.title} onInput={this.updateTitle} />
          <label>Description</label>
          <Input defaultValue={this.state.description} onInput={this.updateDescription} />
          <Button label="Save" isPrimary={true} onClick={this.save} />
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

