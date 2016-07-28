// jscs:disable jsDoc
/*jshint node:true, strict:false */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-stylelint' );

	grunt.initConfig( {
		stylelint: {
			options: {
				syntax: 'less'
			},
			all: [
				'libs/**/*.css'
			]
		}
	} );

	grunt.registerTask( 'lint', [ 'stylelint' ] );
	grunt.registerTask( 'test', [ 'lint' ] );

	grunt.registerTask( 'default', [ 'test' ] );
};
