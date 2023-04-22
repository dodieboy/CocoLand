/*
SPDX-Short-Identifier: MIT
(c) 2019 Alan Tan
This code is licensed under MIT license (See LICENSE.txt for details)
*/
$(document).ready(function() {
    login_check();
    if ($(window).width() < 777) {
        cart_check('mobile');
    } else {
        cart_check();
    }
    $(".navIcon").click(function(event) {
        nav();
    });
});

$(window).resize(function() {
    if ($(window).width() < 985) {
        cart_check('mobile');
        $(".nav").hide();
        $(".header").height("auto");
        $(".header").css('background-color', '');
    } else {
        cart_check();
        $(".nav").show();
    }
})

function login_check() {
    if(Cookies.get('login')){
        return true;
    }
    return false;
}

function nav_login() {
    if (login_check()) {
        $('#navLogin').html('<a href="logout.php">Logout Now</a>');
        return;
    }
    $('#navLogin').html('<a href="login.html">Login Now</a>');
}

function cart_check(i) {
    if ($.session.get("cart") !== undefined) {
        var cart = JSON.parse("[" + $.session.get("cart") + "]")[0];
        if (i == "mobile") {
            $("#navCart").html("Cart (" + cart.length + ")");
            return;
        }
        $("#navCart").html("Cart&#65077;" + cart.length + "&#65078;");
    }
}

function nav() {
    if ($(".nav").is(":visible")) {
        $(".nav").hide();
        $(".header").height("auto");
        $(".header").css('background-color', '');
    } else {
        $(".nav").show();
        $(".header").height("100vh");
        $(".header").css('background-color', 'black');
    }
}