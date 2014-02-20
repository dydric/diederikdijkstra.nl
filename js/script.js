// @codekit-prepend "modernizr.js";

if (Function('/*@cc_on return document.documentMode===10@*/')()){
	document.documentElement.className+=' ie10';
}

var isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);

$(function(){
	if isIE11{
		$('html').addClass("ie");
	}
});
