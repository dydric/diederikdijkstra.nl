twitterFetcher.fetch('354251581652336640', 'tweets', 6, true, true, false);

$(function(){

	$(".toggle-menu").click(function(e) {
		$("body").toggleClass("show-social");
		$(this).toggleClass("active");
		e.preventDefault();
	});

//	INSTAGRAM
	//$('.instagram').on('willLoadInstagram', willLoadInstagram);
	$('.instagram').on('didLoadInstagram', didLoadInstagram);
	$('.instagram').instagram({
		userId:      43506,
		accessToken: '43506.641afef.c6e98b8b3c524d669a742ad8a8387e79',
		clientId:    '641afef0e84241348544153eb29093e2',
		count:       6
	});

//	LAST.FM 
	$('.lastfm').lfm({
		APIkey:   'b81d7780087dd93aab8297803dda33c8',
		User:     'dydric',
		Behavior: 'click',
		limit:    8,
		period:   '12month'
	});

//	OWL-CAROUSEL
	$(".carousel").owlCarousel({
		navigation:            false,
		responsiveBaseWidth:   '.header',
		slideSpeed:            300,
		paginationSpeed:       400,
		singleItem:            true,
		lazyLoad:              true,
		responsiveRefreshRate: 10,
		//autoPlay:            5000,
		beforeInit : function(elem){
			random(elem);
		},
		afterAction: function(el){
			this.$owlItems.removeClass('active')
			this.$owlItems.eq(this.currentItem).addClass('active')
		}
	});

});

$(window).load(function(){

	$('.tweet__list .tweet__list__item:odd').addClass('tweet__list__item--even');
	$('.tweet__list .tweet__list__item:even').addClass('tweet__list__item--odd'); 

	// ADD TITLES TO FEEDS
	// if ($('.tweets').find('.tweet__list').length){
	// 	$(this).prepend("<h2 class='title title--h2 title--tweets'>(Re)Tweets</h2>");
	// }
	// if ($('.lastfm').find('.album').length){
	// 	$(this).prepend("<h2 class='title title--h2 title--lastfm'>TopAlbums</h2>");
	// }

	//INSTAGRAMTITEL ZIT IN DIDLOADINSTAGRAM FUNCTIE
	$('.tweets').prepend("<h2 class='title title--h2 title--tweets'>(Re)Tweets</h2>");
	$('.tweets').append("<div class='tweets__ruler'></div>");
	$('.lastfm').prepend("<h2 class='title title--h2 title--lastfm'>TopAlbums</h2>");
	$('.feeds').addClass('show');

	// OPEN LINKS DIE NAAR ANDERE WEBSITES GAAN IN NIEUW VENSTER
	$('a').each(function() {
		var a = new RegExp('/' + window.location.host + '/');
		if(!a.test(this.href)) {
			$(this).click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				window.open(this.href, '_blank');
			});
		}
	});

	$(window).on("resize", function() {
		$('.carousel__item').each(function() {
			$(this).css("height", $('.slider').height());
		});

		//equalHeight($(".tweet__list__body"));

	}).trigger("resize");

	$('body').addClass('ready');

});