import mwApiToken from './mwApiToken';

export default function ( lang, title, body, summary, section, project, profile, method ) {
  var params = {
    action: 'edit',
    title: title,
    basetimestamp: null, // revision timestamp
    starttimestamp: null,
    summary: summary || ''
  }
  if ( method ) {
    params[method] = body;
  } else {
    params.text = body;
  }
  if ( section !== undefined ) {
    params.section = section;
  }

  return mwApiToken( 'csrf', lang, params, project, { method: 'POST' }, profile ).then( function ( data ) {
    return new Promise( function ( resolve ) {
      // leave time to invalidate.
      setTimeout( function () {
        resolve( data );
      }, 8000 );
    } );
  } );
}
