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

/*********************************
serve scripts
*********************************/
gulp.task('serve:local', function (cb) {
	runSequence('clean', ['images', 'styles', 'scripts', 'nprogress', 'html'], 'jekyll-build', function (cb) {
		browserSync({
			notify: false,
			logPrefix: 'BS',
			server: '_site'
		});
		gulp.watch(['_sass/**/*'], ['styles']);
		gulp.watch(['_js/**/*'], ['scripts']);
		gulp.watch(['img/**/*'], ['images']);
		gulp.watch(['_jade/**/*'], ['html']);
		gulp.watch(['index.html', '_includes/*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
	});
});

/*********************************
Jekyll scripts
*********************************/
gulp.task('jekyll-build', function (done) {
	return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
		.on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
	browserSync.reload();
});

/*********************************
watch scripts
*********************************/
gulp.task('styles', function (cb) {
	return gulp.src(['_sass/*.scss'])
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass.sync().on('error', $.sass.logError))
		.pipe($.autoprefixer({
			browsers: AUTOPREFIXER_BROWSERS
		}))
		.pipe($.minifyCss({
			keepSpecialComments: false
		}))
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest('css'))
		.pipe($.if(browserSync.active, reload({ stream: true })))
		.pipe($.size({
			title: 'styles'
		}));
});

// scripts
gulp.task('scripts', function () {
	return gulp.src(['_js/source/plugins/**/*.js', '_js/source/*.js'])
		.pipe($.sourcemaps.init())
		.pipe($.concat('script.concat.js'))
		.pipe(gulp.dest('js/'))
		.pipe($.uglify())
		.pipe($.rename('script.min.js'))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('js/'))
		.pipe($.if(browserSync.active, reload({ stream: true })))
		.pipe($.size({
			title: 'scripts'
		}));
});

// nprogress
gulp.task('nprogress', function (cb) {
	return gulp.src(['_js/nprogress.js'])
		.pipe($.plumber())
		.pipe(gulp.dest('js/'))
		.pipe($.if(browserSync.active, reload({ stream: true })))
		.pipe($.size({
			title: 'nprogress'
		}));
});

// images
gulp.task('images', function (cb) {
	return gulp.src(['img/**/*.{jpg,png,svg}'])
		.pipe($.plumber())
		.pipe($.changed('img/'))
		.pipe($.imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('img/'))
		.pipe($.if(browserSync.active, reload({ stream: true })))
		.pipe($.size({
			title: 'images'
		}));
});

// HTML
gulp.task('html', function (cb) {
	return gulp.src(['_jade/*.{jade,html}'])
		.pipe($.plumber())
		.pipe($.if('*.jade', $.jade({
			cache: true,
			pretty: true
		})))
		.pipe(gulp.dest('_includes/'))
		.pipe($.if(browserSync.active, reload({ stream: true })))
		.pipe($.size({
			title: 'html'
		}));
});

// CLEAN
gulp.task('clean', function (cb) {
	return del(['css', 'js', '_site/'], cb);
});
