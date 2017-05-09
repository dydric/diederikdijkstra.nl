
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


// ------------------------------------------
// Rellax.js - v1.0.0
// Buttery smooth parallax library
// Copyright (c) 2016 Moe Amaya (@moeamaya)
// MIT license
//
// Thanks to Paraxify.js and Jaime Cabllero
// for parallax concepts
// ------------------------------------------

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Rellax = factory();
  }
}(this, function () {
  var Rellax = function(el, options){
    "use strict";

    var self = Object.create(Rellax.prototype);

    var posY = 0; // set it to -1 so the animate function gets called at least once
    var screenY = 0;
    var blocks = [];
    var pause = false;

    // check what requestAnimationFrame to use, and if
    // it's not supported, use the onscroll event
    var loop = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(callback){ setTimeout(callback, 1000 / 60); };

    // limit the given number in the range [min, max]
    var clamp = function(num, min, max) {
      return (num <= min) ? min : ((num >= max) ? max : num);
    };

    // Default Settings
    self.options = {
      speed: -2,
      center: false
    };

    // User defined options (might have more in the future)
    if (options){
      Object.keys(options).forEach(function(key){
        self.options[key] = options[key];
      });
    }

    // If some clown tries to crank speed, limit them to +-10
    self.options.speed = clamp(self.options.speed, -10, 10);

    // By default, rellax class
    if (!el) {
      el = '.rellax';
    }

    // Classes
    if (document.getElementsByClassName(el.replace('.',''))){
      self.elems = document.getElementsByClassName(el.replace('.',''));
    }

    // Now query selector
    else if (document.querySelector(el) !== false) {
      self.elems = document.querySelector(el);
    }

    // The elements don't exist
    else {
      throw new Error("The elements you're trying to select don't exist.");
    }


    // Let's kick this script off
    // Build array for cached element values
    // Bind scroll and resize to animate method
    var init = function() {
      screenY = window.innerHeight;
      setPosition();

      // Get and cache initial position of all elements
      for (var i = 0; i < self.elems.length; i++){
        var block = createBlock(self.elems[i]);
        blocks.push(block);
      }

      window.addEventListener('resize', function(){
        animate();
      });

      // Start the loop
      update();

      // The loop does nothing if the scrollPosition did not change
      // so call animate to make sure every element has their transforms
      animate();
    };


    // We want to cache the parallax blocks'
    // values: base, top, height, speed
    // el: is dom object, return: el cache values
    var createBlock = function(el) {
      var dataPercentage = el.getAttribute('data-rellax-percentage');
      var dataSpeed = el.getAttribute('data-rellax-speed');

      // initializing at scrollY = 0 (top of browser)
      // ensures elements are positioned based on HTML layout.
      //
      // If the element has the percentage attribute, the posY needs to be
      // the current scroll position's value, so that the elements are still positioned based on HTML layout
      var posY = dataPercentage || self.options.center ? document.body.scrollTop : 0;

      var blockTop = posY + el.getBoundingClientRect().top;
      var blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

      // apparently parallax equation everyone uses
      var percentage = dataPercentage ? dataPercentage : (posY - blockTop + screenY) / (blockHeight + screenY);
      if(self.options.center){ percentage = 0.5; }

      // Optional individual block speed as data attr, otherwise global speed
      // Check if has percentage attr, and limit speed to 5, else limit it to 10
      var speed = dataSpeed ? clamp(dataSpeed, -10, 10) : self.options.speed;
      if (dataPercentage || self.options.center) {
        speed = clamp(dataSpeed || self.options.speed, -5, 5);
      }

      var base = updatePosition(percentage, speed);

      // ~~Store non-translate3d transforms~~
      // Store inline styles and extract transforms
      var style = el.style.cssText;
      var transform = '';

      // Check if there's an inline styled transform
      if (style.indexOf('transform') >= 0) {
        // Get the index of the transform
        var index = style.indexOf('transform');

        // Trim the style to the transform point and get the following semi-colon index
        var trimmedStyle = style.slice(index);
        var delimiter = trimmedStyle.indexOf(';');

        // Remove "transform" string and save the attribute
        if (delimiter) {
          transform = " " + trimmedStyle.slice(11, delimiter).replace(/\s/g,'');
        } else {
          transform = " " + trimmedStyle.slice(11).replace(/\s/g,'');
        }
      }

      return {
        base: base,
        top: blockTop,
        height: blockHeight,
        speed: speed,
        style: style,
        transform: transform
      };
    };

    // set scroll position (posY)
    // side effect method is not ideal, but okay for now
    // returns true if the scroll changed, false if nothing happened
    var setPosition = function() {
      var oldY = posY;

      if (window.pageYOffset !== undefined) {
        posY = window.pageYOffset;
      } else {
        posY = (document.documentElement || document.body.parentNode || document.body).scrollTop;
      }

      if (oldY != posY) {
        // scroll changed, return true
        return true;
      }

      // scroll did not change
      return false;
    };


    // Ahh a pure function, gets new transform value
    // based on scrollPostion and speed
    var updatePosition = function(percentage, speed) {
      var value = (speed * (100 * (1 - percentage)));
      return Math.round(value);
    };


    //
    var update = function() {
      if (setPosition() && pause === false) {
        animate();
      }

      // loop again
      loop(update);
    };

    // Transform3d on parallax element
    var animate = function() {
      for (var i = 0; i < self.elems.length; i++){
        var percentage = ((posY - blocks[i].top + screenY) / (blocks[i].height + screenY));

        // Subtracting initialize value, so element stays in same spot as HTML
        var position = updatePosition(percentage, blocks[i].speed) - blocks[i].base;

        // Move that element
        // (Prepare the new transform and append initial inline transforms. Set the new, and preppend previous inline styles)
        var translate = ' translate3d(0,' + position + 'px' + ',0)' + blocks[i].transform;
        self.elems[i].style.cssText = blocks[i].style+'-webkit-transform:'+translate+';-moz-transform:'+translate+';transform:'+translate+';';
      }
    };


    self.destroy = function() {
      for (var i = 0; i < self.elems.length; i++){
        self.elems[i].style.cssText = blocks[i].style;
      }
      pause = true;
    };


    init();
    return self;
  };
  return Rellax;
}));

var rellax = new Rellax('.rellax');
