import subscriber from 'web-push-subscriber';

function remove( browser, featureName, token ) {
	subscriber.unsubscribe( browser, featureName, token );
	return true;
}

function add( browser, featureName, token ) {
	subscriber.subscribe( browser, featureName, token );
	return true;
}

function ping( browser, featureName, token ) {
	subscriber.ping( browser, [ token ], featureName );
}

export default {
	add: add,
	ping: ping,
	remove: remove
};
