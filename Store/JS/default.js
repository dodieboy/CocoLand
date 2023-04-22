/*
SPDX-Short-Identifier: MIT
(c) 2019 Alan Tan
This code is licensed under MIT license (See LICENSE.txt for details)
*/
$.ajaxSetup({
    async: false
});

$(document).ready(function () {
    Cookies.set('JWT', '1234567890', { sameSite: 'strict' });
	nav_check();
	if ($(window).width() < 777) {
		cart_check("mobile");
	} else {
		cart_check();
	}
	$(".navIcon").click(function (event) {
		nav();
	});
});

$(window).resize(function () {
	if ($(window).width() < 985) {
		cart_check("mobile");
		$(".nav").hide();
		$(".header").height("auto");
		$(".header").css("background-color", "");
	} else {
		cart_check();
		$(".nav").show();
	}
});

function session_val(token) {
    var result = false;
    $.getJSON("json/session.json", {}, function(data) {
		var data = data.session;
        if (data.length !== 0) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].token === token) {
                    result = true;
                    return;
				}
			}
		}
	}).fail(function () {
		console.log("Error: failed to connect to JWT server!");
	})
    return result;
}

function login_check() {
	if (Cookies.get("JWT") && session_val(Cookies.get("JWT"))) {
		return true;
	}
	return false;
}

function role_check(r) {
    var result = false;
    $.getJSON("json/session.json", {}, function(data) {
        var data = data.session;
        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].token === Cookies.get("JWT") && data[i].role === r) {
                    result = true;
                    return;
                }
            }
        }
    }).fail(function () {
        console.log("Error: failed to connect to JWT server!");
    })
    return result;
}

function nav_check() {
	if (login_check()) {
		$("#navLogin").html('<a href="logout.php">Logout Now</a>');
		if(role_check("A")){
            $("#navHome").html('<a href="admin.html">Admin</a>');
            return;
        }
        $("#navHome").html('<a href="index.html">Store</a>');
	}
	$("#navLogin").html('<a href="login.html">Login Now</a>'); 
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
		$(".header").css("background-color", "");
	} else {
		$(".nav").show();
		$(".header").height("100vh");
		$(".header").css("background-color", "black");
	}
}
