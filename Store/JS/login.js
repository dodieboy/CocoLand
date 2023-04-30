/*
SPDX-Short-Identifier: MIT
(c) 2019 Alan Tan
This code is licensed under MIT license (See LICENSE.txt for details)
*/
$(document).ready(function () {
	$("#login").on("submit", function (e) {
		e.preventDefault();
		var hashPass = $.md5($("#password").val());
		$.getJSON("json/user.json", {}, function (data) {
			var data = data.user;
			console.log($("#username").val());
			console.log(hashPass);
			if (data.length !== 0) {
				for (let i = 0; i < data.length; i++) {
					if (data[i].username === $("#username").val() && data[i].password === hashPass) {
						console.log(1);
						Cookies.set("Name", data[i].name, { sameSite: "strict" });
						setToken(data[i].id);
						roleCheck();
						return;
					}
				}
			}
			$("#result").html("Error: Username or password is wrong");
			$("#result").show();
		}).fail(function () {
			console.log("Error: failed to connect to JWT server!");
		});
	});
	$("#register").on("submit", function (e) {
		//this is just a demo and account will not be able to login
		e.preventDefault();
		var tempPass = $.md5($("#password").val());
		window.location = "login.html";
	});
});

function roleCheck() {
	var result = false;
	$.getJSON("json/session.json", {}, function (data) {
		var data = data.session;
		if (data.length !== 0) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].token === Cookies.get("JWT")) {
					if (data[i].role === "N") {
						window.location = "index.html";
					} else if (data[i].role === "A") {
						window.location = "admin.html";
					}
					result = true;
					return;
				}
			}
		}
	}).fail(function () {
		console.log("Error: failed to connect to JWT server!");
	});
	return result;
}

function setToken(id) {
	$.getJSON("json/session.json", {}, function (data) {
		var data = data.session;
		if (data.length !== 0) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].user_id === id) {
					Cookies.set("JWT", data[i].token, { sameSite: "strict" });
					return;
				}
			}
		}
	}).fail(function () {
		console.log("Error: failed to connect to JWT server!");
	});
}
