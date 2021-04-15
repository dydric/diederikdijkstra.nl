if ( process.env.ELEVENTY_PRODUCTION) {

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
      count: 200,
      tweet_mode: 'extended'
    };

    client.get('favorites/list', params, function (error, favorites) {
      if (!error) {

        fs.writeFile(__dirname + '/../twitterfavs.json', JSON.stringify(favorites), err => {
          if(err) {
            console.log(err);
          } else {
            console.log("Updated twitterfavs.json");
          }
        });
      }
    });

  };
}
