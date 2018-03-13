export default function ( username, collection ) {
	var title = 'User:' + username + '/lists/';
	if ( collection !== undefined ) {
		title += collection;
	}
	return title;
}
