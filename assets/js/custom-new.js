(function ($) {
    // 'use strict';

    // Main Navigation
    $(".hamburger-menu").on("click", function () {
        $(this).toggleClass("open");
        $(".site-navigation").toggleClass("show");
    });


})(jQuery);
$(window).on("load", function () {
    jQuery(".loader-wrapper")
        .fadeOut("slow");
    $("body").css("overflow-y", "auto");
});
