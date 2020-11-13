if ( process.env.ELEVENTY_PRODUCTION ) {

  const fs = require('fs');
  const spotifyWebApi = require('spotify-web-api-node');

  module.exports = async () => {

    require('dotenv').config();

    const paths = {
      spotify: {
        dest: '/../',
        playlists: [
          ['0phr7QOeXCConRswu3ZEtv', 'musiclog/2020_shortlist.json'],
          ['7D9pAnq8UVKaHayto9TDaL', 'musiclog/2020_albums.json'],
          ['6qvsOeXvvBmpCiMzLIAEdS', 'musiclog/2019_albums.json'],
          ['0U2gEvXyHaY67UPObHltWl', 'musiclog/2019_shortlist.json']
        ]
      }
    };

    const spotify = new spotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENTID,
      clientSecret: process.env.SPOTIFY_CLIENTSECRET
    });

    spotify.clientCredentialsGrant()
    .then(function(data) {
      spotify.setAccessToken(data.body.access_token);

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
  };
}
