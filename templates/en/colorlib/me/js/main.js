$(function() {
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
			if(w > 768) {
				if($('body').hasClass('offcanvas-menu')) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		});

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();
			if($('body').hasClass('offcanvas-menu')) {
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
                if($('body').hasClass('offcanvas-menu')) {
                    $('body').removeClass('offcanvas-menu');
                }
            }
		});
	}; 
	siteMenuClone();
    // #endregion    
    // #region TESTIMONIALS SLIDER
    $('.slide-one-item').owlCarousel({
        center: false,
        items: 1,
        loop: true,
        stagePadding: 0,
        margin: 0,
        smartSpeed: 1000,
        autoplay: true,
        pauseOnHover: false,
        autoHeight: true,
        nav: false,
        navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">']
    });
    // #endregion
    // #region STICKY HEADER
    $(".js-sticky-header").sticky({topSpacing:0});
    $(window).scroll(function() {
        var st = $(this).scrollTop();
        if (st > 100) {
            $('.js-sticky-header').addClass('shrink');
        } else {
            $('.js-sticky-header').removeClass('shrink');
        }
    });
    // #endregion
    // #region HASH LINK ANIMATED SCROLL
    $("body").on("click", ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a, .footer-links a", function(e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            'scrollTop': $(hash).offset().top
        }, 600, 'easeInOutExpo', function() {
            window.location.hash = hash;
        });
    });
    // #endregion
});