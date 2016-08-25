// jscs:disable jsDoc
/*jshint node:true, strict:false */
module.exports = function ( grunt ) {
  grunt.loadNpmTasks( 'grunt-stylelint' );
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks( 'grunt-cssjanus' );

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
    cssjanus: {
      build: {
        generateExactDuplicates: false,
        files: {
          'public/style.rtl.css': 'public/style.css'
        }
      }
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
