                // Ordering Window

                function MenuItem(name, cost)
                {
                this.name = name;
                this.cost=cost;
                }

                menuItems = new Array(
                new MenuItem("Two full size beds", 225),
                new MenuItem("One king size bed", 230),
                new MenuItem("Family Suite", 350),
                );

                prices = [225, 230, 350];
                quantotal = [0, 0, 0];
                quanCount = [0, 0, 0];
                orderInfo = [0, 0, 0]; 
                itemInfo = [];
                isPickup = true;
                subtotal = 0;
                total = 0; 
                tax = 0;

                function updateDollars() 
                {
                    subtotal = 0;
                    for (i = 0; i < menuItems.length; i++) {
                    size = document.getElementsByName("quan" + i)[0].value;
                    if (parseInt(size) != 0) {
                    costs = (parseInt(size) * menuItems[i].cost).toFixed(2);
                    document.getElementsByName("cost")[i].value = costs;
                    subtotal += parseFloat(costs);
                    }
                    }

                    subtotal = subtotal;
                    tax = (subtotal * 0.0625);
                    total = subtotal + tax;
                    document.getElementById("subtotal").value = subtotal.toFixed(2);
                    document.getElementById("tax").value = tax.toFixed(2);
                    document.getElementById("total").value = total.toFixed(2);
                }

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
                } else if ($("input[name='phone']").val() == "") {
                return printError("your phone number", "phone");
                } else if (!isValidPhone($("input[name='phone']").val())) {
                return printError("a valid phone number of 7 or 10 digits", "phone");
                } else if (total == 0) {
                errorTotal.show();
                $("select").eq(0).focus();
                $(".errorTotal").text("*Please add at least one item to your cart"); 
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

                // Receipt Window

                // get order information from prev page
                itemPrice = JSON.parse(localStorage.getItem("quanData"));
                totals = JSON.parse(localStorage.getItem("totals"));
                items = JSON.parse(localStorage.getItem("items"));
                quans = JSON.parse(localStorage.getItem("quans"));
                pickup = JSON.parse(localStorage.getItem("time"));


                menu = ["Two full size beds", "One king size bed", 
                "Family Suite"];

                timeEstimate();
                printTotals();
                printItems();

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


                function makeSelect(name, minRange, maxRange)
                {
                var t= "";
                t = "<select name='" + name + "' size='1' onchange='updateDollars()'>";
                for (j=minRange; j<=maxRange; j++)
                t += "<option>" + j + "</option>";
                t+= "</select>"; 
                return t;
                }

                function td(content, className="")
                {
                return "<td class = '" + className + "'>" + content + "</td>";
                }