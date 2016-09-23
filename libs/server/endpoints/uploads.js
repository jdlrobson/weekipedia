import mwApi from './mwApi'

// request/lib/oauth.js
export default function ( langProject, username, query ) {
  var params = Object.assign( {
    prop: 'pageterms|pageimages|pageprops',
    ppprop: 'displaytitle',
    wbpterms: 'description',
    piprop: 'thumbnail',
    pithumbsize: '80',
    pilimit: 50,
    iiurlwidth: 150,
    generator: 'allimages',
    gaiuser: username,
    gaisort: 'timestamp',
    gaidir: 'descending',
    gailimit: 50
  }, query || {} );

  return mwApi( langProject, params );
}
