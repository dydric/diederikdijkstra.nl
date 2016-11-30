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
var webpack      = require('webpack-stream');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

// Load configurations & set variables
var config = require('./config.js');
var tasks  = [];
var build  = [];
var paths  = {};
var entry  = [];

// Set default & build tasks
Object.keys(config.tasks).forEach(function (key) {
  if (config.tasks[key]) {
    tasks.push(key == 'webpack' ? '_' + key : key);
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

for (var i = 0; i <= config.js.entry.length - 1; i++) {
  entry.push(paths.jsSrc + '/' + config.js.entry[i]);
}

// Jekyll
gulp.task('jekyll-build', function (done) {
  var jekyllConfig = config.jekyll.config;
  return cp.spawn(jekyll, ['build', '--config', jekyllConfig], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browsersync.notify('Rebuilded Jekyll');
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
  return gulp.src(paths.sass + '/style.scss')
    .pipe(sass({outputStyle: config.sass.outputStyle}).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: config.autoprefixer.browsers }))
    .pipe(gulp.dest(paths.css));
});

gulp.task('sass-critical', function () {
  return gulp.src(paths.sass + '/critical.scss')
    .pipe(sass({outputStyle: config.sass.outputStyle}).on('error', sass.logError))
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
  return gulp.src(entry)
    .pipe(concat('script.concat.js'))
    .pipe(gulp.dest(paths.jsSrc))
    .pipe(uglify())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest(paths.js));
});

// Webpack
gulp.task('webpack', function () {
  return gulp.src(entry)
    .pipe(plumber())
    .pipe(webpack({
      watch: argv.watch ? true : false,
      output: {
        filename: config.js.output
      },
      module : {
        loaders: [{
          test: /.js$/,
          loader: 'babel-loader'
        }]
      }
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js));
});

// For internal use only
gulp.task('_webpack', function () {
  argv.watch = true;
  gulp.start('webpack');
});

// Build
gulp.task('build', build, function (done) {
  var jekyllConfig = config.jekyll.config;
  return cp.spawn(jekyll, ['build', '--config', jekyllConfig], {stdio: 'inherit'})
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
    watch(paths.sass + '/**/*', function () {
      gulp.start('sass', 'sass-critical');
    });
  }

  if (config.tasks.scripts) {
    watch(paths.jsSrc + '/**/*', function () {
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
      paths.images + '/**/*'
    ], function () {
      gulp.start('jekyll-rebuild');
    });
  }
});
