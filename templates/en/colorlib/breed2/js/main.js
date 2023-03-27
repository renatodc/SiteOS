$(function() {

	// #region Fix Navbar
	var nav_offset_top = $('header').height() + 50;
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= nav_offset_top) {
            $('.header_area').addClass('navbar_fixed');
        } else {
            $('.header_area').removeClass('navbar_fixed');
        }
    });
    // #endregion
    
	// #region Portfolio Filtering
    if (document.getElementById('portfolio')) {            
        $('.portfolio-grid').imagesLoaded(function() {
            var $workGrid = $('.portfolio-grid').isotope({
                itemSelector: '.all',
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-sizer'
                }
            });
        });
    }
    $('.portfolio-filter ul li').on('click', function () {
        $('.portfolio-filter ul li').removeClass('active');
        $(this).addClass('active');
        var data = $(this).attr('data-filter');
        $workGrid.isotope({
            filter: data
        });
    });
    // #endregion

	// #region Testimonials Slider
	if ($('.testimonial-slider').length) {
		$('.testimonial-slider').owlCarousel({
			loop: false,
			margin: 30,
			items: 1,
			autoplay: false,
			smartSpeed: 2500,
			dots: true
		});
	}
    // #endregion

	// #region Brand Slider
	if ($('.brand-carousel').length) {
        $(".brand-carousel").owlCarousel({
            items: 1,
            autoplay: false,
            loop: true,
            nav: false,
            margin: 30,
            dots: false,
            responsive: {
                0: {
                    items: 1,
                },
                420: {
                    items: 1,
                },
                480: {
                    items: 3,
                },
                768: {
                    items: 3,
                },
                992: {
                    items: 5,
                }
            }
        });
    }
    // #endregion
    
});
