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
      count: 99
    };

    client.get('statuses/user_timeline', params, function (error, tweets) {
      if (!error) {

        tweets = tweets.map((tweet) => {
          // console.log(tweet);

          if (tweet.is_quote_status == false) {

            return {
              text:    tweet.text,
              url:     'https://twitter.com/dydric/status/' + tweet.id_str,
              created: tweet.created_at.substring(),
              retweet: tweet.retweeted
            };

          } else {

            return {
              text:    tweet.text,
              url:     'https://twitter.com/dydric/status/' + tweet.id_str,
              created: tweet.created_at.substring(),
              retweet: tweet.retweeted,
              quote: tweet.retweeted_status.quoted_status.text
            };

          }

        });

        fs.writeFile(__dirname + '/../tweets.json', JSON.stringify(tweets), err => {
          if(err) {
            console.log(err);
          } else {
            console.log("Updated tweets.json");
          }
        });
      }
    });

  }
}
