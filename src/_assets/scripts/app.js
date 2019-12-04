console.log(`I was loaded at ${Date(Date.now()).toString()}`);

// Twemoji
twemoji.parse(document.body);

// Audio
(function() {

  const audio = document.querySelectorAll('.js-audio audio');

  if(audio) {
    for (var i = 0; i < audio.length; i++) {

      const audioHolder = audio[i].parentNode;
      const audioButton = audioHolder.querySelector('button');

      audioButton.addEventListener('click', function(e){

        const audio = document.querySelectorAll('.js-audio audio');
        const button = document.querySelectorAll('.js-audio button');
        const player = this.parentNode.querySelector('audio');

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
