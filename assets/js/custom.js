(function ($) {
  // 'use strict';

  // Main Navigation
  $(".hamburger-menu").on("click", function () {
    $(this).toggleClass("open");
    $(".site-navigation").toggleClass("show");
  });

  var countdown_date = $(".countdown").data("date");

  $(".countdown").countdown(countdown_date, function (event) {
    $(".dday").html(event.strftime("%-D"));
    $(".dhour").html(event.strftime("%-H"));
    $(".dmin").html(event.strftime("%-M"));
    $(".dsec").html(event.strftime("%-S"));
  });

  // Events Slider
  var next_event_slider = new Swiper(".next-event-slider", {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    breakpoints: {
      // when window width is <= 320px
      576: {
        slidesPerView: 1
      },
      // when window width is <= 480px
      768: {
        slidesPerView: 2
      },
      // when window width is <= 640px
      1200: {
        slidesPerView: 3
      }
    },
    navigation: {
      nextEl: ".next-event-slider-wrap .swiper-button-next"
    }
  });

})(jQuery);
$(window).on("load", function () {
  jQuery(".loader-wrapper")
    .fadeOut("slow");
  $("body").css("overflow-y", "auto");
});
