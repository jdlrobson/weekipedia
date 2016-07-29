import mwApi from './mwApi'

export default function ( title, lang ) {
  var params = {
    meta: 'siteinfo',
    siprop: 'general',
    prop: 'langlinks',
    lllimit: 'max',
    titles: title,
    llprop: 'url|autonym|langname',
    llinlanguagecode: lang
  };

  return mwApi( lang, params ).then( function ( pages ) {
    return pages.length ? pages[0].langlinks || [] : [];
  } );
}
