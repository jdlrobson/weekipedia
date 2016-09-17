import mwApi from './mwApi'

export default function ( language_project, title, wikitext, section ) {
  var params = {
    action: 'parse',
    format: 'json',
    text: wikitext,
    sectionpreview: section === undefined ? false : true,
    pst: true,
    mobileformat: true,
    prop: 'text|sections',
    title: title
  };

  return mwApi( language_project, params, {  method: 'POST' } ).then( function( data ) {
    return data.parse;
  } )
}
