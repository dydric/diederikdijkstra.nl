/*global module */
/*
A date formatter filter for Nunjucks
*/
module.exports = function(date) {
  var d = new Date(date);
  var month = [
    'Januari',
    'Februari',
    'Maart',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Augustus',
    'September',
    'Oktober',
    'November',
    'December'
  ];
  return d.getDate() + ' ' + month[d.getMonth()];
};
