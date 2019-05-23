/*global module */

/*
A date formatter filter for Nunjucks
*/
module.exports = function(date) {
  var d = new Date(date);
  return d.getFullYear();
};
