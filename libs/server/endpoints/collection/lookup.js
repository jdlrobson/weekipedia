export default function ( username, collection ) {
    var title = 'User:' + username + '/lists/';
    if ( collection ) {
      title += collection;
    }
    return title;
}
