import React from 'react'
import ReactDOM from 'react-dom'
import { Icon, SearchForm } from 'wikipedia-react-components';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import './styles.less'
import './icons.less'

import MainMenu from './../MainMenu'
import TransparentShield from './../TransparentShield'
import ChromeHeader from './../ChromeHeader'

import ReferenceDrawer from './../../overlays/ReferenceDrawer'
import Toast from './../../overlays/Toast'

import initOffline from './../../offline'

import SVGFilter from './SVGFilter.jsx'

const passPropsToChildren = ( children, propsToSend ) => {
  return React.Children.map( children, ( child ) => React.cloneElement( child, propsToSend ) );
};

// Main component
class App extends React.Component {
  constructor(props){
    super(props);
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
  clearSession() {
    this.props.store.clearSession( this.props.storage );
  }
  renderCurrentRoute() {
    var store = this.props.store;
    var path = window.location.pathname;
    var hash = window.location.hash;
    var route = this.props.router.matchRoute( path, hash,
      Object.assign( {}, this.props ) );

    if ( route.overlay ) {
      store.showOverlay( route.overlay );
    } else {
      store.setPage( route.title, route.language, route.children[0] );
    }
  }
  componentDidMount() {
    var showNotification = this.showNotification;
    var props = this.props;
    var msg = this.props.msg;
    var state = props.store;
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

    state.setLanguage( props.lang );
    state.loadSession( props.api, props.storage );
  }
  showOverlay( overlay ) {
    this.props.store.showOverlay( overlay );
  }
  onClickInternalLink( ev ) {
    var href, parts, match, refId, title, path;
    var link = ev.currentTarget;
    var childNode = link.firstChild;
    var parentNode = link.parentNode;
    var props = this.props;
    var state = this.props.store;
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
    this.props.store.hideOverlays();
  }
  closePrimaryNav() {
    this.props.store.closeMainMenu();
  }
  openPrimaryNav( ev ){
    this.props.store.openMainMenu();
    ev.preventDefault();
    ev.stopPropagation();
  }
  showNotification( msg ) {
    this.props.store.setUserNotification( msg );
  }
  onClickSearch(ev){
    this.props.router.navigateTo( '#/search' );
    ev.stopPropagation();
  }
  getLocalUrl( title, params ) {
    var source = this.props.language_project || this.props.lang + '/wiki';
    title = title ? encodeURIComponent( title ).replace( '%3A', ':' ) : '';
    params = params ? '/' + encodeURIComponent( params ).replace( /%2F/g, '/' ) : '';

    return '/' + source + '/' + title + params;
  }
  render(){
    var props = this.props;
    var state = props.store;
    var isCurrentPageRTL = state.isRTL;
    var actionClickSearch = this.onClickSearch.bind(this);
    var actionOpenPrimaryNav = this.openPrimaryNav.bind(this);
    var actionClosePrimaryNav = this.closePrimaryNav.bind(this);
    var actionClickLink = this.onClickInternalLink.bind(this);
    var actionOnUpdateLoginStatus = this.clearSession.bind(this);
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
      isRTL: isCurrentPageRTL,
      session: state.session,
      onClickInternalLink: actionClickLink
    } : {};
    if ( state.pageviews === 0 ) {
      Object.assign( childProps, props.fallbackProps || {} );
    }
    
    var search = (<SearchForm key="chrome-search-form"
      placeholder={props.msg( 'search' )}
      language_project={props.language_project}
      onClickSearch={actionClickSearch} />);

    var navigationClasses = this.props.store.isMenuOpen ?
      'primary-navigation-enabled navigation-enabled' : '';

    // FIXME: link should point to Special:MobileMenu
    var icon = <Icon glyph="mainmenu" label="Home"
      id="mw-mf-main-menu-button"
      href={this.getLocalUrl( 'Special:MobileMenu' )}
      onClick={actionOpenPrimaryNav}/>;
    var shield = this.props.store.isMenuOpen ? <TransparentShield /> : null;

    var toast, secondaryIcon,
      overlay = state.isOverlayEnabled ? state.overlay : null;

    if ( overlay ) {
      navigationClasses += state.isOverlayFullScreen ? 'overlay-enabled' : '';
    }

    if ( state.notification ) {
     toast = <Toast>{state.notification}</Toast>;
    }

    if ( state.session ) {
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
    var page = state.page ? [
      state.page
    ] : props.children;

    return (
      <div id="mw-mf-viewport" className={navigationClasses}
        lang={this.props.lang} dir={isCurrentPageRTL ? 'rtl' : 'ltr'}>
        <nav id="mw-mf-page-left">
        <MainMenu {...this.props} onClickInternalLink={actionClickLink}
            onLogoutClick={actionOnUpdateLoginStatus}
            onLoginClick={actionOnUpdateLoginStatus}
            onItemClick={actionClosePrimaryNav} session={state.session}/>
        </nav>
        <div id="mw-mf-page-center" onClick={actionClosePrimaryNav}>
          <ChromeHeader {...props} primaryIcon={icon}
            includeSiteBranding={true}
            search={search} secondaryIcon={secondaryIcon}/>
          {
            state.devTools && (<DevTools />)
          }
          {passPropsToChildren( page, childProps )}
          {shield}
        </div>
        { overlay }
        { toast }
        <SVGFilter />
      </div>
    )
  }
};

App.defaultProps = {
  lang: 'en',
  isOverlayFullScreen: true,
  isOverlayEnabled: false
};

export default observer(App);
