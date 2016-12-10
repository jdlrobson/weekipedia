// FIXME: Remove when file handling from endpoints/page.js has been upstreamed to MCS
import mwApi from './mwApi'

export default function ( lang, title, width, height, project ) {
  var params = {
    titles: title.indexOf( 'File:' ) > -1 ? title : 'File:' + title,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: width,
    iirurlheight: height
  };

  return mwApi( lang, params, project ).then( function ( data ) {
    var pages = data.pages;
    if ( pages[0] && pages[0].imageinfo ) {
      return pages[0].imageinfo[0];
    } else {
      throw new Error( 'Unable to find file' );
    }
  } );
}
