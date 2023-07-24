let installAPI = "/api/install.php";

$(function() {
    $("body").off("keyup");
    $("body").keyup(function(event) {
        if(event.which == 13) {
            $("#install-continue").trigger("click");
        }
    });
    $("#form-domainname").keyup(function(event) {
        $("#form-emaildomain").html("@" + $("#form-domainname").val());
    });
    $("#install-continue").click(function() {
        $(".login-body .ui.form").removeClass("error");
        $(".login-body .ui.form").removeClass("warning");
        let formCompanyName = $("#form-companyname").val();
        let formCustomerName = $("#form-customername").val();
        let formDomainName = $("#form-domainname").val();
        let formEmail = $("#form-email").val();
        let formPassword = $("#form-password").val();
        if(!formCompanyName || !formCustomerName || !formDomainName || !formEmail || !formPassword) {
            $(".login-body .ui.form").addClass("error");
            return false;
        }
        if(formPassword.length < 8) {
            $(".login-body .ui.form").addClass("warning");
            return false;
        }
        var installRequest = $.ajax({
            method: "POST",
            url: installAPI,
            dataType: "json",
            data: {
                formCompanyName,
                formCustomerName,
                formDomainName,
                formEmail,
                formPassword
            }
        });
        installRequest.done(function(res) {
            if(parseInt(res.code) == 1) {
                location.replace("/install-keys");
                // $(".login-body .ui.form").removeClass("error");
                // var installRequest2 = $.ajax({
                //     method: "PATCH",
                //     url: installAPI
                // });
                // installRequest2.done(function(res2) {
                //     location.replace("app." + formDomainName + "/install-keys");
                // });
                // installRequest2.fail(function() {
                // });
                // installRequest2.always(function() {
                // });
            } else {
                $(".login-body .ui.form .ui.error p").html(res.msg);
                $(".login-body .ui.form").addClass("error");
            }
        });
        installRequest.fail(function() {
        });
        installRequest.always(function() {
        });
    });
});