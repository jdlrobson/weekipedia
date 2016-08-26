import fetch from 'isomorphic-fetch'
import param from 'node-jquery-param'
import OAuth from 'oauth'

function flatten( pages ) {
  pages.forEach( function ( page ) {
    if ( page.terms && page.terms.description ) {
      page.description = page.terms.description[0] || '';
      delete page.terms;
    }
    if ( page.coordinates ) {
      page.coordinates = page.coordinates[0];
    }
  } );
  return pages;
}

function signedRequest( url, session, params, options ) {
  var oauth = new OAuth.OAuth(
    // URL to request a token
    'https://meta.wikimedia.org/index.php?title=Special%3AOAuth%2Finitiate',
    // URL to get access token
    'https://meta.wikimedia.org/index.php??title=Special%3AOAuth%2Ftoken',
    session.oauth.consumer_key,
    session.oauth.consumer_secret,
    '1.0',
    null,
    'HMAC-SHA1'
  );

  return new Promise( function ( resolve, reject ) {
    var handler = function ( err, data ) {
      if ( err ) {
        reject( JSON.stringify( err ) );
      } else {
        resolve( JSON.parse( data ) );
      }
    };

    if ( options && options.method === 'POST' ) {
      oauth.post(
        url,
        session.oauth.token,
        session.oauth.token_secret,
        params,
        handler );
    } else {
      url += '?' + param( params );
      oauth.get(
        url,
        session.oauth.token,
        session.oauth.token_secret,
        handler);
    }
  } );
}

function anonRequest( url, params, options ) {
  if ( options && options.method === 'POST' ) {
    options.body = JSON.stringify( params );
  } else {
    url += '?' + param( Object.assign( {}, params ) );
  }
  return fetch( url, options )
    .then( function ( resp ) {
     if ( resp.status === 200 ) {
       return resp.json();
     } else {
       throw Error( resp.status );
     }
    } ).then( function ( json ) {
      return json;
    });
}

export default function ( lang, params, project, options, session ) {
  var req, url, fullParams,
    baseParams = {
      action: 'query',
      format: 'json',
      formatversion: 2
    };


  project = project || 'wikipedia';
  url = 'https://' + lang + '.' + project + '.org/w/api.php';

  fullParams = Object.assign( {}, baseParams, params );

  if ( session ) {
    req = signedRequest( url, session, fullParams, options );
  } else {
    req = anonRequest( url, fullParams, options );
  }

  return req.then( function ( json ) {
    if ( json.query && json.query.pages ) {
      return { pages: flatten( json.query.pages ), continue: json.continue };
    } else if ( params.meta ) {
      return json.query[params.meta];
    } else {
      return json;
    }
  } );
}
