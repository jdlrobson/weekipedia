var fetch = require( 'isomorphic-fetch' );
function Api() {}

Api.prototype = {
  getPage: function ( title, lang ) {
    lang = lang || 'en';
    return fetch( '/api/' + lang + '/' + title ).then( function ( resp ) {
      return resp.json();
    } );
  },
  getTrending: function ( filter ) {
    var url = '/api/trending/';
    if ( filter ) {
      url += filter;
    }
    return fetch( url ).then( function ( resp ) {
      return resp.json();
    } ).then( function ( json ) {
      return json.results;
    } );
  }
};

export default new Api();
