// Auto-link URLs in a string
// Usage: mystring.parseURL()
String.prototype.parseURL = function() {
  return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function( url ) {
    // return url.link( url );
    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
  });
};

// Auto-link Twitter usernames in a string
// Usage: mystring.parseUsername()
String.prototype.parseUsername = function() {
  return this.replace(/[@]+[A-Za-z0-9-_]+/g, function( u ) {
    var username = u.replace("@","");
    // return u.link( 'http://twitter.com/' + username );
    return '<a href="http://twitter.com/' + username + '" target="_blank" rel="noopener noreferrer">' + u + '</a>';
  });
};

// Auto-link Twitter hashtags in a string
// Usage: mystring.parseHashtag()
String.prototype.parseHashtag = function() {
  return this.replace(/[#]+[A-Za-z0-9-_]+/g, function( t ) {
    var tag = t.replace("#","");
    // return t.link( 'http://search.twitter.com/search?q=' + tag );
    return '<a href="https://twitter.com/hashtag/' + tag + '" target="_blank" rel="noopener noreferrer">' + t + '</a>';
  });
};

module.exports = function tweetText(value) {
  // Remove last link from tweet
  const text = value.replace(/https:\/\/t\.co\/\S+\s*$/g, "");
  const cleantext = text.parseURL().parseUsername().parseHashtag();

  return `${cleantext}`;
};
