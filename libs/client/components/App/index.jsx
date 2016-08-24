import React from 'react'
import ReactDOM from 'react-dom'
import { Icon, SearchForm } from 'wikipedia-react-components'

import './styles.less'
import './icons.less'

import MainMenu from './../MainMenu'
import TransparentShield from './../TransparentShield'
import ChromeHeader from './../ChromeHeader'

import ReferenceDrawer from './../../overlays/ReferenceDrawer'
import Toast from './../../overlays/Toast'

import isRTL from './../../is-rtl'
import initOffline from './../../offline'

const APP_SESSION_KEY = 'app-session'

var globalSession;

// Main component
export default React.createClass({
  getInitialState() {
    return {
      pageviews: 0,
      isMenuOpen: false,
      notification: '',
      checkedLoginStatus: false,
      offlineEnabled: false,
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
      getLocalUrl: this.getLocalUrl,
      closeOverlay: this.closeOverlay,
      hijackLinks: this.hijackLinks,
      isRTL: isRTL( props.lang ),
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
      newLang = props.uselang || props.lang,
      rtl = isRTL( newLang ),
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
      if ( ( new Date() - new Date( localSession.timestamp ) ) / 1000 > 60 * 60 ) {
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
    if ( !globalSession ) {
      globalSession = this.props.api.fetch( '/auth/whoamithistime', {
          credentials: 'include'
      } );
    }
    return globalSession.then( function ( session ) {
      // cache for next session
      session.timestamp = new Date();
      self.props.storage.set( APP_SESSION_KEY, JSON.stringify( session ) );
      self.setState( { session: session } );
    } ).catch( function () {
      self.props.storage.set( APP_SESSION_KEY, 'false' );
      self.setState( { session: false } );
    } );
  },
  clearSession() {
    this.props.storage.remove( APP_SESSION_KEY );
  },
  renderCurrentRoute() {
    var path = window.location.pathname;
    var hash = window.location.hash;
    var route = this.props.router.matchRoute( path, hash,
      Object.assign( {}, this.props ) );
    this.mount( route );
  },
  componentDidMount() {
    var showNotification = this.showNotification;
    var props = this.props;
    var msg = this.props.msg;
    var self = this;

    if ( this.props.offlineVersion ) {
      initOffline( function ( updateFound ) {
        self.setState( { offlineEnabled: true } );
        if ( updateFound ) {
          showNotification( msg( 'offline-ready' ) );
        }
      } );
    }
    if ( 'onpopstate' in window ) {
      window.onpopstate = this.renderCurrentRoute;
      props.router.on( 'onpushstate', this.renderCurrentRoute );
      props.router.on( 'onreplacestate', this.renderCurrentRoute );
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
    var href, parts, match, refId, title, path;
    var link = ev.currentTarget;
    var childNode = link.firstChild;
    var parentNode = link.parentNode;
    var props = this.props;
    var allowForeignProjects = props.siteoptions.allowForeignProjects;

    if ( parentNode.className === 'mw-ref' ) {
      ev.preventDefault();
      ev.stopPropagation();
      refId = link.getAttribute( 'href' ).split( '#' )[1];
      this.showOverlay( <ReferenceDrawer {...props} refId={refId} hijackLinks={this.hijackLinks} /> );

    } else if ( childNode && childNode.nodeName === 'IMG' ) {
      href = link.getAttribute( 'href' ) || '';
      match = href.match( /\.\/File\:(.*)|^File\:(.*)$/ );
      if ( match ) {
        ev.preventDefault();
        ev.stopPropagation();
        path = match[1] || match[2];
        props.router.navigateTo( { hash: '#/media/' + path } );
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
  getLocalUrl( title, params ) {
    var source = this.props.language_project || this.props.lang + '/wiki';
    title = title ? encodeURIComponent( title ).replace( '%3A', ':' ) : '';
    params = params ? '/' + encodeURIComponent( params ).replace( /%2F/g, '/' ) : '';

    return '/' + source + '/' + title + params;
  },
  render(){
    var props = this.props;
    var state = this.state;
    var session = this.state.session;
    var username = session ? session.username : '~your device';
    var search = (<SearchForm msg={this.props.msg}
      placeholder={props.msg( 'search' )}
      language_project={props.language_project}
      onClickSearch={this.onClickSearch} />);

    var navigationClasses = this.state.isMenuOpen ?
      'primary-navigation-enabled navigation-enabled' : '';

    // FIXME: link should point to Special:MobileMenu
    var icon = <Icon glyph="mainmenu" label="Home"
      id="mw-mf-main-menu-button"
      href={this.getLocalUrl( 'Special:MobileMenu' )}
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

    if ( state.offlineEnabled ) {
      secondaryIcon = <Icon glyph='offline' key="offline-icon"
        onClick={this.onClickInternalLink}
        href={'/' + props.language_project + '/Special:Collections/by/' + username + '/-1'}/>
    }

    if ( props.showMenuNoJavaScript ) {
      navigationClasses += ' navigation-full-screen';
    }

    secondaryIcon = [
      <Icon glyph="search" onClick={this.onClickSearch}/>,
      secondaryIcon
    ];

    return (
      <div id="mw-mf-viewport" className={navigationClasses}
        lang={this.props.lang} dir={isRTL ? 'rtl' : 'ltr'}>
        <nav id="mw-mf-page-left">
        <MainMenu {...this.props} onClickInternalLink={this.onClickInternalLink} onLogoutClick={this.clearSession}
            onLoginClick={this.clearSession}
            onItemClick={this.closePrimaryNav} session={this.state.session}/>
        </nav>
        <div id="mw-mf-page-center" onClick={this.closePrimaryNav}>
          <ChromeHeader {...props} primaryIcon={icon}
            includeSiteBranding={true}
            search={search} secondaryIcon={secondaryIcon}/>
          {this.state.children}
          {shield}
        </div>
        { overlay }
        { toast }
        <svg>
          <filter id="filter-normal-icon" colorInterpolationFilters="sRGB"
            x="0" y="0" height="100%" width="100%">
            <feColorMatrix type="matrix"
              values="0.33 0    0    0 0
                      0    0.35 0    0 0
                      0    0    0.36 0 0
                      0    0    0    1   0" />
          </filter>
          <filter id="filter-progressive-icon" colorInterpolationFilters="sRGB"
            x="0" y="0" height="100%" width="100%">
            <feColorMatrix type="matrix"
              values="0.2 0   0   0 0
                      0   0.4 0   0 0
                      0   0   0.8 0 0
                              0   0   0   1   0" />
          </filter>
        </svg>
      </div>
    )
  }
} );
