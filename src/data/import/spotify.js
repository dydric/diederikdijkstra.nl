if ( process.env.ELEVENTY_PRODUCTION) {

  const fs = require('fs');
  const auth = require('spotify-personal-auth');
  const spotifyWebApi = require('spotify-web-api-node');

  module.exports = async () => {

    require('dotenv').config();

    // Configure module
    auth.config({
      port: 8080,
      clientId: process.env.SPOTIFY_CLIENTID,
      clientSecret: process.env.SPOTIFY_CLIENTSECRET,
      scope: ['user-modify-playback-state', 'user-top-read'], // Replace with your array of needed Spotify scopes
    });

    const api = new spotifyWebApi();

    /* Get token promise, the token will refresh if this is called when it has expired,
    * But you can get the refresh token if you would rather handle it
    * It is resolve as an array containing the token and refresh as shown below
    */
    auth.token().then(([token, refresh]) => {
      // Sets api access and refresh token
      api.setAccessToken(token);
      api.setRefreshToken(refresh);

      api.getMyTopTracks()
        .then(function(data) {
          let topTracks = data.body.items;
          // console.log(topTracks);

          fs.writeFile(__dirname + '/../spotifytoptracks.json', JSON.stringify(topTracks), function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log('Spotify top tracks saved');
            }
          });

        }, function(err) {
          console.log('Something went wrong!', err);
        });


        api.getMyTopArtists()
          .then(function(data) {
            let topArtists = data.body.items;
            //console.log(topArtists);

            fs.writeFile(__dirname + '/../spotifytopartists.json', JSON.stringify(topArtists), function(err) {
              if(err) {
                console.log(err);
              } else {
                console.log('Spotify top artists saved');
              }
            });
          }, function(err) {
            console.log('Something went wrong!', err);
          });

    },
    function(err) {
      console.log('Something went wrong!', err);
    });
  };
}
