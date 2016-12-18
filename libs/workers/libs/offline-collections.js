import offlineRequests from './offline-requests'

function offlineCollections( cache ) {
  var members = {};
  var collections = [];

  return offlineRequests( cache ).then( ( reqs ) => {
    reqs.forEach( ( item ) => {
      var content = item.content;
      var id = content && content.id;
      if ( id && !members[id]  ) {
        collections.push( {
          id: id,
          owner: content.owner
        } );
        members[id] = true;
      }
    } );
    return collections;
  } );
}

export default offlineCollections;
