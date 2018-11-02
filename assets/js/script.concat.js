(function(){
	'use strict';
	if(!window.addEventListener){return;}

	var regWhite = /\s+/g;
	var regSplitSet = /\s*\|\s+|\s+\|\s*/g;
	var regSource = /^(.+?)(?:\s+\[\s*(.+?)\s*\])?$/;
	var allowedBackgroundSize = {contain: 1, cover: 1};
	var proxyWidth = function(elem){
		var width = lazySizes.gW(elem, elem.parentNode);

		if(!elem._lazysizesWidth || width > elem._lazysizesWidth){
			elem._lazysizesWidth = width;
		}
		return elem._lazysizesWidth;
	};
	var getBgSize = function(elem){
		var bgSize;

		bgSize = (getComputedStyle(elem) || {getPropertyValue: function(){}}).getPropertyValue('background-size');

		if(!allowedBackgroundSize[bgSize] && allowedBackgroundSize[elem.style.backgroundSize]){
			bgSize = elem.style.backgroundSize;
		}

		return bgSize;
	};
	var createPicture = function(sets, elem, img){
		var picture = document.createElement('picture');
		var sizes = elem.getAttribute(lazySizesConfig.sizesAttr);
		var ratio = elem.getAttribute('data-ratio');
		var optimumx = elem.getAttribute('data-optimumx');

		if(elem._lazybgset && elem._lazybgset.parentNode == elem){
			elem.removeChild(elem._lazybgset);
		}

		Object.defineProperty(img, '_lazybgset', {
			value: elem,
			writable: true
		});
		Object.defineProperty(elem, '_lazybgset', {
			value: picture,
			writable: true
		});

		sets = sets.replace(regWhite, ' ').split(regSplitSet);

		picture.style.display = 'none';
		img.className = lazySizesConfig.lazyClass;

		if(sets.length == 1 && !sizes){
			sizes = 'auto';
		}

		sets.forEach(function(set){
			var source = document.createElement('source');

			if(sizes && sizes != 'auto'){
				source.setAttribute('sizes', sizes);
			}

			if(set.match(regSource)){
				source.setAttribute(lazySizesConfig.srcsetAttr, RegExp.$1);
				if(RegExp.$2){
					source.setAttribute('media', lazySizesConfig.customMedia[RegExp.$2] || RegExp.$2);
				}
			}
			picture.appendChild(source);
		});

		if(sizes){
			img.setAttribute(lazySizesConfig.sizesAttr, sizes);
			elem.removeAttribute(lazySizesConfig.sizesAttr);
			elem.removeAttribute('sizes');
		}
		if(optimumx){
			img.setAttribute('data-optimumx', optimumx);
		}
		if(ratio) {
			img.setAttribute('data-ratio', ratio);
		}

		picture.appendChild(img);

		elem.appendChild(picture);
	};

	var proxyLoad = function(e){
		if(!e.target._lazybgset){return;}

		var image = e.target;
		var elem = image._lazybgset;
		var bg = image.currentSrc || image.src;

		if(bg){
			elem.style.backgroundImage = 'url('+ bg +')';
		}

		if(image._lazybgsetLoading){
			lazySizes.fire(elem, '_lazyloaded', {}, false, true);
			delete image._lazybgsetLoading;
		}
	};

	addEventListener('lazybeforeunveil', function(e){
		var set, image, elem;

		if(e.defaultPrevented || !(set = e.target.getAttribute('data-bgset'))){return;}

		elem = e.target;
		image = document.createElement('img');

		image.alt = '';

		image._lazybgsetLoading = true;
		e.detail.firesLoad = true;

		createPicture(set, elem, image);

		setTimeout(function(){
			lazySizes.loader.unveil(image);

			lazySizes.rAF(function(){
				lazySizes.fire(image, '_lazyloaded', {}, true, true);
				if(image.complete) {
					proxyLoad({target: image});
				}
			});
		});

	});

	document.addEventListener('load', proxyLoad, true);

	window.addEventListener('lazybeforesizes', function(e){
		if(e.target._lazybgset && e.detail.dataAttr){
			var elem = e.target._lazybgset;
			var bgSize = getBgSize(elem);

			if(allowedBackgroundSize[bgSize]){
				e.target._lazysizesParentFit = bgSize;

				lazySizes.rAF(function(){
					e.target.setAttribute('data-parent-fit', bgSize);
					if(e.target._lazysizesParentFit){
						delete e.target._lazysizesParentFit;
					}
				});
			}
		}
	}, true);

	document.documentElement.addEventListener('lazybeforesizes', function(e){
		if(e.defaultPrevented || !e.target._lazybgset){return;}
		e.detail.width = proxyWidth(e.target._lazybgset);
	});
})();

