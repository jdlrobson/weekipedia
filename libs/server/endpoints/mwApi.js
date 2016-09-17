import oauthFetchJson from 'oauth-fetch-json'

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

export default function ( langOrLanguageProject, params, projectOrOptions, optionsOrSession, session ) {
  var url, fullParams, project, options,
    baseParams = {
      action: 'query',
      format: 'json',
      formatversion: 2
    };

  if ( langOrLanguageProject.indexOf( '.' ) > -1 ) {
    url = 'https://' + langOrLanguageProject + '.org/w/api.php';
    options = projectOrOptions;
    session = optionsOrSession;
  } else {
    project = projectOrOptions || 'wikipedia';
    url = 'https://' + langOrLanguageProject + '.' + project + '.org/w/api.php';
    options = optionsOrSession;
  }

  fullParams = Object.assign( {}, baseParams, params );

  return oauthFetchJson( url, fullParams, options, session ? session.oauth : null ).then( function ( json ) {
    if ( json.error ) {
      throw new Error( json.error.code + ': ' + json.error.info );
    } else if ( json.query && json.query.pages ) {
      return { pages: flatten( json.query.pages ), continue: json.continue, redirects: json.query.redirects };
    } else if ( params.meta ) {
      return json.query[params.meta];
    } else {
      return json;
    }
  } );
}
