// jscs:disable jsDoc
/*jshint node:true, strict:false */
module.exports = function ( grunt ) {
  grunt.loadNpmTasks( 'grunt-stylelint' );
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks( 'grunt-cssjanus' );
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks("grunt-jscs");

  grunt.initConfig( {
    jscs: {
        src: 'libs/**/*.js',
        options: {
            config: ".jscsrc",
            fix: true, // Autofix code style violations when possible.
            requireCurlyBraces: [ "if" ]
        }
    },
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
    uglify: {
      build: {
        files: {
          'public/main-bundle.js': ['public/main-bundle.js'],
          'public/push-bundle.js': ['public/push-bundle.js'],
          'public/sw-bundle.js': ['public/sw-bundle.js']
        }
      }
    },
    cssmin: {
      build: {
        files: {
          'style.css': ['public/style.css'],
          'public/style.rtl.css': ['public/style.rtl.css']
        }
      }
    },
    stylelint: {
      options: {
        syntax: 'less'
      },
      all: [
        'libs/**/*.less'
      ]
    }
  } );

  grunt.registerTask( 'lint', [ 'jshint', 'stylelint' ] );
  grunt.registerTask( 'test', [ 'lint', 'jscs' ] );

  grunt.registerTask( 'default', [ 'test' ] );
};
