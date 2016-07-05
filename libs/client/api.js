var fetch = require( 'isomorphic-fetch' );
function Api() {}

Api.prototype = {
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