(function(window, factory) {
  var lazySizes = factory(window, window.document);
  window.lazySizes = lazySizes;
  if(typeof module == 'object' && module.exports){
    module.exports = lazySizes;
  }
}(window, function l(window, document) {
  'use strict';
  /*jshint eqnull:true */
  if(!document.getElementsByClassName){return;}

  var lazySizesConfig;

  var docElem = document.documentElement;

  var Date = window.Date;

  var supportPicture = window.HTMLPictureElement;

  var _addEventListener = 'addEventListener';

  var _getAttribute = 'getAttribute';

  var addEventListener = window[_addEventListener];

  var setTimeout = window.setTimeout;

  var requestAnimationFrame = window.requestAnimationFrame || setTimeout;

  var requestIdleCallback = window.requestIdleCallback;

  var regPicture = /^picture$/i;

  var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];

  var regClassCache = {};

  var forEach = Array.prototype.forEach;

  var hasClass = function(ele, cls) {
    if(!regClassCache[cls]){
      regClassCache[cls] = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    }
    return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
  };

  var addClass = function(ele, cls) {
    if (!hasClass(ele, cls)){
      ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
    }
  };

  var removeClass = function(ele, cls) {
    var reg;
    if ((reg = hasClass(ele,cls))) {
      ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
    }
  };

  var addRemoveLoadEvents = function(dom, fn, add){
    var action = add ? _addEventListener : 'removeEventListener';
    if(add){
      addRemoveLoadEvents(dom, fn);
    }
    loadEvents.forEach(function(evt){
      dom[action](evt, fn);
    });
  };

  var triggerEvent = function(elem, name, detail, noBubbles, noCancelable){
    var event = document.createEvent('CustomEvent');

    event.initCustomEvent(name, !noBubbles, !noCancelable, detail || {});

    elem.dispatchEvent(event);
    return event;
  };

  var updatePolyfill = function (el, full){
    var polyfill;
    if( !supportPicture && ( polyfill = (window.picturefill || lazySizesConfig.pf) ) ){
      polyfill({reevaluate: true, elements: [el]});
    } else if(full && full.src){
      el.src = full.src;
    }
  };

  var getCSS = function (elem, style){
    return (getComputedStyle(elem, null) || {})[style];
  };

  var getWidth = function(elem, parent, width){
    width = width || elem.offsetWidth;

    while(width < lazySizesConfig.minSize && parent && !elem._lazysizesWidth){
      width =  parent.offsetWidth;
      parent = parent.parentNode;
    }

    return width;
  };

  var rAF = (function(){
    var running, waiting;
    var fns = [];

    var run = function(){
      var fn;
      running = true;
      waiting = false;
      while(fns.length){
        fn = fns.shift();
        fn[0].apply(fn[1], fn[2]);
      }
      running = false;
    };

    return function(fn){
      if(running){
        fn.apply(this, arguments);
      } else {
        fns.push([fn, this, arguments]);

        if(!waiting){
          waiting = true;
          (document.hidden ? setTimeout : requestAnimationFrame)(run);
        }
      }
    };
  })();

  var rAFIt = function(fn, simple){
    return simple ?
      function() {
        rAF(fn);
      } :
      function(){
        var that = this;
        var args = arguments;
        rAF(function(){
          fn.apply(that, args);
        });
      }
    ;
  };

  var throttle = function(fn){
    var running;
    var lastTime = 0;
    var gDelay = 125;
    var RIC_DEFAULT_TIMEOUT = 999;
    var rICTimeout = RIC_DEFAULT_TIMEOUT;
    var run = function(){
      running = false;
      lastTime = Date.now();
      fn();
    };
    var idleCallback = requestIdleCallback ?
      function(){
        requestIdleCallback(run, {timeout: rICTimeout});
        if(rICTimeout !== RIC_DEFAULT_TIMEOUT){
          rICTimeout = RIC_DEFAULT_TIMEOUT;
        }
      }:
      rAFIt(function(){
        setTimeout(run);
      }, true)
    ;

    return function(isPriority){
      var delay;
      if((isPriority = isPriority === true)){
        rICTimeout = 66;
      }

      if(running){
        return;
      }

      running =  true;

      delay = gDelay - (Date.now() - lastTime);

      if(delay < 0){
        delay = 0;
      }

      if(isPriority || (delay < 9 && requestIdleCallback)){
        idleCallback();
      } else {
        setTimeout(idleCallback, delay);
      }
    };
  };

  //based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
  var debounce = function(func) {
    var timeout, timestamp;
    var wait = 99;
    var run = function(){
      timeout = null;
      func();
    };
    var later = function() {
      var last = Date.now() - timestamp;

      if (last < wait) {
        setTimeout(later, wait - last);
      } else {
        (requestIdleCallback || run)(run);
      }
    };

    return function() {
      timestamp = Date.now();

      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
    };
  };


  var loader = (function(){
    var lazyloadElems, preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;

    var eLvW, elvH, eLtop, eLleft, eLright, eLbottom;

    var defaultExpand, preloadExpand, hFac;

    var regImg = /^img$/i;
    var regIframe = /^iframe$/i;

    var supportScroll = ('onscroll' in window) && !(/glebot/.test(navigator.userAgent));

    var shrinkExpand = 0;
    var currentExpand = 0;

    var isLoading = 0;
    var lowRuns = 0;

    var resetPreloading = function(e){
      isLoading--;
      if(e && e.target){
        addRemoveLoadEvents(e.target, resetPreloading);
      }

      if(!e || isLoading < 0 || !e.target){
        isLoading = 0;
      }
    };

    var isNestedVisible = function(elem, elemExpand){
      var outerRect;
      var parent = elem;
      var visible = getCSS(document.body, 'visibility') == 'hidden' || getCSS(elem, 'visibility') != 'hidden';

      eLtop -= elemExpand;
      eLbottom += elemExpand;
      eLleft -= elemExpand;
      eLright += elemExpand;

      while(visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem){
        visible = ((getCSS(parent, 'opacity') || 1) > 0);

        if(visible && getCSS(parent, 'overflow') != 'visible'){
          outerRect = parent.getBoundingClientRect();
          visible = eLright > outerRect.left &&
            eLleft < outerRect.right &&
            eLbottom > outerRect.top - 1 &&
            eLtop < outerRect.bottom + 1
          ;
        }
      }

      return visible;
    };

    var checkElements = function() {
      var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal;

      if((loadMode = lazySizesConfig.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)){

        i = 0;

        lowRuns++;

        if(preloadExpand == null){
          if(!('expand' in lazySizesConfig)){
            lazySizesConfig.expand = docElem.clientHeight > 500 ? 500 : 400;
          }

          defaultExpand = lazySizesConfig.expand;
          preloadExpand = defaultExpand * lazySizesConfig.expFactor;
        }

        if(currentExpand < preloadExpand && isLoading < 1 && lowRuns > 3 && loadMode > 2){
          currentExpand = preloadExpand;
          lowRuns = 0;
        } else if(loadMode > 1 && lowRuns > 2 && isLoading < 6){
          currentExpand = defaultExpand;
        } else {
          currentExpand = shrinkExpand;
        }

        for(; i < eLlen; i++){

          if(!lazyloadElems[i] || lazyloadElems[i]._lazyRace){continue;}

          if(!supportScroll){unveilElement(lazyloadElems[i]);continue;}

          if(!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)){
            elemExpand = currentExpand;
          }

          if(beforeExpandVal !== elemExpand){
            eLvW = innerWidth + (elemExpand * hFac);
            elvH = innerHeight + elemExpand;
            elemNegativeExpand = elemExpand * -1;
            beforeExpandVal = elemExpand;
          }

          rect = lazyloadElems[i].getBoundingClientRect();

          if ((eLbottom = rect.bottom) >= elemNegativeExpand &&
            (eLtop = rect.top) <= elvH &&
            (eLright = rect.right) >= elemNegativeExpand * hFac &&
            (eLleft = rect.left) <= eLvW &&
            (eLbottom || eLright || eLleft || eLtop) &&
            ((isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4)) || isNestedVisible(lazyloadElems[i], elemExpand))){
            unveilElement(lazyloadElems[i]);
            loadedSomething = true;
            if(isLoading > 9){break;}
          } else if(!loadedSomething && isCompleted && !autoLoadElem &&
            isLoading < 4 && lowRuns < 4 && loadMode > 2 &&
            (preloadElems[0] || lazySizesConfig.preloadAfterLoad) &&
            (preloadElems[0] || (!elemExpandVal && ((eLbottom || eLright || eLleft || eLtop) || lazyloadElems[i][_getAttribute](lazySizesConfig.sizesAttr) != 'auto')))){
            autoLoadElem = preloadElems[0] || lazyloadElems[i];
          }
        }

        if(autoLoadElem && !loadedSomething){
          unveilElement(autoLoadElem);
        }
      }
    };

    var throttledCheckElements = throttle(checkElements);

    var switchLoadingClass = function(e){
      addClass(e.target, lazySizesConfig.loadedClass);
      removeClass(e.target, lazySizesConfig.loadingClass);
      addRemoveLoadEvents(e.target, rafSwitchLoadingClass);
    };
    var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
    var rafSwitchLoadingClass = function(e){
      rafedSwitchLoadingClass({target: e.target});
    };

    var changeIframeSrc = function(elem, src){
      try {
        elem.contentWindow.location.replace(src);
      } catch(e){
        elem.src = src;
      }
    };

    var handleSources = function(source){
      var customMedia, parent;

      var sourceSrcset = source[_getAttribute](lazySizesConfig.srcsetAttr);

      if( (customMedia = lazySizesConfig.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')]) ){
        source.setAttribute('media', customMedia);
      }

      if(sourceSrcset){
        source.setAttribute('srcset', sourceSrcset);
      }

      //https://bugzilla.mozilla.org/show_bug.cgi?id=1170572
      if(customMedia){
        parent = source.parentNode;
        parent.insertBefore(source.cloneNode(), source);
        parent.removeChild(source);
      }
    };

    var lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg){
      var src, srcset, parent, isPicture, event, firesLoad;

      if(!(event = triggerEvent(elem, 'lazybeforeunveil', detail)).defaultPrevented){

        if(sizes){
          if(isAuto){
            addClass(elem, lazySizesConfig.autosizesClass);
          } else {
            elem.setAttribute('sizes', sizes);
          }
        }

        srcset = elem[_getAttribute](lazySizesConfig.srcsetAttr);
        src = elem[_getAttribute](lazySizesConfig.srcAttr);

        if(isImg) {
          parent = elem.parentNode;
          isPicture = parent && regPicture.test(parent.nodeName || '');
        }

        firesLoad = detail.firesLoad || (('src' in elem) && (srcset || src || isPicture));

        event = {target: elem};

        if(firesLoad){
          addRemoveLoadEvents(elem, resetPreloading, true);
          clearTimeout(resetPreloadingTimer);
          resetPreloadingTimer = setTimeout(resetPreloading, 2500);

          addClass(elem, lazySizesConfig.loadingClass);
          addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
        }

        if(isPicture){
          forEach.call(parent.getElementsByTagName('source'), handleSources);
        }

        if(srcset){
          elem.setAttribute('srcset', srcset);
        } else if(src && !isPicture){
          if(regIframe.test(elem.nodeName)){
            changeIframeSrc(elem, src);
          } else {
            elem.src = src;
          }
        }

        if(srcset || isPicture){
          updatePolyfill(elem, {src: src});
        }
      }

      rAF(function(){
        if(elem._lazyRace){
          delete elem._lazyRace;
        }
        removeClass(elem, lazySizesConfig.lazyClass);

        if( !firesLoad || elem.complete ){
          if(firesLoad){
            resetPreloading(event);
          } else {
            isLoading--;
          }
          switchLoadingClass(event);
        }
      });
    });

    var unveilElement = function (elem){
      var detail;

      var isImg = regImg.test(elem.nodeName);

      //allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
      var sizes = isImg && (elem[_getAttribute](lazySizesConfig.sizesAttr) || elem[_getAttribute]('sizes'));
      var isAuto = sizes == 'auto';

      if( (isAuto || !isCompleted) && isImg && (elem.src || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesConfig.errorClass)){return;}

      detail = triggerEvent(elem, 'lazyunveilread').detail;

      if(isAuto){
         autoSizer.updateElem(elem, true, elem.offsetWidth);
      }

      elem._lazyRace = true;
      isLoading++;

      lazyUnveil(elem, detail, isAuto, sizes, isImg);
    };

    var onload = function(){
      if(isCompleted){return;}
      if(Date.now() - started < 999){
        setTimeout(onload, 999);
        return;
      }
      var afterScroll = debounce(function(){
        lazySizesConfig.loadMode = 3;
        throttledCheckElements();
      });

      isCompleted = true;

      lazySizesConfig.loadMode = 3;

      throttledCheckElements();

      addEventListener('scroll', function(){
        if(lazySizesConfig.loadMode == 3){
          lazySizesConfig.loadMode = 2;
        }
        afterScroll();
      }, true);
    };

    return {
      _: function(){
        started = Date.now();

        lazyloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass);
        preloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass + ' ' + lazySizesConfig.preloadClass);
        hFac = lazySizesConfig.hFac;

        addEventListener('scroll', throttledCheckElements, true);

        addEventListener('resize', throttledCheckElements, true);

        if(window.MutationObserver){
          new MutationObserver( throttledCheckElements ).observe( docElem, {childList: true, subtree: true, attributes: true} );
        } else {
          docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
          docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
          setInterval(throttledCheckElements, 999);
        }

        addEventListener('hashchange', throttledCheckElements, true);

        //, 'fullscreenchange'
        ['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend', 'webkitAnimationEnd'].forEach(function(name){
          document[_addEventListener](name, throttledCheckElements, true);
        });

        if((/d$|^c/.test(document.readyState))){
          onload();
        } else {
          addEventListener('load', onload);
          document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
          setTimeout(onload, 20000);
        }

        throttledCheckElements(lazyloadElems.length > 0);
      },
      checkElems: throttledCheckElements,
      unveil: unveilElement
    };
  })();


  var autoSizer = (function(){
    var autosizesElems;

    var sizeElement = rAFIt(function(elem, parent, event, width){
      var sources, i, len;
      elem._lazysizesWidth = width;
      width += 'px';

      elem.setAttribute('sizes', width);

      if(regPicture.test(parent.nodeName || '')){
        sources = parent.getElementsByTagName('source');
        for(i = 0, len = sources.length; i < len; i++){
          sources[i].setAttribute('sizes', width);
        }
      }

      if(!event.detail.dataAttr){
        updatePolyfill(elem, event.detail);
      }
    });
    var getSizeElement = function (elem, dataAttr, width){
      var event;
      var parent = elem.parentNode;

      if(parent){
        width = getWidth(elem, parent, width);
        event = triggerEvent(elem, 'lazybeforesizes', {width: width, dataAttr: !!dataAttr});

        if(!event.defaultPrevented){
          width = event.detail.width;

          if(width && width !== elem._lazysizesWidth){
            sizeElement(elem, parent, event, width);
          }
        }
      }
    };

    var updateElementsSizes = function(){
      var i;
      var len = autosizesElems.length;
      if(len){
        i = 0;

        for(; i < len; i++){
          getSizeElement(autosizesElems[i]);
        }
      }
    };

    var debouncedUpdateElementsSizes = debounce(updateElementsSizes);

    return {
      _: function(){
        autosizesElems = document.getElementsByClassName(lazySizesConfig.autosizesClass);
        addEventListener('resize', debouncedUpdateElementsSizes);
      },
      checkElems: debouncedUpdateElementsSizes,
      updateElem: getSizeElement
    };
  })();

  var init = function(){
    if(!init.i){
      init.i = true;
      autoSizer._();
      loader._();
    }
  };

  (function(){
    var prop;

    var lazySizesDefaults = {
      lazyClass: 'lazyload',
      loadedClass: 'lazyloaded',
      loadingClass: 'lazyloading',
      preloadClass: 'lazypreload',
      errorClass: 'lazyerror',
      //strictClass: 'lazystrict',
      autosizesClass: 'lazyautosizes',
      srcAttr: 'data-src',
      srcsetAttr: 'data-srcset',
      sizesAttr: 'data-sizes',
      //preloadAfterLoad: false,
      minSize: 40,
      customMedia: {},
      init: true,
      expFactor: 1.5,
      hFac: 0.8,
      loadMode: 2
    };

    lazySizesConfig = window.lazySizesConfig || window.lazysizesConfig || {};

    for(prop in lazySizesDefaults){
      if(!(prop in lazySizesConfig)){
        lazySizesConfig[prop] = lazySizesDefaults[prop];
      }
    }

    window.lazySizesConfig = lazySizesConfig;

    setTimeout(function(){
      if(lazySizesConfig.init){
        init();
      }
    });
  })();

  return {
    cfg: lazySizesConfig,
    autoSizer: autoSizer,
    loader: loader,
    init: init,
    uP: updatePolyfill,
    aC: addClass,
    rC: removeClass,
    hC: hasClass,
    fire: triggerEvent,
    gW: getWidth,
    rAF: rAF,
  };
}
));

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;n="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,n.charming=e()}}(function(){return function e(n,r,o){function t(i,u){if(!r[i]){if(!n[i]){var d="function"==typeof require&&require;if(!u&&d)return d(i,!0);if(f)return f(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var l=r[i]={exports:{}};n[i][0].call(l.exports,function(e){var r=n[i][1][e];return t(r?r:e)},l,l.exports,e,n,r,o)}return r[i].exports}for(var f="function"==typeof require&&require,i=0;i<o.length;i++)t(o[i]);return t}({1:[function(e,n,r){n.exports=function(e,n){function r(e){for(var n=e.parentNode,r=e.nodeValue,i=r.length,u=-1;++u<i;){var d=document.createElement(o);t&&(d.className=t+f,f++),d.appendChild(document.createTextNode(r[u])),n.insertBefore(d,e)}n.removeChild(e)}n=n||{};var o=n.tagName||"span",t=null!=n.classPrefix?n.classPrefix:"char",f=1;!function e(n){if(n.nodeType===Node.TEXT_NODE)return r(n);var o=Array.prototype.slice.call(n.childNodes),t=o.length;if(1===t&&o[0].nodeType===Node.TEXT_NODE)return r(o[0]);for(var f=-1;++f<t;)e(o[f])}(e)}},{}]},{},[1])(1)});

