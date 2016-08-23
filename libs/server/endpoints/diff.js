
import mwApi from './mwApi'

export default function ( lang, revId, project ) {
  var params = {
    prop: 'revisions',
    revids: revId,
    rvprop: 'ids|timestamp|comment|size|flags|sizediff|user',
    rvdiffto: 'prev'
  };

  return mwApi( lang, params, project ).then( function ( data ) {
    var pages = data.pages;
    if ( pages[0] && pages[0].revisions ) {
      return pages[0];
    }
    throw new Error( 'Unable to load diff.' );
  } );
}

