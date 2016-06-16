// LOAD TYPEKIT
WebFont.load({
  typekit: { id: 'iez3ngi' }
});

$(function(){
  // CROSS-BROWSER EMOJI SUPPORT
  $('.band').each(function(){
    var el = $(this);
    var input = el.html();
    var output = input;
    output = emoji.replace_colons(output);
    output = emoji.replace_unified(output);
    el.html(output);
  });

});
