$(function() {
    
	// PRELOADER
	$(window).on('load', function(){
		$("#preloader").fadeOut(500);
    });
    
	// MOBILE MENU
	$(".mainmenu ul#primary-menu").slicknav({
		allowParentLinks: true,
		prependTo: '.responsive-menu',
	});
	
	// STICKY HEADER
	$(window).on('scroll', function() {
		if ($(this).scrollTop() > 10) {
			$('.header').addClass("sticky");
		} else {
			$('.header').removeClass("sticky");
		}
	});
	
	// SMOOTH SCROLL
	$('.mainmenu li a, .logo a,.slicknav_nav li a').on('click', function () {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
		&& location.hostname == this.hostname) {
		  var $target = $(this.hash);
		  $target = $target.length && $target
		  || $('[name=' + this.hash.slice(1) +']');
		  if ($target.length) {
			var targetOffset = $target.offset().top;
			$('html,body')
			.animate({scrollTop: targetOffset}, 2000);
		   return false;
		  }
		}
	});
    
    // SCROLL TO TOP
	$(window).on('scroll', function() {
		if ($(this).scrollTop() > 600) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});
	$('.scrollToTop').on('click', function () {
		$('html, body').animate({scrollTop : 0},2000);
		return false;
	});
    
    // SCREENSHOTS SLIDER
	$('.screenshot-wrap').slick({
		autoplay: true,
		dots: true,
		autoplaySpeed: 1000,
		slidesToShow: 3,
		centerPadding: '20%',
		centerMode: true,
		prevArrow: '',
		nextArrow: '',
		responsive: [{
		  breakpoint: 992,
		  settings: {
			slidesToShow: 1,
			centerPadding: '33.3%'
		  }
		},{
		  breakpoint: 576,
		  settings: {
			slidesToShow: 1,
			centerPadding: '0'
		  }
		}]
	});
    
});