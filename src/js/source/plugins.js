//EQUALHEIGHTS
function equalHeight(obj){
	var topHeight = 0;
	obj.css({height: 'auto'});
	obj.each(function(){
		topHeight = ($(this).height() > topHeight ? $(this).height() : topHeight);
	});
	obj.height(topHeight);
}

//VALID EMAILADDRESS
//function isValidEmailAddress(emailAddress){
//	var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
//	return pattern.test(emailAddress);
//};

//VALID POSTCODE
//function isValidPostcode(postcode){
//	var pattern = new RegExp(/^[0-9]{4} ?[A-Z]{2}$/i);
//	return pattern.test(postcode);
//};

function isValidEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function isValidDate(s) {
	if(!parseDate(s)){
		return false
	}

	var bits = s.split("-");

	var y = bits[2], m  = bits[1], d = bits[0];
	// Assume not leap year by default (note zero index for Jan)
	var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

	// If evenly divisible by 4 and not evenly divisible by 100,
	// or is evenly divisible by 400, then a leap year
	if ( (!(y % 4) && y % 100) || !(y % 400)) {
		daysInMonth[1] = 29;
	}
	return d <= daysInMonth[--m]
}

function parseDate(str) {
	var m = str.match(/^(\d{1,2})\-(\d{1,2})\-(\d{4})$/);
	return (m) ? new Date(m[3], m[2]-1, m[1]) : null;
}

//PLACEHOLDER
(function($) {
	var native_support = ('placeholder' in document.createElement('input'));
	$.fn.placeholder = function(command) {
		if(!native_support) {
			if(command) {
				switch(command) {
					case 'clear':
						this.each(function() {
							var el = $(this);
							if(el.data('isEmpty') || el.val() === el.attr('placeholder')) {
								el.val('');
							}
						});
					break;
				}
				return this;
			}

			this.each(function() {
				if(!$(this).data('gotPlaceholder')) {
					$(this).focus(function() {
						var el = $(this);
						if(el.data('isEmpty')) {
							el.val('').removeClass('placeholder');
						}
					}).blur(function() {
						var el = $(this);
						if(el.data('isEmpty') || !el.val().length) {
							el.val(el.attr('placeholder')).addClass('placeholder');
						}
					}).keyup(function() {
						var el = $(this);
						el.data('isEmpty', (el.val().length === 0));
					}).data('gotPlaceholder', true);

					if(!$(this).val().length || $(this).val() === $(this).attr('placeholder')) {
						$(this).val($(this).attr('placeholder')).addClass('placeholder').data('isEmpty', true);
					}
				}
			});
		}

		return this;
	};
})(jQuery);