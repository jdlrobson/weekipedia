import React from 'react'
import createReactClass from 'create-react-class'
import { Button, ErrorBox, Panel } from 'wikipedia-react-components';

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
export default createReactClass({
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
  loadServiceWorker( serviceWorkerPath ) {
    var self = this;
    navigator.serviceWorker.register( serviceWorkerPath ).then( function ( serviceWorkerRegistration ) {
      self.setState( { serviceWorkerRegistration: serviceWorkerRegistration } );
      serviceWorkerRegistration.pushManager.getSubscription().then( function ( subscription ) {
        self.setState( { isEnabled: subscription ? true : false, isLoading: false, subscription: subscription } );
      } );
    } );
  },
  load( serviceWorkerPath ) {
    var serviceWorkerSupport = 'serviceWorker' in navigator,
      pushManagerSupport = 'PushManager' in window,
      notificationSupport = serviceWorkerSupport && 'showNotification' in ServiceWorkerRegistration.prototype;

    // Check that service workers are supported, if so, progressively
    // enhance and add push messaging support, otherwise continue without it.
    if ( serviceWorkerSupport && pushManagerSupport && notificationSupport ) {
      if ( Notification.permission === 'denied' ) {
        this.setState( { isError: true, isBlocked: true } );
      } else {
        this.loadServiceWorker( serviceWorkerPath );
      }
    } else {
      this.setState( { isError: true } );
    }
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
    } ).catch( function () {
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
    } else if ( this.state.serviceWorkerRegistration ) {
      this.state.serviceWorkerRegistration.pushManager.subscribe( {
        userVisibleOnly: true
      } ).then( function ( subscription ) {
        self.setState( { subscription: subscription } );
      } ).then( function () {
        self.doAction( 'subscribe' );
      } ).catch( function () {
        self.setState( { isError: true, isBlocked: Notification.permission === 'denied' } );
      } );
    }
  },
  componentDidMount() {
    if ( !this.props.serviceWorker ) {
      this.setState( { isError: true } );
    } else {
      this.loadServiceWorker( this.props.serviceWorker );
    }
  },
  render(){
    var label, error, onClick,
      msg = this.state.isEnabled ? 'Bored of push notifications?'
        : 'Enable push notifications and receive trends as they happen.';
    if ( !this.state.isError ) {
      label = this.state.isEnabled ? 'Disable' : 'Enable';
      onClick = this.toggle;
    } else {
      error = this.state.isBlocked ? 'Please enable push notifications in your web browser.'
        : 'Your web browser does not support push notifications.';
    }

    return error ? <ErrorBox msg={error} /> : (
      <Panel>
        <p>{msg}</p>
        <Button className="push-button" onClick={onClick} label={label}></Button>
      </Panel>
    )
  }
})

