const appendSuffix = n => {
  var s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

module.exports = function dateFilter(value) {
  const dateObject = new Date(value);

  const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

  // const dayWithSuffix = appendSuffix(dateObject.getDate());
  // return `${dayWithSuffix} ${months[dateObject.getMonth()]} ${dateObject.getFullYear()}`;

  return `${dateObject.getDate()} ${months[dateObject.getMonth()]} ${dateObject.getFullYear()}`;
};
