// jscs:disable jsDoc
/*jshint node:true, strict:false */
module.exports = function ( grunt ) {
  grunt.loadNpmTasks( 'grunt-stylelint' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );

  grunt.initConfig( {
    jshint: {
      options: {
        jshintrc: true
      },
      all: [
        'libs/**/*.js'
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
