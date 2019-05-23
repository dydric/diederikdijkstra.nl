/*global module */

/*
  A simple ISO timestamp for Nunjucks
*/
module.exports = function () {
  let timestamp = new Date();
  return timestamp.getFullYear() + '-' + (timestamp.getMonth() + 1) + '-' + timestamp.getDate();
};
