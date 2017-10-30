/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
/*global charming, anime, Waypoint, imagesLoaded, TweenMax, Elastic, Power2 */

var body = document.body;
var section = document.querySelector('.section');
var sections = document.querySelectorAll('.section');

// CHARMING
const h1title = document.querySelector('h1');
if(h1title) {
  charming(h1title);
}

// ONLY WHEN BODY HASCLASS BODY--HOME
if (body.classList.contains('body--home')) {

  // SLIDER
  const headerslides = document.querySelectorAll('.slider li');
  const headerimg = document.querySelectorAll('.slider li .bgimg');

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

}

const btn1 = document.querySelector('.buttons li:nth-child(1) .button');
const btn2 = document.querySelector('.buttons li:nth-child(2) .button');
const btn3 = document.querySelector('.buttons li:nth-child(3) .button');

// MOVE BUTTONS
if(btn1) {
  class HoverButton {
    constructor(el) {
      this.el = el;
      this.hover = false;
      this.calculatePosition();
      this.attachEventsListener();
    }

    attachEventsListener() {
      window.addEventListener('mousemove', e => this.onMouseMove(e));
      window.addEventListener('resize', e => this.calculatePosition(e));
    }

    calculatePosition() {
      TweenMax.set(this.el, {
        x: 0,
        y: 0,
        scale: 1
      });
      const box = this.el.getBoundingClientRect();
      this.x = box.left + (box.width * 0.5);
      this.y = box.top + (box.height * 0.5);
      this.width = box.width;
      this.height = box.height;
    }

    onMouseMove(e) {
      let hover = false;
      let hoverArea = (this.hover ? 0.7 : 0.5);
      let x = e.clientX - this.x;
      let y = e.clientY - this.y;
      let distance = Math.sqrt( x*x + y*y );
      if (distance < (this.width * hoverArea)) {
        hover = true;
        if (!this.hover) {
          this.hover = true;
        }
        this.onHover(e.clientX, e.clientY);
      }

      if(!hover && this.hover) {
        this.onLeave();
        this.hover = false;
      }
    }

    onHover(x, y) {
      TweenMax.to(this.el, 0.4, {
        x: (x - this.x) * 0.4,
        y: (y - this.y) * 0.4,
        scale: 1.15,
        ease: Power2.easeOut
      });
      // this.el.style.zIndex = 10;
    }
    onLeave() {
      TweenMax.to(this.el, 0.7, {
        x: 0,
        y: 0,
        scale: 1,
        ease: Elastic.easeOut.config(1.2, 0.4)
      });
      // this.el.style.zIndex = 1;
    }
  }

  new HoverButton(btn1);
  new HoverButton(btn2);
  new HoverButton(btn3);

}

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
