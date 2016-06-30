'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var consolidate = require('gulp-consolidate');
var del = require('del');
var ftp = require('vinyl-ftp');
var Git = require('git-wrapper');
var gutil = require('gulp-util');
var psi = require('psi');
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var cp = require('child_process');

// Which browsers do we need to support
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// BUILD
gulp.task('default', function (cb) {
  runSequence('clean', ['img']);
});

// SERVE
gulp.task('serve', function (cb) {
  runSequence(['img', 'jade', 'sass', 'js', 'modernizr'], 'jekyll-build', function (cb) {
    browserSync({
      notify: false,
      logPrefix: 'BS',
      server: '_site'
    });
    gulp.watch(['src/sass/**/*'], ['sass']);
    gulp.watch(['src/js/**/*'], ['js']);
    gulp.watch(['src/img/**/*'], ['img']);
    gulp.watch(['src/jade/**/*'], ['jade']);
    gulp.watch([
        '*.html',
        '*.md',
        '_layouts/*',
        '_posts/**/*',
        '_drafts/**/*',
        'assets/css/**/*.css',
        'assets/js/*'
      ], ['jekyll-rebuild']);
  });
});

// JEKYLL
gulp.task('jekyll-build', function (done) {
  return cp.spawn('jekyll', ['build', '--drafts'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

// SASS
gulp.task('sass', function (cb) {
  return gulp.src(['src/sass/*.scss'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync().on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe($.minifyCss({
      keepSpecialComments: false,
      processImport: false,
      processImportFrom: ['!fonts.googleapis.com']
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('assets/css'))
    .pipe($.if(browserSync.active, reload({ stream: true })))
    .pipe($.size({
      title: 'sass'
    }));
});

// JS
gulp.task('js', function () {
  return gulp.src(['src/js/plugins/**/*.js', 'src/js/script.js'])
    .pipe($.sourcemaps.init())
    .pipe($.concat('script.concat.js'))
    .pipe(gulp.dest('assets/js/'))
    .pipe($.uglify())
    .pipe($.rename('script.min.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('assets/js/'))
    .pipe($.if(browserSync.active, reload({ stream: true })))
    .pipe($.size({
      title: 'js'
    }));
});

// MODERNIZR
gulp.task('modernizr', function (cb) {
  return gulp.src(['src/js/modernizr-custom.js'])
    .pipe($.plumber())
    .pipe(gulp.dest('assets/js/'))
    .pipe($.if(browserSync.active, reload({ stream: true })))
    .pipe($.size({
      title: 'modernizr'
    }));
});

// IMG
gulp.task('img', function (cb) {
  return gulp.src(['src/img/**/*.{jpg,png,svg}'])
    .pipe($.plumber())
    .pipe($.changed('assets/img/'))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('assets/img/'))
    .pipe($.if(browserSync.active, reload({ stream: true })))
    .pipe($.size({
      title: 'img'
    }));
});

// JADE
gulp.task('jade', function (cb) {
  return gulp.src(['src/jade/layouts/*'])
    .pipe($.plumber())
    .pipe($.if('*.jade', $.jade({
      cache: true,
      pretty: false
    })))
    .pipe(gulp.dest('_layouts/'))
    .pipe($.if(browserSync.active, reload({ stream: true })))
    .pipe($.size({
      title: 'jade'
    }));
});

// CLEAN
gulp.task('clean', function (cb) {
  return del(['assets/', '_layouts', '_site/'], cb);
});
