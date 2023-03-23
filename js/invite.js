// #region VARIABLES
let inviteAPI = "/api/invite.php";
let token;
let pfCustomer = {};
let password;
// #endregion
// #region HELPER METHODS
function isValidEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
// #endregion
// #region MAIN METHODS
function translateInvite() {
    switch(pfCustomer.CustomerLanguage) {
        case "es":
            $(".page-body > h1").text("Bienvenido");
            $("#ln1").html(`Tienes una nueva cuenta para ${pfCustomer.DomainName}`);
            $("#ln2").html(`Por favor, ingresa una nueva contraseña para tu nueva cuenta: <br />${pfCustomer.CompanyEmail}`);
            $("#form-password > label").text("Contraseña");
            $(".ui.error.message .header").text("Contraseña vacía");
            $(".ui.error.message p").text("Por favor, ingresa una contraseña");
            $(".ui.warning.message .header").text("Contraseña no cumple los requisitos");
            $(".ui.warning.message p").text("Contraseña debe tener por lo menos 8 caracteres, y debería contener por lo menos una letra mayúscula, un número, y un símbolo");
            $("#form-do").text("Registrar");
            $(".statement").html("");
            break;
        default:
            break;
    }
}
function validateForm() {
    $("#form-do").blur();
    $(".page-body .ui.form").removeClass("error");
    $(".page-body .ui.form").removeClass("warning");
    $(".page-body .ui.form #form-password").removeClass("error");
    $(".page-body .ui.form #form-password").removeClass("warning");

    password = $("#form-password input").val();

    if(!password) {
        $(".page-body .ui.form #form-password").addClass("error");
        $(".page-body .ui.form").addClass("error");
        return false;
    }
    if(password.length < 8) {
        $(".page-body .ui.form #form-password").addClass("warning");
        $(".page-body .ui.form").addClass("warning");
        return false;
    }
    return true;
}
// #endregion
// #region LAUNCH
function wireForm() {
    $("#form-company").html(pfCustomer.DomainName);
    $("#form-email").html(pfCustomer.CompanyEmail);
    $("body").off("keyup");
    $("body").keyup(function(event) {
        if(event.which == 13) {
            $("#form-do").trigger("click");
        }
    });
    $("#form-do").click(function() {
        if(!validateForm()) {
            return false;
        }
        var invitePass = $.ajax({
            method: "PUT",
            url: inviteAPI + "/" + token,
            dataType: "json",
            data: {
                CustomerPassword: password
            }
        });
        invitePass.done(function(res) {
            if(parseInt(res.code) == 1) {
                $(".page-body .ui.form").removeClass("error");
                location.replace("/leads");
            } else {
                toastr.error(res.msg);
            }
        });
        invitePass.fail(handleAPIError);
        invitePass.always(function() {
        });
    });
}
$(function() {
    token = getParameterByName("token");
    toastr.options.positionClass = "toast-bottom-right";
    var getUserRequest = $.ajax({
        method: "POST",
        url: inviteAPI + "/" + token,
        dataType: "json",
    });
    getUserRequest.done(function(res) {
        if(parseInt(res.code) == 1) {
            pfCustomer = res.data;
            wireForm();
            translateInvite();
        } else {
            toastr.error(res.msg);
        }
    });
});
// #endregion