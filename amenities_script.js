        
        carousel = ["food0.jpeg", "food1_sm.mov", "food2.jpeg", 
                    "gym0.jpeg", "gym1_sm.mov", "gym2.jpeg",
                    "spa0.jpeg", "bar1.mov", "buis2.jpeg"]
        carouselTitle = ["Room Service", "Fitness Center", "And Many More..."];
        carouselP = ["Food made to perfection by our gourmet chefs brought directly to your room.",
                     "Never miss a workout with our state-of-the-art equipment",
                     "From complimentary massages to computers, and free WIFI, everything is at your disposal..."];
        curr_img = 0;

        $("#arrow_r").click(function () {spin("foward");});
        $("#arrow_l").click(function () {spin("back");});
        $(".bookBtn").click(function () {window.location.href="book.html";});
        $(".exploreBtn").click(function () {window.location.href="explore.html";});


        // toggle play and pause when videos are clicked
        $("video").click(function () {
                $(this).get(0).paused ? $(this).get(0).play() : $(this).get(0).pause();
        });

        // start slide show on smaller devices
        setInterval(function() {
                if ($("#arrow_r").css("display") == "none") {
                      spin("foward");
                }
        }, 7000);

        // change slide
        function spin(direction) {
                direction == "foward" ? curr_img = (curr_img + 3) % 9 : 
                                        curr_img = (curr_img + 6) % 9;

                $(".slideTitle").text(carouselTitle[curr_img / 3]);
                $(".slideP").text(carouselP[curr_img / 3]);

                $(".slide0").fadeOut(600, function() {
                        $(".slide0").attr("src", "./amenitiesMedia/" + carousel[curr_img]);
                        $(".slide0").fadeIn(600);
                });
                $(".slide1").fadeOut(600, function() {
                        $(".slide1").attr("src", "./amenitiesMedia/" + carousel[curr_img + 1]);
                        $(".slide1").fadeIn(600);
                });
                $(".slide2").fadeOut(600, function() {
                        $(".slide2").attr("src", "./amenitiesMedia/" + carousel[curr_img + 2]);
                        $(".slide2").fadeIn(600);
                });
        }

        $(window).scroll(function() {
                // checks if window is scrolled more than 750px, adds/removes solid class
                if($(this).scrollTop() > 200) { 
                    $(".navBar").addClass("showNav");
                } else {
                    $(".navBar").removeClass("showNav");
                }
        });
