$(document).ready(function () {
    // Get variables from html(php).
    var action = $(".create_folder form").attr("action"); // $now.
    $("td:first-child").click(function () {
        var value = $(this).text();
        $(".download_element h3").append(value);
        $(".download_element").css({"display": "block"});
        $(".download_element button").click(function () {
            if ($(this).val() == 1) {
                var current_dir = $(this).attr("name");
                window.location.href = "?download=" + current_dir + '/' + value;
            }
            $(".download_element").css({"display": "none"});
        });
    });

    $("td:first-child, a").contextmenu(function () {
        $(".change_element").css({"display": "block"});
        // Global var "value".
        value = $(this).text();
        $(".change_element").prepend(value);
    });
    // Delete element.
    $(".delete").click(function () {
        $(".change_element").css({"display": "none"});
        $(".confirm").css({"display": "block"});
        $(".confirm button").click(function () {
            if ($(this).val() == 1) {
                $.post(action,
                    {delete: value}, function () {
                        $("body").load(action);
                    });
            }
            $(".confirm").css({"display": "none"});

        });
    });
    // Rename element.
    $(".rename").click(function () {
        $(".change_element").css({"display": "none"});
        $(".new_name").css({"display": "block"});
        $(".new_name input").attr('placeholder', value);
        $(".new_name button").click(function () {
            var n_name = $(".new_name input").val();
            $.post(action,
                {name: value, new_name: n_name}, function () {
                    $("body").load(action);
                });
        });
    });
    // Copy element.
    $(".copy").click(function () {
        $.post(action, {copy: value});
        $(".change_element").css({"display": "none"});
    });

    // Cut.
    $(".cut").click(function () {
        $.post(action, {cut: value});
        $(".change_element").css({"display": "none"});
    });
    // Paste.
    $(".paste button").click(function () {
        $.post(action,
            {past: "yes"}, function () {
                $("body").load(action);
            });
    });

});