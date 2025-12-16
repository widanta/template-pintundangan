$(window).on("load", function () {
    $(".loader").fadeOut("slow");
    $("html, body").css({
        overflowX: "hidden",
        overflowY: "hidden",
        height: "100vh",
    });
    $("#countdown-animation").css({
        display: "none",
    });

    // fungsi untuk mendapatkan parameter query dari URL jika tidak perlu bisa di hapus
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        let value = urlParams.get(param);
        if (value) {
            return value.trim();
        }
        return null;
    }
    const namaTamu = getQueryParam("to");
    if (namaTamu) {
        $("#guest-name").text(namaTamu);
    } else {
        $("#guest-name").text("Widanta Nugraha");
    }

    $(document).on("click", "#btn-opening-cover", function () {
        $("section, footer").fadeIn(400, function () {
            $("html, body").css({
                overflowX: "hidden",
                overflowY: "auto",
                height: "auto",
            });

            $("#countdown-animation").css({
                display: "flex",
            });

            $(".header-info").css({
                display: "none",
            });

            $("#btn-opening-cover").css({
                display: "none",
            });

            if (typeof AOS !== "undefined") {
                setTimeout(function () {
                    try {
                        AOS.refresh();
                        if (typeof AOS.refreshHard === "function") {
                            AOS.refreshHard();
                        }
                        window.dispatchEvent(new Event("resize"));
                    } catch (e) {
                        try {
                            AOS.init({ once: true });
                        } catch (ee) {}
                    }
                }, 300);
            }

            // $("html, body").animate(
            //     {
            //         scrollTop: $("#opening").offset().top,
            //     },
            //     450
            // );

            // play audio
            var audio = document.getElementById("audio");
            if (audio && typeof audio.play === "function") audio.play();

            // init masonry after reveal (if needed)
            if (window.matchMedia("(max-width: 767px)").matches) {
                var masonry = new MiniMasonry({
                    container: document.querySelector(".masonry_wrapper"),
                    surroundingGutter: false,
                    ultimateGutter: 2,
                    gutterX: 20,
                    gutterY: 20,
                    baseWidth: 150,
                });
            } else {
                var masonry = new MiniMasonry({
                    container: document.querySelector(".masonry_wrapper"),
                    surroundingGutter: false,
                    gutterX: 20,
                    gutterY: 20,
                });
            }
        });
    });

    // Audio mute unmute control
    $(document).on("click", ".abs-fix-audio-control button", function () {
        var is_volume_mute = $(this).attr("is-volume-mute");

        if (is_volume_mute == "false") {
            $(".abs-fix-audio-control button .volume-unmute").hide();
            $(".abs-fix-audio-control button .volume-mute").show();
            $(this).attr("is-volume-mute", "true");

            $("#audio").prop("muted", true);
        } else {
            $(".abs-fix-audio-control button .volume-unmute").show();
            $(".abs-fix-audio-control button .volume-mute").hide();
            $(this).attr("is-volume-mute", "false");

            $("#audio").prop("muted", false);
        }
    });

    // Countdown Function
    var dateTimeEvent = "Dec 28, 2025 09:00:00";
    // var dateTimeEvent = $("body").attr("prim_time_event");
    var countDownDate = new Date(dateTimeEvent).getTime();

    const clock = document.getElementById("countdown-animation");
    const daysSpan = clock.querySelector(".days");
    const hoursSpan = clock.querySelector(".hours");
    const minutesSpan = clock.querySelector(".minutes");
    const secondsSpan = clock.querySelector(".seconds");

    var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            clearInterval(x);
            daysSpan.innerHTML = 0;
            hoursSpan.innerHTML = 0;
            minutesSpan.innerHTML = 0;
            secondsSpan.innerHTML = 0;
        } else {
            daysSpan.innerHTML = days;
            hoursSpan.innerHTML = hours;
            minutesSpan.innerHTML = minutes;
            secondsSpan.innerHTML = seconds;
        }
    }, 1000);

    // Fancy Gallery
    $(".fancy").fancybox({
        transitionIn: "elastic",
        transitionOut: "elastic",
        speedIn: 600,
        speedOut: 200,
        overlayShow: false,
    });

    // Form rsvp function
    $('form[id="rsvp-store"]').each(function () {
        $(this).validate({
            ignore: ".ignore",
            rules: {
                Name: "required",
                Message: "required",
            },
            messages: {
                Name: "Nama masih kosong",
                Message: "Pesan masih kosong",
            },
            errorPlacement: function (error, element) {
                var elementName = element.attr("base_error");

                error.appendTo("#" + elementName);
            },
            submitHandler: function (form) {
                $.ajax({
                    url: form.action,
                    type: "POST",
                    data: $(form).serialize(),
                    cache: false,
                    processData: false,
                    beforeSend: function () {
                        $("input, textarea").prop("disabled", true);

                        $("#rsvp-store .btn-submit").html("Ucapan Sedang Dikirim");
                        $("#rsvp-store .btn-submit").prop("disabled", true);
                    },
                    success: function (data) {
                        $("input, textarea").prop("disabled", false);
                        $('input[type="text"], textarea').val("");
                        $('#rsvp-store input[type="radio"]').prop("checked", false);
                        $('#rsvp-store input[type="radio"]:first').prop("checked", true);

                        $("#rsvp-store .btn-submit").html("Kirim Ucapan");
                        $("#rsvp-store .btn-submit").prop("disabled", false);

                        if (data.act == "success") {
                            $(".show-rsvp-data").removeClass("important-hide");

                            $("html, body").animate(
                                {
                                    scrollTop: $(".show-rsvp-data").offset().top - 200,
                                },
                                500
                            );

                            $(".show-rsvp-data .message-box ul").prepend(data.payload.view);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        $("input, textarea").prop("disabled", false);

                        $("#rsvp-store .btn-submit").html("Kirim Ucapan");
                        $("#rsvp-store .btn-submit").prop("disabled", false);
                    },
                });
                return false;
            },
        });
    });

    // Theme change function
    $(document).on("change", '.theme-option select[name="SelectTheme"]', function () {
        var val = $(this).val();

        window.location.href = val;
    });

    // Theme color change function
    $(document).on("click", ".theme-option .color-box li", function () {
        var theme_color = $(this).attr("theme-color");
        var theme_color_secondary = $(this).attr("theme-color-secondary");

        document.documentElement.style.setProperty("--theme-color", theme_color);
        document.documentElement.style.setProperty("--theme-color-secondary", theme_color_secondary);

        $(".theme-option .color-box li").removeClass("color-selected");
        $(this).addClass("color-selected");
    });

    // Scrolled function for audio & navigation control
    $(window).scroll(function () {
        var hT = $(".intro-cover").offset().top,
            hH = $(".intro-cover").outerHeight(),
            wH = $(window).height(),
            wS = $(this).scrollTop();

        if (wS > hT + hH - wH + 300) {
            $(".abs-fix-audio-control").fadeIn();
            $(".navigation-inner").slideDown();
        } else {
            $(".abs-fix-audio-control").fadeOut();
            $(".navigation-inner").slideUp();
        }
    });

    // Audio mute unmute control
    $(document).on("click", ".abs-fix-audio-control button", function () {
        var is_volume_mute = $(this).attr("is-volume-mute");

        if (is_volume_mute == "false") {
            $(".abs-fix-audio-control button .volume-unmute").hide();
            $(".abs-fix-audio-control button .volume-mute").show();
            $(this).attr("is-volume-mute", "true");

            $("#audio").prop("muted", true);
        } else {
            $(".abs-fix-audio-control button .volume-unmute").show();
            $(".abs-fix-audio-control button .volume-mute").hide();
            $(this).attr("is-volume-mute", "false");

            $("#audio").prop("muted", false);
        }
    });

    var scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: "#navigation-fcs",
    });

    // Copy to clipboard
    $(".copyto-clipboard").click(function () {
        var value = $(this).attr("data-text");
        var notificationText = $(this).attr("data-notif-text");
        CopyToClipboard(value, true, notificationText);
    });
    function CopyToClipboard(value, showNotification, notificationText) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(value).select();
        document.execCommand("copy");
        $temp.remove();

        if (typeof showNotification === "undefined") {
            showNotification = true;
        }
        if (typeof notificationText === "undefined") {
            notificationText = "Copied to clipboard";
        }

        var notificationTag = $("div.copy-notification");
        if (showNotification && notificationTag.length == 0) {
            notificationTag = $("<div/>", { class: "copy-notification", text: notificationText });
            $("body").append(notificationTag);

            notificationTag.fadeIn("slow", function () {
                setTimeout(function () {
                    notificationTag.fadeOut("slow", function () {
                        notificationTag.remove();
                    });
                }, 1000);
            });
        }
    }
});
