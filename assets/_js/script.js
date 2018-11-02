/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
/*global twemoji */

twemoji.parse(document.body);

// Get current time
var bg = document.querySelector('.bg');

if (bg) {
  var currentdate = new Date();
  bg.classList.add('bg--H' + currentdate.getHours());
  // bg.classList.add('bg--H14');
}
