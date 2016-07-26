var fetch = require( 'isomorphic-fetch' );
function Api() {
  this.cache = {};
}

Api.prototype = {
  fetch: function ( url ) {
    var promise,
      cache = this.cache;

    if ( cache[url] ) {
      return cache[url];
    } else {
      promise = fetch( url ).then( function ( resp ) {
        if ( resp.status === 200 ) {
          cache[url] = promise;
          return resp.json();
        } else {
          throw Error( response.statusText );
        }
      } );
      return promise;
    }
  },
  getPage: function ( title, lang ) {
    lang = lang || 'en';
    return this.fetch( '/api/page/' + lang + '/' + title );
  },
  getTrending: function ( wiki, halflife ) {
    var url = '/api/trending/';
    if ( wiki ) {
      url += wiki;
    }
    if ( halflife ) {
      url += '/' + halflife;
    }
    return this.fetch( url ).then( function ( json ) {
      return json.results;
    } );
  }
};

export default new Api();
