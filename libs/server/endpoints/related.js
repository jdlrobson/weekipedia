import mwApi from './mwApi'

export default function ( lang, title, project ) {
  var params = {
    prop: 'pageterms|pageimages',
    wbptterms: 'description',
    pilimit: 3,
    pithumbsize: 160,
    generator: 'search',
    gsrqiprofile: 'classic_noboostlinks',
    gsrnamespace: 0,
    gsrlimit: 3,
    gsrsearch: 'morelike:' + title
  };

  return mwApi( lang, params, project );
}

