import React from 'react'

import Overlay from './../../containers/Overlay'
import Icon from './../../components/Icon'

import './styles.less'
import './icons.less'

export default React.createClass({
  getDefaultProps() {
    return {
      
    };
  },
  getInitialState() {
    return {
      collections: null
    }
  },
  componentWillMount() {
    var self = this;
    var endpoint = '/api/private/' + this.props.lang + '/collection/all/with/' + this.props.title;
    this.props.api.fetch( endpoint ).then( function ( data ) {
      self.setState( data );
    } );
  },
  toggleCollectionState( id ) {
    var endpoint;
    var props = this.props;
    var collections = this.state.collections;

    collections.forEach( function ( col ) {
      if ( col.id === parseInt( id, 10 ) ) {
        endpoint  = '/api/private/' + props.lang + '/collection/' + id;
        endpoint += col.member ? '/remove/' : '/add/';
        endpoint += encodeURIComponent( props.title );
        props.showNotification( col.member ?
          'Page removed from collection.' : 'Page added to collection.' );

        // do it
        col.member = !col.member;
        props.api.post( endpoint );
      }
    } );
    this.setState( collections );
  },
  watch( ev ) {
    var id = ev.currentTarget.getAttribute( 'data-id' );

    ev.stopPropagation();
    this.toggleCollectionState( id );
  },
  render(){
    var watch = this.watch;

    if ( this.state.collections ) {
      return (
        <Overlay {...this.props} className="collection-overlay" isDrawer={true}>
        <h2>Add to existing collection</h2>,
        <ul>
          {
            this.state.collections.map( function ( collection ) {
              var glyph = collection.member ? 'tick' : 'blank-tick';
              return (
                <li onClick={watch} data-id={collection.id}>{collection.title}<Icon glyph={glyph} className="status-indicator"/></li>
              );
            } )
          }
        </ul>
        </Overlay>
      );
    } else {
      return <div style={{display: 'none'}} />;
    }
  }
} )

