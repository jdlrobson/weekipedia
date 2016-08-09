import fetch from 'isomorphic-fetch'

import mwApi from './mwApi';

export default function ( title, lang, project ) {
  // FIXME: Handle this better please. Use better API.
  var url = 'https://' + lang + '.' + project + '.org/api/rest_v1/page/mobile-sections/' +
    encodeURIComponent( title );

  return fetch( url )
    .then( function ( resp ) {
      if ( resp.status === 200 ) {
        return resp.json();
      } else {
        throw Error( resp.status );
      }
    } ).then( function ( json ) {
      if ( json.lead && json.lead.ns === 2 ) {
        var username= title.indexOf( ':' ) > -1 ? title.split( ':' )[1] : title;

        // it's a user page so get more info
        return mwApi( lang, { meta: 'globaluserinfo', guiuser: username }, project ).then( function ( userInfo ) {
          json.user =  userInfo;
          return json;
        } ).catch( function () {
          return json;
        } )
      } else {
        return json;
      }
    } );
}
