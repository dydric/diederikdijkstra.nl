/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
/*global require, process */

'use strict';

// gulp modules
var argv         = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var browsersync  = require('browser-sync').create();
var cp           = require('child_process');
var gulp         = require('gulp');
var imagemin     = require('gulp-imagemin');
var named        = require('vinyl-named');
var newer        = require('gulp-newer');
var plumber      = require('gulp-plumber');
var pngquant     = require('imagemin-pngquant');
var sass         = require('gulp-sass');
var uglify       = require('gulp-uglify');
var watch        = require('gulp-watch');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var babel        = require('gulp-babel');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

// Load configurations & set variables
var config = require('./config.js');
var tasks  = [];
var build  = [];
var paths  = {};

// Set default & build tasks
Object.keys(config.tasks).forEach(function (key) {
  if (config.tasks[key]) {
    tasks.push(key);
  }
});

Object.keys(config.tasks).forEach(function (key) {
  if (config.tasks[key] && key != 'server') {
    build.push(key);
  }
});

// Paths
Object.keys(config.paths).forEach(function (key) {
  if (key != 'assets') {
    if (config.paths.assets === '') {
      paths[key] = './' + config.paths[key];
    } else {
      paths[key] = config.paths.assets + '/' + config.paths[key];
    }
  }
});

// Jekyll
gulp.task('jekyll-build', function (done) {
  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--config', '_config.yml'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browsersync.notify('👷🏻‍♂️ Rebuilded Jekyll');
  browsersync.reload();
});

gulp.task('server', ['jekyll-build'], function() {
  return browsersync.init({
    port: config.port,
    server: {
      baseDir: config.paths.dest,
    }
  });
});

// Sass
gulp.task('sass', function () {
  return gulp.src([paths.sass + '/*.scss', '!' + paths.sass + '/critical.scss'])
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: config.autoprefixer.browsers }))
    .pipe(gulp.dest(paths.css));
});

// Copy critical.css to _includes folder to use inline
gulp.task('sass-critical', function () {
  return gulp.src(paths.sass + '/critical.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: config.autoprefixer.browsers }))
    .pipe(gulp.dest('_includes'));
});

// ImageMin
gulp.task('imagemin', function () {
  return gulp.src(paths.imagesSrc + '/**/*')
    .pipe(plumber())
    .pipe(newer(paths.images))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.images));
});

// Scripts

gulp.task('scripts', function () {
  return gulp.src([paths.jsSrc + '/plugins/**/*.js', paths.jsSrc + '/script.js'])
    .pipe(concat('script.concat.js'))
    .pipe(gulp.dest(paths.js))
    .pipe(babel({
      presets: ['es2015'],
      minified: true,
      comments: false
    }))
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest(paths.js));
});

// Build
gulp.task('build', build, function (done) {
  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--config', '_config.yml'], {stdio: 'inherit'})
    .on('close', done);
});

// Default gulp task
gulp.task('default', tasks, function () {
  if (config.tasks.imagemin) {
    watch(paths.imagesSrc + '/**/*', function () {
      gulp.start('imagemin');
    });
  }

  if (config.tasks.sass) {
    watch(paths.sass + '/**/*.scss', function () {
      gulp.start('sass', 'sass-critical');
    });
  }

  if (config.tasks.scripts) {
    watch([paths.jsSrc + '/plugins/**/*.js', paths.jsSrc + '/script.js'], function () {
      gulp.start('scripts');
    });
  }

  if (config.tasks['server']) {
    watch([
      '!./node_modules/**/*',
      '!./README.md',
      '!' + paths.dest + '/**/*',
      '_includes/**/*',
      '_layouts/**/*',
      '*.html',
      './**/*.md',
      './**/*.markdown',
      paths.posts + '/**/*',
      paths.css + '/**/*',
      paths.js + '/**/*',
      paths.images + '/**/*',
      '!./assets/css/style.min.css',
    ], function () {
      gulp.start('jekyll-rebuild');
    });
  }
});
