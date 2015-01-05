$(function(){

	// COOKIES
	// RETINA
	$.cookie("isRetina", window.devicePixelRatio > 1, { path: "/" });

	// //COOKIE-BAR
	// $(".cookie-bar__text a")
	// 	.click(function() {
	// 		$(".cookie-bar").remove();
	// 		$.cookie('cookiebar', 'true', {
	// 			expires: 365,
	// 			path: '/'
	// 		});
	// 	// e.preventDefault();
	// });

	// $(".cookie-bar__close").click(function(e) {
	// 	e.preventDefault();
	// });

	// if($.cookie('cookiebar') === undefined) {
	// 	$(".cookie-bar").show();
	// }

	// PLACEHOLDER
	$('[placeholder]').placeholder();

	// REMOVE MARGIN BIJ OPEENVOLGENDE AFBEELDINGEN
	$(".figure--left, .figure--right").each(function() {
		if ($(this).next(".figure--left, .figure--right").length >= 1) {
			if (!$(this).hasClass("figure--no-margin")) {
				$(this).next().addClass("figure--no-margin").after("<div class=\"clear\"></div>");
			}
		}
	});

	// CLEAR CALL TO ACTIONS
	$("a.button").each(function(){
		if ($(this).prev(".button").length < 0) {
			$(this).before("<div class=\"clear\"></div>");
		}
		if ($(this).next(".button").length < 0) {
			$(this).after("<div class=\"clear\"></div>");
		}
	});


	// OWL CAROUSEL
	$(".product__image__slider").owlCarousel({
		singleItem: true,
		pagination: false
	});
	$(".product__image__thumbnails").owlCarousel({
		items: 4,
		itemsMobile: [479, 4]
	});
	$(".product__image__thumbnails .owl-item").on("click", function() {
		$(".product__image__slider").data("owlCarousel").goTo($(this).index());
	});

	// COLORBOX
	$(".colorbox").colorbox({ 
		rel: "colorbox",
		current: "afbeelding {current} van {total}",
		previous: "vorige",
		next: "volgende",
		close: "sluiten",
		xhrError: "De inhoud kan niet worden geladen",
		imgError: "De afbeelding kan niet worden geladen"
	});
	$(".colorbox--iframe").colorbox({ 
		iframe: true,
		width: "80%",
		height: "80%"
	});

}); // END FUNCTION

$(window).load(function(){

	// EQUALHEIGHT
	// equalHeight($(".equalheight"));

	// BREEDTE AFBEELDING = MAXIMALE BREEDTE VOOR ONDERSCHRIFT
	$(window).on("resize", function() {
		$("figure").each(function() {
			$(this).find("figcaption").show().css("max-width", $(this).find("img").width());
		});
	}).trigger("resize");

});
