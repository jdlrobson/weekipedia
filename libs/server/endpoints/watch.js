import mwApi from './mwApi';

export default function ( lang, project, titles, profile, unwatch ) {
  var watchTokenParams = { action: 'query', meta: 'tokens', type: 'watch' };
  return mwApi( lang, watchTokenParams, project, null, profile ).then( function ( data ) {
    var params = {
      action: 'watch',
      titles: titles.join( '|' ),
      token: data.watchtoken
    };

    if ( unwatch ) {
      params.unwatch = '1';
    }

    return mwApi( lang, params, project, { method: 'POST' }, profile );
  } );
}
