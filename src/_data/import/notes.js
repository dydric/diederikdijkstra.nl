if ( process.env.ELEVENTY_PRODUCTION ) {

  const fs = require('fs');
  const tumblr = require('tumblr');

  module.exports = async () => {

    require('dotenv').config();

    const paths = {
      tumblr: {
        dest: '/../notes.json',
        pages: 1,
        posts: 20
      }
    };

    const oauth = {
      consumer_key: process.env.TUMBLR_CONSUMER_KEY,
      consumer_secret: process.env.TUMBLR_CONSUMER_SECRET
    };

    const blog = new tumblr.Blog(process.env.NOTES_URL, oauth);
    const JSONposts = new Array();
    const promises = [];

    // console.log(process.env.NOTES_URL);

    for (var i = 0; i < paths.tumblr.pages; i++) {
      promises.push(new Promise(
        (resolve) => {
          console.log(blog);

          blog.posts({limit: paths.tumblr.posts, offset: (i * paths.tumblr.posts) }, function(error, response) {
            if (error) {
              throw new Error(error);
            }

            response.posts.map((post) => {
              var epoch = new Date(post.date).getTime() / 1000;

                // console.log(post);

                if (post.type == 'text') {
                  var newObject = {
                    id:    post.id,
                    type:  post.type,
                    date:  post.date,
                    epoch: epoch,
                    url:   post.short_url,
                    tags:  post.tags,
                    body:  post.body
                  };
                  JSONposts.push(newObject);
                }

                if (post.type == 'link') {
                  var newObject = {
                    id:           post.id,
                    type:         post.type,
                    date:         post.date,
                    epoch:        epoch,
                    url:          post.short_url,
                    tags:         post.tags,
                    body:         post.description,
                    link:         post.url,
                    link_title:   post.title,
                    link_excerpt: post.excerpt
                  };
                  JSONposts.push(newObject);
                }

                if (post.type == 'audio') {
                  var newObject = {
                    id:           post.id,
                    type:         post.type,
                    date:         post.date,
                    epoch:        epoch,
                    url:          post.short_url,
                    tags:         post.tags,
                    body:         post.caption,
                    audio_link:   post.source_url,
                    audio_artist: post.artist,
                    audio_track:  post.track_name,
                    audio_cover:  post.album_art
                  };
                  JSONposts.push(newObject);
                }

                if (post.type == 'photo') {
                  var newObject = {
                    id:    post.id,
                    type:  post.type,
                    date:  post.date,
                    epoch: epoch,
                    url:   post.short_url,
                    tags:  post.tags,
                    body:  post.caption,
                    image: post.photos[0].alt_sizes[0].url
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

      fs.writeFile(__dirname + paths.tumblr.dest, JSON.stringify(sortedJSON.reverse()), err => {
        if(err) {
          console.log(err);
        } else {
          console.log("Updated notes.json");
        }
      });

    });
  };
}
