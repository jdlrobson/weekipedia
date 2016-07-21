var fetch = require( 'isomorphic-fetch' );
function Api() {}

Api.prototype = {
  getPage: function ( title, lang ) {
    lang = lang || 'en';
    return fetch( '/api/page/' + lang + '/' + title ).then( function ( resp ) {
      if ( resp.status === 200 ) {
        return resp.json();
      } else {
        throw Error(response.statusText);
      }
    } );
  },
  fetch: function ( path ) {
    return fetch( path ).then( function ( resp ) {
      if ( resp.status === 200 ) {
        return resp.json();
      } else {
        throw Error(response.statusText);
      }
    } );
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
