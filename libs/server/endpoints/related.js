import mwApi from './mwApi'

export default function ( lang, title ) {
  var params = {
    prop: 'pageterms|pageimages',
    wbptterms: 'description',
    pilimit: 3,
    pithumbsize: 160,
    generator: 'search',
    gsrnamespace: 0,
    gsrlimit: 3,
    gsrsearch: 'morelike:' + encodeURIComponent( title )
  };

  return mwApi( lang, params );
}

