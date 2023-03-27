 AOS.init({
 	duration: 800,
 	easing: 'slide',
 	once: true
 });

$(function() {	
	// #region STICKY HEADER
    $(".js-sticky-header").sticky({topSpacing:0});
    var stickyFillInit = function() {
		$(window).on('resize orientationchange', function() {
            recalc();
        }).resize();

        function recalc() {
            if ( $('.jm-sticky-top').length > 0 ) {
                var elements = $('.jm-sticky-top');
                Stickyfill.add(elements);
            }
        }
	}
	stickyFillInit();
	// #endregion
	// #region MOBILE MENU
	var siteMenuClone = function() {
		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});
		setTimeout(function() {			
			var counter = 0;
            $('.site-mobile-menu .has-children').each(function(){
                var $this = $(this);                
                $this.prepend('<span class="arrow-collapse collapsed">');
                $this.find('.arrow-collapse').attr({
                    'data-toggle' : 'collapse',
                    'data-target' : '#collapseItem' + counter,
                });
                $this.find('> ul').attr({
                    'class' : 'collapse',
                    'id' : 'collapseItem' + counter,
                });
                counter++;
            });
        }, 1000);
		$('body').on('click', '.arrow-collapse', function(e) {
            var $this = $(this);
            if($this.closest('li').find('.collapse').hasClass('show')) {
                $this.removeClass('active');
            } else {
                $this.addClass('active');
            }
            e.preventDefault();      
        });

        $(window).resize(function() {
            var $this = $(this),
                w = $this.width();
            if ( w > 768 ) {
                if ( $('body').hasClass('offcanvas-menu') ) {
                    $('body').removeClass('offcanvas-menu');
                }
            }
        });
        $('body').on('click', '.js-menu-toggle', function(e) {
            var $this = $(this);
            e.preventDefault();
            if ( $('body').hasClass('offcanvas-menu') ) {
                $('body').removeClass('offcanvas-menu');
                $this.removeClass('active');
            } else {
                $('body').addClass('offcanvas-menu');
                $this.addClass('active');
            }
        });

        // click outisde offcanvas
        $(document).mouseup(function(e) {
            var container = $(".site-mobile-menu");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ( $('body').hasClass('offcanvas-menu') ) {
                    $('body').removeClass('offcanvas-menu');
                }
            }
        });
	}; 
	siteMenuClone();
	// #endregion
	// #region SMOOTH SCROLL
    var OnePageNavigation = function() {
        $("body").on("click", ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a[href^='#']", function(e) {
            e.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                'scrollTop': $(hash).offset().top - 0
            }, 1000, 'easeInOutCirc', function() {
                window.location.hash = hash;
                setTimeout(function() {
                    $('body').removeClass('offcanvas-menu');
                }, 20);            
            });
        });
    };
    OnePageNavigation();

    var siteScroll = function() {
        $(window).scroll(function() {
            var st = $(this).scrollTop();
            if (st > 300) {
                $('.js-sticky-header').addClass('shrink');
            } else {
                $('.js-sticky-header').removeClass('shrink');
            }
            if ( $('body').hasClass('offcanvas-menu') ) {
                $('body').removeClass('offcanvas-menu');
            }
        });
    };
    siteScroll();
	// #endregion
});