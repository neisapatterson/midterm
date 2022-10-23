// Ordering Window

	prices = [5.5, 7.25, 6.8, 9.5, 3.25];
	imgs = ["chicken.jpeg", "pork.jpeg", "shrimp.jpeg", "moo_shi.jpeg", "rice.jpeg"];
	quantotal = [0, 0, 0, 0, 0];
	quanCount = [0, 0, 0, 0, 0];
	orderInfo = [0, 0, 0]; 
	itemInfo = [];
	isPickup = true;
	subtotal = 0;
	total = 0; 
	tax = 0;

	// slide show
	$("table").append("<div class='slide'><img src=''></div>");

        // tags for writing errors
        $("p.userInfo").eq(4).append("<p class='error'><p>");
        $(".total.totalSection").append("<p class='errorTotal'><p>");
        errorTag = $(".error");
        errorTag.hide();
        errorTotal = $(".errorTotal");
        errorTotal.hide();

        // pop up thank you message
        TY_message = $("form").prepend("<p class='thankYou'>Thank you for your order!<p>");
        $(".thankYou").hide();

	initialize();
	$(".slide img").fadeTo(4000, 0);
	$(".slide img").attr("src", imgs[0]);
	slideShow();

	// add event listeners to all dropdowns
	$("select[name='quan0']").change(function() {updatePrices(0);});
	$("select[name='quan1']").change(function() {updatePrices(1);});
	$("select[name='quan2']").change(function() {updatePrices(2);});
	$("select[name='quan3']").change(function() {updatePrices(3);});
	$("select[name='quan4']").change(function() {updatePrices(4);});

	$("input[value='delivery'").click(function() {
		isPickup = false;
		$(".userInfo.address").show();
	});
	$("input[value='pickup'").click(function() {
		isPickup = true;
		$(".userInfo.address").hide();
	});

	// when submit is clicked, get timeEstimate and order is being placed
	$("input[type='button']").click(function() {
		if (isValidForm()) {
                        $(".thankYou").show();
			// move data from main page to receipt page
			localStorage.setItem("quanData", JSON.stringify(quantotal));
			localStorage.setItem("totals", JSON.stringify(orderInfo));
			localStorage.setItem("items", JSON.stringify(itemInfo));
			localStorage.setItem("quans", JSON.stringify(quanCount));
			localStorage.setItem("time", isPickup);
                        // delay window change
                        setTimeout(() => {window.open("receipt.html");}, 1000); 
		}
	});

	// update the price for the corresponding menu item
	// update subtotal, total etc.
	function updatePrices(index) {
		// calculate each amount and update boxes
		quantity = $("select").eq(index).val();
		cost = quantity * prices[index];
		$("input[name='cost']").eq(index).val(cost);
		// update array for each quantity change
		quantotal[index] = cost;
		quanCount[index] = quantity;
		subtotal = 0;
		quantotal.forEach(element => {
			subtotal += element;
		});

		$("input[name='subtotal']").val(subtotal);

		tax = Math.round((6.25 / 100) * subtotal * 100) / 100;
		$("input[name='tax']").val(tax);

		total = Math.round((tax + subtotal) * 100) / 100;
		$("input[name='total']").val(total);

		// store data to be used on next page
		orderInfo[0] = subtotal;
		orderInfo[1] = tax;
		orderInfo[2] = total;
		itemInfo.push(index);
	}

	// initializes prices and hides delivery specific inputs
	function initialize() {
		$("input[name='cost']").val(0);
		$("#subtotal").val(0);
		$("#tax").val(0);
		$("#total").val(0);
		$(".userInfo.address").hide();
	}
	
	// format for printing time estimate
	Date.prototype.format = function () {
		minutes = this.getMinutes();
		ampm = this.getHours() >= 12 ? ' PM' : ' AM';
		timeFormat = this.getMonth() + "/" + 
		       this.getDate() + "/" + 
		       this.getFullYear() + " at " + 
		       this.getHours() + ":" +
		      (minutes >= 10 ? minutes : "0" + minutes) + ampm;
		return timeFormat;
	}

	// once order is placed validate order
	function isValidForm() {
		// requirements for both pickup and delivery
		if ($("input[name='lname']").val() == "") {
                        return printError("your last name", "lname");
		} else if (($("input[name='street']").val() == "") && !isPickup) {
                        return printError("your street address", "street");
		} else if (($("input[name='city']").val() == "") && !isPickup) {
                        return printError("your city.", "city");
		} else if ($("input[name='phone']").val() == "") {
                        return printError("your phone number", "phone");
		} else if (!isValidPhone($("input[name='phone']").val())) {
                        return printError("a valid phone number of 7 or 10 digits", "phone");
		} else if (total == 0) {
                        errorTotal.show();
                        $("select").eq(0).focus();
                        $(".errorTotal").text("*Please add at least one item to your order"); 
                        return false;
		}

                // remove error message
                errorTag.hide();
                errorTotal.hide();
		return true; 
	}

        // print error message passed in and focus box
        function printError(message, tag) {
                errorTag.show();
                $("input[name='" + tag + "']").focus();
                $(".error").text("*Please enter " + message);
                return false;
        }
	// sum all the digits (ignoring other chars) of the phone number
	// make sure it equals 7 or 10
	function isValidPhone(phone) {
		digits = 0;
		for (i = 0; i < phone.length; i++) {
			if ($.isNumeric(phone[i])) { digits++;};
		}
		return ((digits == 7) || (digits == 10));
	}

	function slideShow() {
		curr_img = 0;
		setInterval(() => {
			$(".slide img").attr("src", imgs[curr_img]);
			$(".slide img").fadeTo(4000, 1);
			$(".slide img").fadeTo(4000, 0, function (){
				curr_img = (curr_img + 1) % 5
				$(".slide img").attr("src", imgs[curr_img]);
			});
		}, 5000);
	}

// Receipt Window

	// get order information from prev page
	itemPrice = JSON.parse(localStorage.getItem("quanData"));
	totals = JSON.parse(localStorage.getItem("totals"));
	items = JSON.parse(localStorage.getItem("items"));
	quans = JSON.parse(localStorage.getItem("quans"));
	pickup = JSON.parse(localStorage.getItem("time"));


	menu = ["Chicken Chop Suey", "Sweet and Sour Pork", 
		"Shrimp Lo Mein", "Moo Shi Chicken", "Fried Rice"];

	timeEstimate();
	printTotals();
	printItems();

	// get the time estimate based on the order method
	function timeEstimate() {
		currTime = new Date();
		// print time estimate
		if (pickup) {
			time = new Date(currTime.getTime() + (20 * 60000));
			$(".footer").prepend("<p class='time'>Pick Up: " + time.format() + "</p>");
		} else {
			time = new Date(currTime.getTime() + (40 * 60000));
			$(".footer").prepend("<p class='time'>Delivery: " + time.format() + "</p>");
		}
	}

	// print subtotal, tax, and total
	function printTotals() {
		$("#subtotal").text("$" + totals[0]);
		$("#tax").text("$" + totals[1]);
		$("#total").text("$" + totals[2]);
	}

	// print item, quan, and price
	function printItems() { 
		menuCount = 0;
		for (i = 0; i < 5; i++) {
			// only print the info of ordered items
			if (itemPrice[i] != 0) {
				$("#price" + i).text("$" + itemPrice[i]);
				$(".item" + i).text(menu[items[menuCount]]);
				$("#quantity" + i).text(quans[i]);
				menuCount++;
			}
		}
	}