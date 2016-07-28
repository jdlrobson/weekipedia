import mwApi from './mwApi'

export default function ( lang, title, width, height ) {
  var params = {
    titles: title.indexOf( 'File:' ) > -1 ? title : 'File:' + title,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: width,
    iirurlheight: height
  };

  return mwApi( lang, params ).then( function ( data ) {
    if ( data[0] && data[0].imageinfo ) {
      return data[0].imageinfo[0];
    } else {
      throw new Error( 'Unable to find file' );
    }
  } );
}
