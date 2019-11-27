/*global twemoji */
twemoji.parse(document.body);
/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
// Audio
(function () {
  var audio = document.querySelectorAll('.js-audio audio');

  if (audio) {
    for (var i = 0; i < audio.length; i++) {
      var audioHolder = audio[i].parentNode;
      var audioButton = audioHolder.querySelector('button');
      audioButton.addEventListener('click', function (e) {
        var audio = document.querySelectorAll('.js-audio audio');
        var button = document.querySelectorAll('.js-audio button');
        var player = this.parentNode.querySelector('audio');

        if (player.duration > 0 && !player.paused) {
          this.classList.remove('playing');
          player.pause();
        } else {
          for (var i = 0; i < button.length; i++) {
            button[i].classList.remove('playing');
          }

          for (i = 0; i < audio.length; i++) {
            audio[i].pause();
          }

          this.classList.add('playing');
          player.play();
        }

        e.preventDefault();
      });
    }
  }
})();