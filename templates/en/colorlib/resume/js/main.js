$(function() {

    var window_height    = window.innerHeight,
	header_height 		 = $(".default-header").height(),
	fitscreen 			 = window_height - header_height;

	$(".fullscreen").css("height", window_height)
	$(".fitscreen").css("height", fitscreen);

    $(".default-header").sticky({topSpacing:0});

    $('.navbar-nav a[href*="#"]').not('[href="#"]').not('[href="#0"]')
    .on('click',function(event) {
        if(location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
        && 
        location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top-50
                }, 1000, function() {
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { 
                        return false;
                    } else {
                        $target.attr('tabindex','-1');
                        $target.focus();
                    };
                });
            }
        }
    });
});
