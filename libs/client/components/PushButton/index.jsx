import React, { Component } from 'react'

import Button from './../../components/Button';

import './styles.css'

function getSubscriptionId( subscription ) {
  var provider = getPushProvider( subscription.endpoint );
  if ( provider === 'firefox' ) {
    return subscription.endpoint.split( 'https://updates.push.services.mozilla.com/push/' )[1];
  } else {
    return subscription.endpoint.split( 'https://android.googleapis.com/gcm/send/' )[1];
  }
}

function getPushProvider( endpoint ) {
  if ( endpoint.indexOf( 'https://android.googleapis.com/gcm/send/' ) > -1 ) {
    return 'google';
  } else if ( endpoint.indexOf( 'https://updates.push.services.mozilla.com' ) > -1 ) {
    return 'firefox';
  } else {
    throw 'unknown provider ' + endpoint;
  }
}

// Pages
export default React.createClass({
  getInitialState() {
    return {
      serviceWorkerRegistration: null,
      subscription: null,
      isLoading: true,
      isSupported: true,
      isError: false,
      isBlocked: false,
      isEnabled: null
    };
  },
  getDefaultProps() {
    return {
      api: null,
      serviceName: 'trending',
      serviceWorker: '/push-bundle.js'
    };
  },
  load( serviceWorkerPath ) {
    var self = this;
    window.addEventListener( 'load', function () {
      var serviceWorkerSupport = 'serviceWorker' in navigator,
        pushManagerSupport = 'PushManager' in window,
        notificationSupport = serviceWorkerSupport && 'showNotification' in ServiceWorkerRegistration.prototype;

      // Check that service workers are supported, if so, progressively
      // enhance and add push messaging support, otherwise continue without it.
      if ( serviceWorkerSupport && pushManagerSupport && notificationSupport ) {
        if ( Notification.permission === 'denied' ) {
          self.setState( { isError: true, isBlocked: true } );
        } else {
          navigator.serviceWorker.register( serviceWorkerPath ).then( function ( serviceWorkerRegistration ) {
            // Work out whether enabled or not.
            self.setState( { serviceWorkerRegistration: serviceWorkerRegistration } );
            serviceWorkerRegistration.pushManager.getSubscription().then( function ( subscription ) {
              self.setState( { isEnabled: subscription ? true : false, isLoading: false, subscription: subscription } );
            } );
          } );
        }
      } else {
        self.setState( { isError: true } );
      }
      } );

  },
  doAction( action ) {
    var self = this;
    var subscription = this.state.subscription;
    var id = getSubscriptionId( subscription );
    var provider = getPushProvider( subscription.endpoint );
    this.props.api.post( '/api/web-push/' + action, {
      token: id,
      browser: provider,
      feature: this.props.serviceName
    } ).then( function () {
      self.setState( { isLoading: false, isEnabled: action === 'subscribe' } );
    } ).catch( function ( e ) {
      self.setState( { isError: true } );
    } );
  },
  toggle() {
    var self = this;

    this.setState( { isLoading: true } );
    if ( this.state.isEnabled ) {
      this.state.subscription.unsubscribe().then( function ( success ) {
        if ( success ) {
          self.doAction( 'unsubscribe' );
        }
      } );
    } else {
      this.state.serviceWorkerRegistration.pushManager.subscribe( {
        userVisibleOnly: true
      } ).then( function ( subscription ) {
        self.setState( { subscription: subscription } );
      } ).then( function () {
        self.doAction( 'subscribe' );
      } ).catch( function ( e ) {
        self.setState( { isError: true, isBlocked: Notification.permission === 'denied' } );
      } );
    }
  },
  componentDidMount() {
    if ( !this.props.serviceWorker ) {
      this.setState( { isError: true } );
    } else {
      this.load( this.props.serviceWorker );
    }
  },
  render(){
    var label, onClick;
    if ( !this.state.isError ) {
      label = this.state.isEnabled ? 'Disable push notifications' : 'Enable push notifications';
      onClick = this.toggle;
    } else {
      label = this.state.isBlocked ? 'Please enable push notifications.' : 'Not supported.';
    }

    return (
      <Button className="push-button" onClick={onClick} label={label}></Button>
    )
  }
})

