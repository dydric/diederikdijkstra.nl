/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
/*global charming, anime, Waypoint, imagesLoaded */

var body = document.body;
var section = document.querySelector('.section');
var sections = document.querySelectorAll('.section');

// CHARMING
const element = document.querySelector('h1');
charming(element);

// SLIDER
var headerslides = document.querySelectorAll('.slider li');
var headerimg = document.querySelectorAll('.slider li .bgimg');

var slider = anime({
  targets: headerslides,
  autoplay: false,
  translateX: [
    { value: '-100%', duration: 5000, easing: 'easeOutExpo'},
    { value: '-200%', duration: 2500, easing: 'easeOutExpo'}
  ],
  loop: true,
  delay: function(el, i) {
    return i * 5000;
  },
  run: function(anim) {
    // Start slider again at 5000ms when progress is 90%
    // console.log('progress : ' + Math.round(anim.progress) + '%');
    if (Math.round(anim.progress) >= 90) {
      slider.pause();
      slider.seek(5000);
      slider.play();
    }
  },
});

// START SLIDER WHEN READY
imagesLoaded( headerimg, { background: true }, function() {
  slider.play();
});

// // WAYPOINTS
// for (var i = 0; i < sections.length; i++) {
//   var waypoint = new Waypoint({
//     element: sections[i],
//     handler: function() {
//       var previousWaypoint = this.previous();
//       var nextWaypoint = this.next();

//       this.element.classList.remove('section--prev', 'section--next', 'section--active');
//       this.element.classList.add('section--active');

//       if (previousWaypoint) {
//         previousWaypoint.element.classList.add('section--prev');
//         previousWaypoint.element.classList.remove('section--active');
//       }

//       if (nextWaypoint) {
//         nextWaypoint.element.classList.add('section--next');
//         nextWaypoint.element.classList.remove('section--active');
//       }
//     },
//     offset: '50%'
//   });
// }
