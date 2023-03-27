/* jquery.poptrox.js v2.5.2-dev | (c) @ajlkn | github.com/ajlkn/jquery.poptrox | MIT licensed */
!function(e){e.fn.poptrox_disableSelection=function(){return e(this).css("user-select","none").css("-khtml-user-select","none").css("-moz-user-select","none").css("-o-user-select","none").css("-webkit-user-select","none")},e.fn.poptrox=function(o){if(0==this.length)return e(this);if(this.length>1){for(var t=0;t<this.length;t++)e(this[t]).poptrox(o);return e(this)}var p,i,s=e.extend({preload:!1,baseZIndex:1e3,fadeSpeed:300,overlayColor:"#000000",overlayOpacity:.6,overlayClass:"poptrox-overlay",windowMargin:50,windowHeightPad:0,selector:"a",caption:null,parent:"body",popupSpeed:300,popupWidth:200,popupHeight:100,popupIsFixed:!1,useBodyOverflow:!1,usePopupEasyClose:!0,usePopupForceClose:!1,usePopupLoader:!0,usePopupCloser:!0,usePopupCaption:!1,usePopupNav:!1,usePopupDefaultStyling:!0,popupBackgroundColor:"#FFFFFF",popupTextColor:"#000000",popupLoaderTextSize:"2em",popupCloserBackgroundColor:"#000000",popupCloserTextColor:"#FFFFFF",popupCloserTextSize:"20px",popupPadding:10,popupCaptionHeight:60,popupCaptionTextSize:null,popupBlankCaptionText:"(untitled)",popupCloserText:"&#215;",popupLoaderText:"&bull;&bull;&bull;&bull;",popupClass:"poptrox-popup",popupSelector:null,popupLoaderSelector:".loader",popupCloserSelector:".closer",popupCaptionSelector:".caption",popupNavPreviousSelector:".nav-previous",popupNavNextSelector:".nav-next",onPopupClose:null,onPopupOpen:null},o),r=e(this),n=e("body"),a=e('<div class="'+s.overlayClass+'"></div>'),l=e(window),u=[],d=0,h=!1,g=new Array,f=function(){p=l.width(),i=l.height()+s.windowHeightPad;var e=Math.abs(x.width()-x.outerWidth()),o=Math.abs(x.height()-x.outerHeight()),t=p-2*s.windowMargin-e,r=i-2*s.windowMargin-o;x.css("min-width",s.popupWidth).css("min-height",s.popupHeight),v.children().css("max-width",t).css("max-height",r)};s.usePopupLoader||(s.popupLoaderSelector=null),s.usePopupCloser||(s.popupCloserSelector=null),s.usePopupCaption||(s.popupCaptionSelector=null),s.usePopupNav||(s.popupNavPreviousSelector=null,s.popupNavNextSelector=null);var x;x=e(s.popupSelector?s.popupSelector:'<div class="'+s.popupClass+'">'+(s.popupLoaderSelector?'<div class="loader">'+s.popupLoaderText+"</div>":"")+'<div class="pic"></div>'+(s.popupCaptionSelector?'<div class="caption"></div>':"")+(s.popupCloserSelector?'<span class="closer">'+s.popupCloserText+"</span>":"")+(s.popupNavPreviousSelector?'<div class="nav-previous"></div>':"")+(s.popupNavNextSelector?'<div class="nav-next"></div>':"")+"</div>");var v=x.find(".pic"),w=e(),b=x.find(s.popupLoaderSelector),m=x.find(s.popupCaptionSelector),C=x.find(s.popupCloserSelector),y=x.find(s.popupNavNextSelector),S=x.find(s.popupNavPreviousSelector),P=y.add(S);if(s.usePopupDefaultStyling&&(x.css("background",s.popupBackgroundColor).css("color",s.popupTextColor).css("padding",s.popupPadding+"px"),m.length>0&&(x.css("padding-bottom",s.popupCaptionHeight+"px"),m.css("position","absolute").css("left","0").css("bottom","0").css("width","100%").css("text-align","center").css("height",s.popupCaptionHeight+"px").css("line-height",s.popupCaptionHeight+"px"),s.popupCaptionTextSize&&m.css("font-size",popupCaptionTextSize)),C.length>0&&C.html(s.popupCloserText).css("font-size",s.popupCloserTextSize).css("background",s.popupCloserBackgroundColor).css("color",s.popupCloserTextColor).css("display","block").css("width","40px").css("height","40px").css("line-height","40px").css("text-align","center").css("position","absolute").css("text-decoration","none").css("outline","0").css("top","0").css("right","-40px"),b.length>0&&b.html("").css("position","relative").css("font-size",s.popupLoaderTextSize).on("startSpinning",function(o){var t=e("<div>"+s.popupLoaderText+"</div>");t.css("height",Math.floor(s.popupHeight/2)+"px").css("overflow","hidden").css("line-height",Math.floor(s.popupHeight/2)+"px").css("text-align","center").css("margin-top",Math.floor((x.height()-t.height()+(m.length>0?m.height():0))/2)).css("color",s.popupTextColor?s.popupTextColor:"").on("xfin",function(){t.fadeTo(300,.5,function(){t.trigger("xfout")})}).on("xfout",function(){t.fadeTo(300,.05,function(){t.trigger("xfin")})}).trigger("xfin"),b.append(t)}).on("stopSpinning",function(e){var o=b.find("div");o.remove()}),2==P.length)){P.css("font-size","75px").css("text-align","center").css("color","#fff").css("text-shadow","none").css("height","100%").css("position","absolute").css("top","0").css("opacity","0.35").css("cursor","pointer").css("box-shadow","inset 0px 0px 10px 0px rgba(0,0,0,0)").poptrox_disableSelection();var k,T;s.usePopupEasyClose?(k="100px",T="100px"):(k="75%",T="25%"),y.css("right","0").css("width",k).html('<div style="position: absolute; height: 100px; width: 125px; top: 50%; right: 0; margin-top: -50px;">&gt;</div>'),S.css("left","0").css("width",T).html('<div style="position: absolute; height: 100px; width: 125px; top: 50%; left: 0; margin-top: -50px;">&lt;</div>')}return l.on("resize orientationchange",function(){f()}),m.on("update",function(e,o){o&&0!=o.length||(o=s.popupBlankCaptionText),m.html(o)}),C.css("cursor","pointer").on("click",function(e){return e.preventDefault(),e.stopPropagation(),x.trigger("poptrox_close"),!0}),y.on("click",function(e){e.stopPropagation(),e.preventDefault(),x.trigger("poptrox_next")}),S.on("click",function(e){e.stopPropagation(),e.preventDefault(),x.trigger("poptrox_previous")}),a.css("position","fixed").css("left",0).css("top",0).css("z-index",s.baseZIndex).css("width","100%").css("height","100%").css("text-align","center").css("cursor","pointer").appendTo(s.parent).prepend('<div style="display:inline-block;height:100%;vertical-align:middle;"></div>').append('<div style="position:absolute;left:0;top:0;width:100%;height:100%;background:'+s.overlayColor+";opacity:"+s.overlayOpacity+";filter:alpha(opacity="+100*s.overlayOpacity+');"></div>').hide().on("touchmove",function(e){return!1}).on("click",function(e){e.preventDefault(),e.stopPropagation(),x.trigger("poptrox_close")}),x.css("display","inline-block").css("vertical-align","middle").css("position","relative").css("z-index",1).css("cursor","auto").appendTo(a).hide().on("poptrox_next",function(){var e=d+1;e>=u.length&&(e=0),x.trigger("poptrox_switch",[e])}).on("poptrox_previous",function(){var e=d-1;e<0&&(e=u.length-1),x.trigger("poptrox_switch",[e])}).on("poptrox_reset",function(){f(),x.data("width",s.popupWidth).data("height",s.popupHeight),b.hide().trigger("stopSpinning"),m.hide(),C.hide(),P.hide(),v.hide(),w.attr("src","").detach()}).on("poptrox_open",function(e,o){return!!h||(h=!0,s.useBodyOverflow&&n.css("overflow","hidden"),s.onPopupOpen&&s.onPopupOpen(),x.addClass("loading"),void a.fadeTo(s.fadeSpeed,1,function(){x.trigger("poptrox_switch",[o,!0])}))}).on("poptrox_switch",function(o,t,p){var i;if(!p&&h)return!0;if(h=!0,x.addClass("loading").css("width",x.data("width")).css("height",x.data("height")),m.hide(),w.attr("src")&&w.attr("src",""),w.detach(),i=u[t],w=i.object,w.off("load"),v.css("text-indent","-9999px").show().append(w),"ajax"==i.type?e.get(i.src,function(e){w.html(e),w.trigger("load")}):w.attr("src",i.src),"image"!=i.type){var r,n;r=i.width,n=i.height,"%"==r.slice(-1)&&(r=parseInt(r.substring(0,r.length-1))/100*l.width()),"%"==n.slice(-1)&&(n=parseInt(n.substring(0,n.length-1))/100*l.height()),w.css("position","relative").css("outline","0").css("z-index",s.baseZIndex+100).width(r).height(n)}b.trigger("startSpinning").fadeIn(300),x.show(),s.popupIsFixed?(x.removeClass("loading").width(s.popupWidth).height(s.popupHeight),w.on("load",function(){w.off("load"),b.hide().trigger("stopSpinning"),m.trigger("update",[i.captionText]).fadeIn(s.fadeSpeed),C.fadeIn(s.fadeSpeed),v.css("text-indent",0).hide().fadeIn(s.fadeSpeed,function(){h=!1}),d=t,P.fadeIn(s.fadeSpeed)})):w.on("load",function(){f(),w.off("load"),b.hide().trigger("stopSpinning");var e=w.width(),o=w.height(),p=function(){m.trigger("update",[i.captionText]).fadeIn(s.fadeSpeed),C.fadeIn(s.fadeSpeed),v.css("text-indent",0).hide().fadeIn(s.fadeSpeed,function(){h=!1}),d=t,P.fadeIn(s.fadeSpeed),x.removeClass("loading").data("width",e).data("height",o).css("width","auto").css("height","auto")};e==x.data("width")&&o==x.data("height")?p():x.animate({width:e,height:o},s.popupSpeed,"swing",p)}),"image"!=i.type&&w.trigger("load")}).on("poptrox_close",function(){return!(!h||s.usePopupForceClose)||(h=!0,x.hide().trigger("poptrox_reset"),s.onPopupClose&&s.onPopupClose(),void a.fadeOut(s.fadeSpeed,function(){s.useBodyOverflow&&n.css("overflow","auto"),h=!1}))}).trigger("poptrox_reset"),s.usePopupEasyClose?(m.on("click","a",function(e){e.stopPropagation()}),x.css("cursor","pointer").on("click",function(e){e.stopPropagation(),e.preventDefault(),x.trigger("poptrox_close")})):x.on("click",function(e){e.stopPropagation()}),l.keydown(function(e){if(x.is(":visible"))switch(e.keyCode){case 37:case 32:if(s.usePopupNav)return x.trigger("poptrox_previous"),!1;break;case 39:if(s.usePopupNav)return x.trigger("poptrox_next"),!1;break;case 27:return x.trigger("poptrox_close"),!1}}),r.find(s.selector).each(function(o){var t,p,i=e(this),r=i.find("img"),n=i.data("poptrox");if("ignore"!=n&&i.attr("href")){if(t={src:i.attr("href"),captionText:r.attr("title"),width:null,height:null,type:null,object:null,options:null},s.caption){if("function"==typeof s.caption)c=s.caption(i);else if("selector"in s.caption){var a;a=i.find(s.caption.selector),"attribute"in s.caption?c=a.attr(s.caption.attribute):(c=a.html(),s.caption.remove===!0&&a.remove())}}else c=r.attr("title");if(t.captionText=c,n){var l=n.split(",");0 in l&&(t.type=l[0]),1 in l&&(p=l[1].match(/([0-9%]+)x([0-9%]+)/),p&&3==p.length&&(t.width=p[1],t.height=p[2])),2 in l&&(t.options=l[2])}if(!t.type)switch(p=t.src.match(/\/\/([a-z0-9\.]+)\/.*/),(!p||p.length<2)&&(p=[!1]),p[1]){case"api.soundcloud.com":t.type="soundcloud";break;case"youtu.be":t.type="youtube";break;case"vimeo.com":t.type="vimeo";break;case"wistia.net":t.type="wistia";break;case"bcove.me":t.type="bcove";break;default:t.type="image"}switch(p=t.src.match(/\/\/[a-z0-9\.]+\/(.*)/),t.type){case"iframe":t.object=e('<iframe src="" frameborder="0"></iframe>'),t.object.on("click",function(e){e.stopPropagation()}).css("cursor","auto"),t.width&&t.height||(t.width="600",t.height="400");break;case"ajax":t.object=e('<div class="poptrox-ajax"></div>'),t.object.on("click",function(e){e.stopPropagation()}).css("cursor","auto").css("overflow","auto"),t.width&&t.height||(t.width="600",t.height="400");break;case"soundcloud":t.object=e('<iframe scrolling="no" frameborder="no" src=""></iframe>'),t.src="//w.soundcloud.com/player/?url="+escape(t.src)+(t.options?"&"+t.options:""),t.width="600",t.height="166";break;case"youtube":t.object=e('<iframe src="" frameborder="0" allowfullscreen="1"></iframe>'),t.src="//www.youtube.com/embed/"+p[1]+(t.options?"?"+t.options:""),t.width&&t.height||(t.width="800",t.height="480");break;case"vimeo":t.object=e('<iframe src="" frameborder="0" allowFullScreen="1"></iframe>'),t.src="//player.vimeo.com/video/"+p[1]+(t.options?"?"+t.options:""),t.width&&t.height||(t.width="800",t.height="480");break;case"wistia":t.object=e('<iframe src="" frameborder="0" allowFullScreen="1"></iframe>'),t.src="//fast.wistia.net/"+p[1]+(t.options?"?"+t.options:""),t.width&&t.height||(t.width="800",t.height="480");break;case"bcove":t.object=e('<iframe src="" frameborder="0" allowFullScreen="1" width="100%"></iframe>'),t.src="//bcove.me/"+p[1]+(t.options?"?"+t.options:""),t.width&&t.height||(t.width="640",t.height="360");break;default:if(t.object=e('<img src="" alt="" style="vertical-align:bottom" />'),s.preload){var p=document.createElement("img");p.src=t.src,g.push(p)}t.width=i.attr("width"),t.height=i.attr("height")}"file:"==window.location.protocol&&t.src.match(/^\/\//)&&(t.src="http:"+t.src),u.push(t),r.removeAttr("title"),i.removeAttr("href").css("cursor","pointer").css("outline",0).on("click",function(e){e.preventDefault(),e.stopPropagation(),x.trigger("poptrox_open",[o])})}}),r.prop("_poptrox",s),r}}(jQuery);

/* browser.js v1.0 | @ajlkn | MIT licensed */
var browser=function(){"use strict";var e={name:null,version:null,os:null,osVersion:null,touch:null,mobile:null,_canUse:null,canUse:function(n){e._canUse||(e._canUse=document.createElement("div"));var o=e._canUse.style,r=n.charAt(0).toUpperCase()+n.slice(1);return n in o||"Moz"+r in o||"Webkit"+r in o||"O"+r in o||"ms"+r in o},init:function(){var n,o,r,i,t=navigator.userAgent;for(n="other",o=0,r=[["firefox",/Firefox\/([0-9\.]+)/],["bb",/BlackBerry.+Version\/([0-9\.]+)/],["bb",/BB[0-9]+.+Version\/([0-9\.]+)/],["opera",/OPR\/([0-9\.]+)/],["opera",/Opera\/([0-9\.]+)/],["edge",/Edge\/([0-9\.]+)/],["safari",/Version\/([0-9\.]+).+Safari/],["chrome",/Chrome\/([0-9\.]+)/],["ie",/MSIE ([0-9]+)/],["ie",/Trident\/.+rv:([0-9]+)/]],i=0;i<r.length;i++)if(t.match(r[i][1])){n=r[i][0],o=parseFloat(RegExp.$1);break}for(e.name=n,e.version=o,n="other",o=0,r=[["ios",/([0-9_]+) like Mac OS X/,function(e){return e.replace("_",".").replace("_","")}],["ios",/CPU like Mac OS X/,function(e){return 0}],["wp",/Windows Phone ([0-9\.]+)/,null],["android",/Android ([0-9\.]+)/,null],["mac",/Macintosh.+Mac OS X ([0-9_]+)/,function(e){return e.replace("_",".").replace("_","")}],["windows",/Windows NT ([0-9\.]+)/,null],["bb",/BlackBerry.+Version\/([0-9\.]+)/,null],["bb",/BB[0-9]+.+Version\/([0-9\.]+)/,null],["linux",/Linux/,null],["bsd",/BSD/,null],["unix",/X11/,null]],i=0;i<r.length;i++)if(t.match(r[i][1])){n=r[i][0],o=parseFloat(r[i][2]?r[i][2](RegExp.$1):RegExp.$1);break}e.os=n,e.osVersion=o,e.touch="wp"==e.os?navigator.msMaxTouchPoints>0:!!("ontouchstart"in window),e.mobile="wp"==e.os||"android"==e.os||"ios"==e.os||"bb"==e.os}};return e.init(),e}();!function(e,n){"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?module.exports=n():e.browser=n()}(this,function(){return browser});

/* breakpoints.js v1.0 | @ajlkn | MIT licensed */
var breakpoints=function(){"use strict";function e(e){t.init(e)}var t={list:null,media:{},events:[],init:function(e){t.list=e,window.addEventListener("resize",t.poll),window.addEventListener("orientationchange",t.poll),window.addEventListener("load",t.poll),window.addEventListener("fullscreenchange",t.poll)},active:function(e){var n,a,s,i,r,d,c;if(!(e in t.media)){if(">="==e.substr(0,2)?(a="gte",n=e.substr(2)):"<="==e.substr(0,2)?(a="lte",n=e.substr(2)):">"==e.substr(0,1)?(a="gt",n=e.substr(1)):"<"==e.substr(0,1)?(a="lt",n=e.substr(1)):"!"==e.substr(0,1)?(a="not",n=e.substr(1)):(a="eq",n=e),n&&n in t.list)if(i=t.list[n],Array.isArray(i)){if(r=parseInt(i[0]),d=parseInt(i[1]),isNaN(r)){if(isNaN(d))return;c=i[1].substr(String(d).length)}else c=i[0].substr(String(r).length);if(isNaN(r))switch(a){case"gte":s="screen";break;case"lte":s="screen and (max-width: "+d+c+")";break;case"gt":s="screen and (min-width: "+(d+1)+c+")";break;case"lt":s="screen and (max-width: -1px)";break;case"not":s="screen and (min-width: "+(d+1)+c+")";break;default:s="screen and (max-width: "+d+c+")"}else if(isNaN(d))switch(a){case"gte":s="screen and (min-width: "+r+c+")";break;case"lte":s="screen";break;case"gt":s="screen and (max-width: -1px)";break;case"lt":s="screen and (max-width: "+(r-1)+c+")";break;case"not":s="screen and (max-width: "+(r-1)+c+")";break;default:s="screen and (min-width: "+r+c+")"}else switch(a){case"gte":s="screen and (min-width: "+r+c+")";break;case"lte":s="screen and (max-width: "+d+c+")";break;case"gt":s="screen and (min-width: "+(d+1)+c+")";break;case"lt":s="screen and (max-width: "+(r-1)+c+")";break;case"not":s="screen and (max-width: "+(r-1)+c+"), screen and (min-width: "+(d+1)+c+")";break;default:s="screen and (min-width: "+r+c+") and (max-width: "+d+c+")"}}else s="("==i.charAt(0)?"screen and "+i:i;t.media[e]=!!s&&s}return t.media[e]!==!1&&window.matchMedia(t.media[e]).matches},on:function(e,n){t.events.push({query:e,handler:n,state:!1}),t.active(e)&&n()},poll:function(){var e,n;for(e=0;e<t.events.length;e++)n=t.events[e],t.active(n.query)?n.state||(n.state=!0,n.handler()):n.state&&(n.state=!1)}};return e._=t,e.on=function(e,n){t.on(e,n)},e.active=function(e){return t.active(e)},e}();!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.breakpoints=t()}(this,function(){return breakpoints});

// UTIL
(function($) {

	/**
	 * Generate an indented list of links from a nav. Meant for use with panel().
	 * @return {jQuery} jQuery object.
	 */
	$.fn.navList = function() {

		var	$this = $(this);
			$a = $this.find('a'),
			b = [];

		$a.each(function() {

			var	$this = $(this),
				indent = Math.max(0, $this.parents('li').length - 1),
				href = $this.attr('href'),
				target = $this.attr('target');

			b.push(
				'<a ' +
					'class="link depth-' + indent + '"' +
					( (typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
					( (typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
				'>' +
					'<span class="indent-' + indent + '"></span>' +
					$this.text() +
				'</a>'
			);

		});

		return b.join('');

	};

	/**
	 * Panel-ify an element.
	 * @param {object} userConfig User config.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.panel = function(userConfig) {

		// No elements?
			if (this.length == 0)
				return $this;

		// Multiple elements?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).panel(userConfig);

				return $this;

			}

		// Vars.
			var	$this = $(this),
				$body = $('body'),
				$window = $(window),
				id = $this.attr('id'),
				config;

		// Config.
			config = $.extend({

				// Delay.
					delay: 0,

				// Hide panel on link click.
					hideOnClick: false,

				// Hide panel on escape keypress.
					hideOnEscape: false,

				// Hide panel on swipe.
					hideOnSwipe: false,

				// Reset scroll position on hide.
					resetScroll: false,

				// Reset forms on hide.
					resetForms: false,

				// Side of viewport the panel will appear.
					side: null,

				// Target element for "class".
					target: $this,

				// Class to toggle.
					visibleClass: 'visible'

			}, userConfig);

			// Expand "target" if it's not a jQuery object already.
				if (typeof config.target != 'jQuery')
					config.target = $(config.target);

		// Panel.

			// Methods.
				$this._hide = function(event) {

					// Already hidden? Bail.
						if (!config.target.hasClass(config.visibleClass))
							return;

					// If an event was provided, cancel it.
						if (event) {

							event.preventDefault();
							event.stopPropagation();

						}

					// Hide.
						config.target.removeClass(config.visibleClass);

					// Post-hide stuff.
						window.setTimeout(function() {

							// Reset scroll position.
								if (config.resetScroll)
									$this.scrollTop(0);

							// Reset forms.
								if (config.resetForms)
									$this.find('form').each(function() {
										this.reset();
									});

						}, config.delay);

				};

			// Vendor fixes.
				$this
					.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
					.css('-webkit-overflow-scrolling', 'touch');

			// Hide on click.
				if (config.hideOnClick) {

					$this.find('a')
						.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

					$this
						.on('click', 'a', function(event) {

							var $a = $(this),
								href = $a.attr('href'),
								target = $a.attr('target');

							if (!href || href == '#' || href == '' || href == '#' + id)
								return;

							// Cancel original event.
								event.preventDefault();
								event.stopPropagation();

							// Hide panel.
								$this._hide();

							// Redirect to href.
								window.setTimeout(function() {

									if (target == '_blank')
										window.open(href);
									else
										window.location.href = href;

								}, config.delay + 10);

						});

				}

			// Event: Touch stuff.
				$this.on('touchstart', function(event) {

					$this.touchPosX = event.originalEvent.touches[0].pageX;
					$this.touchPosY = event.originalEvent.touches[0].pageY;

				})

				$this.on('touchmove', function(event) {

					if ($this.touchPosX === null
					||	$this.touchPosY === null)
						return;

					var	diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
						diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
						th = $this.outerHeight(),
						ts = ($this.get(0).scrollHeight - $this.scrollTop());

					// Hide on swipe?
						if (config.hideOnSwipe) {

							var result = false,
								boundary = 20,
								delta = 50;

							switch (config.side) {

								case 'left':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
									break;

								case 'right':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
									break;

								case 'top':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
									break;

								case 'bottom':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
									break;

								default:
									break;

							}

							if (result) {

								$this.touchPosX = null;
								$this.touchPosY = null;
								$this._hide();

								return false;

							}

						}

					// Prevent vertical scrolling past the top or bottom.
						if (($this.scrollTop() < 0 && diffY < 0)
						|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

							event.preventDefault();
							event.stopPropagation();

						}

				});

			// Event: Prevent certain events inside the panel from bubbling.
				$this.on('click touchend touchstart touchmove', function(event) {
					event.stopPropagation();
				});

			// Event: Hide panel if a child anchor tag pointing to its ID is clicked.
				$this.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.removeClass(config.visibleClass);

				});

		// Body.

			// Event: Hide panel on body click/tap.
				$body.on('click touchend', function(event) {
					$this._hide(event);
				});

			// Event: Toggle.
				$body.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.toggleClass(config.visibleClass);

				});

		// Window.

			// Event: Hide on ESC.
				if (config.hideOnEscape)
					$window.on('keydown', function(event) {

						if (event.keyCode == 27)
							$this._hide(event);

					});

		return $this;

	};

	/**
	 * Apply "placeholder" attribute polyfill to one or more forms.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.placeholder = function() {

		// Browser natively supports placeholders? Bail.
			if (typeof (document.createElement('input')).placeholder != 'undefined')
				return $(this);

		// No elements?
			if (this.length == 0)
				return $this;

		// Multiple elements?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).placeholder();

				return $this;

			}

		// Vars.
			var $this = $(this);

		// Text, TextArea.
			$this.find('input[type=text],textarea')
				.each(function() {

					var i = $(this);

					if (i.val() == ''
					||  i.val() == i.attr('placeholder'))
						i
							.addClass('polyfill-placeholder')
							.val(i.attr('placeholder'));

				})
				.on('blur', function() {

					var i = $(this);

					if (i.attr('name').match(/-polyfill-field$/))
						return;

					if (i.val() == '')
						i
							.addClass('polyfill-placeholder')
							.val(i.attr('placeholder'));

				})
				.on('focus', function() {

					var i = $(this);

					if (i.attr('name').match(/-polyfill-field$/))
						return;

					if (i.val() == i.attr('placeholder'))
						i
							.removeClass('polyfill-placeholder')
							.val('');

				});

		// Password.
			$this.find('input[type=password]')
				.each(function() {

					var i = $(this);
					var x = $(
								$('<div>')
									.append(i.clone())
									.remove()
									.html()
									.replace(/type="password"/i, 'type="text"')
									.replace(/type=password/i, 'type=text')
					);

					if (i.attr('id') != '')
						x.attr('id', i.attr('id') + '-polyfill-field');

					if (i.attr('name') != '')
						x.attr('name', i.attr('name') + '-polyfill-field');

					x.addClass('polyfill-placeholder')
						.val(x.attr('placeholder')).insertAfter(i);

					if (i.val() == '')
						i.hide();
					else
						x.hide();

					i
						.on('blur', function(event) {

							event.preventDefault();

							var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

							if (i.val() == '') {

								i.hide();
								x.show();

							}

						});

					x
						.on('focus', function(event) {

							event.preventDefault();

							var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');

							x.hide();

							i
								.show()
								.focus();

						})
						.on('keypress', function(event) {

							event.preventDefault();
							x.val('');

						});

				});

		// Events.
			$this
				.on('submit', function() {

					$this.find('input[type=text],input[type=password],textarea')
						.each(function(event) {

							var i = $(this);

							if (i.attr('name').match(/-polyfill-field$/))
								i.attr('name', '');

							if (i.val() == i.attr('placeholder')) {

								i.removeClass('polyfill-placeholder');
								i.val('');

							}

						});

				})
				.on('reset', function(event) {

					event.preventDefault();

					$this.find('select')
						.val($('option:first').val());

					$this.find('input,textarea')
						.each(function() {

							var i = $(this),
								x;

							i.removeClass('polyfill-placeholder');

							switch (this.type) {

								case 'submit':
								case 'reset':
									break;

								case 'password':
									i.val(i.attr('defaultValue'));

									x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

									if (i.val() == '') {
										i.hide();
										x.show();
									}
									else {
										i.show();
										x.hide();
									}

									break;

								case 'checkbox':
								case 'radio':
									i.attr('checked', i.attr('defaultValue'));
									break;

								case 'text':
								case 'textarea':
									i.val(i.attr('defaultValue'));

									if (i.val() == '') {
										i.addClass('polyfill-placeholder');
										i.val(i.attr('placeholder'));
									}

									break;

								default:
									i.val(i.attr('defaultValue'));
									break;

							}
						});

				});

		return $this;

	};

	/**
	 * Moves elements to/from the first positions of their respective parents.
	 * @param {jQuery} $elements Elements (or selector) to move.
	 * @param {bool} condition If true, moves elements to the top. Otherwise, moves elements back to their original locations.
	 */
	$.prioritize = function($elements, condition) {

		var key = '__prioritize';

		// Expand $elements if it's not already a jQuery object.
			if (typeof $elements != 'jQuery')
				$elements = $($elements);

		// Step through elements.
			$elements.each(function() {

				var	$e = $(this), $p,
					$parent = $e.parent();

				// No parent? Bail.
					if ($parent.length == 0)
						return;

				// Not moved? Move it.
					if (!$e.data(key)) {

						// Condition is false? Bail.
							if (!condition)
								return;

						// Get placeholder (which will serve as our point of reference for when this element needs to move back).
							$p = $e.prev();

							// Couldn't find anything? Means this element's already at the top, so bail.
								if ($p.length == 0)
									return;

						// Move element to top of parent.
							$e.prependTo($parent);

						// Mark element as moved.
							$e.data(key, $p);

					}

				// Moved already?
					else {

						// Condition is true? Bail.
							if (condition)
								return;

						$p = $e.data(key);

						// Move element back to its original location (using our placeholder).
							$e.insertAfter($p);

						// Unmark element as moved.
							$e.removeData(key);

					}

			});

	};

})(jQuery);

// MAIN
(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		settings = {

			// Keyboard shortcuts.
				keyboardShortcuts: {

					// If true, enables scrolling via keyboard shortcuts.
						enabled: true,

					// Sets the distance to scroll when using the left/right arrow keys.
						distance: 50

				},

			// Scroll wheel.
				scrollWheel: {

					// If true, enables scrolling via the scroll wheel.
						enabled: true,

					// Sets the scroll wheel factor. (Ideally) a value between 0 and 1 (lower = slower scroll, higher = faster scroll).
						factor: 1

				},

			// Scroll zones.
				scrollZones: {

					// If true, enables scrolling via scroll zones on the left/right edges of the scren.
						enabled: true,

					// Sets the speed at which the page scrolls when a scroll zone is active (higher = faster scroll, lower = slower scroll).
						speed: 15

				}

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Tweaks/fixes.

		// Mobile: Revert to native scrolling.
			if (browser.mobile) {

				// Disable all scroll-assist features.
					settings.keyboardShortcuts.enabled = false;
					settings.scrollWheel.enabled = false;
					settings.scrollZones.enabled = false;

				// Re-enable overflow on main.
					$main.css('overflow-x', 'auto');

			}

		// IE: Fix min-height/flexbox.
			if (browser.name == 'ie')
				$wrapper.css('height', '100vh');

		// iOS: Compensate for address bar.
			if (browser.os == 'ios')
				$wrapper.css('min-height', 'calc(100vh - 30px)');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Items.

		// Assign a random "delay" class to each thumbnail item.
			$('.item.thumb').each(function() {
				$(this).addClass('delay-' + Math.floor((Math.random() * 6) + 1));
			});

		// IE: Fix thumbnail images.
			if (browser.name == 'ie')
				$('.item.thumb').each(function() {

					var $this = $(this),
						$img = $this.find('img');

					$this
						.css('background-image', 'url(' + $img.attr('src') + ')')
						.css('background-size', 'cover')
						.css('background-position', 'center');

					$img
						.css('opacity', '0');

				});

	// Poptrox.
		$main.poptrox({
			onPopupOpen: function() { $body.addClass('is-poptrox-visible'); },
			onPopupClose: function() { $body.removeClass('is-poptrox-visible'); },
			overlayColor: '#1a1f2c',
			overlayOpacity: 0.75,
			popupCloserText: '',
			popupLoaderText: '',
			selector: '.item.thumb a.image',
			caption: function($a) {
				return $a.prev('h2').html();
			},
			usePopupDefaultStyling: false,
			usePopupCloser: false,
			usePopupCaption: true,
			usePopupNav: true,
			windowMargin: 50
		});

		breakpoints.on('>small', function() {
			$main[0]._poptrox.windowMargin = 50;
		});

		breakpoints.on('<=small', function() {
			$main[0]._poptrox.windowMargin = 0;
		});

	// Keyboard shortcuts.
		if (settings.keyboardShortcuts.enabled)
			(function() {

				$window

					// Keypress event.
						.on('keydown', function(event) {

							var scrolled = false;

							if ($body.hasClass('is-poptrox-visible'))
								return;

							switch (event.keyCode) {

								// Left arrow.
									case 37:
										$main.scrollLeft($main.scrollLeft() - settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Right arrow.
									case 39:
										$main.scrollLeft($main.scrollLeft() + settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Page Up.
									case 33:
										$main.scrollLeft($main.scrollLeft() - $window.width() + 100);
										scrolled = true;
										break;

								// Page Down, Space.
									case 34:
									case 32:
										$main.scrollLeft($main.scrollLeft() + $window.width() - 100);
										scrolled = true;
										break;

								// Home.
									case 36:
										$main.scrollLeft(0);
										scrolled = true;
										break;

								// End.
									case 35:
										$main.scrollLeft($main.width());
										scrolled = true;
										break;

							}

							// Scrolled?
								if (scrolled) {

									// Prevent default.
										event.preventDefault();
										event.stopPropagation();

									// Stop link scroll.
										$main.stop();

								}

						});

			})();

	// Scroll wheel.
		if (settings.scrollWheel.enabled)
			(function() {

				// Based on code by @miorel + @pieterv of Facebook (thanks guys :)
				// github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
					var normalizeWheel = function(event) {

						var	pixelStep = 10,
							lineHeight = 40,
							pageHeight = 800,
							sX = 0,
							sY = 0,
							pX = 0,
							pY = 0;

						// Legacy.
							if ('detail' in event)
								sY = event.detail;
							else if ('wheelDelta' in event)
								sY = event.wheelDelta / -120;
							else if ('wheelDeltaY' in event)
								sY = event.wheelDeltaY / -120;

							if ('wheelDeltaX' in event)
								sX = event.wheelDeltaX / -120;

						// Side scrolling on FF with DOMMouseScroll.
							if ('axis' in event
							&&	event.axis === event.HORIZONTAL_AXIS) {
								sX = sY;
								sY = 0;
							}

						// Calculate.
							pX = sX * pixelStep;
							pY = sY * pixelStep;

							if ('deltaY' in event)
								pY = event.deltaY;

							if ('deltaX' in event)
								pX = event.deltaX;

							if ((pX || pY)
							&&	event.deltaMode) {

								if (event.deltaMode == 1) {
									pX *= lineHeight;
									pY *= lineHeight;
								}
								else {
									pX *= pageHeight;
									pY *= pageHeight;
								}

							}

						// Fallback if spin cannot be determined.
							if (pX && !sX)
								sX = (pX < 1) ? -1 : 1;

							if (pY && !sY)
								sY = (pY < 1) ? -1 : 1;

						// Return.
							return {
								spinX: sX,
								spinY: sY,
								pixelX: pX,
								pixelY: pY
							};

					};

				// Wheel event.
					$body.on('wheel', function(event) {

						// Disable on <=small.
							if (breakpoints.active('<=small'))
								return;

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Stop link scroll.
							$main.stop();

						// Calculate delta, direction.
							var	n = normalizeWheel(event.originalEvent),
								x = (n.pixelX != 0 ? n.pixelX : n.pixelY),
								delta = Math.min(Math.abs(x), 150) * settings.scrollWheel.factor,
								direction = x > 0 ? 1 : -1;

						// Scroll page.
							$main.scrollLeft($main.scrollLeft() + (delta * direction));

					});

			})();

	// Scroll zones.
		if (settings.scrollZones.enabled)
			(function() {

				var	$left = $('<div class="scrollZone left"></div>'),
					$right = $('<div class="scrollZone right"></div>'),
					$zones = $left.add($right),
					paused = false,
					intervalId = null,
					direction,
					activate = function(d) {

						// Disable on <=small.
							if (breakpoints.active('<=small'))
								return;

						// Paused? Bail.
							if (paused)
								return;

						// Stop link scroll.
							$main.stop();

						// Set direction.
							direction = d;

						// Initialize interval.
							clearInterval(intervalId);

							intervalId = setInterval(function() {
								$main.scrollLeft($main.scrollLeft() + (settings.scrollZones.speed * direction));
							}, 25);

					},
					deactivate = function() {

						// Unpause.
							paused = false;

						// Clear interval.
							clearInterval(intervalId);

					};

				$zones
					.appendTo($wrapper)
					.on('mouseleave mousedown', function(event) {
						deactivate();
					});

				$left
					.css('left', '0')
					.on('mouseenter', function(event) {
						activate(-1);
					});

				$right
					.css('right', '0')
					.on('mouseenter', function(event) {
						activate(1);
					});

				$body
					.on('---pauseScrollZone', function(event) {

						// Pause.
							paused = true;

						// Unpause after delay.
							setTimeout(function() {
								paused = false;
							}, 500);

					});

			})();

})(jQuery);