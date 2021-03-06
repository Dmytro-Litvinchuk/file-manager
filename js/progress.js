function toggleBarVisibility() {
    var e = document.getElementById("bar-blank");
    e.style.display = (e.style.display == "block") ? "none" : "block";
}

function createRequestObject() {
    var http;
    if (navigator.appName == "Microsoft Internet Explorer") {
        http = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        http = new XMLHttpRequest();
    }
    return http;
}

function sendRequest() {
    var http = createRequestObject();
    http.open("GET", "progress.php");
    http.onreadystatechange = function () {
        handleResponse(http);
    };
    http.send(null);
}

function handleResponse(http) {
    var response;
    if (http.readyState == 4) {
        response = http.responseText;
        document.getElementById("bar-color").style.width = response + "%";
        document.getElementById("status").innerHTML = response + "%";

        if (response < 100) {
            setTimeout("sendRequest()", 100);
        } else {
            toggleBarVisibility();
            document.getElementById("status").innerHTML = "Done";
            window.location.reload();
        }
    }
}

function startUpload() {
    toggleBarVisibility();
    setTimeout("sendRequest()", 100);
}

(function () {
    document.getElementById("my-form").onsubmit = startUpload;
})();