import React from 'react'
import messages, { msg } from 'mediawiki-messages'

import App from './../client/components/App'

import router from './router.js'
import sharedRoutes from './routes.js'

var globalProps;

function init( config, routes ) {
  routes = routes || [];

  // merge common and global routes
  routes = sharedRoutes.concat( routes );

  // add home page route to end so it gets added last.
  routes.push(
    [
      // Home page / Hot
      /^\/?$/,
      function ( info, props, query ) {
        return router.matchRoute( props.siteinfo.home, '#', props, query )
      }
    ],
    [
      /^\/([a-z\-]*)\/wiki\/Category(\%3A|:)(.*)|^\/.*\/Category(\%3A|:)(.*)$/,
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

function render( path, hash, props, query ) {
  props = props || {};
  hash = hash || '#';

  var newProps = Object.assign( {}, globalProps, props );
  delete newProps.children;
  newProps.key = path + '_' + hash;
  return React.createElement( App,
    router.matchRoute( path, hash, newProps, query )
  )
}

export default {
  router: router,
  init: init,
  render: render
};
