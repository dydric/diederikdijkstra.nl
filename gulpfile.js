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

// SERVE
gulp.task('serve:local', function (cb) {
	runSequence('clean', ['images', 'styles', 'scripts', 'nprogress', 'layouts', 'posts', 'drafts'], 'jekyll-build', function (cb) {
		browserSync({
			notify: false,
			logPrefix: 'BS',
			server: '_site'
		});
		gulp.watch(['_sass/**/*'], ['styles']);
		gulp.watch(['_js/**/*'], ['scripts']);
		gulp.watch(['img/**/*'], ['images']);
		gulp.watch(['_jade/**/*'], ['layouts', 'posts', 'drafts']);
		gulp.watch(['index.html', '_includes/*.html', '_layouts/*.html', '_posts/*', '_drafts/*', 'css/**/*', 'js/*', ], ['jekyll-rebuild']);
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
gulp.task('styles', function (cb) {
	return gulp.src(['_sass/**/*.scss'])
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
		.pipe(gulp.dest('css'))
		.pipe($.if(browserSync.active, reload({ stream: true })))
		.pipe($.size({
			title: 'styles'
		}));
});

// SCRIPTS
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

// NPROGRESS
gulp.task('nprogress', function (cb) {
	return gulp.src(['_js/nprogress.js'])
		.pipe($.plumber())
		.pipe(gulp.dest('js/'))
		.pipe($.if(browserSync.active, reload({ stream: true })))
		.pipe($.size({
			title: 'nprogress'
		}));
});

// IMAGES
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

// LAYOUTS
gulp.task('layouts', function (cb) {
	return gulp.src(['_jade/layouts/*'])
		.pipe($.plumber())
		.pipe($.if('*.jade', $.jade({
			cache: true
			// pretty: true
		})))
		.pipe(gulp.dest('_layouts/'))
		.pipe($.if(browserSync.active, reload({ stream: true })))
		.pipe($.size({
			title: 'layouts'
		}));
});

// POSTS
gulp.task('posts', function (cb) {
	return gulp.src(['_jade/posts/*', '!_jade/posts/post.jade'])
		.pipe($.plumber())
		.pipe($.if('*.jade', $.jade({
			cache: true
		})))
		.pipe(gulp.dest('_posts'))
		.pipe($.if(browserSync.active, reload({ stream: true })))
		.pipe($.size({
			title: 'posts'
		}));
});

// POSTS
gulp.task('drafts', function (cb) {
	return gulp.src(['_jade/drafts/*'])
		.pipe($.plumber())
		.pipe($.if('*.jade', $.jade({
			cache: true
		})))
		.pipe(gulp.dest('_drafts'))
		.pipe($.if(browserSync.active, reload({ stream: true })))
		.pipe($.size({
			title: 'drafts'
		}));
});

// CLEAN
gulp.task('clean', function (cb) {
	return del(['css', 'js', '_includes', '_posts', '_drafts', '_layouts', '_site/'], cb);
});
