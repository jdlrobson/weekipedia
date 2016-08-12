import fetch from 'isomorphic-fetch'
import param from 'node-jquery-param'
import OAuth from 'oauth'

function signedGetRequest( url, session ) {
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
    oauth.get(
      url,
      session.oauth.token,
      session.oauth.token_secret,
      function ( err, data, res ){
        if ( err ) {
          reject( JSON.stringify( err ) );
        } else {
          resolve( JSON.parse( data ) );
        }
      });
  } );
}

function anonRequest( url, options ) {
  return fetch( url, options )
    .then( function ( resp ) {
     if ( resp.status === 200 ) {
       return resp.json();
     } else {
       throw Error( resp.status );
     }
    } );
}

export default function ( lang, params, project, options, session ) {
  var req, url,
    baseParams = {
      action: 'query',
      format: 'json',
      formatversion: 2
    };


  project = project || 'wikipedia';
  url = 'https://' + lang + '.' + project + '.org/w/api.php?' +
    param( Object.assign( {}, baseParams, params ) );

  if ( session ) {
    req = signedGetRequest( url, session );
  } else {
    req = anonRequest( url, options );
  }

  return req.then( function ( json ) {
    if ( json.query && json.query.pages ) {
      return { pages: json.query.pages, continue: json.continue };
    } else if ( params.meta ) {
      return json.query[params.meta];
    } else if ( params.list ) {
      return json;
    } else {
      return [];
    }
  } );
}
