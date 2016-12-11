import React from 'react'

import CtaIcon from '../CtaIcon'

import CollectionOverlay from './../../overlays/CollectionOverlay'

import './icons.less'

export default React.createClass({
  getInitialState(){
    return {
      collections: null
    };
  },
  getDefaultProps() {
    return {
      collection: 0
    }
  },
  componentWillMount() {
    if ( this.props.session && this.props.isWatched === undefined ) {
      this.loadWatchInfo();
    }
  },
  componentDidMount() {
    if ( this.props.isWatched ) {
      this.setState( { isWatched: this.props.isWatched } );
    }
  },
  loadWatchInfo() {
    var props = this.props;
    var title = props.title;
    var self = this;
    var endpoint = '/api/private/' + this.props.lang + '/collection/all/with/' + this.props.title;
    this.props.api.fetch( endpoint ).then( function ( data ) {
      var isWatched = false;
      var collections = data.collections;
      collections.forEach( ( collection ) => { isWatched = isWatched || collection.member } );
      title = decodeURIComponent( title );
      self.setState( { collections: collections, isWatched: isWatched } );
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
    props.api.clearCache();
    props.showNotification( state.isWatched ?
      'Page removed from watchlist.' : 'Page added to watchlist.' );
  },
  dispatch( ev ) {
    var props = this.props;
    var collectionsEnabled = props.siteoptions && props.siteoptions.collectionsEnabled;
    var collections = this.state.collections;

    if ( !props.collection && collections.length > 1 || collectionsEnabled ) {
      props.showOverlay( <CollectionOverlay {...props} /> );
    } else {
      this.watch( ev );
    }
  },
  render(){
    var state = this.state;
    var props = this.props;
    var isWatched = state.isWatched;

    var iconProps = {
      key: 'watch',
      showOverlay: props.showOverlay,
      glyph: isWatched ? 'watched' : 'watch',
      label: 'Watch this page',
      title: props.title,
      language_project: props.language_project,
      // Can operate collection with id -1 when anonymous
      session: props.collection === '-1' ? { username: '~' } : props.session,
      ctaMsg: props.msg( 'watch-cta' ),
      onLoginClick: this.dispatch
    };

    if ( this.state.isError ) {
      iconProps.className = 'disabled';
    }

    return (
      <CtaIcon {...iconProps} />
    )
  }
});
