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

