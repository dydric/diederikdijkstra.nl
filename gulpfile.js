/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
/*global require, process */
/* exported gulp, parallel */

//  General
const { gulp, src, dest, watch, series, parallel } = require('gulp');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');

// Styles
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const tailwindcss = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');

// Scripts
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

// Imports
const fs = require('fs');
const spotifyWebApi = require('spotify-web-api-node');
const Instagram = require('node-instagram').default;
const tumblr = require('tumblr');
const twitter = require('twitter');

/**
 * File paths
 */
const paths = {
    sass: {
        source: './resources/sass/style.scss',
        dest: 'assets/css/'
    },
    javascript: {
        source:
            [
                './resources/js/utilities/*.js',
                './resources/js/local/*.js'
            ],
        dest: 'assets/javascript/'
    },
    data: {
        twitter: {
            dest: './site/data/import/tweets.json',
            screenname: 'dydric',
            count: 200
        },
        tumblr: {
            dest: './site/data/import/tumblr.json',
            pages: 51,
            posts: 20
        },
        instagram: {
            dest: './site/data/import/instagram.json'
        },
        spotify: {
            dest: './site/data/import/playlists/',
            playlists: [
                ['5C2AFaNulz8Wz6Tb6UPVfv', '2019_01.json'],
                ['6ShQiKq8bZF98ikrMlQVzy', '2019_02.json'],
                ['0NEo9bAKRbbhWvUGJzrSGh', '2019_03.json'],
                ['1GqnOwVW7VaWcivCpWVUZa', '2019_04.json'],
                ['0vGdLCvf1ohz0ybSPzTSJZ', '2019_05.json'],
                ['1urJgpzBntEN7rRF9YW0Gj', '2019_06.json'],
                ['6FlVlVj5kd3uQEtGhN1a2m', '2019_07.json'],
                ['6sNv1lYvJTwF6OrHu6tHTg', '2019_08.json'],
                ['43VdZl4vBgpROXbfgjCDVR', '2019_09.json'],
                ['7JXe7hZlzX2FCY7wBaIsox', '2019_10.json'],
                ['3Q0jxbxKS8Tid3jgr1ScVz', '2019_11.json'],
                ['41wLOutl8A36WoqAPltlZ6', '2019_12.json']
            ]
        }
    }
};


/**
 * Errors function
 */
var onError = function(err) {
    notify.onError({
        title: "Gulp Error - Compile Failed",
        message: "Error: <%= error.message %>"
    })(err);

    this.emit('end');
}


/**
 * Tailwind extractor
 */
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:\/]+/g) || [];
    }
}


/**
 * Import Data
 */
require('dotenv').config();

/**
 * Import Twitter Posts
 */
const client = new twitter({
    consumer_key:        process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:     process.env.TWITTER_CONSUMER_SECRET,
    access_token_key:    process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const twitterImport = (done) => {

    let params = {
        screen_name: paths.data.twitter.screenname,
        count: paths.data.twitter.count
    };

    client.get('statuses/user_timeline', params, function (error, tweets) {
      if (!error) {

        tweets = tweets.map((tweet) => {
          return {
            text:    tweet.text,
            url:     'https://twitter.com/' + paths.data.twitter.screenname + '/status/' + tweet.id_str,
            created: tweet.created_at.substring(0, tweet.created_at.length - 11)
          };
        });

        fs.writeFile(paths.data.twitter.dest, JSON.stringify(tweets), function(){});
      }
    });

    done();
}

/**
 * Import Tumblr Posts
 */
const oauth = {
    consumer_key: process.env.TUMBLR_CONSUMER_KEY,
    consumer_secret: process.env.TUMBLR_CONSUMER_SECRET
  };

const tumblrImport = (done) => {

    const blog = new tumblr.Blog(process.env.TUMBLR_URL, oauth);
    const JSONposts = new Array();
    const promises = [];

    for (var i = 0; i < paths.data.tumblr.pages; i++) {
        promises.push(new Promise(
            (resolve) => {
                blog.photo({limit: paths.data.tumblr.posts, offset: (i * paths.data.tumblr.posts) }, function(error, response) {
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
                        }
                        resolve();
                    });
                });
            }
        ));
    }

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

        var sortedJSON = JSONposts.sort(compare);
        fs.writeFile(paths.data.tumblr.dest, JSON.stringify(sortedJSON.reverse()), function() {});
    });
    done();
}

/**
 * Import Instagram Posts
 */
const instagram = new Instagram({
    clientId: process.env.INSTAGRAM_CLIENTID,
    clientSecret: process.env.INSTAGRAM_CLIENTSECRET,
    accessToken: process.env.INSTAGRAM_ACCESSTOKEN,
});

