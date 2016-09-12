import mwApi from './mwApi';

// request/lib/oauth.js
export default function ( lang, title, project, query ) {
  var params = Object.assign( {
    prop: 'pageterms|pageimages',
    wbptterms: 'description',
    pithumbsize: 120,
    pilimit: 50
  }, query || {} );
  if ( title ) {
    params.gcmtitle = 'Category:' + title;
    params.generator = 'categorymembers';
    params.gcmlimit = 50;
  } else {
    params.generator = 'allcategories';
    params.gaclimit = 50;
  }

  return mwApi( lang, params, project ).then( function ( data ) {
    return {
      continue: data.continue,
      pages: data.pages
    }
  } )
}

