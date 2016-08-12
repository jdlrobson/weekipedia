import React from 'react'
import fetch from 'isomorphic-fetch'
import Card from './components/Card'

function Api() {
  this.cache = {};
  this.refCache = {};
}

Api.prototype = {
  post: function ( url, data ) {
    return fetch( url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( data )
    } );
  },
  fetchCards: function ( url, props ) {
    return this.fetch( url ).then( function ( data ) {
      var cards = [];
      if ( data.pages.length ) {
        data.pages.forEach( function ( item ) {
          item.key = item.pageid;
          cards.push( React.createElement( Card, Object.assign( {}, props, item ) ) );
        } );
        return cards;
      } else {
        return null;
      }
    } );
  },
  fetch: function ( url ) {
    var promise, req,
      cache = this.cache;

    if ( cache[url] ) {
      return cache[url];
    } else {
      req = new Request( url, {
        credentials: 'same-origin'
      } );
      promise = fetch( req ).then( function ( resp ) {
        if ( resp.status === 200 ) {
          cache[url] = promise;
          return resp.json();
        } else {
          throw Error( resp.statusText );
        }
      } );
      return promise;
    }
  },
  getPage: function ( title, lang ) {
    lang = lang || 'en';
    return this.fetch( '/api/page/' + lang + '/' + title );
  },
  getReference: function ( title, lang, refId ) {
    return this.getReferences( title, lang ).then( function ( refs ) {
      if ( refs[refId] ) {
        return refs[refId];
      } else {
        throw "No reference";
      }
    } );
  },
  getReferences: function ( title, lang ) {
    var promise;
    var reflist = {};
    var cache = this.refCache;
    var cacheKey = lang + '#' + title;

    if ( cache[ cacheKey ] ) {
      return cache[cacheKey];
    } else {
      promise = this.getPage( title, lang ).then( function ( json ) {
        var container = document.createElement( 'div' );

        json.remaining.sections.forEach( function ( section ) {
          var refNodes;
          // check it's a reference section
          if ( section.text.indexOf( 'class="mw-references' ) > -1 ) {
            container.innerHTML = section.text;
            refNodes = container.querySelectorAll( '[id]' );
            Array.prototype.forEach.call( refNodes, function ( refNode ) {
              var id = refNode.getAttribute( 'id' );
              if ( id ) {
                reflist[id] = refNode.innerHTML;
              }
            } );
          }
        } );
        return reflist;
      } );
      cache[cacheKey] = promise;
      return promise;
    }
  },
  getTrending: function ( wiki, halflife ) {
    var url = '/api/trending/' + wiki + '/' + halflife;

    return this.fetch( url ).then( function ( json ) {
      return json.results;
    } );
  }
};

export default new Api();
