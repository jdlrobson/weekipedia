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

// Main component
class App extends React.Component {
  constructor(props){
   super(props);
   this.state = {
      pageviews: 0,
      isMenuOpen: false,
      notification: '',
      isRTL: false,
      lang: 'en',
      session: null,
      isOverlayFullScreen: true,
      isOverlayEnabled: false
    };
  }
  hijackLinks( container ){
    container = container || ReactDOM.findDOMNode( this );

    var links = container.querySelectorAll( 'a' );
    var self = this;

    function navigateTo( ev ) {
      self.onClickInternalLink( ev );
    }

    container.setAttribute( 'data-hijacked-prev', 1 );
    Array.prototype.forEach.call( links, function ( link ) {
      link.addEventListener( 'click', navigateTo.bind( self ) );
    } );
  }
  mountOverlay( props ) {
    var state = state || {};
    var actionShowNotification = this.showNotification.bind( this );
    var actionCloseCurrentOverlay = this.closeOverlay.bind( this );

    this.setState( {
      overlay: props.overlay ? React.cloneElement( props.overlay, {
        showNotification: actionShowNotification,
        closeOverlay: actionCloseCurrentOverlay
      } ) : null,
      isOverlayEnabled: props.overlay,
      session: state.session,
      isOverlayFullScreen: props.isOverlayFullScreen
    } );
  }
  mountChildren( props, session ) {
    var actionShowNotification = this.showNotification.bind( this );
    var actionCloseCurrentOverlay = this.closeOverlay.bind( this );
    var actionShowOverlay = this.showOverlay.bind( this );
    var actionClickLink = this.onClickInternalLink.bind(this);

    // clone each child and pass them the notifier
    var childProps = typeof document !== 'undefined' ? {
      showNotification: actionShowNotification,
      showOverlay: actionShowOverlay,
      getLocalUrl: this.getLocalUrl.bind( this ),
      closeOverlay: actionCloseCurrentOverlay,
      hijackLinks: this.hijackLinks.bind( this ),
      isRTL: isRTL( props.lang ),
      session: session || this.state.session,
      onClickInternalLink: actionClickLink
    } : {};
    if ( this.state.pageviews === 0 ) {
      Object.assign( childProps, props.fallbackProps || {} );
    }

    var children = React.Children.map( props.children, ( child ) => React.cloneElement( child, childProps ) );
    this.setState( { children: children, pageviews: this.state.pageviews + 1 } );
  }
  mountLanguage( props ) {
    var newStylesheet,
      self = this,
      pageIsRtl = this.state && this.state.isRTL,
      curLang = this.state && this.state.lang,
      newLang = props.uselang || props.lang,
      rtl = isRTL( newLang ),
      stylesheet = document.querySelector( 'link[href="/style.rtl.css"]' );

    function addStylesheet( newPath ) {
      newStylesheet = document.createElement( 'link' )
      newStylesheet.setAttribute( 'rel', 'stylesheet' );
      newStylesheet.setAttribute( 'href', newPath );
      document.body.appendChild( newStylesheet );
    }

    if ( rtl && !pageIsRtl && !stylesheet ) {
      addStylesheet( '/style.rtl.css' );
    } else if ( !rtl && pageIsRtl && stylesheet ) {
      stylesheet.parentNode.removeChild( stylesheet );
    }

    this.setState( { isRTL: rtl } );
    if ( newLang !== curLang ) {
      props.api.fetch( '/api/messages/' + newLang ).then( function ( msgs ) {
        props.messages.load( msgs );
        self.setState( { lang: newLang } );
      } );
    }
  }
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
  }
  mount( props ) {
    var state = this.state || {};

    if ( typeof document !== 'undefined' ) {
      this.mountLanguage( props );
      this.mountOverlay( props );
      // set the title to the title as specified in the props
      this.setState( { title: props.title } );

      var localSession = this.getLocalSession();
      if ( !state.session ) {
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
  }
  componentWillReceiveProps( nextProps ) {
    this.mount( nextProps );
  }
  componentWillMount() {
    this.mount( this.props );
  }
  login() {
    var self = this;
    if ( !this._loginRequest ) {
      this._loginRequest = this.props.api.fetch( '/auth/whoamithistime', {
        credentials: 'include'
      } );
    }
    return this._loginRequest.then( function ( session ) {
      // cache for next session
      session.timestamp = new Date();
      self.props.storage.set( APP_SESSION_KEY, JSON.stringify( session ) );
      self.setState( { session: session } );
    } ).catch( function () {
      self.props.storage.set( APP_SESSION_KEY, 'false' );
      self.setState( { session: null } );
    } );
  }
  clearSession() {
    this.props.storage.remove( APP_SESSION_KEY );
  }
  renderCurrentRoute() {
    var path = window.location.pathname;
    var hash = window.location.hash;
    var route = this.props.router.matchRoute( path, hash,
      Object.assign( {}, this.props ) );
    this.mount( route );
  }
  componentDidMount() {
    var showNotification = this.showNotification;
    var props = this.props;
    var msg = this.props.msg;
    var renderCurrentRoute = this.renderCurrentRoute.bind( this )
    if ( this.props.offlineVersion ) {
      initOffline( function () {
        showNotification( msg( 'offline-ready' ) );
      } );
    }
    if ( 'onpopstate' in window ) {
      window.onpopstate = renderCurrentRoute;
      props.router.on( 'onpushstate', renderCurrentRoute );
      props.router.on( 'onreplacestate', renderCurrentRoute );
    }
  }
  showOverlay( overlay ) {
    this.setState( {
      overlay: overlay,
      isOverlayEnabled: true,
      isOverlayFullScreen: false
    } );
  }
  onClickInternalLink( ev ) {
    var href, parts, match, refId, title, path;
    var link = ev.currentTarget;
    var childNode = link.firstChild;
    var parentNode = link.parentNode;
    var props = this.props;
    var state = this.state;
    var allowForeignProjects = props.siteoptions.allowForeignProjects;

    if ( parentNode.className === 'mw-ref' ) {
      ev.preventDefault();
      ev.stopPropagation();
      refId = link.getAttribute( 'href' ).split( '#' )[1];
      this.showOverlay( <ReferenceDrawer {...props} title={state.title}
        refId={refId} hijackLinks={this.hijackLinks.bind(this)} /> );

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
  }
  closeOverlay() {
    // If an overlay is open
    if ( this.state.isOverlayEnabled ) {
      this.setState( { isOverlayEnabled: false } );
      if ( window.location.hash && window.location.hash !== '#' ) {
        window.location.hash = '#';
      }
    }
    this.setState( { notification: null } );
  }
  closePrimaryNav(){
    this.setState({ isMenuOpen: false });
    this.closeOverlay();
  }
  openPrimaryNav( ev ){
    this.setState({ isMenuOpen: true });
    this.closeOverlay();
    ev.preventDefault();
    ev.stopPropagation();
  }
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
  }
  onClickSearch(){
    this.props.router.navigateTo( '#/search' );
  }
  getLocalUrl( title, params ) {
    var source = this.props.language_project || this.props.lang + '/wiki';
    title = title ? encodeURIComponent( title ).replace( '%3A', ':' ) : '';
    params = params ? '/' + encodeURIComponent( params ).replace( /%2F/g, '/' ) : '';

    return '/' + source + '/' + title + params;
  }
  render(){
    var props = this.props;
    var actionClickSearch = this.onClickSearch.bind(this);
    var actionOpenPrimaryNav = this.openPrimaryNav.bind(this);
    var actionClosePrimaryNav = this.closePrimaryNav.bind(this);
    var actionClickLink = this.onClickInternalLink.bind(this);
    var actionOnUpdateLoginStatus = this.clearSession.bind(this);
    
    var search = (<SearchForm key="chrome-search-form"
      placeholder={props.msg( 'search' )}
      language_project={props.language_project}
      onClickSearch={actionClickSearch} />);

    var navigationClasses = this.state.isMenuOpen ?
      'primary-navigation-enabled navigation-enabled' : '';

    // FIXME: link should point to Special:MobileMenu
    var icon = <Icon glyph="mainmenu" label="Home"
      id="mw-mf-main-menu-button"
      href={this.getLocalUrl( 'Special:MobileMenu' )}
      onClick={actionOpenPrimaryNav}/>;
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
        onClick={actionClickLink}
        href={'/' + this.props.language_project + '/Special:Notifications'}/>
    }

    if ( props.showMenuNoJavaScript ) {
      navigationClasses += ' navigation-full-screen';
    }

    secondaryIcon = [
      <Icon glyph="search" onClick={actionClickSearch}/>,
      secondaryIcon
    ];

    return (
      <div id="mw-mf-viewport" className={navigationClasses}
        lang={this.props.lang} dir={isRTL ? 'rtl' : 'ltr'}>
        <nav id="mw-mf-page-left">
        <MainMenu {...this.props} onClickInternalLink={actionClickLink}
            onLogoutClick={actionOnUpdateLoginStatus}
            onLoginClick={actionOnUpdateLoginStatus}
            onItemClick={actionClosePrimaryNav} session={this.state.session}/>
        </nav>
        <div id="mw-mf-page-center" onClick={actionClosePrimaryNav}>
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
};

App.defaultProps = {
  lang: 'en',
  isOverlayFullScreen: true,
  isOverlayEnabled: false
};
export default App;
  