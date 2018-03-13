var md5fn = require( 'md5-hex' );

export default function ( title, size ) {
	var md5, filename, source,
		path = '//upload.wikimedia.org/wikipedia/commons/';

	size = size || 160;
	// uppercase first letter in file name
	filename = title.charAt( 0 ).toUpperCase() + title.substr( 1 );
	// replace spaces with underscores
	filename = filename.replace( / /g, '_' );
	md5 = md5fn( filename );
	source = md5.charAt( 0 ) + '/' + md5.substr( 0, 2 ) + '/' + filename;
	if ( filename.substr( filename.length - 3 ) !== 'svg' ) {
		return path + 'thumb/' + source + '/' + size + 'px-' + filename;
	} else {
		return path + source;
	}
}
