// setup polyfills
require( 'phantomjs-polyfill' );
require( 'es6-map/implement' );
require( 'phantomjs-polyfill-object-assign' );
window.Promise = require( 'es6-promise-polyfill' ).Promise;

// run like normal
require( './app' );
