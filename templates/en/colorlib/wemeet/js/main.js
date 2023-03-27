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
    $('.brand_active').owlCarousel({
        loop:true,
        margin:0,
        items:1,
        autoplay:true,
        navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
        nav:false,
        dots:false,
        autoplayHoverPause: true,
        autoplaySpeed: 800,
        responsive:{
            0:{
                items:2,
                dots:false,
                nav:false,
            },
            767:{
                items:4,
                dots:false,
                nav:false,
            },
            992:{
                items:5,
                nav:false
            },
            1200:{
                items:6,
                nav:false
            },
            1500:{
                items:6
            }
        }
    });

    // count_down
    // $('#clock').countdown('2030/12/21', function(event) {
    //     $(this).html(event.strftime('<div class="countdown_time"><div class="single_countdown"><h3>%D</h3><span>days</span></div><div class="single_countdown"><h3>%H</h3><span>Hours</span></div><div class="single_countdown"><h3>%M</h3><span>Minutes</span></div><div class="single_countdown"><h3>%S</h3><span>Seconds</span></div></div>'));
    // });

    // wow js
    new WOW().init();

    // counter 
    $('.counter').counterUp({
        delay: 10,
        time: 10000
    });

});	