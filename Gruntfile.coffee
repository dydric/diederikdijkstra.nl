'use strict'

ftp =
  options:
    host: '###'
    port: 21
    authKey: 'default'
  dest: '###'
  exclusions: [
    '.DS_Store',
    '.ftppass',
    '.git',
    '.gitignore',
    '.grunt',
    '.sass-cache',
    'Gruntfile.coffee',
    '*.html',
    '*.md',
    'node_modules',
    'package.json',
    'script.concat.js',
    'src/*'
  ]

module.exports = (grunt) ->
  grunt.initConfig

    autoprefixer:
      dist:
        options:
          map: true
        expand: true
        flatten: true
        src: 'build/css/*.css'
        dest: 'build/css/'

    browserSync:
      local:
        bsFiles:
          src: [
            'build/css/*.css',
            'build/js/*.js',
            'build/*.html'
          ]
        options:
          watchTask: true
          open: true
          server:
            baseDir: 'build/'
            index: 'index.html'

    compass:
      dist:
        src: 'src/sass/**/*.scss'
        options:
          sassDir: 'src/sass'
          cssDir: 'build/css'
          imagesDir: 'src/img'
          javascriptsDir: 'src/js'
          fontsDir: 'src/fonts'
          relativeAssets: true
          sourcemap: true
          outputStyle: 'compressed'
          generated_images_path: 'build/img'

    concat:
      dist:
        src: [
          'src/js/source/plugins/modernizr.js',
          'src/js/source/plugins/*.js',
          'src/js/source/plugins.js',
          'src/js/source/script.js'
        ]
        dest: 'build/js/script.concat.js'

    copy:
      main:
        expand: true
        cwd: 'src/'
        src: 'fonts/**/*'
        dest: 'build/'

    ftpush:
      production:
        auth: ftp.options
        src: 'build/'
        dest: ftp.dest
        exclusions: ftp.exclusions
        keep: 'dev'
        simple: false
        useList: false
      development:
        auth: ftp.options
        src: 'build/'
        dest: ftp.dest + '/dev'
        exclusions: ftp.exclusions
        simple: false
        useList: false

    imagemin:
      dist:
        expand: true
        cwd: 'src/img/'
        src: [
          '**/*.{png,jpg,gif}',
          '!sprite/*',
          '!sprite@2x/*'
        ]
        dest: 'build/img/'

    jade:
      options:
        client: false,
        pretty: true
      files:
        cwd: 'src/jade/'
        src: [
          '**/*.jade',
          '!includes/*'
        ]
        dest: 'build/'
        expand: true
        ext: '.html'

    jshint:
      options:
        force: true
        reporter: require 'jshint-stylish'
      target: 'build/js/source/script.js'

    scsslint:
      dist:
        src: 'src/sass/**/*.scss'
        options:
          colorizeOutput: true
          maxBuffer: 2000 * 1024

    uglify:
      dist:
        options:
          sourceMap: true
        src: 'build/js/script.concat.js'
        dest: 'build/js/script.min.js'

    watch:
      local:
        files: [
          'src/js/**/*.js',
          'src/sass/**/*.scss',
          'src/jade/**/*'
        ]
        tasks: [
          'newer:concat:dist',
          'newer:uglify:dist',
          'newer:compass:dist',
          'jade',
          'newer:imagemin:dist',
          'newer:copy:main',
          'newer:autoprefixer:dist'
        ]
      development:
        files: [
          'src/js/**/*.js',
          'src/sass/**/*.scss'
        ]
        tasks: [
          'newer:concat:dist',
          'newer:uglify:dist',
          'newer:compass:dist',
          'imagemin:dist',
          'newer:copy:main',
          'newer:autoprefixer:dist',
          'newer:cssmin:dist',
          'ftpush:development'
        ]
      production:
        files: [
          'src/js/**/*.js',
          'src/sass/**/*.scss'
        ]
        tasks: [
          'newer:concat:dist',
          'newer:uglify:dist',
          'newer:compass:dist',
          'imagemin:dist',
          'newer:copy:main',
          'newer:autoprefixer:dist',
          'newer:cssmin:dist',
          'ftpush:production'
        ]

  require('time-grunt') grunt
  require('load-grunt-tasks') grunt

  grunt.registerTask 'default', [
    'compass:dist',
    'imagemin:dist',
    'concat:dist',
    'uglify:dist',
    'jade',
    'copy:main',
    'autoprefixer:dist',
    'cssmin:dist'
  ]

  grunt.registerTask 'hint', 'jshint'

  grunt.registerTask 'deploy:dev', [
    'imagemin:dist',
    'ftpush:development'
  ]
  grunt.registerTask 'deploy:prod', [
    'imagemin:dist',
    'ftpush:production'
  ]

  grunt.registerTask 'local', [
    'browserSync:local',
    'watch:local'
  ]
  grunt.registerTask 'prod', 'watch:production'
  grunt.registerTask 'dev', 'watch:development'
