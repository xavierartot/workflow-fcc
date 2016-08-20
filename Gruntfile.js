'use strict';
module.exports = function(grunt) {
  // Load all tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time
  require('time-grunt')(grunt);

  var jsFileList = [
    'js/_main.js'
  ];

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'js/_main.js'
      ]
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'edge', 'ie 11', 'android 2.3', 'android 4', 'opera 12']
      },
      dev: {
        options: {
          map: {
            prev: 'css/'
          }
        },
        src: 'css/main.css'
      },
      build: {
        src: 'css/main.css'
      }
    },
    sass: {
      dev: {
        options: {                       // Target options
          lineNumbers: true,
          sourcemap: true,
          style: 'compact'
        },
        files: {
          'css/main.css': 'css/main.scss'
        }
      },
      build: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: {
          'css/main.css': 'css/main.scss'
        }
      }
    },
    jade: {
      debug: {
        options: {
          data: {
            //debug: true,
            timestamp: "<%= new Date().getTime() %>"
          },
          pretty: true
        },
        files: {
          "index.html": "index.jade"
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'js/main.js': ['js/_main.js'] //[jsFileList]
        }
      }
    },
    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 10, // maximum number of notifications from jshint output
        //title: "Project Name", // defaults to the name in package.json, or will use project directory's name
        success: false, // whether successful grunt executions should be notified automatically
        duration: 10 // the duration of notification in seconds, for `notify-send only
      }
    },
    watch: {
      sass: {
        files: [
          'css/*.scss'
        ],
        tasks: ['sass:dev', 'autoprefixer:dev']
      },
      js: {
        files: [
          jsFileList,'<%= jshint.all %>'
        ],
        tasks: ['jshint', 'uglify']
      },
      jade: {
        files: [
          'index.jade'
        ],
        tasks: ['jade']
      },
      livereload: {
        // Browser live reloading
        // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
        options: {
          livereload: true
        },
        files: [
          'css/main.css',
          'index.html',
          'js/main.js',
        ]
      }
    }
  });

  grunt.task.run('notify_hooks');

  // Register tasks
  grunt.registerTask('default', [
    'dev'
  ]);
  grunt.registerTask('dev', [
    'newer:jshint',
    'watch',
    'newer:sass:dev',
    'newer:autoprefixer:dev',
    'uglify',
    'newer:jade'
  ]);
  grunt.registerTask('build', [
    'jshint',
    'sass:build',
    'autoprefixer:build',
    'newer:jade',
    'uglify'
  ]);
};
