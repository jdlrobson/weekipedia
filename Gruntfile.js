// jscs:disable jsDoc
/*jshint node:true, strict:false */
module.exports = function ( grunt ) {
  grunt.loadNpmTasks( 'grunt-stylelint' );
  grunt.loadNpmTasks('grunt-jsxhint');

  grunt.initConfig( {
    jshint: {
      options: {
        esversion: 6,
        jshintrc: true
      },
      all: [
        'libs/**/*.js',
        'libs/**/*.jsx'
      ],
    },
    stylelint: {
      options: {
        syntax: 'less'
      },
      all: [
        'libs/**/*.css',
        'libs/**/*.less'
      ]
    }
  } );

  grunt.registerTask( 'lint', [ 'jshint', 'stylelint' ] );
  grunt.registerTask( 'test', [ 'lint' ] );

  grunt.registerTask( 'default', [ 'test' ] );
};