/*!
 * imagesLoaded PACKAGED v4.1.3
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( 'ev-emitter/ev-emitter',factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : this, function() {



function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var i = 0;
  var listener = listeners[i];
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  while ( listener ) {
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
    // get next listener
    i += isOnce ? 0 : 1;
    listener = listeners[i];
  }

  return this;
};

proto.allOff =
proto.removeAllListeners = function() {
  delete this._events;
  delete this._onceEvents;
};

return EvEmitter;

}));

/*!
 * imagesLoaded v4.1.3
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 'use strict';
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'ev-emitter/ev-emitter'
    ], function( EvEmitter ) {
      return factory( window, EvEmitter );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('ev-emitter')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EvEmitter
    );
  }

})( typeof window !== 'undefined' ? window : this,

// --------------------------  factory -------------------------- //

function factory( window, EvEmitter ) {



var $ = window.jQuery;
var console = window.console;

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( typeof obj.length == 'number' ) {
    // convert nodeList to array
    for ( var i=0; i < obj.length; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

// -------------------------- imagesLoaded -------------------------- //

/**
 * @param {Array, Element, NodeList, String} elem
 * @param {Object or Function} options - if function, use as callback
 * @param {Function} onAlways - callback function
 */
function ImagesLoaded( elem, options, onAlways ) {
  // coerce ImagesLoaded() without new, to be new ImagesLoaded()
  if ( !( this instanceof ImagesLoaded ) ) {
    return new ImagesLoaded( elem, options, onAlways );
  }
  // use elem as selector string
  if ( typeof elem == 'string' ) {
    elem = document.querySelectorAll( elem );
  }

  this.elements = makeArray( elem );
  this.options = extend( {}, this.options );

  if ( typeof options == 'function' ) {
    onAlways = options;
  } else {
    extend( this.options, options );
  }

  if ( onAlways ) {
    this.on( 'always', onAlways );
  }

  this.getImages();

  if ( $ ) {
    // add jQuery Deferred object
    this.jqDeferred = new $.Deferred();
  }

  // HACK check async to allow time to bind listeners
  setTimeout( function() {
    this.check();
  }.bind( this ));
}

