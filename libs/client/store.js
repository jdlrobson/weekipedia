import React from 'react'
import { observable } from 'mobx';

import isRTL from './is-rtl'

const APP_SESSION_KEY = 'app-session'

const store = observable({
  devTools: true,
  pageviews: 0,
  page: null,
  isMenuOpen: false,
  notification: '',
  isRTL: false,
  lang: 'en',
  session: null,
  isOverlayFullScreen: true,
  isOverlayEnabled: false
});

store.showOverlay = function ( overlay, fullScreen = true ) {
  // In future we won't do this as part of this method.
  this.overlay = React.cloneElement( overlay, {
    showNotification: store.setUserNotification.bind( this ),
    closeOverlay: store.hideOverlays.bind( this )
  } );
  this.isOverlayEnabled = true;
  this.isOverlayFullScreen = fullScreen;
};

store.clearUserNotification = function () {
  this.notification = null;
};

store.setUserNotification = function ( msg ) {
  var self = this;
  this.notification = msg;
  if ( msg ) {
    clearTimeout( this.pendingToast );
    this.pendingToast = setTimeout( function () {
      self.setUserNotification( null );
    }, 5000 );
  }
};

store.closeMainMenu = function () {
  this.isMenuOpen = false;
  this.hideOverlays();
};

store.openMainMenu = function () {
  this.isMenuOpen = true;
  this.hideOverlays();
};

store.hideOverlays = function () {
  if ( this.isOverlayEnabled ) {
    this.isOverlayEnabled = false;
    if ( window.location.hash && window.location.hash !== '#' ) {
      window.location.hash = '#';
    }
  }
  this.setUserNotification( null );
};

function getLocalSession( storage ) {
  var localSession = storage.get( APP_SESSION_KEY );
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

store.clearSession = function ( storage ) {
  this.session = null;
  storage.remove( APP_SESSION_KEY );
}

store.loadSession = function ( api, storage ) {
  var session = getLocalSession( storage );
  if ( this.session === undefined && session ) {
    this.session = session;
  } else {
    this.login( api, storage );
  }
};

store.setLanguage = function ( langCode ) {
  this.lang = langCode;
  this.isRTL = isRTL( langCode );
};

store.setPage = function ( title, langCode, page ) {
  this.hideOverlays();
  this.title = title;
  this.setLanguage( langCode );
  this.page = page;
  this.pageviews++;
};

store.login = function (api, storage) {
  var self = this;
  if ( !this._loginRequest ) {
    this._loginRequest = api.fetch( '/auth/whoamithistime', {
      credentials: 'include'
    } );
  }
  return this._loginRequest.then( function ( session ) {
    // cache for next session
    session.timestamp = new Date();
    storage.set( APP_SESSION_KEY, JSON.stringify( session ) );
    self.session = session;
  } ).catch( function () {
    storage.set( APP_SESSION_KEY, 'false' );
    self.session = null;
  } );
};

export default store;
