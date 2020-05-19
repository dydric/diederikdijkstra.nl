console.log(`I was loaded at ${Date(Date.now()).toString()}`);

// Twemoji
twemoji.parse(document.body);

// Toggle Menu
(function () {

  var toggleMenuLink = document.querySelector('.js-toggleMenu');
  if(toggleMenuLink) {
    toggleMenuLink.addEventListener('click', function(e){
      document.body.classList.toggle('show-menu');
      e.preventDefault();
    });
  }

})();

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

// Noise
var manageNoise = {
  canvas: document.querySelector('.noise'),
  resize: function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
};

var canvas = document.querySelector('.noise');
var ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

function noise(ctx) {

    var w = ctx.canvas.width,
        h = ctx.canvas.height,
        idata = ctx.createImageData(w, h),
        buffer32 = new Uint32Array(idata.data.buffer),
        len = buffer32.length,
        i = 0;

    for(; i < len;)
        buffer32[i++] = ((255 * Math.random())|0) << 24;

    ctx.putImageData(idata, 0, 0);
}

var toggle = true;

// added toggle to get 30 FPS instead of 60 FPS
function loop() {
    toggle = !toggle;
    if (toggle) {
        requestAnimationFrame(loop);
        return;
    }
    noise(ctx);
    requestAnimationFrame(loop);
};

loop();
