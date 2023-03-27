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

    // #region Home - Slideshow
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
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
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
                nav:true
            },
            1200:{
                items:1,
                nav:true
            },
            1600:{
                items:1,
                nav:true
            }
        }
    });
    // #endregion

    // #region Home - Services Slider
    $('.service_active').owlCarousel({
        loop:true,
        margin:30,
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
                items:2,
            },
            992:{
                items:3,
                nav:false
            },
            1200:{
                items:3,
            },
            1500:{
                items:3,
                nav:true
            }
        }
    });
    // #endregion

    // #region About - Testimonials Slider
    $('.testmonial_active').owlCarousel({
        loop:true,
        margin:30,
        items:1,
        // autoplay:true,
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

    // #region Project Grid
    $('.grid').imagesLoaded(function() {
        var $grid = $('.grid').isotope({
            itemSelector: '.grid-item',
            percentPosition: true,
            masonry: {
                columnWidth: '.grid-item',
            }
        });
    });
    // #endregion

    // #region Project Filtering
    $('.portfolio-menu').on('click', 'button', function() {
        let filter = $(this).attr('data-filter');
        $grid.isotope({ filter });
    });
    $('.portfolio-menu button').on('click', function(event) {
        $('.portfolio-menu button.active').removeClass('active');
        $(this).addClass('active');
        event.preventDefault();
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