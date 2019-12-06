const fs = require('fs');
const spotifyWebApi = require('spotify-web-api-node');
module.exports = () => {

  require('dotenv').config();

  const paths = {
    spotify: {
      dest: '/../dev/spotify/',
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
  };

  const spotify = new spotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENTID,
    clientSecret: process.env.SPOTIFY_CLIENTSECRET
  });

  spotify.clientCredentialsGrant()
  .then(function(data) {
    spotify.setAccessToken(data.body['access_token']);

    paths.spotify.playlists.forEach(function(playlist) {
      spotify.getPlaylistTracks(playlist[0])
        .then(function(data) {
          var playlistTracks = data.body;

          fs.writeFile(__dirname + paths.spotify.dest + playlist[1], JSON.stringify(playlistTracks), err => {
            if(err) {
              console.log(err);
            } else {
              console.log('Updated spotify playlist: ' + playlist[1] + ' .json');
            }
          });

        }, function(err) {
          console.log('Something went wrong!', err);
        });
    });
  });


}
