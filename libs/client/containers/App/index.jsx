import React from 'react'

import './styles.less'

import MainMenu from './../../components/MainMenu'
import Header from './../../components/Header'
import Icon from './../../components/Icon'
import TransparentShield from './../../components/TransparentShield'
import SearchForm from './../../components/SearchForm'
import ChromeHeader from './../../components/ChromeHeader'

import ReferenceDrawer from './../../overlays/ReferenceDrawer'
import Toast from './../../overlays/Toast'

import isRTL from './../../is-rtl'
import initOffline from './../../offline'

// Main component
export default React.createClass({
  getInitialState() {
    return {
      pageviews: 0,
      isMenuOpen: false,
      notification: '',
      isRTL: false,
      lang: 'en',
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
      overlay: props.overlay ? React.cloneElement( props.overlay, {
        showNotification: this.showNotification,
        closeOverlay: this.closeOverlay
      } ) : null,
      isOverlayEnabled: props.overlay,
      isOverlayFullScreen: props.isOverlayFullScreen
    } );
  },
  mountChildren( props ) {
    // clone each child and pass them the notifier
    var childProps = typeof document !== 'undefined' ? {
      showNotification: this.showNotification,
      showOverlay: this.showOverlay,
      closeOverlay: this.closeOverlay,
      onClickInternalLink: this.onClickInternalLink
    } : {};
    if ( this.state.pageviews === 0 ) {
      Object.assign( childProps, props.fallbackProps || {} );
    }

    var children = React.Children.map( props.children, ( child ) => React.cloneElement( child, childProps ) );
    this.setState( { children: children, pageviews: this.state.pageviews + 1 } );
  },
  mountLanguage( props ) {
    var newStylesheet,
      self = this,
      newLang = props.lang,
      rtl = isRTL( props.lang ),
      stylesheet = document.querySelector( 'link[href="/style.rtl.css"]' );

    function addStylesheet( newPath ) {
      newStylesheet = document.createElement( 'link' )
      newStylesheet.setAttribute( 'rel', 'stylesheet' );
      newStylesheet.setAttribute( 'href', newPath );
      document.body.appendChild( newStylesheet );
    }

    if ( rtl && !this.state.isRTL && !stylesheet ) {
      addStylesheet( '/style.rtl.css' );
    } else if ( !rtl && this.state.isRTL && stylesheet ) {
      stylesheet.parentNode.removeChild( stylesheet );
    }

    this.setState( { isRTL: rtl } );
    if ( newLang !== this.state.lang ) {
      props.api.fetch( '/api/messages/' + newLang ).then( function ( msgs ) {
        props.messages.load( msgs );
        self.setState( { lang: newLang } );
      } );
    }
  },
  mount( props ) {
    if ( typeof document !== 'undefined' ) {
      this.mountLanguage( props );
      this.mountOverlay( props );
    }
    this.mountChildren( props );
  },
  componentWillReceiveProps( nextProps ) {
    this.mount( nextProps );
  },
  componentWillMount() {
    this.mount( this.props );
  },
  componentDidMount() {
    var showNotification = this.showNotification;
    var msg = this.props.msg;
    if ( this.props.offlineVersion ) {
      initOffline( function () {
        showNotification( msg( 'offline-ready' ) );
      } );
    }
  },
  showOverlay( overlay ) {
    this.setState( {
      overlay: overlay,
      isOverlayEnabled: true,
      isOverlayFullScreen: false
    } );
  },
  onClickInternalLink( ev ) {
    var href, parts, match, refId, title;
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
      title = link.getAttribute( 'title' ) || '';

      if ( href.substr( 0, 5 ) !== '/auth' ) {

        // FIXME: Workaround for #5
        if ( href.substr( 0, 5 ) === '/wiki' ) {
          if ( props.language_project && props.siteinfo.allowForeignProjects ) {
            href = '/' + props.language_project + href.substr( 5 );
          } else {
            href = '/' + props.lang + href;
          }
        }

        if ( href.indexOf( '//' ) === -1 ) {
          parts = href.split( '?' );
          props.router.navigateTo( {
            pathname: parts[0],
            search: parts[1]
          }, title );
          ev.preventDefault();
        } else if ( props.siteinfo.allowForeignProjects ){
          props.supportedProjects.forEach( function( project ) {
            var reg = new RegExp( '\/\/([a-z\-]*)\.' + project + '\.org\/wiki\/(.*)|\/\/' + project + '\.wikimedia\.org\/wiki\/(.*)|\/\/' );
            var m = href.match( reg );
            if ( m && m[1] && m[2] ) {
              props.router.navigateTo( {
                pathname: '/' + m[1] + '.' + project + '/' + m[2]
              }, m[2] );
              ev.preventDefault();
            } else if ( m && m[3] ) {
              props.router.navigateTo( {
                pathname: '/' + props.lang + '.' + project + '/' + m[3]
              }, m[2] );
              ev.preventDefault();
            }
          } );
        }
      }
    }
  },
  closeOverlay() {
    // If an overlay is open
    if ( this.state.isOverlayEnabled ) {
      this.setState( { isOverlayEnabled: false } );
      if ( window.location.hash && window.location.hash !== '#' ) {
        window.location.hash = '#';
      }
    }
    this.setState( { notification: null } );
  },
  closePrimaryNav(){
    this.setState({ isMenuOpen: false });
    this.closeOverlay();
  },
  openPrimaryNav( ev ){
    this.setState({ isMenuOpen: true });
    this.closeOverlay();
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
    var siteinfo = this.props.siteinfo;
    var heading = siteinfo.includeSiteBranding ? <ChromeHeader {...this.props} /> : null;
    var search = (<SearchForm msg={this.props.msg}
      onClickSearch={this.onClickSearch} />);

    if ( !heading ) {
      heading = search;
      search = null;
    }
    var navigationClasses = this.state.isMenuOpen ?
      'primary-navigation-enabled navigation-enabled' : '';

    var icon = <Icon glyph="mainmenu" label="Home"
      onClick={this.openPrimaryNav}/>;
    var shield = this.state.isMenuOpen ? <TransparentShield /> : null;

    var toast,
      isRTL = this.state.isRTL,
      overlay = this.state.isOverlayEnabled ? this.state.overlay : null;

    if ( overlay ) {
      navigationClasses += this.state.isOverlayFullScreen ? 'overlay-enabled' : '';
    }

    if ( this.state.notification ) {
     toast = <Toast>{this.state.notification}</Toast>;
    }

    return (
      <div id="mw-mf-viewport" className={navigationClasses}
        lang={this.props.lang} dir={isRTL ? 'rtl' : 'ltr'}>
        <nav id="mw-mf-page-left">
          <MainMenu {...this.props} onClickInternalLink={this.onClickInternalLink}
            onItemClick={this.closePrimaryNav}/>
        </nav>
        <div id="mw-mf-page-center" onClick={this.closePrimaryNav}>
          <Header key="header-bar" primaryIcon={icon}
            main={heading}
            search={search}></Header>
          {this.state.children}
          {shield}
        </div>
        { overlay }
        { toast }
      </div>
    )
  }
} );