ImagesLoaded.prototype = Object.create( EvEmitter.prototype );

ImagesLoaded.prototype.options = {};

ImagesLoaded.prototype.getImages = function() {
  this.images = [];

  // filter & find items if we have an item selector
  this.elements.forEach( this.addElementImages, this );
};

/**
 * @param {Node} element
 */
ImagesLoaded.prototype.addElementImages = function( elem ) {
  // filter siblings
  if ( elem.nodeName == 'IMG' ) {
    this.addImage( elem );
  }
  // get background image on element
  if ( this.options.background === true ) {
    this.addElementBackgroundImages( elem );
  }

  // find children
  // no non-element nodes, #143
  var nodeType = elem.nodeType;
  if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
    return;
  }
  var childImgs = elem.querySelectorAll('img');
  // concat childElems to filterFound array
  for ( var i=0; i < childImgs.length; i++ ) {
    var img = childImgs[i];
    this.addImage( img );
  }

  // get child background images
  if ( typeof this.options.background == 'string' ) {
    var children = elem.querySelectorAll( this.options.background );
    for ( i=0; i < children.length; i++ ) {
      var child = children[i];
      this.addElementBackgroundImages( child );
    }
  }
};

var elementNodeTypes = {
  1: true,
  9: true,
  11: true
};

ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    // Firefox returns null if in a hidden iframe https://bugzil.la/548397
    return;
  }
  // get url inside url("...")
  var reURL = /url\((['"])?(.*?)\1\)/gi;
  var matches = reURL.exec( style.backgroundImage );
  while ( matches !== null ) {
    var url = matches && matches[2];
    if ( url ) {
      this.addBackground( url, elem );
    }
    matches = reURL.exec( style.backgroundImage );
  }
};

/**
 * @param {Image} img
 */
ImagesLoaded.prototype.addImage = function( img ) {
  var loadingImage = new LoadingImage( img );
  this.images.push( loadingImage );
};

ImagesLoaded.prototype.addBackground = function( url, elem ) {
  var background = new Background( url, elem );
  this.images.push( background );
};

ImagesLoaded.prototype.check = function() {
  var _this = this;
  this.progressedCount = 0;
  this.hasAnyBroken = false;
  // complete if no images
  if ( !this.images.length ) {
    this.complete();
    return;
  }

  function onProgress( image, elem, message ) {
    // HACK - Chrome triggers event before object properties have changed. #83
    setTimeout( function() {
      _this.progress( image, elem, message );
    });
  }

  this.images.forEach( function( loadingImage ) {
    loadingImage.once( 'progress', onProgress );
    loadingImage.check();
  });
};

ImagesLoaded.prototype.progress = function( image, elem, message ) {
  this.progressedCount++;
  this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
  // progress event
  this.emitEvent( 'progress', [ this, image, elem ] );
  if ( this.jqDeferred && this.jqDeferred.notify ) {
    this.jqDeferred.notify( this, image );
  }
  // check if completed
  if ( this.progressedCount == this.images.length ) {
    this.complete();
  }

  if ( this.options.debug && console ) {
    console.log( 'progress: ' + message, image, elem );
  }
};

ImagesLoaded.prototype.complete = function() {
  var eventName = this.hasAnyBroken ? 'fail' : 'done';
  this.isComplete = true;
  this.emitEvent( eventName, [ this ] );
  this.emitEvent( 'always', [ this ] );
  if ( this.jqDeferred ) {
    var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
    this.jqDeferred[ jqMethod ]( this );
  }
};

// --------------------------  -------------------------- //

function LoadingImage( img ) {
  this.img = img;
}

LoadingImage.prototype = Object.create( EvEmitter.prototype );

LoadingImage.prototype.check = function() {
  // If complete is true and browser supports natural sizes,
  // try to check for image status manually.
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    // report based on naturalWidth
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    return;
  }

  // If none of the checks above matched, simulate loading on detached element.
  this.proxyImage = new Image();
  this.proxyImage.addEventListener( 'load', this );
  this.proxyImage.addEventListener( 'error', this );
  // bind to image as well for Firefox. #191
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.proxyImage.src = this.img.src;
};

LoadingImage.prototype.getIsImageComplete = function() {
  return this.img.complete && this.img.naturalWidth !== undefined;
};

LoadingImage.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.img, message ] );
};

