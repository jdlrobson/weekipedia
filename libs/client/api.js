import fetch from 'isomorphic-fetch'

function Api( basePath ) {
  this.cache = {};
  this.refCache = {};
  this.path = basePath || '/api/';
}

Api.prototype = {
  cacheable: function ( url ) {
    if ( url.indexOf( '/api/wikitext' ) === 0 ) {
      return false;
    } else {
      return true;
    }
  },
  invalidatePath: function ( path ) {
    delete this.cache[path];
    if ( path[path.length - 1] === '/' ) {
      delete this.cache[path.substr( 0, path.length - 1 )];
    }
  },
  invalidatePage: function ( title, langOrProject ) {
    var s = langOrProject.split( '.' );
    var lang = s[0];
    var keyPrefix = this.path + 'page/' + lang + '/';
    var keyPrefix2 = this.path + 'page/' + langOrProject + '/';

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
      canCache = this.cacheable( url ),
      cache = this.cache;

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
