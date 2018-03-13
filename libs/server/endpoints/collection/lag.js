// This accounts for the lag for newly created collections being returned
// by search results

function lag( result, username, profile ) {
	// Workaround the lag on search result generation.
	if ( profile && profile.collections && profile.displayName === username ) {
		profile.collections.forEach( function ( newCollection, i ) {
			var found;
			result.collections.forEach( function ( existingCollection ) {
				if ( existingCollection.id === newCollection.id ) {
					found = true;
				}
			} );
			if ( found ) {
				profile.collections.splice( i, 1 );
			}
		} );
		// update with the missing ones on front
		result.collections = profile.collections.concat( result.collections );
	}
	return result;
}

export default lag;
