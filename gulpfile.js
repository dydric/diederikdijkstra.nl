/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
/*global require, process */

var gulp = require('gulp'),
  babel = require('gulp-babel'),
  cleanCSS = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  fs = require('fs'),
  notify = require('gulp-notify'),
  plumber = require('gulp-plumber'),
  postcss = require('gulp-postcss'),
  purgecss = require('@fullhuman/postcss-purgecss'),
  rename = require('gulp-rename'),
  run = require('gulp-run-command').default,
  sass = require('gulp-sass'),
  sheetsy = require('sheetsy'),
  spotifyWebApi = require('spotify-web-api-node'),
  tailwindcss = require('tailwindcss'),
  Instagram = require('node-instagram').default,
  tumblr = require('tumblr'),
  twitter = require('twitter'),
  uglify = require('gulp-uglify');

// Resources paths
var paths = {
  sass: {
    source: './resources/sass/style.scss',
    dest: 'assets/css/'
  },
  javascript: {
    source: './resources/js/**/*.js',
    dest: 'assets/javascript/'
  }
};

// Errors function
var onError = function (err) {
  notify.onError({
    title: 'Gulp Error - Compile Failed',
    message: 'Error: <%= error.message %>'
  })(err);

  this.emit('end');
};

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:/]+/g) || [];
  }
}

require('dotenv').config();

// Create the tailwind.config.js file.
gulp.task('tailwind:init', run('./node_modules/.bin/tailwind init tailwind.config.js'));


gulp.task('data:workouts', (cb) => {
  const { urlToKey, getWorkbook, getSheet } = sheetsy;
  const key = urlToKey(process.env.WORKOUTS_URL);

  getWorkbook(key).then(workbook => {
    const workbookID = workbook.sheets[0].id;

    getSheet(key, workbookID).then(sheet => {

      var activities = sheet.rows.map((activity) => {
        return {
          type: activity[2],
          movingtime: activity[4],
          distance: activity[6],
          heartrate: activity[8],
          activecalories: activity[7]
        };
      });

      var jsonWorkouts = JSON.stringify(activities.slice(0, 49));

      fs.writeFile('site/data/import/workouts.json', jsonWorkouts, function(err) {
        if(err) {
          console.warn(err);
        } else {
          console.log('Workouts data saved.');
          cb();
        }
      });
    });
  });
});

// Health

gulp.task('data:health', (cb) => {
  const { urlToKey, getWorkbook, getSheet } = sheetsy;
  const key = urlToKey(process.env.HEALTH_URL);

  getWorkbook(key).then(workbook => {
    const workbookID = workbook.sheets[0].id;

    getSheet(key, workbookID).then(sheet => {

      var dailyHealth = sheet.rows.map((day) => {
        return {
          energy: day[1],
          resting_energy: day[2],
          resting: day[3],
          hrv: day[4],
          steps: day[5]
        };
      });

      var jsonHealth = JSON.stringify(dailyHealth.slice(0, 29));

      fs.writeFile('site/data/import/health.json', jsonHealth, function(err) {
        if(err) {
          console.warn(err);
        } else {
          console.log('Daily Health data saved.');
          cb();
        }
      });
    });
  });
});

// Spotify

// credentials are optional
const spotifyApi = new spotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENTID,
  clientSecret: process.env.SPOTIFY_CLIENTSECRET
});

