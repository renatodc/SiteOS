var baseURL = "/";
var loginAPI = baseURL + "api/login.php";
var recoveryAPI = baseURL + "mail/member-recovery.php";

$(function() {
    $("#login-remember .ui.checkbox").checkbox();

    $("body").off("keyup");
    $("body").keyup(function(event) {
        if(event.which == 13) {
            $("#login-do").trigger("click");
        }
    });
    $(".forgot").click(function() {       
        let email = $("#login-email input").val();
        if(email) {
            $(".login-body .ui.form").removeClass("error");
        } else {
            $(".login-body .ui.form").addClass("error");
            $(".login-body .ui.form .ui.error p").html("Type in your email address");
            return false;
        }
        $(".dimmer").addClass("active"); 
        let recoveryRequest = $.ajax({
            method: "POST",
            url: recoveryAPI,
            dataType: "json",
            data: {
                LoginEmail: email
            }
        });
        recoveryRequest.done(function(res) {
            if(parseInt(res.code) == 1) {
                $("#modal-recovery").modal("show");
            } else {
                $(".login-body .ui.form").addClass("error");
                $(".login-body .ui.form .ui.error p").html(res.msg);
            }
        });
        recoveryRequest.fail(function() {
        });
        recoveryRequest.always(function() {
            $(".dimmer").removeClass("active");
        });
    });
    $("#login-do").click(function() {
        if($(".login-body .ui.form").hasClass("error")) {
            $(".login-body .ui.form").removeClass("error");
        }
        let email = $("#login-email input").val();
        let password = $("#login-password input").val();
        let remember = $("#login-remember .ui.checkbox").checkbox("is checked");
        if(!email || !password) {
            $(".login-body .ui.form .ui.error p").html("Please fill in all fields");
            $(".login-body .ui.form").addClass("error");
            return false;
        }
        let loginRequest = $.ajax({
            method: "POST",
            url: loginAPI,
            dataType: "json",
            data: {
                LoginEmail: email,
                LoginPassword: password,
                LoginRemember: remember
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
            console.log("Login API server error");
        });
        loginRequest.always(function() {
        });
    });

});