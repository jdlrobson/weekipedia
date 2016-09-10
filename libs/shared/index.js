import React from 'react'
import messages, { msg } from 'mediawiki-messages'

import App from './../client/containers/App'

import router from './router.js'
import commonRoutes from './routes.js'

var globalProps;

function init( config, routes ) {
  routes = routes || [];

  // merge common and global routes
  routes = commonRoutes.concat( routes );

  // add home page route to end so it gets added last.
  routes.push(
    [
      // Home page / Hot
      /^\/?$/,
      function( info, props ) {
        return router.matchRoute( props.siteinfo.home, '#', props )
      }
    ],
    [
      /^\/([a-z\-]*)\/wiki\/Category(\%3A|:)(.*)|^\/wiki\/Category(\%3A|:)(.*)$/,
      function ( info, props ) {
        var lang = info[1] || 'en';
        var params = info[5] || info[3] || '';
        var newPath = '/' + lang + '/wiki/Special:Categories/' + params;

        return router.matchRoute( newPath, '', props );
      }
    ]
  );

  // load messages
  messages.load( config.i18n || {} );

  // register all the routes
  routes.forEach( function ( args ) {
    router.addRoute.apply( router, args );
  } );

  // register global config
  globalProps = Object.assign( {}, config, {
    msg: msg,
    router: router,
    messages: messages
  } );
}

function render( path, hash, props ) {
  props = props || {};
  hash = hash || '#';

  return React.createElement( App,
    router.matchRoute( path, hash, Object.assign( {}, globalProps, props ) )
  )
}

export default {
  router: router,
  init: init,
  render: render
};
