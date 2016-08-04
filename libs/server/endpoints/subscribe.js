import subscriber from 'web-push-subscriber'

function remove ( browser, featureName, token ) {
  subscriber.unsubscribe( browser, featureName, token );
  return true;
}

function add ( browser, featureName, token ) {
  subscriber.subscribe( browser, featureName, token );
  return true;
}

export default {
  add: add,
  remove: remove
}