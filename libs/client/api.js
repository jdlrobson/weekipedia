import fetch from 'isomorphic-fetch'

function Api( basePath ) {
  this.cache = {};
  this.refCache = {};
  this.path = basePath || '/api/';
}

Api.prototype = {
  clearCache: function () {
    this.cache = {};
  },
  cacheable: function ( url ) {
    // offline pages
    if ( url.match( /api\/private\// ) ) {
      return false;
    } else if ( url.match( /collection\/by\/[^\/]*\/-1/ ) ) {
      return false;
    } else if ( url.indexOf( '/api/wikitext' ) === 0 ) {
      return false;
    } else {
      return true;
    }
  },
  // Issue with node-jquery-param
  param: function ( args ) {
    var key,
      array = [];

    for ( key in args ) {
      array.push( encodeURIComponent( key ) + '=' + encodeURIComponent( args[key] ) );
    }
    return array.join( '&' );
  },
  edit: function ( source, title, section, text, summary, appendText ) {
    var data;
    var action = appendText ? 'edit-append' : 'edit';
    var self = this;
    var endpoint = '/api/private/' + action + '/' + source + '/' + encodeURIComponent( title );

    if ( section ) {
      endpoint += '/' + section;
    }
    data = {
      text: text,
      summary: summary
    };

    return this.post( endpoint, data ).then( function ( res ) {
      return new Promise( function ( resolve ) {
        // wait 2s before doing this to give cache time to warm.
        setTimeout( function () {
          self.clearCache();
          resolve( res );
        }, 2000 );
      } );
    } );
  },
  post: function ( url, data ) {
    return fetch( url, {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
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
  fetch: function ( url, options ) {
    var req,
      qs = options && options.query ? this.param( options.query ) : '',
      canCache = this.cacheable( url + '?' + qs ),
      cache = this.cache;

    url = url + '?' + qs;
    if ( canCache && cache[url] ) {
      return cache[url];
    } else {
      req = new Request( url, options || {
        credentials: 'same-origin'
      } );
      cache[url] = fetch( req ).then( function ( resp ) {
        if ( resp.status === 200 ) {
          return resp.json();
        } else {
          delete cache[url];
          throw Error( resp.statusText );
        }
        if ( !canCache ) {
          delete cache[url];
        }
      } );
      return cache[url];
    }
  },
  getPage: function ( title, langOrLanguageProject, sections ) {
    langOrLanguageProject = langOrLanguageProject || 'en';
    var route = sections ? sections + '/' : '';
    route += langOrLanguageProject + '/';
    // encode any '/' symbols in title (fixes #89)
    title = encodeURIComponent( title ).replace( /\//gi, '%2F' );

    return this.fetch( this.path + 'page/' + route + title );
  },
  getReference: function ( title, langOrLanguageProject, refId ) {
    return this.getReferences( title, langOrLanguageProject ).then( function ( refs ) {
      if ( refs[refId] ) {
        return refs[refId];
      } else {
        throw 'No reference';
      }
    } );
  },
  getReferenceSections: function ( title, langOrLanguageProject ) {
    return this.getPage( title, langOrLanguageProject, 'references' );
  },
  getReferences: function ( title, langOrLanguageProject ) {
    var promise;
    var reflist = {};
    var cache = this.refCache;
    var cacheKey = langOrLanguageProject + '#' + title;

    if ( cache[ cacheKey ] ) {
      return cache[cacheKey];
    } else {
      promise = this.getReferenceSections( title, langOrLanguageProject ).then( function ( json ) {
        var container = document.createElement( 'div' );

        json.references.sections.forEach( function ( section ) {
          var refNodes;
          container.innerHTML = section.text;
          refNodes = container.querySelectorAll( '[id]' );
          Array.prototype.forEach.call( refNodes, function ( refNode ) {
            var id = refNode.getAttribute( 'id' );
            if ( id ) {
              reflist[id] = refNode.innerHTML;
            }
          } );
        } );
        return reflist;
      } );
      cache[cacheKey] = promise;
      return promise;
    }
  }
};

export default Api;
