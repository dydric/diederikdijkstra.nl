if ( process.env.ELEVENTY_PRODUCTION) {

  const fs = require('fs');
  const tumblr = require('tumblr');

  module.exports = async () => {

    require('dotenv').config();

    const paths = {
      tumblr: {
        dest: '/../tumblr.json',
        pages: 36,
        posts: 20
      }
    };

    const oauth = {
      consumer_key: process.env.TUMBLR_CONSUMER_KEY,
      consumer_secret: process.env.TUMBLR_CONSUMER_SECRET
    };

    const blog = new tumblr.Blog(process.env.TUMBLR_URL, oauth);
    const JSONposts = new Array();
    const promises = [];

    for (var i = 0; i < paths.tumblr.pages; i++) {
      promises.push(new Promise(
        (resolve) => {
          blog.photo({limit: paths.tumblr.posts, offset: (i * paths.tumblr.posts) }, function(error, response) {
            if (error) {
                throw new Error(error);
            }

            response.posts.map((post) => {
              var epoch = new Date(post.date).getTime() / 1000;

                // console.log(post);

                if (post.type == 'photo') {

                  var sizesLength = post.photos[0].alt_sizes.length;
                  if (sizesLength > 4) {
                    var thumb = post.photos[0].alt_sizes[sizesLength - 4].url;
                  } else {
                    thumb = post.photos[0].alt_sizes[sizesLength - 3].url;
                  }

                  var newObject = {
                    id:    post.id,
                    type:  post.type,
                    date:  post.date,
                    epoch: epoch,
                    url:   post.short_url,
                    tags:  JSON.stringify(post.tags),
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

      fs.writeFile(__dirname + paths.tumblr.dest, JSON.stringify(sortedJSON.reverse()), err => {
        if(err) {
          console.log(err);
        } else {
          console.log("Updated tumblr.json");
        }
      });

    });
  }
}
