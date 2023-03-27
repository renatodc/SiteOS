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
    var menu = $('ul#navigation');
    if(menu.length){
        menu.slicknav({
            prependTo: ".mobile_menu",
            closedSymbol: '+',
            openedSymbol:'-'
        });
    };
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

    // #region Services Slider
    $('.financial_active').owlCarousel({
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
                nav:false
            },
            767:{
                items:1,
                nav:false
            },
            992:{
                items:1
            },
            1200:{
                items:1
            },
            1500:{
                items:1
            }
        }
    });
    // #endregion

    // #region Testimonials Slider
    $('.testimonial_active2').owlCarousel({
        loop:true,
        margin:0,
        items:1,
        autoplay:true,
        navText:['<i class="ti ti-angle-left"></i>','<i class="ti ti-angle-right"></i>'],
        nav:false,
        dots:false,
        autoplayHoverPause: true,
        autoplaySpeed: 800,
        responsive:{
            0:{
                items:1,
                dots:false,
            },
            767:{
                items:1,
                dots:false,
            },
            992:{
                items:1,
            },
            1200:{
                items:1,
            },
            1500:{
                items:1
            }
        }
    });
    // #endregion    
    
    // #region Get a Quote Popup
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