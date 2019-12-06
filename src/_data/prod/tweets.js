const fs = require('fs');
const twitter = require('twitter');

module.exports = () => {

  require('dotenv').config();

  const client = new twitter({
    consumer_key:        process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:     process.env.TWITTER_CONSUMER_SECRET,
    access_token_key:    process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  let params = {
    screen_name: 'dydric',
    count: 20
  };

  client.get('statuses/user_timeline', params, function (error, tweets) {
    if (!error) {

      tweets = tweets.map((tweet) => {
        return {
          text:    tweet.text,
          url:     'https://twitter.com/dydric/status/' + tweet.id_str,
          created: tweet.created_at.substring(0, tweet.created_at.length - 11)
        };
      });

      fs.writeFile(__dirname + '/../dev/tweets.json', JSON.stringify(tweets), err => {
        if(err) {
          console.log(err);
        } else {
          console.log("Updated tweets.json");
        }
      });
    }
  });

}
