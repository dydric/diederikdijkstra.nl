// @codekit-prepend "modernizr.js";

if (Function('/*@cc_on return document.documentMode===10@*/')()){
	document.documentElement.className+=' ie10';
}

if (jQuery.browser.msie) {
	$("html").addClass("ie");
}