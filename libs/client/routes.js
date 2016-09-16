import React from 'react'

import Categories from './pages/Categories'
import Collections from './pages/Collections'
import Contributions from './pages/Contributions'
import History from './pages/History'
import Feed from './pages/Feed'
import Page from './pages/Page'
import SpecialPage from './pages/SpecialPage'
import MobileDiff from './pages/MobileDiff'
import MostRead from './pages/MostRead'
import Random from './pages/Random'
import Nearby from './pages/Nearby'
import Watchlist from './pages/Watchlist'
import UserLogin from './pages/UserLogin'

import utils from './utils'

var routes = [
  // View a page
  [
    /^\/([a-z\-]*)\/wiki\/(.*)|^\/wiki\/(.*)/,
    function ( info, props ) {
      var title = info[2] || info[3],
        titleDecoded = decodeURIComponent( title ),
        titleSansPrefix = titleDecoded.substr( titleDecoded.indexOf( ':' ) + 1 ),
        titleParts = titleSansPrefix.split( '/' ),
        lang = info[1] || 'en';

      props.lang = lang;
      titleSansPrefix = titleParts[0];
      props.mobileUrl = utils.getAbsoluteUrl( title, lang, 'm.' + props.project + '.org' );
      props.desktopUrl = utils.getAbsoluteUrl( title, lang, props.project + '.org' );

      // FIXME: i18n
      if ( title.indexOf( 'Special:' ) === 0 ) {
        props.children = [
          React.createElement( SpecialPage,
            Object.assign( {}, props, {
              key: 'page-' + titleSansPrefix,
              title: titleSansPrefix,
              params: titleParts.slice( 1 )
            } )
          )
        ];
      } else {
        props.title = titleDecoded;
        props.fallback = '/api/page/' + lang + '/' + title;
        props.children = [
          React.createElement( Page,
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
  routes.push( [
    new RegExp( '^\/([a-z\-]*)\/wiki\/Special:' + title + '\/?(.*)|^\/wiki\/Special:' + title + '\/?(.*)$' ),
    function ( info, props ) {
      var lang = info[1] || 'en';

      props.lang = lang;
      props.mobileUrl = utils.getAbsoluteUrl( 'Special:' + title, lang, 'm.' + props.project + '.org' );
      props.desktopUrl = utils.getAbsoluteUrl( 'Special:' + title, lang, props.project + '.org' );
      props.children = [
        React.createElement( Class,
          Object.assign( {}, props, {
            title: title,
            key: 'page-special-' + title,
            params: info[3] || info[2],
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
  addSpecialPage( 'MostRead', MostRead );
  addSpecialPage( 'Random', Random );
  addSpecialPage( 'Nearby', Nearby );
  addSpecialPage( 'UserLogin', UserLogin );
  addSpecialPage( 'Collections', Collections );
}

initSpecialPages();

export default routes;