gulp.task('data:spotify', () => {

  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      // console.log('The access token is ' + data.body['access_token']);
      spotifyApi.setAccessToken(data.body['access_token']);

      var playlistID_albums = '4Bv3dkg5pD81HBoFaKC4S7';

      var playlistID_musiclog01 = '5C2AFaNulz8Wz6Tb6UPVfv';
      var playlistID_musiclog02 = '6ShQiKq8bZF98ikrMlQVzy';
      var playlistID_musiclog03 = '0NEo9bAKRbbhWvUGJzrSGh';
      var playlistID_musiclog04 = '1GqnOwVW7VaWcivCpWVUZa';
      var playlistID_musiclog05 = '0vGdLCvf1ohz0ybSPzTSJZ';
      var playlistID_musiclog06 = '1urJgpzBntEN7rRF9YW0Gj';
      var playlistID_musiclog07 = '6FlVlVj5kd3uQEtGhN1a2m';
      var playlistID_musiclog08 = '6sNv1lYvJTwF6OrHu6tHTg';
      var playlistID_musiclog09 = '43VdZl4vBgpROXbfgjCDVR';
      var playlistID_musiclog10 = '7JXe7hZlzX2FCY7wBaIsox';
      var playlistID_musiclog11 = '3Q0jxbxKS8Tid3jgr1ScVz';
      var playlistID_musiclog12 = '41wLOutl8A36WoqAPltlZ6';

      // ALBUMS
      spotifyApi.getPlaylistTracks(playlistID_albums)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/albums.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // JANUARI
      spotifyApi.getPlaylistTracks(playlistID_musiclog01)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog01.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // FEBRUARI
      spotifyApi.getPlaylistTracks(playlistID_musiclog02)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog02.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // MAART
      spotifyApi.getPlaylistTracks(playlistID_musiclog03)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog03.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // APRIL
      spotifyApi.getPlaylistTracks(playlistID_musiclog04)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog04.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // MEI
      spotifyApi.getPlaylistTracks(playlistID_musiclog05)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog05.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // JUNI
      spotifyApi.getPlaylistTracks(playlistID_musiclog06)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog06.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // JULI
      spotifyApi.getPlaylistTracks(playlistID_musiclog07)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog07.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // AUGUSTUS
      spotifyApi.getPlaylistTracks(playlistID_musiclog08)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog08.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // SEPTEMBER
      spotifyApi.getPlaylistTracks(playlistID_musiclog09)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog09.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // OKTOBER
      spotifyApi.getPlaylistTracks(playlistID_musiclog10)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog10.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // NOVEMBER
      spotifyApi.getPlaylistTracks(playlistID_musiclog11)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog11.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      // DECEMBER
      spotifyApi.getPlaylistTracks(playlistID_musiclog12)
        .then(function(data) {
          var playlistTracks = data.body;
          fs.writeFile('site/data/import/listening/musiclog12.json', JSON.stringify(playlistTracks), function(){});
        }, function(err) {
          console.log('Something went wrong!', err);
        });


    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

// Instagram

const instagram = new Instagram({
  clientId: process.env.INSTAGRAM_CLIENTID,
  clientSecret: process.env.INSTAGRAM_CLIENTSECRET,
  accessToken: process.env.INSTAGRAM_ACCESSTOKEN,
});

gulp.task('data:instagram', (cb) => {

  instagram.get('users/self/media/recent').then(data => {

    var instagramPosts = data;

    fs.writeFile('site/data/import/instagram.json', JSON.stringify(instagramPosts), function(err) {
      if(err) {
        console.warn(err);
      } else {
        console.log('Instagram posts saved.');
        cb();
      }
    });
  });
});

// Tumblr

const oauth = {
  consumer_key: process.env.TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.TUMBLR_CONSUMER_SECRET
};

gulp.task('data:tumblr', (cb) => {

  var blog = new tumblr.Blog(process.env.TUMBLR_URL, oauth);

  // blog.posts(function() {
  // console.log(response.blog.total_posts);
  // var totalPosts = response.blog.total_posts;

  var JSONposts = new Array();
  let promises = [];

  for (var i = 0; i < 51; i++) {

    promises.push(new Promise(
      (resolve) => {

        blog.photo({limit: 20, offset: (i * 20) }, function(error, response) {
          if (error) {
            throw new Error(error);
          }

          response.posts.map((post) => {

            var epoch = new Date(post.date).getTime() / 1000;

            if (post.type == 'photo') {

              var sizesLength = post.photos[0].alt_sizes.length;
              if (sizesLength > 4) {
                var thumb = post.photos[0].alt_sizes[sizesLength - 4].url;
              } else {
                thumb = post.photos[0].alt_sizes[sizesLength - 3].url;
              }

              var newObject = {
                type:  post.type,
                date:  post.date,
                epoch: epoch,
                url:   post.short_url,
                photo: post.photos[0].alt_sizes[0].url,
                thumb: thumb
              };

              JSONposts.push(newObject);
            } else {
              // var postBody = post.body;
              // console.log(postBody);
            }

            resolve();
          });
        });
      }
    ));
  }

  // console.log(promises.length);
  Promise.all(promises).then(() => {


    function compare(a, b ) {
      if ( a.epoch < b.epoch ){
        return -1;
      }
      if ( a.epoch > b.epoch ){
        return 1;
      }
      return 0;
    }

    var sortedJSON = JSONposts.sort( compare );
    // console.log(sortedJSON);

    fs.writeFile('site/data/import/tumblr.json', JSON.stringify(sortedJSON.reverse()), function(err) {
      if(err) {
        console.warn(err);
      } else {
        console.log('Tumblr posts saved.');
        cb();
      }
    });
  });

});


const client = new twitter({
  consumer_key:        process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:     process.env.TWITTER_CONSUMER_SECRET,
  access_token_key:    process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Twitter
gulp.task('data:twitter', (cb) => {

  let params = {screen_name: 'dydric', count: 200};

  client.get('statuses/user_timeline', params, function (error, tweets) {
    if (!error) {

      tweets = tweets.map((tweet) => {
        return {
          text:    tweet.text,
          url:     'https://twitter.com/dydric/status/' + tweet.id_str,
          created: tweet.created_at.substring(0, tweet.created_at.length - 11)
        };
      });

      fs.writeFile('site/data/import/tweets.json', JSON.stringify(tweets), function(err) {
        if(err) {
          console.warn(err);
        } else {
          console.log('Tweets data saved.');
          cb();
        }
      });
    }
  });
});

gulp.task('data:twitter-likes', (cb) => {

  let params = {screen_name: 'dydric', count: 200};

  client.get('favorites/list', params, function (error, tweets) {
    if (!error) {

      tweets = tweets.map((tweet) => {

        // console.log(tweet);
        return {
          text:  tweet.text,
          url:   'https://twitter.com/dydric/status/' + tweet.id_str,
          created: tweet.created_at.substring(0, tweet.created_at.length - 11),
          from: tweet.user.name
        };
      });

      fs.writeFile('site/data/import/likes.json', JSON.stringify(tweets), function(err) {
        if(err) {
          console.warn(err);
        } else {
          console.log('Likes data saved.');
          cb();
        }
      });
    }
  });
});

// Global data task
gulp.task('data', [
  'data:twitter', 'data:twitter-likes', 'data:instagram', 'data:health', 'data:workouts', 'data:spotify', 'data:tumblr'
]);

// Compile Tailwind
gulp.task('css:compile', function() {
  return gulp.src(paths.sass.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(postcss([tailwindcss('./tailwind.config.js')]))
    .pipe(rename({extname: '.css'}))
    .pipe(gulp.dest(paths.sass.dest));
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
  return gulp.src([
    './assets/css/style.css',
    '!./assets/css/*.min.css'
  ])
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./assets/css'));
});

// Run all CSS tasks
gulp.task('css', ['css:minify']);

// Concatinate and Compile Scripts
gulp.task('js:compile', function () {
  return gulp.src(paths.javascript.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(babel({
      presets: ['@babel/env'],
      sourceType: 'script'
    }))
    .pipe(concat('script.js'))
    .pipe(gulp.dest(paths.javascript.dest));
});

// Minify Scripts
gulp.task('js:minify', function() {
  return gulp.src(paths.javascript.dest + 'script.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(paths.javascript.dest));
});

// Run all JS tasks
gulp.task('js', ['js:minify']);

// Default Gulp task
gulp.task('default', ['data', 'css', 'js:compile']);

// Dev task
gulp.task('dev', ['css', 'js:compile'], function () {
  gulp.watch(['site/*.njk', 'site/includes/**/*.njk'], ['css']);
  gulp.watch('./tailwind.config.js', ['css']);
  gulp.watch('./resources/sass/**/*.scss', ['css']);
  gulp.watch('./resources/js/**/*.js', ['js:compile']);
});

// CSS Preflight
gulp.task('css:compile:preflight', function () {
  return gulp.src(paths.sass.source)
    .pipe(sass())
    .pipe(postcss([
      tailwindcss('./tailwind.config.js'),
      purgecss({
        content: [
          'site/**/*.njk'
        ],
        extractors: [
          {
            extractor: TailwindExtractor,
            extensions: ['html', 'njk']
          }
        ],
        whitelist: [
          'body',
          'html',
          'h1',
          'h2',
          'h3',
          'p',
          'blockquote',
          'ul',
          'ol',
          'table',
          'emoji',
          'zoom-overlay'
        ],
        // whitelistPatterns: [/yellow-800$/, /lightblue-400$/, /red-500$/, /green-500$/],
      })
    ]))
    .pipe(rename({extname: '.css'}))
    .pipe(gulp.dest('assets/css/'));
});

// Minify CSS [PREFLIGHT]
gulp.task('css:minify:preflight', ['css:compile:preflight'], function () {
  return gulp.src([
    './assets/css/*.css',
    '!./assets/css/*.min.css'
  ])
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./assets/css'));
});

// Run all CSS tasks
gulp.task('css:preflight', ['css:minify:preflight']);

// Build task
gulp.task('build', ['data', 'css:preflight', 'js:minify']);
