const fs = require('fs');
const Instagram = require('node-instagram').default;

module.exports = () => {

  // require('dotenv').config();

  // const instagram = new Instagram({
  //   clientId: process.env.INSTAGRAM_CLIENTID,
  //   clientSecret: process.env.INSTAGRAM_CLIENTSECRET,
  //   accessToken: process.env.INSTAGRAM_ACCESSTOKEN,
  // });

  // instagram.get('users/self/media/recent').then(data => {
  //   var instagramPosts = data;

  //   fs.writeFile(__dirname + '/../dev/instagram.json', JSON.stringify(instagramPosts), err => {
  //     if(err) {
  //       console.log(err);
  //     } else {
  //       console.log("Updated instagram.json");
  //     }
  //   });
  // });
}
