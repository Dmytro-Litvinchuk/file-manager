$(document).ready(function () {
    // Hide table.
    if ($(".files p").html() === 'No found') {
        $(".files table").hide();
    }
    // Button back.
    $(".button-back button").click(function () {
        window.history.back();
    });
    // Validation folder create.
    $('.create-folder input[type=text]').on('change', function () {
        var folder_name = $.trim($(this).val());
        if (folder_name !== '') {
            $('.create-folder input[type=submit]').prop('disabled', false);
        } else {
            $('.create-folder input[type=submit]').prop('disabled', true);
        }
    });
    // Get variables from html(php).
    var action = $(".create-folder form").attr("action"); // $now.
    // Download file.
    $("td:first-child").click(function () {
        var value = $(this).text();
        $(".download-element h3").append(value);
        $(".download-element").css({"display": "block"});
        $(".download-element button").click(function () {
            if ($(this).val() === '1') {
                var current_dir = $(this).attr("name");
                window.location.href = "?download=" + current_dir + '/' + value;
            }
            $(".download-element").css({"display": "none"});
        });
    });
    // Show context menu.
    $("td:first-child, a").contextmenu(function () {
        $(".change-element").css({"display": "block"});
        // Global var "value".
        value = $(this).text();
        $(".change-element").prepend(value);
    });
    // Delete element.
    $(".delete").click(function () {
        $(".change-element").css({"display": "none"});
        $(".confirm").css({"display": "block"});
        $(".confirm button").click(function () {
            if ($(this).val() === '1') {
                $.post(action, {delete: value}, function () {
                    $("body").load(action);
                });
            }
            $(".confirm").css({"display": "none"});
        });
    });
    // Rename element.
    $(".rename").click(function () {
        $(".change-element").css({"display": "none"});
        $(".new-name").css({"display": "block"});
        $(".new-name input").attr('placeholder', value);
        $(".new-name button").click(function () {
            var n_name = $(".new-name input").val();
            $.post(action, {name: value, new_name: n_name}, function () {
                $("body").load(action);
            });
        });
    });
    // Copy element.
    $(".copy").click(function () {
        $.post(action, {copy: value});
        $(".change-element").css({"display": "none"});
    });

    // Cut.
    $(".cut").click(function () {
        $.post(action, {cut: value});
        $(".change-element").css({"display": "none"});
    });
    // Paste.
    $(".paste button").click(function () {
        $.post(action, {past: "yes"}, function () {
            $("body").load(action);
        });
    });
    // Validation to upload.
    $('#my-form input[type=file]').on('change', function () {
        if ($(this).val() !== '') {
            $('#my-form input[type=submit]').prop('disabled', false);
        } else {
            $('#my-form input[type=submit]').prop('disabled', true);
        }
    });
});