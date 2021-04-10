// Auto-link URLs in a string
// Usage: mystring.parseURL()
String.prototype.parseURL = function() {
  return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function( url ) {
    return url.link( url );
  });
};

// Auto-link Twitter usernames in a string
// Usage: mystring.parseUsername()
String.prototype.parseUsername = function() {
  return this.replace(/[@]+[A-Za-z0-9-_]+/g, function( u ) {
    var username = u.replace("@","");
    return u.link( 'http://twitter.com/' + username );
  });
};

// Auto-link Twitter hashtags in a string
// Usage: mystring.parseHashtag()
String.prototype.parseHashtag = function() {
  return this.replace(/[#]+[A-Za-z0-9-_]+/g, function( t ) {
    var tag = t.replace("#","%23");
    return t.link( 'http://search.twitter.com/search?q=' + tag );
  });
};

module.exports = function tweetText(value) {
  const text = value.parseURL().parseUsername().parseHashtag();
  return `${text}`;
};
