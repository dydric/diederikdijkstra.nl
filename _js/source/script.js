// LOAD TYPEKIT
WebFont.load({
	typekit: { id: 'iez3ngi' }
});

var interval = setInterval(function() {
	NProgress.inc(.2);
	console.log((NProgress.inc().status * 100).toFixed() + "% loaded");
}, 100);

$(function() {
	$('body').addClass('loadpage');

	$('.email').html(function() {
		var address = $(this).attr('user') + '@' + $(this).attr('domain');
		$(this).attr('href', 'mailto:' + address);
	});

});

$(window).load(function(){

	clearInterval(interval);
	imagesLoaded($('.site'), function() {
		console.log('all images are loaded');

		setTimeout(function(){
			// LOADING COMPLETE!
			NProgress.done();
			// console.log("%cGo!","color: #2a2a2c; font-size: 14px; font-weight: bold");

			$('body').removeClass('loadpage').addClass('done');
			if (!Modernizr.touch) {
				moveFx();
				// scrollFx();
				hideScrolling();
			}

		}, 500);
	});

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

});

$(window).unload(function () {
	NProgress.start();
});

function moveFx(){
	var $b, $h, imageMoveDampeningX, imageMoveDampeningY, mouseEntered, mouseMovedX, mouseMovedY, moveImageLinkGreensock;

	$b = $('.fx1');
	$h = $('.fx2');

	xPos = 0;
	yPos = 0;

	$(window).on('mouseenter', function(e) {
		var xPos = 0;
		var yPos = 0;

		TweenLite.to($h, 0.6, {
			rotationY: 20*xPos,
			rotationX: 20*yPos,
			ease: Power1.easeOut,
			transformPerspective: 900,
			transformOrigin: "center"
		});
	});

	$(window).on('mousemove', function(e) {
		var xPos = (e.clientX/$(window).width())-0.5;
		var yPos = (e.clientY/$(window).height())-0.5;

		TweenLite.to($h, 0.6, {
			rotationY: 20*xPos,
			rotationX: 20*yPos,
			ease: Power1.easeOut,
			transformPerspective: 900,
			transformOrigin: "center"
		});
	});

	$(window).on('mouseleave', function(e) {
		var xPos = 0;
		var yPos = 0;

		TweenLite.to($h, 0.6, {
			rotationY: 20*xPos,
			rotationX: 20*yPos,
			ease: Power1.easeOut,
			transformPerspective: 900,
			transformOrigin: "center"
		});
	});

	moveImageLinkGreensock = function ($target, e) {
		var mouseMovedX, mouseMovedY;
		mouseMovedX = mouseEntered.x - e.pageX;
		mouseMovedY = mouseEntered.y - e.pageY;
		return TweenLite.to($target, 0.1, {
			x: mouseMovedX * imageMoveDampeningX,
			y: mouseMovedY * imageMoveDampeningY
		});
	};

	imageMoveDampeningX = -0.03;
	imageMoveDampeningY = -0.02;
	mouseEntered = {
		x: 0,
		y: 0
	};
	mouseMovedX = 0;
	mouseMovedY = 0;

	$b.on('mouseenter', function(e) {
		return mouseEntered = {
			x: e.pageX,
			y: e.pageY
		};
	});

	$b.on('mousemove', function(e) {
		var $hoveredBigLink;
		$hoveredBigLink = $(this);
		return moveImageLinkGreensock($hoveredBigLink, e, false, false);
	});

	$b.on('mouseleave', function(e) {
		var $image;
		$image = $(this);
		mouseMovedX = 0;
		mouseMovedY = 0;
		return TweenLite.to($image, 0.5, {
			x: 0,
			y: 0
		});
	});
}

function scrollFx(){
	$(window).on('scroll', function(e) {
		scrollPercentage = (1 - (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight));
		$('header').css("opacity", scrollPercentage);
	});
}

function hideScrolling(){
	$(window).on('scroll touchmove', function(e){
		clearTimeout(t);
		var t = setTimeout(function(){
			if ($(window).scrollTop() >= 100) {
				$('header').addClass('move');
			} else {
				$('header').removeClass('move');
			}
		}, 100);
	});
}

