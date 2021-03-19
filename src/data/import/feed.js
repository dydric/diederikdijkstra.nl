if ( process.env.ELEVENTY_PRODUCTION) {

  let Parser = require('rss-parser');
  const fs = require('fs');
  let parser = new Parser();

  module.exports = async () => {

    let feed = await parser.parseURL('https://feeds.pinboard.in/rss/secret:3582808daf663c954d58/u:dydric/starred/');
    // console.log(feed);

    // feed.items.forEach(item => {
    //   console.log(item);
    //   // console.log(item.title + ':' + item.link);
    // });

    fs.writeFile(__dirname + '/../feed.json', JSON.stringify(feed), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log('Feed saved');
      }
    });

  };
}
