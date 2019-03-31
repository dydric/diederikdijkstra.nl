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
var Twitter      = require('twitter');
var fs           = require('fs');
var yaml         = require('json2yaml');

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

// Twitter

gulp.task('twitter', (cb) => {

  const client = new Twitter({
    consumer_key:        'UoffXbEdQ5XnYwcpeExBOg', // process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:     '6YMsldgwwnxoxGIZKpTzFng1ULnbSruXEx7OpxGRg3w', // process.env.TWITTER_CONSUMER_SECRET,
    access_token_key:    '775387-FKL8W3iEcq6xFATCSdGODmhl4pn6VcjY4fGjKa4s8', //process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: 'mDhW5RW1jZeJKlScaKR4xZkZHsr53eXX76oSnbpXc' //process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  let params = {screen_name: 'dydric', count: 4};
  client.get('statuses/user_timeline', params, function (error, tweets) {
    if (!error) {

      tweets = tweets.map((tweet) => {
        return {
          text:    tweet.text,
          url:     'https://twitter.com/dydric/status/' + tweet.id_str,
          created: tweet.created_at.substring(0, tweet.created_at.length - 11),
        };
      });

      // fs.writeFile('_data/tweets.json', JSON.stringify(tweets), function (err) {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log('Tweets data saved.');
      //     cb();
      //   }
      // });

      var ymlText = yaml.stringify(tweets);
      fs.writeFile('_data/tweets.yml', ymlText, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('Tweets data saved.');
          cb();
        }
      });
    }
  });
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

  if (config.tasks.twitter) {
    gulp.start('twitter');
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
