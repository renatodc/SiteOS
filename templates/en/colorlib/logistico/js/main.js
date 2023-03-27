$(function() {
    // TOP Menu Sticky
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

    // mobile_menu
	$('ul#navigation').slicknav({
		prependTo: ".mobile_menu",
		closedSymbol: '+',
		openedSymbol:'-'
    });

    // review-active
    $('.testimonial_active').owlCarousel({
        loop:true,
        margin:0,
        items:1,
        autoplay:true,
        navText:['<i class="ti ti-angle-left"></i>','<i class="ti ti-angle-right"></i>'],
        nav:false,
        dots:true,
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

    // counter 
    $('.counter').counterUp({
        delay: 2,
        time: 2000
    });
});