// ----- events ----- //

// trigger specified handler for event type
LoadingImage.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

LoadingImage.prototype.onload = function() {
  this.confirm( true, 'onload' );
  this.unbindEvents();
};

LoadingImage.prototype.onerror = function() {
  this.confirm( false, 'onerror' );
  this.unbindEvents();
};

LoadingImage.prototype.unbindEvents = function() {
  this.proxyImage.removeEventListener( 'load', this );
  this.proxyImage.removeEventListener( 'error', this );
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

// -------------------------- Background -------------------------- //

function Background( url, element ) {
  this.url = url;
  this.element = element;
  this.img = new Image();
}

// inherit LoadingImage prototype
Background.prototype = Object.create( LoadingImage.prototype );

Background.prototype.check = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.img.src = this.url;
  // check if image is already complete
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    this.unbindEvents();
  }
};

Background.prototype.unbindEvents = function() {
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

Background.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.element, message ] );
};

// -------------------------- jQuery -------------------------- //

ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
  jQuery = jQuery || window.jQuery;
  if ( !jQuery ) {
    return;
  }
  // set local variable
  $ = jQuery;
  // $().imagesLoaded()
  $.fn.imagesLoaded = function( options, callback ) {
    var instance = new ImagesLoaded( this, options, callback );
    return instance.jqDeferred.promise( $(this) );
  };
};
// try making plugin
ImagesLoaded.makeJQueryPlugin();

