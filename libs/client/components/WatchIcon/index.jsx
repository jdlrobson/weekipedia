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
  componentWillMount() {
    if ( this.props.session ) {
      this.loadWatchInfo();
    }
  },
  loadWatchInfo() {
    var title = this.props.title;
    var self = this;
    var endpoint = '/api/private/watchlist/' + this.props.lang + '/' + title;
    this.props.api.fetch( endpoint ).then( function ( data ) {
      title = decodeURIComponent( title );
      self.setState( { isWatched: Boolean( data[title] ) } );
    } ).catch( function () {
      self.setState( { isError: true } );
    } );
  },
  watch( ev ) {
    var endpointPrefix;
    var props = this.props;
    var state = this.state;

    ev.stopPropagation();
    this.setState( { isWatched: !state.isWatched } );
    endpointPrefix  = state.isWatched ? '/api/private/unwatch/' : '/api/private/watch/';
    // do it
    props.api.post( endpointPrefix + props.lang + '/' + encodeURIComponent( props.title ) );
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
