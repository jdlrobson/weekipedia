import React from 'react'

import Categories from './../client/pages/Categories'
import Collections from './../client/pages/Collections'
import Contributions from './../client/pages/Contributions'
import History from './../client/pages/History'
import Feed from './../client/pages/Feed'
import Page from './../client/pages/Page'
import PageInfo from './../client/pages/PageInfo'
import SpecialPage from './../client/pages/SpecialPage'
import MobileDiff from './../client/pages/MobileDiff'
import MobileMenu from './../client/pages/MobileMenu'
import MobileOptions from './../client/pages/MobileOptions'
import MostRead from './../client/pages/MostRead'
import Random from './../client/pages/Random'
import Search from './../client/pages/Search'
import Nearby from './../client/pages/Nearby'
import Watchlist from './../client/pages/Watchlist'
import UserLogin from './../client/pages/UserLogin'
import Uploads from './../client/pages/Uploads'

import utils from './utils'

var routes = [
  // View a page
  [
    // regex 1: /:lang/wiki/:title [1, 2]
    // regex 2: /wiki/:title [3]
    // regex3: /:lang.:project/:title [4,5,6]
    /^\/([a-z\-]*)\/wiki\/(.*)|^\/wiki\/(.*)|^\/(.*)\.([^\/]*)\/(.*)/,
    function ( info, props ) {
      var View,
        title = info[2] || info[3] || info[6],
        titleDecoded = decodeURIComponent( title ),
        titleSansPrefix = titleDecoded.substr( titleDecoded.indexOf( ':' ) + 1 ),
        titleParts = titleSansPrefix.split( '/' ),
        project = info[5],
        action = props.query && props.query.action || 'view',
        lang = info[1] || info[4] || 'en',
        articleSource = project ? lang + '.' + project : lang;

      props.lang = lang;
      titleSansPrefix = titleParts[0];
      props.project = project || props.project;
      props.language_project = lang + '.' + props.project;
      props.mobileUrl = utils.getAbsoluteUrl( title, lang, 'm.' + props.project + '.org' );
      props.desktopUrl = utils.getAbsoluteUrl( title, lang, props.project + '.org' );

      // FIXME: i18n
      if ( title.indexOf( 'Special:' ) === 0 ) {
        props.children = [
          React.createElement( SpecialPage,
            Object.assign( {}, props, {
              key: 'page-' + titleSansPrefix,
              title: titleSansPrefix,
              params: decodeURIComponent( titleParts.slice( 1 ) )
            } )
          )
        ];
      } else {
        if ( action === 'info' ) {
          View = PageInfo;
        } else {
          View = Page;
        }
        props.title = titleDecoded;
        props.fallback = '/api/page/' + articleSource + '/' + title;
        props.children = [
          React.createElement( View,
            Object.assign( {}, props, {
              key: 'page-' + title,
              titleSansPrefix: titleSansPrefix,
              title: titleDecoded
            } )
          )
        ];
      }
      return props;
    }
  ]
];

function addSpecialPage( title, Class, handler ) {
  var regex = [
    // regex 1: /:lang/wiki/Special\::title [1, 2]
    '^\/([a-z\-]*)\/wiki\/Special:' + title + '\/?(.*)',
    // regex 2: /wiki/Special\::title [3]
    '^\/wiki\/Special:' + title + '\/?(.*)$',
    // // regex3: /:lang.:project/:title [4,5,6]
    '^\/([^\.]*)\.(.*)\/Special:' + title + '\/?(.*)$'
  ];
  routes.push( [
    new RegExp( regex.join( '|' ) ),
    function ( info, props ) {
      var lang = info[1] || info[4] || 'en';
      var project = info[5];
      var params = info[3] || info[2] || info[6];
      var suffix = params ? '/' + params : '';

      props.project = project || props.project;
      props.language_project = lang + '.' + props.project;

      props.lang = lang;
      props.mobileUrl = utils.getAbsoluteUrl( 'Special:' + title + suffix, lang, 'm.' + props.project + '.org' );
      props.desktopUrl = utils.getAbsoluteUrl( 'Special:' + title + suffix, lang, props.project + '.org' );
      props.children = [
        React.createElement( Class,
          Object.assign( {}, props, {
            title: title,
            key: 'page-special-' + title,
            params: params ? decodeURIComponent( params ).replace( /%2F/gi, '/' ) : params,
            children: []
          } )
        )
      ];

      return handler ? handler( info, props ) : props;
    }
  ] );
}

function initSpecialPages() {
  addSpecialPage( 'Categories', Categories );
  addSpecialPage( 'Feed', Feed );
  addSpecialPage( 'History', History );
  addSpecialPage( 'RecentChanges', Contributions );
  addSpecialPage( 'Contributions', Contributions );
  addSpecialPage( 'Watchlist', Watchlist );
  addSpecialPage( 'EditWatchlist', Watchlist );
  addSpecialPage( 'MobileDiff', MobileDiff );
  addSpecialPage( 'MobileOptions', MobileOptions );
  addSpecialPage( 'MostRead', MostRead );
  addSpecialPage( 'Random', Random );
  addSpecialPage( 'Search', Search );
  addSpecialPage( 'MobileMenu', MobileMenu, function ( info, props ) {
    props.showMenuNoJavaScript = true;
    return props;
  } );
  addSpecialPage( 'Nearby', Nearby );
  addSpecialPage( 'UserLogin', UserLogin );
  addSpecialPage( 'Collections', Collections );
  addSpecialPage( 'Uploads', Uploads );
}

initSpecialPages();

export default routes;
