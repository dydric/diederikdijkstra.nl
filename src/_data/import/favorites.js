if ( process.env.ELEVENTY_PRODUCTION ) {

  const fs = require('fs');
  const twitter = require('twitter');

  module.exports = async () => {

    require('dotenv').config();

    const client = new twitter({
      consumer_key:        process.env.TWITTER_CONSUMER_KEY,
      consumer_secret:     process.env.TWITTER_CONSUMER_SECRET,
      access_token_key:    process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    let params = {
      screen_name: 'dydric',
      count: 24
    };

    client.get('favorites/list', params, function (error, tweets) {
      if (!error) {

        tweets = tweets.map((tweet) => {

          // console.log(tweet);

          var media = "";

          if (tweet.entities.media) {
            // console.log(tweet.entities.media);

            media = tweet.entities.media;
          }



          var epoch = new Date(tweet.created_at.substring()).getTime() / 1000;

          return {
            type: 'favorite',
            text:    tweet.text,
            id: tweet.id,
            url:     'https://twitter.com/dydric/status/' + tweet.id_str,
            created: tweet.created_at.substring(),
            epoch: epoch,
            media: media,
            user: tweet.user
          };
        });

        fs.writeFile(__dirname + '/../favorites.json', JSON.stringify(tweets), err => {
          if(err) {
            console.log(err);
          } else {
            console.log("Updated tweets.json");
          }
        });
      }
    });

  };
}