const instagramImport = (done) => {
    instagram.get('users/self/media/recent').then(data => {
        var instagramPosts = data;
        fs.writeFile(paths.data.instagram.dest, JSON.stringify(instagramPosts), function(){});
      });
    done();
}

/**
 * Import Spotify Playlist
 */
const spotify = new spotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENTID,
    clientSecret: process.env.SPOTIFY_CLIENTSECRET
});

const spotifyImport = (done) => {
    spotify.clientCredentialsGrant()
        .then(function(data) {
            spotify.setAccessToken(data.body['access_token']);
            paths.data.spotify.playlists.forEach(function(playlist) {
                spotify.getPlaylistTracks(playlist[0])
                    .then(function(data) {
                        var playlistTracks = data.body;
                        fs.writeFile(paths.data.spotify.dest + playlist[1], JSON.stringify(playlistTracks), function(){});
                    }, function(err) {
                        console.log('Something went wrong!', err);
                    });
            });
        });
    done();
}


/**
 * Compile SCSS & Tailwind
 */
const compileCSS = (done) => {
    return src(paths.sass.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(postcss([
        tailwindcss('./tailwind.config.js')
    ]))
    .pipe(rename({
        extname: '.css'
    }))
    .pipe(dest(paths.sass.dest))
    .pipe(notify({
        message: 'Tailwind Compile Success'
    }));
    done();
}


/**
 * Concatinate and compile scripts
 */
const compileJS = (done) => {
    return src(paths.javascript.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(babel({
        presets: ['@babel/env'],
        sourceType: 'script'
    }))
    .pipe(concat('script.js'))
    .pipe(dest(paths.javascript.dest))
    .pipe(notify({
        message: 'Javascript Compile Success'
    }));
    done();
}


/**
 * Minify scripts
 * This will be ran as part of our preflight task
 */
const minifyJS = (done) => {
    return src(paths.javascript.dest + 'script.js')
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(dest(paths.javascript.dest))
    .pipe(notify({
        message: 'Javascript Minify Success'
    }));
    done();
}


/**
 * Watch files
 */
const watchFiles = (done) => {
    watch([
        'site/*.njk',
        'site/includes/**/*.njk',
    ], series(compileCSS));
    watch('./tailwind.config.js', series(compileCSS));
    watch('./resources/sass/**/*.scss', series(compileCSS));
    watch('./resources/js/**/*.js', series(compileJS));
    done();
}


/**
 * CSS Preflight
 *
 * Compile SCSS & Tailwind [PREFLIGHT]
 */
const compileCSSPreflight = (done) => {
    return src(paths.sass.source)
    .pipe(sass())
    .pipe(postcss([
        tailwindcss('./tailwind.config.js'),
        purgecss({
            content: [
                'site/*.njk',
                'site/includes/**/*.njk',
            ],
            extractors: [
                {
                    extractor: TailwindExtractor,
                    extensions: ['html', 'njk'],
                }
            ],
            /**
             * You can whitelist selectors to stop purgecss from removing them from your CSS.
             * see: https://www.purgecss.com/whitelisting
             *
             * Any selectors defined below will not be stripped from the main.min.css file.
             * PurgeCSS will not purge the main.css file, as this is useful for development.
             *
             * @since 1.0.0
             */
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
                'zoom-overlay',
                'playing'
            ],
        })
    ]))
    .pipe(rename({
        extname: '.css'
    }))
    .pipe(dest('assets/css/'))
    .pipe(notify({
        message: 'CSS & Tailwind [PREFLIGHT] Success'
    }));
}


/**
 * Minify CSS [PREFLIGHT]
 */
const minifyCSSPreflight = (done) => {
    return src([
        './assets/css/*.css',
        '!./assets/css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(dest('./assets/css'))
    .pipe(notify({
        message: 'Minify CSS [PREFLIGHT] Success'
    }));
}


/**
 * [IMPORT] task
 */
exports.data = series(spotifyImport, instagramImport, tumblrImport, twitterImport);

/**
 * [BUILD] task
 * Run this once you'yare happy with your site and you want to prep the files for production.
 *
 * This will run the Preflight tasks to minify our CSS and scripts, as well as pass the CSS through PurgeCSS to remove any unused CSS.
 *
 * Always double check that everything is still working. If something isn't displaying correctly, it may be because you need to add it to the PurgeCSS whitelist.
 */
exports.build = series(compileCSSPreflight, minifyCSSPreflight, minifyJS);

/**
 * [DEFAULT] task
 */
exports.default = series(compileCSS, compileJS, watchFiles);


