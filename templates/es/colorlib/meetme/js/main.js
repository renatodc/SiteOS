$(function() {	
    // #region STICKY HEADER
    var nav_offset_top = $('header').height() + 50;    
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();   
        if (scroll >= nav_offset_top) {
            $(".header_area").addClass("navbar_fixed");
        } else {
            $(".header_area").removeClass("navbar_fixed");
        }
    });
    // #endregion
    // #region ABOUT PAGE - PROGRESS BARS
	$(".skill_main").each(function() {
        $(this).waypoint(function() {
            $(".progress-bar").each(function() {
                $(this).css("width", $(this).attr("aria-valuenow") + "%");
            });
        }, {
            triggerOnce: true,
            offset: 'bottom-in-view'
        });
    });
    // #endregion
	// #region TESTIMONIALS SLIDER
    $('.testimonials_slider').owlCarousel({
        loop:true,
        margin: 30,
        items: 3,
        nav: false,
        autoplay: true,
        smartSpeed: 1500,
        dots:true, 
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 3,
            },
        }
    });
    // #endregion
    // #region HASH LINK ANIMATED SCROLL
    $("body").on("click", ".nav-link", function(e) {
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