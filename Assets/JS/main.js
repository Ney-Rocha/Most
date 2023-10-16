$(document).ready(function(){

    $('.navbar-toggler').on('click', function (e) {
        $('html').toggleClass('backdrop');
    });

    $('html, body').on('click', function (e) {
        if (e.target == document.documentElement) {
            e.preventDefault();
            if ($(window).width() < 769) {
                $('.navbar-toggler').click();
            }
        }
    });

    $('.nav-link').on('click', function () {
        $('.navbar-collapse').removeClass('show');
        $('html').removeClass('backdrop');
    });
});
