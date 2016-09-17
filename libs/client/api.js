import fetch from 'isomorphic-fetch'

function Api() {
  this.cache = {};
  this.refCache = {};
}

const API_PATH = '/api/';

Api.prototype = {
  invalidatePath: function ( path ) {
    delete this.cache[path];
    if ( path[path.length - 1] === '/' ) {
      delete this.cache[path.substr(0, path.length -1)];
    }
  },
  invalidatePage: function ( title, langOrProject ) {
    var s = langOrProject.split( '.' );
    var lang = s[0];
    var proj = s[1];
    var keyPrefix = API_PATH + 'page/' + lang + '/';
    var keyPrefix2 = API_PATH + 'page/' + langOrProject + '/';

    this.invalidatePath( keyPrefix + title );
    this.invalidatePath( keyPrefix + encodeURIComponent( title ) );
    this.invalidatePath( keyPrefix2 + title );
    this.invalidatePath( keyPrefix2 + encodeURIComponent( title ) );
  },
  post: function ( url, data ) {
    return fetch( url, {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( data )
    } ).then( resp => resp.json() );
  },
  prefetch: function ( url, data ) {
    this.cache[url] = new Promise( function ( resolve ) {
      resolve( data );
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
    return this.fetch( API_PATH + 'page/' + lang + '/' + encodeURIComponent( title ) );
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
