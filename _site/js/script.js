// @codekit-prepend "modernizr.js", "plugins.js", "plugins/jquery-cookie.js";

if (Function('/*@cc_on return document.documentMode===10@*/')()){
	document.documentElement.className+=' ie10';
}

$(function(){

//	COOKIES

	//RETINA
	$.cookie("isRetina", window.devicePixelRatio > 1, { path: "/" });
	
	//COOKIE-BAR
	$("#cookie-bar-text a")
		.click(function(e) {
			$("#cookie-bar").remove();
			$.cookie('cookiebar', 'true', {
				expires: 365,
				path: '/'
			});
		//e.preventDefault();
	});

	$("#cookie-bar-close").click(function(e) {
		e.preventDefault();
	});

	if($.cookie('cookiebar') === undefined) {
		$("#cookie-bar").show();
	}

//	PLACEHOLDER
	$('[placeholder]').placeholder();


//	TABELLEN
	$("table.standaard tr").each(function(){
		$(this).find("td:first").addClass("first");
	});
	$("table.rij").each(function(){
		$(this).find("tr:odd").addClass("odd");
	});
	$("table.kolom tr").each(function(){
		$(this).find("td:even").addClass("even");
	});

//	REMOVE MARGIN BIJ OPEENVOLGENDE AFBEELDINGEN
	$("figure.left, figure.right").each(function() {
		if ($(this).next("figure.left, figure.right").length >= 1) {
			if (!$(this).hasClass("noMargin")) {
				$(this).next().addClass("noMargin").after("<div class=\"clear\"></div>");
			}
		}
	});

//	CLEAR CALL TO ACTIONS
	$("a.btn").each(function(){
		if ($(this).prev(".btn").length < 0) {
			$(this).before("<div class=\"clear\"></div>");
		}
		if ($(this).next(".btn").length < 0) {
			$(this).after("<div class=\"clear\"></div>");
		}
	});

}); // END FUNCTION


$(window).load(function(){

//	EQUALHEIGHT
//	equalHeight($(".equalheight"));
	
//	BREEDTE AFBEELDING = MAXIMALE BREEDTE VOOR ONDERSCHRIFT
	$(window).on("resize", function() {
		$("figure").each(function() {
			$(this).find("figcaption").show().css("max-width", $(this).find("img").width());
		});
	}).trigger("resize");

//	MINIMALE HOOGTE VAN ARTIKEL = HOOGTE VAN ARTIKELAFBEELDING
	$(window).on("resize", function() {
		var wi = $(window).width();
		if (wi > 480){
			$("article.image").each(function() {
				$(this).css("min-height", $(this).find(".imgurl img").height());
			});
		} else if (wi < 480){
			if (!$("html").hasClass("lt_ie9")) {
				$("article.image").removeAttr('style');
			}
		}
	}).trigger("resize");

});