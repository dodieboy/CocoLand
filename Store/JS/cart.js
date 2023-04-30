$.ajaxSetup({
	async: false,
});
$(document).ready(function () {
	showTable();
	$("#btnRefresh").click(function (event) {
		showTable();
	});
	$("#btnClear").click(function (event) {
		clearCart();
	});
	$("#btnBack").click(function (event) {
		window.location = "cart.html";
	});
	$("#checkOutFrom").on("submit", function (e) {
		e.preventDefault();
		orderProduce();
	});
});

function getPName(id) {
	var result;
	$.getJSON("json/product.json", function (data) {
		if (data.product.length == 0) {
			console.log("Error: no product found!");
			return false;
		}
		$.each(data.product, function (i, v) {
			if (v.id == id) {
				result = v.product_name;
				return false;
			}
		});
	}).fail(function () {
		console.log("An error has occurred.");
	});
	return result;
}

function getPPrice(id) {
	var result;
	$.getJSON("json/product.json", function (data) {
		if (data.product.length == 0) {
			console.log("Error: no product found!");
			return false;
		}
		$.each(data.product, function (i, v) {
			if (v.id == id) {
				result = v.price;
				return false;
			}
		});
	}).fail(function () {
		console.log("An error has occurred.");
	});
	return result;
}

function sumTotal() {
	var y = 0;
	for (var i = 1; i < $("#cartTable tr").length; i++) {
		var total = $("#cartTable")
			.find("tr:eq(" + i + ")")
			.find("td#total")
			.text()
			.replace(/[$]/g, "");
		y = y + total * 1;
	}
	$("#sumTotal").html("$" + y.toFixed(2));
}

function showTable() {
	if ($.session.get("cart") === undefined || $.session.get("cart").length < 3) {
		$("#table").html("<p>Cart is empty</p>");
	} else {
		var cart = JSON.parse("[" + $.session.get("cart") + "]")[0];
		var tables =
			"<table align=center id='cartTable'><tr><th id='tName'>Product Name</th><th id='tQuantity'>Quantity</th><th id='tPrice'>Price</th><th id='tTotal'>Total</th><th id='tDelete'>Delete</th></tr>";
		for (var i = 0; i < cart.length; i++) {
			tables +=
				"<tr class='uData'><td class='pName'>" +
				getPName(cart[i].Id) +
				"</td><td><input onchange='updateQuality(" +
				cart[i].Id +
				", this);' type='text' class='pQuantity' value='" +
				cart[i].q +
				"'></td><td class='pPrice'>$" +
				getPPrice(cart[i].Id) +
				"</td><td id='total'>$" +
				(getPPrice(cart[i].Id) * cart[i].q).toFixed(2) +
				"</td><td><button type='button' onClick='removeProduce(" +
				cart[i].Id +
				")'><i class='fas fa-trash'></i></button></td></tr>";
		}
		tables +=
			"<tr class='tableTotal'><td></td><td></td><td>Total:</td><td id='sumTotal'></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td><button type='button' onClick='checkOut()' title='Check out now'>Check Out</button></td></tr></table>";
		tables += "<script src='JS/cleave.min.js'></script><script>var cleave = new Cleave('.pQuantity', {numeral: true,numeralThousandsGroupStyle: 'thousand'});</script>";
		$("#table").html(tables);
		sumTotal();
	}
}

var timeout = null;

function updateQuality(id, node) {
	var quality = node.value;
	clearTimeout(timeout);
	timeout = setTimeout(function () {
		var product = JSON.parse($.session.get("cart"));
		for (let i = 0; i < product.length; i++) {
			if (product[i].Id === id) {
				product[i].q = quality;
				break;
			}
		}
		product = JSON.stringify(product);
		$.session.set("cart", product);
		$(node)
			.parent()
			.parent()
			.children("td#total")
			.text("$" + getPPrice(id) * quality);
		sumTotal();
	}, 400);
}

function updateTable2() {
	for (var i = 1; i < $("#cartTable tr").length; i++) {
		if ($("#cartTable tr").length <= 3) {
			clearCart();
			return;
		}
		var pId = $("#cartTable")
			.find("tr:eq(" + i + ")")
			.find("td.pId")
			.text();
		var pName = $("#cartTable")
			.find("tr:eq(" + i + ")")
			.find("td.pName")
			.text();
		var pQuantity = $("#cartTable")
			.find("tr:eq(" + i + ")")
			.find("input")
			.val();
		var pPrice = $("#cartTable")
			.find("tr:eq(" + i + ")")
			.children("td.pPrice")
			.text()
			.replace(/[$]/g, "");
	}
}

function clearCart() {
	$.session.remove("cart");
	$("#table").html("<p>Cart is empty</p>");
	cart_check();
}

function removeProduce(id) {
	var product = JSON.parse($.session.get("cart"));
	product = JSON.stringify(
		product.filter(function (el) {
			return el.Id != id;
		})
	);
	$.session.set("cart", product);
	showTable();
	cart_check();
}

function checkOut() {
	for (var i = 1; i < $("#cartTable tr").length; i++) {
		var pId = $("#cartTable")
			.find("tr:eq(" + i + ")")
			.find("td.pId")
			.text();
		var pName = $("#cartTable")
			.find("tr:eq(" + i + ")")
			.find("td.pName")
			.text();
		var pQuantity = $("#cartTable")
			.find("tr:eq(" + i + ")")
			.find("input")
			.val();
		var pPrice = $("#cartTable")
			.find("tr:eq(" + i + ")")
			.children("td.pPrice")
			.text()
			.replace(/[$]/g, "");
		var totals = $("#sumTotal").text();
		if (pName != "") {
			$.ajax({
				type: "POST",
				url: "addCart.php",
				data: {
					type: "update" + i,
					total: totals,
					id: pId,
					name: pName,
					price: pPrice.replace(/[$]/g, ""),
					quantity: pQuantity,
				},
				success: function (data) {
					window.location = "payment.html";
				},
				error: function () {
					alert("error");
				},
			});
		}
	}
}

function orderProduce() {
	if ($("#cardOutput").text() != "Card type: Not vaild") {
		$.ajax({
			type: "POST",
			url: "order.php",
			data: $("#checkOutFrom").serialize(),
			success: function (data) {
				if (data == "Added") {
					clearCart();
					window.location = "OrderComplete.html";
				} else {
					alert("Error\nPlease contact the administrator");
					console.log(data);
				}
			},
			error: function () {
				alert("error");
			},
		});
	} else {
		$("#card").focus();
		$("#cardOutput").html("Card type: Not vaild").css({
			color: "red",
			"font-weight": "bold",
		});
	}
}
