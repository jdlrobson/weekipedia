const disabledExtension = function () { return null; };

// Allow use of ES2015 transpiler e.g. import/const etc..
require( 'babel-core/register' );
require.extensions[ '.less' ] = disabledExtension;
require.extensions[ '.css' ] = disabledExtension;
require( './libs/server/app.js' );
