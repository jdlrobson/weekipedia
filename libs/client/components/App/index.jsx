import React from 'react'
import ReactDOM from 'react-dom'

import './styles.less'
import './icons.less'

import MainMenu from './../MainMenu'
import Icon from './../Icon'
import TransparentShield from './../TransparentShield'
import SearchForm from './../SearchForm'
import ChromeHeader from './../ChromeHeader'

import ReferenceDrawer from './../../overlays/ReferenceDrawer'
import Toast from './../../overlays/Toast'

import isRTL from './../../is-rtl'
import initOffline from './../../offline'

const APP_SESSION_KEY = 'app-session'

// Main component
export default React.createClass({
  getInitialState() {
    return {
      pageviews: 0,
      isMenuOpen: false,
      notification: '',
      isRTL: false,
      lang: 'en',
      session: null,
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
  hijackLinks( container ){
    container = container || ReactDOM.findDOMNode( this );

    var links = container.querySelectorAll( 'a' );
    var self = this;

    function navigateTo( ev ) {
      self.onClickInternalLink( ev );
    }

    container.setAttribute( 'data-hijacked-prev', 1 );
    Array.prototype.forEach.call( links, function ( link ) {
      link.addEventListener( 'click', navigateTo );
    } );
  },
  mountOverlay( props ) {
    this.setState( {
      overlay: props.overlay ? React.cloneElement( props.overlay, {
        showNotification: this.showNotification,
        closeOverlay: this.closeOverlay
      } ) : null,
      isOverlayEnabled: props.overlay,
      session: this.state.session,
      isOverlayFullScreen: props.isOverlayFullScreen
    } );
  },
  mountChildren( props, session ) {
    // clone each child and pass them the notifier
    var childProps = typeof document !== 'undefined' ? {
      showNotification: this.showNotification,
      showOverlay: this.showOverlay,
      closeOverlay: this.closeOverlay,
      hijackLinks: this.hijackLinks,
      session: session || this.state.session,
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
  getLocalSession() {
    var localSession = this.props.storage.get( APP_SESSION_KEY );
    localSession = localSession === 'false' ? null : JSON.parse( localSession );
    if ( localSession && localSession.timestamp ) {
      // is it greater than 1 hours old?
      if ( ( new Date() - new Date( localSession.ts ) ) / 1000 > 60 * 60 ) {
        localSession = null;
      }
    } else if ( localSession && !localSession.timestamp ) {
      localSession = null;
    }
    return localSession;
  },
  mount( props ) {
    if ( typeof document !== 'undefined' ) {
      this.mountLanguage( props );
      this.mountOverlay( props );

      var localSession = this.getLocalSession();
      if ( !this.state.session ) {
        if ( localSession ) {
          // load session from local storage
          this.setState( { session: localSession } );
          this.mountChildren( props, localSession );
        } else {
          this.login().then(()=>this.mountChildren( props ));
        }
      } else {
        this.mountChildren( props );
      }
    } else {
      this.mountChildren( props );
    }
  },
  componentWillReceiveProps( nextProps ) {
    this.mount( nextProps );
  },
  componentWillMount() {
    this.mount( this.props );
  },
  login() {
    var self = this;
    return this.props.api.fetch( '/auth/whoamithistime', {
      credentials: 'include'
    } ).then( function ( session ) {
      // cache for next session
      session.timestamp = new Date();
      self.props.storage.set( APP_SESSION_KEY, JSON.stringify( session ) );
      self.setState( { session: session } );
    } ).catch( function () {
      self.props.storage.set( APP_SESSION_KEY, 'false' );
      self.setState( { session: null } );
    } );
  },
  clearSession() {
    this.props.storage.remove( APP_SESSION_KEY );
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
    var allowForeignProjects = props.siteoptions.allowForeignProjects;

    if ( parentNode.className === 'mw-ref' ) {
      ev.preventDefault();
      ev.stopPropagation();
      refId = link.getAttribute( 'href' ).substr( 1 );
      this.showOverlay( <ReferenceDrawer {...props} refId={refId} hijackLinks={this.hijackLinks} /> );

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
        if ( href.indexOf( '//' ) === -1 ) {
          parts = href.split( '?' );
          props.router.navigateTo( {
            pathname: parts[0],
            search: parts[1]
          }, title );
          ev.preventDefault();
        } else if ( allowForeignProjects ){
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
    var props = this.props;
    var search = (<SearchForm msg={this.props.msg}
      onClickSearch={this.onClickSearch} />);

    var navigationClasses = this.state.isMenuOpen ?
      'primary-navigation-enabled navigation-enabled' : '';

    // FIXME: link should point to Special:MobileMenu
    var icon = <Icon glyph="mainmenu" label="Home"
      id="mw-mf-main-menu-button"
      href="#"
      onClick={this.openPrimaryNav}/>;
    var shield = this.state.isMenuOpen ? <TransparentShield /> : null;

    var toast, secondaryIcon,
      isRTL = this.state.isRTL,
      overlay = this.state.isOverlayEnabled ? this.state.overlay : null;

    if ( overlay ) {
      navigationClasses += this.state.isOverlayFullScreen ? 'overlay-enabled' : '';
    }

    if ( this.state.notification ) {
     toast = <Toast>{this.state.notification}</Toast>;
    }

    if ( this.state.session ) {
      secondaryIcon = <Icon glyph="notifications"
        onClick={this.onClickInternalLink}
        href={'/' + this.props.language_project + '/Special:Notifications'}/>
    }

    return (
      <div id="mw-mf-viewport" className={navigationClasses}
        lang={this.props.lang} dir={isRTL ? 'rtl' : 'ltr'}>
        <nav id="mw-mf-page-left">
        <MainMenu {...this.props} onClickInternalLink={this.onClickInternalLink} onLogoutClick={this.clearSession}
            onLoginClick={this.clearSession}
            onItemClick={this.closePrimaryNav} session={this.state.session}/>
        </nav>
        <div id="mw-mf-page-center" onClick={this.closePrimaryNav}>
          <ChromeHeader {...props} primaryIcon={icon} search={search} secondaryIcon={secondaryIcon}/>
          {this.state.children}
          {shield}
        </div>
        { overlay }
        { toast }
      </div>
    )
  }
} );