// --------------------------  -------------------------- //

return ImagesLoaded;

});

/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
/*global charming, anime, Waypoint, imagesLoaded, TweenMax, Elastic, Power2 */

var body = document.body;
var section = document.querySelector('.section');
var sections = document.querySelectorAll('.section');

// CHARMING
// const headerText = document.querySelector('h1');

// if(h1Header) {
//   charming(h1Header);
// }

// ONLY WHEN BODY HASCLASS BODY--HOME
if (body.classList.contains('body--home')) {

  // IMAGE SLIDER
  const headerslides = document.querySelectorAll('.slider li');
  const headerimg = document.querySelectorAll('.slider li .bgimg');

  var slider = anime({
    targets: headerslides,
    autoplay: false,
    translateX: [
      { value: '-100%', duration: 5000, easing: 'easeOutExpo'},
      { value: '-200%', duration: 2500, easing: 'easeOutExpo'}
    ],
    loop: true,
    delay: function(el, i) {
      return i * 5000;
    },
    run: function(anim) {
      // Start slider again at 5000ms when progress is 90%
      // console.log('progress : ' + Math.round(anim.progress) + '%');
      if (Math.round(anim.progress) >= 90) {
        slider.pause();
        slider.seek(5000);
        slider.play();
      }
    },
  });


  const headertitles = document.querySelectorAll('.header__text h1');

  var textslider = anime({
    targets: headertitles,
    autoplay: false,
    opacity: [
      { value: '1', duration: 5000, easing: 'easeOutExpo'},
      { value: '0', duration: 1000, easing: 'easeOutExpo'}
    ],
    translateY: [
      { value: '10%', duration: 0},
      { value: '0', duration: 5000},
      { value: '-50%', duration: 2500, easing: 'easeOutExpo'}
    ],
    loop: true,
    delay: function(el, i) {
      return i * 5000;
    },
    run: function(anim) {
      // Start slider again at 5000ms when progress is 90%
      // console.log('progress : ' + Math.round(anim.progress) + '%');
      if (Math.round(anim.progress) >= 90) {
        textslider.pause();
        textslider.seek(5000);
        textslider.play();
      }
    },
  });

  // START SLIDER WHEN READY
  imagesLoaded( headerimg, { background: true }, function() {
    slider.play();
    textslider.play();
  });

}

