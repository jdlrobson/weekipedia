import collections from './collection'

/**
 * @param {String} wiki name of wiki to generate a list of trending articles for
 */
function debug( wiki ) {
  var lang = wiki.replace( 'wiki', '' );
  var collection = collections[lang];

  return new Promise( function ( resolve, reject ) {
    if ( !collection ) {
      reject( 'Trending is disabled. A site admin should enable it via TREND_ENABLED.' );
    }
    resolve(
      collection.getPages().map( function ( page ) {
        return { title: page.title, trendiness: page.trendiness };
      } ).sort( function ( page, page2 ) {
        return page.trendiness < page2.trendiness ? -1 : 1;
      } )
    );
  } )
}

export default debug
