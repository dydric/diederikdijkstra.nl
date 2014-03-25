if (/*@cc_on!@*/false && document.documentMode === 10) {
	document.documentElement.className+=' ie10';
}

var mobile = (/iphone|ipod|android|blackberry|mini|windowssce|palm/i.test(navigator.userAgent.toLowerCase()));
var isiPad = navigator.userAgent.match(/iPad/i) !== null;

function createPhotoElement(photo) {
	var innerHtml = $('<img>')
		.addClass('instagram__image')
		.attr('src', photo.images.low_resolution.url);
	return $('<li>')
		.addClass('instagram__item')
		.attr('id', photo.id)
		.append(innerHtml);
}

function willLoadInstagram() {
	$("body").addClass("start");
}

function didLoadInstagram(event, response) {
	var that = this;
	$.each(response.data, function(i, photo) {
		$(that).append(createPhotoElement(photo));
	});
	$(that).find('.instagram__item').wrapAll("<ul class='instagram__list'></ul>");

	$(that).imagesLoaded( function() {
		$('body').addClass('complete');
	});
}

$(function(){ 

	setTimeout(function(){ $("body").addClass("start"); }, 2000);

	$(".header__link").click(function(e) {
		$('body').scrollTo('.default', 400);
		e.preventDefault();
	});

	$('.instagram').on('willLoadInstagram', willLoadInstagram);
	$('.instagram').on('didLoadInstagram', didLoadInstagram);
	$('.instagram').instagram({
		userId: 43506,
		accessToken: '43506.641afef.c6e98b8b3c524d669a742ad8a8387e79',
		clientId: '641afef0e84241348544153eb29093e2',
		count: 32
	});

	$(window).on("resize", function() {
/*
		var wi = $(window).width();
		if (wi < 1024){
			$('.index .header').removeAttr('style');
			$('.index .header').css("height", $(window).height());
		} else {
			$('.index .header').removeAttr('style');
			$('.index .header').css("min-height", $(window).height());
		}
*/
		$('.header').css("height", $(window).height());
		$('.default').css("min-height", $(window).height());
		$('.header').css("min-height", $('.header__content').outerHeight(true));

	}).trigger("resize");

}); // END FUNCTION

$(window).load(function(){

});
