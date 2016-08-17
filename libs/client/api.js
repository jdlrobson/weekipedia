import React from 'react'
import fetch from 'isomorphic-fetch'

import CardList from './containers/CardList'

import PreviewCard from './components/PreviewCard'

function Api() {
  this.cache = {};
  this.refCache = {};
}

function getCards( data, props, CardClass ) {
  var cards = [];

  CardClass = CardClass || PreviewCard;

  if ( data.pages && data.pages.length ) {
    data.pages.forEach( function ( item, i ) {
      var id = item.revid || item.pageid || item.id;
      item.key = 'card-' + i + '-' + id;
      cards.push( React.createElement( CardClass, Object.assign( {}, props, item ) ) );
    } );
  }
  return cards;
}

Api.prototype = {
  post: function ( url, data ) {
    return fetch( url, {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( data )
    } );
  },
  fetchCardListProps: function ( url, props, CardClass ) {
    return this.fetch( url ).then( function ( data ) {
      var listprops = {
        endpoint: url,
        continue: data.continue,
        cards: getCards( data, props, CardClass )
      };
      return Object.assign( {}, props, listprops );
    } );
  },
  fetchCards: function ( url, props ) {
    return this.fetchCardListProps( url, props ).then( function ( props ) {
      return props.cards;
    } );
  },
  fetchCardList: function ( url, props, CardClass ) {
    props.CardClass = CardClass;
    return this.fetchCardListProps( url, props, CardClass ).then( function ( props ) {
      return React.createElement( CardList, props );
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
  }
};

export default new Api();
