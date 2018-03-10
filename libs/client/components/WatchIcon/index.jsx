import React from 'react'

import CtaIcon from '../CtaIcon'

import CollectionOverlay from './../../overlays/CollectionOverlay'

import './icons.less'

class WatchIcon extends React.Component {
  constructor(props){
   super(props);
   this.state = {
     collections: null
    };
  }
  componentWillMount() {
    if ( this.props.session && this.props.isWatched === undefined ) {
      this.loadWatchInfo();
    }
  }
  componentDidMount() {
    if ( this.props.isWatched ) {
      this.setState( { isWatched: this.props.isWatched } );
    }
  }
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
  }
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
    props.store.setUserNotification( state.isWatched ?
      'Page removed from watchlist.' : 'Page added to watchlist.' );
  }
  dispatch( ev ) {
    var props = this.props;
    var collectionsEnabled = props.siteoptions && props.siteoptions.collectionsEnabled;
    var collections = this.state.collections;

    if ( !props.collection && collections.length > 1 || collectionsEnabled ) {
      props.showOverlay( <CollectionOverlay {...props} /> );
    } else {
      this.watch( ev );
    }
  }
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
      session: props.session,
      ctaMsg: props.msg( 'watch-cta' ),
      onLoginClick: this.dispatch.bind( this )
    };

    if ( this.state.isError ) {
      iconProps.className = 'disabled';
    }

    return (
      <CtaIcon {...iconProps} />
    )
  }
}

WatchIcon.defaultProps = {
  collection: 0
};

export default WatchIcon;
