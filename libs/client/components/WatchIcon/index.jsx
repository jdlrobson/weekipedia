import React from 'react'

import Icon from './../Icon'

import CtaDrawer from './../../overlays/CtaDrawer'

import './icons.less'

export default React.createClass({
  getInitialState(){
    return {
      isWatched: false
    };
  },
  getDefaultProps() {
    return {
      collection: 0
    }
  },
  componentWillMount() {
    if ( this.props.session ) {
      this.loadWatchInfo();
    }
  },
  loadWatchInfo() {
    var props = this.props;
    var title = props.title;
    var self = this;
    var endpoint = '/api/private/' + props.lang + '/collection/' + props.collection + '/has/' + title + '/';
    this.props.api.fetch( endpoint ).then( function ( data ) {
      title = decodeURIComponent( title );
      self.setState( { isWatched: Boolean( data[title] ) } );
    } ).catch( function () {
      self.setState( { isError: true } );
    } );
  },
  watch( ev ) {
    var endpoint;
    var props = this.props;
    var state = this.state;

    ev.stopPropagation();
    this.setState( { isWatched: !state.isWatched } );
    endpoint  = '/api/private/' + props.lang + '/collection/' + props.collection;
    endpoint += state.isWatched ? '/remove/' : '/add/';
    endpoint += encodeURIComponent( props.title );

    // do it
    props.api.post( endpoint );
    props.showNotification( state.isWatched ?
      'Page removed from watchlist.' : 'Page added to watchlist.' );
  },
  dispatch( ev ) {
    if ( this.props.session ) {
      this.watch( ev );
    } else {
      this.props.showOverlay( <CtaDrawer {...this.props}/> );
    }
  },
  render(){
    var state = this.state;
    var iconProps = {
      key: 'watch',
      glyph: state.isWatched ? 'watched' : 'watch',
      label: 'Read in another language',
      onClick: this.dispatch
    };

    if ( this.state.isError ) {
      iconProps.className = 'disabled';
    }

    return (
      <Icon {...iconProps} />
    )
  }
});
