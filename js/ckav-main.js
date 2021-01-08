(function () {
	"use strict";
	var $ = jQuery;
	var ckav = {},
		package_ver = "v1.0",
		$document = $(document),
		$window = $(window),
		$html = $("html"),
		pageLoader = $(".page-loader"),
		userAgent = navigator.userAgent.toLowerCase(),

		isIE =
		userAgent.indexOf("msie") !== -1 ?
		parseInt(userAgent.split("msie")[1], 10) :
		userAgent.indexOf("trident") !== -1 ?
		11 :
		userAgent.indexOf("edge") !== -1 ?
		12 :
		false,

		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

	/*----------  RESPONSIVE  ----------*/
	enquire.register("screen and (min-width: 992px)", {
		match: function () {
			ckav.device = 'd';
			$('html').addClass('ckav-d');
		},
		unmatch: function () {
			$('html').removeClass('ckav-d');
		}
	}).register("(min-width: 200px) and (max-width: 991px)", {
		match: function () {
			ckav.device = 'm';
			$('html').addClass('ckav-m');
		},
		unmatch: function () {
			$('html').removeClass('ckav-m');
		}
	});


	/* Page loader
	 ********************************************/
	$window.on("load", function () {
		$(".ckav-page-loader").delay(300).fadeOut('slow');
	});


	/* Utility functions
	/******************************/
	ckav.bgimg = function (obj) {
		"use strict";

		$(obj).css({
			backgroundImage: "url(" + $(obj).attr("data-bg") + ")"
		});
	};
	ckav.videoBg = function (obj, imglist) {
		'use strict';
		var isMobile = {
			Android: function () {
				return navigator.userAgent.match(/Android/i);
			},
			BlackBerry: function () {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			iOS: function () {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function () {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function () {
				return navigator.userAgent.match(/IEMobile/i);
			},
			any: function () {
				return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			}
		};

		if (isMobile.any()) {
			$(obj).css("display", "none");
		} else {
			$(obj).css("display", "block");
			if ($(obj).attr('data-videoid')) {
				$(obj).YTPlayer({
					//fitToBackground: true,
	    			videoId: $(obj).attr('data-videoid'),
	    			start: $(obj).attr('data-start') ? parseInt($(obj).attr('data-start')) : 0,
					onReady: function (player) { }
				});
			}
		}
	}
	
	ckav.bgSlider = function (setting) {
		'use strict';
		setTimeout(function () {
			$(setting.obj).vegas({
				delay: setting.delay,
				slides: setting.slides,
				animation: setting.effect
			});
		}, 1000);

	}

	/* Header - Popup utility
	/******************************/
	ckav.headerPopup = function () {
		'use strict';
		var popHandle = $("[data-ckavpopupid]");

		popHandle.on("click", function () {
			var popBtn = $(this),
				popWrp_class = popBtn.attr("data-ckavpopupid"),
				popWrp = $("[data-popupholder='" + popWrp_class + "']");
			
			if (popWrp.length > 0) {
				if (popBtn.hasClass('active')) {

					popWrp.addClass("off").removeClass("on");
					popBtn.removeClass('active').find('i').attr('class', popBtn.find("i").attr('data-popicon') );
					return;

				} else {

					$("[data-ckavpopupid]").removeClass("active");
					$(".ckav-header-popup").removeClass("on");
					$("[data-ckavpopupid]").each(function(){
						$(this).find("i").attr("class", $(this).find("i").attr('data-popicon'));
					});
					
					// Activate popup
					if (popWrp_class === 'info') {
						popBtn.addClass('active');	
					} else {
						popBtn.addClass('active').find('i').attr('class', 'icon-close');
					}
					
					popWrp.addClass("on").removeClass("off");

					return;
				}
			}
		});
	}


	/* ALL MENU RELATED SCRIPTS
	/******************************/
	
	ckav.mobmenu = function () {
		'use strict';

		$('.ckav-menu').addClass('m-nav');

		//var $menu = $('.ckav-menu');
		$('.ckav-menu').find('.has-dropdown').each(function () {
			$(this).prepend('<b class="sub-handler fas fa-plus">');
			if ($(this).hasClass('menu-item')) {
				$(this).children('ul').addClass('sub');
				$(this).children('.mega-menu').addClass('sub');
			}
			$(this).off('mouseenter').off('mouseleave');
		});

		// Sub menu show / hide
		$('.ckav-menu').off("click").on("click", '.sub-handler', function (event) {

			var parent_el = $(this).closest(".has-dropdown");

			parent_el.off('mouseenter').off('mouseleave');
			
			if (parent_el.hasClass('active')) {
				parent_el.removeClass('active');
				$(this).addClass('fa-plus').removeClass('fa-minus');
			} else {
				$(parent_el).addClass('active');
				$(this).addClass('fa-minus').removeClass('fa-plus');
			}
		});
	}


	ckav.menuFn = function ($menu) {
		'use strict';
		
		if ( $menu.find('.has-dropdown').length === 0 ) {
			$menu.closest(".ckav-menu-wrp").addClass('no-sub');
		}

		// Apply smooth scrolling for one page
		$menu.find('.menu-item a').smoothScroll({
			speed: 1200,
			beforeScroll: function () {
				$menu.find('.menu-item a').removeClass('active');
				$('.nav-handle').trigger('tap');
			},
			afterScroll: function () {
				$(this).addClass('active');
			}
		});

		// Setup dropdown open and close
		var mEnter = 'mouseenter',
			mLeave = 'mouseleave';

		$menu.on(mEnter, '.has-dropdown', function (event) {
			if (ckav.device == 'd') {
				$(this).addClass('active');
				$(this).children('.sub-handler').addClass('fa-minus').removeClass('fa-plus');

				if($(this).children('.dropdown').length != 0){
					var menuinner = $menu.offset();
					var dropdown = $(this).children('.dropdown');
					var dropdown_offset = $(dropdown).offset();
					
					var i = (dropdown_offset.left + $(dropdown).outerWidth()) - (menuinner.left + $menu.outerWidth());
					
					if (i > 0) {
						$(dropdown).addClass('r');
					}else {
						$(dropdown).removeClass('r');
					}
				};
			}
		});
		$menu.on(mLeave, '.has-dropdown', function (event) {
			if (ckav.device == 'd') {
				$(this).removeClass('active');
				$(this).children('.sub-handler').addClass('fa-plus').removeClass('fa-minus');
				$(this).children('.sub').removeAttr('style');
			}
		});

	}


	/* Owl carousel
	/******************************/
	ckav.owlitems = function (arr) {
		'use strict';
		if (typeof (arr) == "string" && arr != 'false') {
			var t1 = arr.split('|');
			var t2 = {};
			$.each(t1, function (index, val) {
				var str = val;
				var newarr = str.split(',');
				t2[newarr[0]] = {}
				t2[newarr[0]] = { items: parseInt(newarr[1], 10) };
			});
			return t2;
		} else if (arr === 'false') {
			return false;
		} else {
			return false;
		}
	}
	ckav.getvar = function (v, default_v, val_type) {
		'use strict';
		if (val_type == 'n') {
			return v ? parseInt(v, 10) : default_v;
		}
		if (val_type == 'b') {
			if (v == 'true') { return true; }
			else if (v == 'false') { return false; }
			else { return default_v; }
		}
		if (val_type == 's') {
			if (v == 'false') {
				return false;
			} else {
				return v ? v : default_v;
			};

		}
	}
	ckav.slider = function (owlObj) {

		'use strict';

		var resObj = {
			0: { items: 1 },
			420: { items: 2 },
			600: { items: 3 },
			768: { items: 3 },
			980: { items: 4 }
		}
		

		var owlEle = $(owlObj + ' .owl-carousel'),
			o = $(owlObj);

		var config = {
			items: ckav.getvar(o.attr('data-items'), 3, 'n'),
			loop: ckav.getvar(o.attr('data-loop'), false, 'b'),
			center: ckav.getvar(o.attr('data-center'), false, 'b'),

			mouseDrag: ckav.getvar(o.attr('data-mdrag'), true, 'b'),
			touchDrag: ckav.getvar(o.attr('data-tdrag'), true, 'b'),

			margin: ckav.getvar(o.attr('data-margin'), 30, 'n'),
			stagePadding: ckav.getvar(o.attr('data-stpd'), 0, 'n'),

			res: o.attr('data-itemrange') ? ckav.owlitems(o.attr('data-itemrange')) : resObj, // 0,1|420,2|980,3
			rbase: ckav.getvar(o.attr('data-rbase'), o.parent(), 's'),
			
			nav: ckav.getvar(o.attr('data-nav'), false, 'b'),
			dots: ckav.getvar(o.attr('data-pager'), false, 'b'),
			slideby: ckav.getvar(o.attr('data-slideby'), 1, 'n'),
			
			animOut: ckav.getvar(o.attr('data-out'), 'fadeOut', 's'),
			animIn: ckav.getvar(o.attr('data-in'), 'fadeIn', 's'),

			autoplay: ckav.getvar(o.attr('data-autoplay'), false, 'b'),
			autoplayTimeout: ckav.getvar(o.attr('data-timeout'), 3000, 'n'),
			autoplayHoverPause: ckav.getvar(o.attr('data-hstop'), true, 'b'),
			autoWidth: ckav.getvar(o.attr('data-awidth'), false, 'b'),
			autoHeight: ckav.getvar(o.attr('data-hauto'), true, 'b'),
			
			contentHeight: ckav.getvar(o.attr('data-h'), true, 'b')
		}
		
		$(owlObj).animate({ opacity: 1 }, 500, function () {

			if (owlEle.find(".owl-stage").length === 0) {
				owlEle.owlCarousel({
					items: config.items,
					loop: $(owlObj + " .owl-carousel > .item").length > 1 ? config.loop : false,
					center: config.center,
					
					mouseDrag: config.mouseDrag,
					touchDrag: config.touchDrag,

					margin: config.margin,
					stagePadding: config.stagePadding,

					responsive: config.res,
					responsiveBaseElement: config.rbase,

					nav: config.nav,
					navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
					dots: config.dots,
					slideBy: config.slideby,

					autoplay: config.autoplay,
					autoplayTimeout: config.autoplayTimeout,
					autoplaySpeed: 2000,
					autoplayHoverPause: config.autoplayHoverPause,

					autoHeight: config.autoHeight,
					autoWidth: config.autoWidth,
					
					animateOut: config.animOut, //'slideOutDown',
					animateIn: config.animIn, //'flipInX',

					onInitialized: function () {
						owlEle.animate({ opacity: 1 }, 300);
						
						// Align arrows
						owlEle.find('.owl-nav').css({
							top: owlEle.find('.owl-stage-outer').outerHeight() / 2
						});
					}
				});

				o.find('.carousel-btn .prev').on('click', function () { owlEle.trigger('prev.owl.carousel'); });
				o.find('.carousel-btn .next').on('click', function () { owlEle.trigger('next.owl.carousel'); });
			}
		});
	}
	
	/* Filterable portfolio
	/******************************/
	ckav.filterable = function (obj) {
		'use strict';

		$(obj).animate({ opacity: 1 }, 500, function () { });
		var filterObj = $(obj),
			container = filterObj.find('.masonry-grid'),
			list = filterObj.find('.filters'),
			time = 500;

		list.find('[data-filter]').on('click', function (event) {
			event.preventDefault();

			var filter = $(this).attr("data-filter");
			
			list.find("[data-filter]").removeClass('active');
			$(this).addClass('active');
			
			container.find('.masonry-item').stop().animate({ opacity: 0 }, 150, function () {
				$(this).hide();

				if (filter === 'all') {
					container.find('.masonry-item').show().stop().animate({ opacity: 1 }, time);
				} else {
					$(filter).show().stop().animate({ opacity: 1 }, time);
				}
			});
		});

		list.find('.active') ? list.find('.active').trigger('click') : list.find('[data-filter]').first().trigger('click');
	}

	/*
	 * Masonry grid
	 ********************************/
	ckav.ckavMasonryGrid = function (obj) {
		var masonry_wrp = $(obj).closest('.masonry-wrp');
		
		masonry_wrp.css({
			opacity: 0,
		});

		var $mGrid = $(obj).imagesLoaded(function() {
			masonry_wrp.animate({
				opacity: 1},
				600, function() {
				$mGrid.isotope({
					itemSelector: '.masonry-item',
					percentPosition: true,
					stagger: 30,
					layoutMode: 'packery',
					hiddenStyle: {
						opacity: 0
					},
					visibleStyle: {
						opacity: 1
					}
				});
			});
		});

		$(masonry_wrp).on('click', '.filters [data-filter]', function(event) {
			event.preventDefault();
			
			$(masonry_wrp).find('.filters [data-filter]').removeClass('active');
			$(this).addClass('active');

			var filterValue = $(this).attr('data-filter');
			// use filterFn if matches value
			$mGrid.isotope({ filter: filterValue });
		});
	}


	/* All Doc ready fuctions
	/******************************/
	$document.ready(function () {

		/*== Get all elements ===============*/
		var $o = {};
		$o.bgimg = $("[data-bg]").length > 0 ? $("[data-bg]") : false;
		$o.bgcolor = $("[data-bgcolor]").length > 0 ? $("[data-bgcolor]") : false;
		$o.videobg = $(".videobg-hold").length > 0 ? $(".videobg-hold") : false;
		$o.bgslider = $("[data-bgslider]").length > 0 ? $("[data-bgslider]") : false;

		$o.header = $('.main-header').length > 0 ? $('.main-header') : false;
		$o.menuwrp = $('.ckav-menu').length > 0 ? $('.ckav-menu') : false;
		$o.navlink = $('.ckav-menu').find(".menu-item").length > 0 ? $('.ckav-menu').find(".menu-item") : false;
		$o.carouselwidget = $(".carousel-widget").length > 0 ? $(".carousel-widget") : false;
		$o.masonry = $("[data-masonry-grid]").length > 0 ? $("[data-masonry-grid]") : false;
		$o.ckavfilterable = $(".ckav-filterable").length > 0 ? $(".ckav-filterable") : false;
		$o.wpimgpopup = $(".blocks-gallery-item a[href$='.jpg']").length > 0 ? $(".blocks-gallery-item a[href$='.jpg']") : false;
		$o.popupgallery = $(".popup-gallery .portfolio-popup-img[href$='.jpg']").length > 0 ? $(".popup-gallery .portfolio-popup-img[href$='.jpg']") : false;
		

		/*== WordPress Utility scripts ===============*/
		// Footer
		if ($("body").hasClass("page-template-page-empty")) {
			$(".site-footer").appendTo(".ckav-content-wrp");
		} else {
			$(".site-footer").appendTo(".scroll-container");
		}
		
		// Layout 3
		if ( $(".layout-2").hasClass("sub-layout-1") ) {
			$("html").addClass("sub-layout-1");
		}
		// Custom scroll
		new SimpleBar($('.ckav-content-wrp')[0]);
		/*== WP Comment script ===============*/
		$('.ckav-reply-title').prependTo(".comment-respond");

		/*== Header utilities ===============*/
		ckav.headerPopup();

		/*== Background utilities ===============*/
		if ($o.bgimg) {
			for (var i = 0; i < $o.bgimg.length; i++) {
				ckav.bgimg($o.bgimg[i]);
			}
		}
		if ($o.bgcolor) {
			for (var i = 0; i < $o.bgcolor.length; i++) {
				$($o.bgcolor[i]).css({ backgroundColor: $($o.bgcolor[i]).attr("data-bgcolor") });
			}
		}
		if ($o.videobg) {
			for (var i = 0; i < $o.videobg.length; i++) {
				ckav.videoBg($o.videobg[i]);
			}
		};
		if ($o.bgslider) {
			for (var i = 0; i < $o.bgslider.length; i++) {

				var s1 = $($o.bgslider[i]).attr('data-bgslider'),
					s2 = s1.split('|'),
					el = $o.bgslider[i],
					bgslides = [];

				$.each(s2, function (index, val) {
					bgslides.push({ src: val });
				});
				setTimeout(function () {
					$(el).vegas({
						delay: 6000,
						slides: bgslides,
						timer: false,
						animation: 'kenburns'
					});
				}, 500);
				
			}
		};


		/*== Owl carousel ===============*/
		if ($o.carouselwidget) {
			for (var i = 0; i < $o.carouselwidget.length; i++) {
				// SET ID ON ALL OBJECTS
				var owlObj = 'owl' + i;
				$($o.carouselwidget[i]).css({ opacity: 0 }).attr("id", owlObj).addClass(owlObj);
				ckav.slider("#" + owlObj);
			}
		}

		/*== Banner grids ===============*/
		if ($o.ckavfilterable) {
			for (var i = 0; i < $o.ckavfilterable.length; i++) {
				// SET ID ON ALL OBJECTS
				var filterObj = 'ckavfilter-' + i;
				$($o.ckavfilterable[i]).css({ opacity: 0 }).attr("id", filterObj).addClass(filterObj);
				ckav.filterable("#" + filterObj);
			}
		}
		
		/* WordPress Image gallery 
		/******************************/
		if ($o.wpimgpopup) {
			$($o.wpimgpopup).magnificPopup({
				type: 'image',
				mainClass: 'mfp-fade',
				gallery:{
					enabled:true
				}
			});
		}

		if ($o.popupgallery) {
			$($o.popupgallery).magnificPopup({
				type: 'image',
				mainClass: 'mfp-fade',
				gallery:{
					enabled:true
				}
			});
		}
		

		/* WordPress post gallery
		/******************************/
		if ($o.masonry) {
			$($o.masonry).each(function(index, el) {
				ckav.ckavMasonryGrid(el);
			});
		}
		

		/* Responsive functions
		/******************************/
		enquire.register("screen and (min-width: 992px)", {
			match: function () {
				$('.ckav-menu').removeClass('m-nav');
				
				if ($o.menuwrp) {
					if ($o.navlink) {
						var $menu = $('.ckav-menu');
						ckav.menuFn($menu);
					};
				}
			},
			unmatch: function () {}
		}).register("(min-width: 200px) and (max-width: 1024px)", {
			match: function () {
				ckav.mobmenu();
				$(".layout-2").removeClass("sub-layout-1");
			},
			unmatch: function () {
				$('.ckav-menu').removeClass('m-nav');
				if ( $("html").hasClass("sub-layout-1") ) {
					$(".layout-2").addClass("sub-layout-1");
				}
			}
		});
	});


	window.ckav = ckav;
})(jQuery, window.ckav);
