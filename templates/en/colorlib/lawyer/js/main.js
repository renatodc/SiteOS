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
    var menu = $('ul#navigation');
    if(menu.length){
        menu.slicknav({
            prependTo: ".mobile_menu",
            closedSymbol: '+',
            openedSymbol:'-'
        });
    };

    // review-active
    $('.slider_active').owlCarousel({
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
                items:1,
                dots:false
            },
            767:{
                items:1,
                dots:false
            },
            992:{
                items:1
            }
        }
    });
    // review-active
    $('.testmonial_active').owlCarousel({
        loop:true,
        margin:30,
        items:1,
        autoplay:true,
        navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
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

    // counter 
    $('.counter').counterUp({
        delay: 10,
        time: 10000
    });

});	