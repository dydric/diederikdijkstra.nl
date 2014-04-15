'use strict'

module.exports = (grunt) ->
  grunt.initConfig

    jekyll:
      build:
        dest: '_site'

    compass:
      dist:
        options:
          sassDir: 'sass'
          cssDir: 'css'
          imagesDir: 'img'
          javascriptsDir: 'js'
          fontsDir: 'fonts'
          outputStyle: 'compressed'
          relativeAssets: true

    concat:
      dist:
        src: [
          'js/source/plugins/modernizr.js',
          'js/source/plugins/*.js',
          'js/source/plugins.js',
          'js/source/functions.js',
          'js/source/script.js'
        ]
        dest: 'js/script.concat.js'

    uglify:
      build:
        src: 'js/script.concat.js'
        dest: 'js/script.min.js'

    imagemin:
      files:
        expand: true
        cwd: 'img/'
        src: [
          '**/*.{png,jpg,gif}'
        ]
        dest: 'img/'

    jshint:
      options:
        force: true
      target: [
        'js/source/script.js'
      ]

    watch:
      options:
        spawn: false
      jekyll:
        files: [
          'js/source/*.js', 
          'img/**/*.{png,jpg,gif}',
          'img/*.{png,jpg,gif}',
          'sass/*.scss',
          'sass/**/*.scss',
          'fonts', 
          '_layouts/*.html',
          '_includes/*.md',
          '_posts/*.md',
          'css/style.css',
          'css/custom/*.css'
        ]
        tasks: [
          'jshint',
          'imagemin',
          'concat',
          'uglify',
          'compass',
          'jekyll'
        ]

    browser_sync:
      files:
        src: [
          '_site/css/*.css',
          '_site/css/custom/*.css',
          '_site/js/*.js', 
          '_posts/*.md'
          ]
        options:
          watchTask: true
          ghostMode:
            clicks: true
            scroll: true
            links: true
            forms: true
          server:
            baseDir: '_site'

  require('time-grunt') grunt
  require('load-grunt-tasks') grunt

  grunt.registerTask 'build', ['compass', 'jekyll']
  grunt.registerTask 'default', ['build', 'browser_sync', 'watch']
