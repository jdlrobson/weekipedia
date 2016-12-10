// Let's use https://en.wikipedia.org/api/rest_v1/page/related/San_Francisco for this
// but... https://phabricator.wikimedia.org/T152825
import mwApi from './mwApi'
import { PAGEIMAGES_API_PROPS } from './consts'

export default function ( lang, title, project ) {
  var params = Object.assign( {
    prop: 'pageterms|pageimages',
    wbptterms: 'description',
    generator: 'search',
    gsrqiprofile: 'classic_noboostlinks',
    gsrnamespace: 0,
    gsrlimit: 3,
    gsrsearch: 'morelike:' + title
  }, PAGEIMAGES_API_PROPS );

  return mwApi( lang, params, project );
}