const btn1 = document.querySelector('.buttons li:nth-child(1) .button');
const btn2 = document.querySelector('.buttons li:nth-child(2) .button');
const btn3 = document.querySelector('.buttons li:nth-child(3) .button');

// MOVE BUTTONS
if(btn1) {
  class HoverButton {
    constructor(el) {
      this.el = el;
      this.hover = false;
      this.calculatePosition();
      this.attachEventsListener();
    }

    attachEventsListener() {
      window.addEventListener('mousemove', e => this.onMouseMove(e));
      window.addEventListener('resize', e => this.calculatePosition(e));
    }

    calculatePosition() {
      TweenMax.set(this.el, {
        x: 0,
        y: 0,
        scale: 1
      });
      const box = this.el.getBoundingClientRect();
      this.x = box.left + (box.width * 0.5);
      this.y = box.top + (box.height * 0.5);
      this.width = box.width;
      this.height = box.height;
    }

    onMouseMove(e) {
      let hover = false;
      let hoverArea = (this.hover ? 0.7 : 0.5);
      let x = e.clientX - this.x;
      let y = e.clientY - this.y;
      let distance = Math.sqrt( x*x + y*y );
      if (distance < (this.width * hoverArea)) {
        hover = true;
        if (!this.hover) {
          this.hover = true;
        }
        this.onHover(e.clientX, e.clientY);
      }

      if(!hover && this.hover) {
        this.onLeave();
        this.hover = false;
      }
    }

    onHover(x, y) {
      TweenMax.to(this.el, 0.4, {
        x: (x - this.x) * 0.4,
        y: (y - this.y) * 0.4,
        scale: 1.15,
        ease: Power2.easeOut
      });
      // this.el.style.zIndex = 10;
    }
    onLeave() {
      TweenMax.to(this.el, 0.7, {
        x: 0,
        y: 0,
        scale: 1,
        ease: Elastic.easeOut.config(1.2, 0.4)
      });
      // this.el.style.zIndex = 1;
    }
  }

  new HoverButton(btn1);
  new HoverButton(btn2);
  new HoverButton(btn3);

}

// // WAYPOINTS
// for (var i = 0; i < sections.length; i++) {
//   var waypoint = new Waypoint({
//     element: sections[i],
//     handler: function() {
//       var previousWaypoint = this.previous();
//       var nextWaypoint = this.next();

//       this.element.classList.remove('section--prev', 'section--next', 'section--active');
//       this.element.classList.add('section--active');

//       if (previousWaypoint) {
//         previousWaypoint.element.classList.add('section--prev');
//         previousWaypoint.element.classList.remove('section--active');
//       }

//       if (nextWaypoint) {
//         nextWaypoint.element.classList.add('section--next');
//         nextWaypoint.element.classList.remove('section--active');
//       }
//     },
//     offset: '50%'
//   });
// }
