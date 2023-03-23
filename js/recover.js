var recoveryAPI = "/api/recover.php";
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

$(function() {
    var loginToken = getParameterByName("token");
    $("#login-show .ui.checkbox").checkbox({
        onChange: function() {
            var x = document.getElementById("login-password");
            if (x.type === "password") {
                x.type = "text";
            } else {
                x.type = "password";
            }
        }
    });
    $("body").off("keyup");
    $("body").keyup(function(event) {
        if(event.which == 13) {
            $("#login-reset").trigger("click");
        }
    });
    $("#login-reset").click(function() {
        var password = $("#login-password").val();
        if(password.length < 8) {
            $(".login-body .ui.form").addClass("error");
            return false;
        }
        var loginRequest = $.ajax({
            method: "POST",
            url: recoveryAPI + "/" + loginToken,
            dataType: "json",
            data: {
                LoginPassword: password
            }
        });
        loginRequest.done(function(res) {
            if(parseInt(res.code) == 1) {
                $(".login-body .ui.form").removeClass("error");
                location.replace("/mail");
            } else {
                $(".login-body .ui.form .ui.error p").html(res.msg);
                $(".login-body .ui.form").addClass("error");
            }
        });
        loginRequest.fail(function() {
        });
        loginRequest.always(function() {
        });
    });
});