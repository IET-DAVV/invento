(function ($) {
    'use strict';

    var $window = $(window);

    // Preloader Active Code
    $window.on('load', function () {
        $('#preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });

    var $listCollection = $(".questions-area > ul > li");
    var $firstItem = $listCollection.first();
    $listCollection.first().addClass("question-show");
    setInterval(function () {
        var $activeItem = $(".question-show")
        $activeItem.removeClass("question-show");
        var $nextItem = $activeItem.closest('li').next();
        if ($nextItem.length == 0) {
            $nextItem = $firstItem;
        }
        $nextItem.addClass("question-show");
    }, 5000);
)(jQuery);
