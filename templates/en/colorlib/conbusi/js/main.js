$(function() {
    // #region Sticky Header
    $(window).on('scroll', function () {
        var scroll = $(window).scrollTop();
        if (scroll < 400) {
            $("#sticky-header").removeClass("sticky");
            $('#back-top').fadeIn(500);
        } else {
            $("#sticky-header").addClass("sticky");
            $('#back-top').fadeIn(500);
        }
    });
    // #endregion

    // #region Mobile Menu
    $('ul#navigation').slicknav({
        prependTo: ".mobile_menu",
        closedSymbol: '+',
        openedSymbol: '-'
    });
    // #endregion

    // #region Home Slider
    $('.slider_active').owlCarousel({
        loop:true,
        margin:0,
        items:1,
        autoplay:true,
        navText:['<i class="ti ti-angle-left"></i>','<i class="ti ti-angle-right"></i>'],
        nav:true,
        dots:false,
        autoplayHoverPause: true,
        autoplaySpeed: 800,
        responsive:{
            0:{
                items:1,
                nav:false,
            },
            767:{
                items:1,
                nav:false,
            },
            992:{
                items:1,
                nav:false
            },
            1200:{
                items:1,
                nav:false
            },
            1600:{
                items:1,
                nav:true
            }
        }
    });
    // #endregion

    // #region Testimonials Slider
    $('.testmonial_active').owlCarousel({
        loop:true,
        margin:0,
        items:1,
        autoplay:true,
        navText:['<i class="ti ti-angle-left"></i>','<i class="ti ti-angle-right"></i>'],
        nav:true,
        dots:false,
        autoplayHoverPause: true,
        autoplaySpeed: 800,
        responsive:{
            0:{
                items:1,
                dots:false,
                nav:false,
            },
            767:{
                items:1,
                dots:false,
                nav:false,
            },
            992:{
                items:1,
                nav:false
            },
            1200:{
                items:1,
                nav:false
            },
            1500:{
                items:1
            }
        }
    });
    // #endregion

    // #region Request a Quote Form
	$('.popup-with-form').magnificPopup({
		type: 'inline',
		preloader: false,
		focus: '#name',
		callbacks: {
			beforeOpen: function() {
				if($(window).width() < 700) {
					this.st.focus = false;
				} else {
					this.st.focus = '#name';
				}
			}
		}
	});
    // #endregion
});	