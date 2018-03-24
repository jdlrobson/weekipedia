import fetch from 'isomorphic-fetch';

function Api( basePath, store ) {
	this.cache = {};
	this.refCache = {};
	this.path = basePath || '/api/';
	this.store = store;
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
			array.push( encodeURIComponent( key ) + '=' + encodeURIComponent( args[ key ] ) );
		}
		return array.join( '&' );
	},
	edit: function ( title, section, text, summary, appendText ) {
		var data;
		var source = this.store.getLangProject();
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
		this.cache[ url ] = new Promise( function ( resolve ) {
			resolve( data );
		} );
	},
	fetch: function ( url, options ) {
		var req, promise,
			qs = options && options.query ? this.param( options.query ) : '',
			canCache = this.cacheable( url + '?' + qs ),
			cache = this.cache;

		url = url + '?' + qs;
		if ( canCache && cache[ url ] ) {
			return cache[ url ];
		} else {
			req = new Request( url, options || {
				credentials: 'same-origin'
			} );
			promise = fetch( req ).then( function ( resp ) {
				if ( resp.status === 200 ) {
					return resp.json();
				} else {
					delete cache[ url ];
					throw Error( resp.statusText );
				}
			} );

			if ( canCache ) {
				cache[ url ] = promise;
			}
			return promise;
		}
	},
	getMwEndpoint: function () {
		var source = this.store.getLangProject();
		return '/api/' + source + '.org/api.php';
	},
	getEndpoint: function ( path, isRest ) {
		var source = this.store.getLangProject();
		if ( isRest ) {
			source += '.org/rest_v1';
		}
		console.log( 'api:', '/api/' + source + '/' + path);
		return '/api/' + source + '/' + path;
	},
	getPage: function ( title, sections, revision ) {
		var langOrLanguageProject = this.store.getLangProject();
		var suffix = '';
		var route = sections ? sections + '/' : '';
		route += langOrLanguageProject + '/';
		// encode any '/' symbols in title (fixes #89)
		title = encodeURIComponent( title ).replace( /\//gi, '%2F' );
		if ( revision ) {
			suffix = '/' + revision;
		}

		return this.fetch( this.path + 'page/' + route + title + suffix );
	},
	getReference: function ( title, refId ) {
		return this.getReferences( title ).then( function ( refs ) {
			if ( refs[ refId ] ) {
				return refs[ refId ];
			} else {
				throw new Error( 'No reference' );
			}
		} );
	},
	getReferenceSections: function ( title ) {
		return this.getPage( title, 'references' );
	},
	getReferences: function ( title ) {
		var langOrLanguageProject = this.store.getLangProject();
		var promise;
		var reflist = {};
		var cache = this.refCache;
		var cacheKey = langOrLanguageProject + '#' + title;

		if ( cache[ cacheKey ] ) {
			return cache[ cacheKey ];
		} else {
			promise = this.getReferenceSections( title ).then( function ( json ) {
				var container = document.createElement( 'div' );

				json.references.sections.forEach( function ( section ) {
					var refNodes;
					container.innerHTML = section.text;
					refNodes = container.querySelectorAll( '[id]' );
					Array.prototype.forEach.call( refNodes, function ( refNode ) {
						var id = refNode.getAttribute( 'id' );
						if ( id ) {
							reflist[ id ] = refNode.innerHTML;
						}
					} );
				} );
				return reflist;
			} );
			cache[ cacheKey ] = promise;
			return promise;
		}
	}
};

export default Api;
