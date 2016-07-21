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
  getTrending: function ( wiki, halflife ) {
    var url = '/api/trending/';
    if ( wiki ) {
      url += wiki;
    }
    if ( halflife ) {
      url += '/' + halflife;
    }
    return fetch( url ).then( function ( resp ) {
      if ( resp.status === 200 ) {
        return resp.json();
      } else {
        throw Error(response.statusText);
      }
    } ).then( function ( json ) {
      return json.results;
    } );
  }
};

export default new Api();
