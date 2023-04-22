/*
SPDX-Short-Identifier: MIT
(c) 2019 Alan Tan
This code is licensed under MIT license (See LICENSE.txt for details)
*/
$(document).ready(function () {
	price();
});

function price() {
	$.getJSON("json/product.json", function (data) {
		data = data.product;
		if (data.length == 0) {
			console.log("Error: no product found!");
			return false;
		}
		$("#itemName1").html(data[0].product_name);
		$("#itemName2").html(data[1].product_name);
		$("#itemName3").html(data[2].product_name);

		$("#itemPrice1").html("$" + data[0].price + " &#127851;");
		$("#itemPrice2").html("$" + data[1].price + " &#127851;");
		$("#itemPrice3").html("$" + data[2].price + " &#127851;");

		$("#itemPrice1").val("$" + data[0].price);
		$("#itemPrice2").val("$" + data[1].price);
		$("#itemPrice3").val("$" + data[2].price);
	}).fail(function () {
		console.log("An error has occurred.");
	});
}

function addCart(pId, buttons) {
	var product;
    var non = true;
	if ($.session.get("cart") === undefined) {
		product = JSON.stringify([{ Id: pId, q: 1 }]);
	} else {
		product = JSON.parse($.session.get("cart"));
		for (let i = 0; i < product.length; i++) {
			if (product[i].Id === pId) {
				product[i].q += 1;
                non = false;
				break;
			}
		}
        if (non){
            product[product.length] = { Id: pId, q: 1 };
        }
        product = JSON.stringify(product);
	}
	$.session.set("cart", product);
	cart_check();
	var temp = $(buttons).val() + " &#127851;";
	$(buttons).html("Added to cart" + " &#128076;");
	window.setTimeout(function () {
		$(buttons).html(temp);
	}, 1200);
}
