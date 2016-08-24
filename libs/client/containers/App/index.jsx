import React from 'react'

import './styles.less'

import MainMenu from './../../components/MainMenu'
import Header from './../../components/Header'
import Icon from './../../components/Icon'
import TransparentShield from './../../components/TransparentShield'
import SearchForm from './../../components/SearchForm'

import ReferenceDrawer from './../../overlays/ReferenceDrawer'
import Toast from './../../overlays/Toast'

// Main component
export default React.createClass({
  getInitialState() {
    return {
      isMenuOpen: false,
      notification: '',
      isOverlayFullScreen: true,
      isOverlayEnabled: false
    }
  },
  getDefaultProps() {
    return {
      lang: 'en',
      isOverlayFullScreen: true,
      isOverlayEnabled: false
    };
  },
  mountOverlay( props ) {
    this.setState( {
      overlay: props.overlay,
      isOverlayEnabled: props.overlay,
      isOverlayFullScreen: props.isOverlayFullScreen
    } );
  },
  mountChildren( props ) {
    // clone each child and pass them the notifier
    var children = React.Children.map( props.children, ( child ) => React.cloneElement( child, {
        showNotification: this.showNotification,
        showOverlay: this.showOverlay,
        onClickInternalLink: this.onClickInternalLink
      } )
    );
    this.setState( { children: children } );
  },
  componentWillReceiveProps( nextProps ) {
    this.mountOverlay( nextProps );
    this.mountChildren( nextProps )
  },
  componentWillMount() {
    this.mountOverlay( this.props );
    this.mountChildren( this.props );
  },
  showOverlay( overlay ) {
    this.setState( {
      overlay: overlay,
      isOverlayEnabled: true,
      isOverlayFullScreen: false
    } );
  },
  onClickInternalLink( ev ) {
    var href, match, refId;
    var link = ev.currentTarget;
    var childNode = link.firstChild;
    var parentNode = link.parentNode;
    var props = this.props;

    if ( parentNode.className === 'mw-ref' ) {
      ev.preventDefault();
      ev.stopPropagation();
      refId = link.getAttribute( 'href' ).substr( 1 );
      this.showOverlay( <ReferenceDrawer {...props} refId={refId} /> );

    } else if ( childNode && childNode.nodeName === 'IMG' ) {
      href = link.getAttribute( 'href' ) || '';
      match = href.match( /\/wiki\/File\:(.*)/ );
      if ( match && match[1] ) {
        ev.preventDefault();
        props.router.navigateTo( '#/media/' + match[1] );
      }
    } else {
      href = link.getAttribute( 'href' ) || '';

      if ( href.substr( 0, 5 ) !== '/auth' ) {

        // FIXME: Workaround for #5
        if ( href.substr( 0, 5 ) === '/wiki' ) {
          href = '/' + props.lang + href;
        }
        props.router.navigateTo( href );
        ev.preventDefault();
      }
    }
  },
  closeOverlay() {
    // If an overlay is open
    if ( this.state.isOverlayEnabled ) {
      this.setState( { isOverlayEnabled: false } );
    }
    this.setState( { notification: null } );
  },
  closePrimaryNav(){
    this.setState({ isMenuOpen: false });
    this.closeOverlay();
  },
  openPrimaryNav( ev ){
    this.setState({ isMenuOpen: true });
    ev.preventDefault();
    ev.stopPropagation();
  },
  showNotification( msg ) {
    var self = this;
    this.setState( {
      notification: msg
    } );
    clearTimeout( this.pendingToast );
    this.pendingToast = setTimeout( function () {
      self.setState( {
        notification: null
      } );
    }, 5000 );
  },
  onClickSearch(){
    this.props.router.navigateTo( '#/search' );
  },
  render(){
    var searchForm = (<SearchForm msg={this.props.msg}
      onClickSearch={this.onClickSearch} />);

    var navigationClasses = this.state.isMenuOpen ?
      'primary-navigation-enabled navigation-enabled' : '';

    var icon = <Icon glyph="mainmenu" label="Home"
      onClick={this.openPrimaryNav}/>;
    var shield = this.state.isMenuOpen ? <TransparentShield /> : null;

    var toast,
      overlay = this.state.isOverlayEnabled ? this.state.overlay : null;

    if ( overlay ) {
      navigationClasses += this.state.isOverlayFullScreen ? 'overlay-enabled' : '';
    }

    if ( this.state.notification ) {
     toast = <Toast>{this.state.notification}</Toast>;
    }

    return (
      <div id="mw-mf-viewport" className={navigationClasses}>
        <nav id="mw-mf-page-left">
          <MainMenu {...this.props} onClickInternalLink={this.onClickInternalLink}
            onItemClick={this.closePrimaryNav}/>
        </nav>
        <div id="mw-mf-page-center" onClick={this.closePrimaryNav}>
          <Header key="header-bar" primaryIcon={icon}
            main={searchForm}></Header>
          {this.state.children}
          {shield}
        </div>
        { overlay }
        { toast }
      </div>
    )
  }
} );
