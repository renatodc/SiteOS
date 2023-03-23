// #region VARIABLES
let dbLogo;
// #endregion
// #region HELPER METHODS
function updateCustomerAJAX(customerModel) {
    customerModel.st = $("#st").val();
    let req = $.ajax({
        method: "PUT",
        url: accountAPI,
        data: customerModel,
        dataType: "json"
    });
    req.done(function(res) {
        if(parseInt(res.code) == 1) {
            location.reload();
        } else if(res.msg && res.msg.includes("Integrity") && res.msg.includes(customerModel.CustomerEmail)) {
            $(".ui.form").addClass("warning");
            $("#user-customeremail").addClass("warning");
            $(".ui.form .ui.warning.message .header").text(w_email_already_registered_h);
            $(".ui.form .ui.warning.message p").text(w_email_already_registered_p);
        } else {            
            $(".ui.form").addClass("warning");
        }
    });
    req.fail(handleAPIError);
}
function clearErrors() {
    $(".ui.form").removeClass("error");
    $(".ui.form").removeClass("warning");

    $("#user-name").removeClass("error");
    $("#user-customeremail").removeClass("error");
    $("#user-customeremail").removeClass("warning");
    $("#user-password").removeClass("error");
    
    // #region DEFAULT ERROR/WARNING MSGS
    $(".ui.form .ui.error.message .header").text(w_invalid_fields_h);
    $(".ui.form .ui.error.message p").text(w_invalid_fields_p);
    $(".ui.form .ui.warning.message .header").text(w_server_error_h);
    $(".ui.form .ui.warning.message p").text(w_server_error_p);
    // #endregion
}
function getUserDetails() {
    let customerModel = {};
    customerModel.EmailSignature = $("#user-mail-signature").html();
    customerModel.CustomerName = $("#user-name input").val();
    customerModel.CustomerRole = $("#user-role input").val();
    customerModel.CustomerEmail = $("#user-customeremail input").val();
    customerModel.CustomerPhone = $("#user-customerphone input").val();
    customerModel.CustomerLanguage = $("#user-language .ui.dropdown").dropdown("get value");
    customerModel.CustomerTheme = $("#user-theme .ui.dropdown").dropdown("get value");
    if($("#user-savetocrm-incomingmail .ui.checkbox").checkbox("is checked")) {
        customerModel.CRMSaveIncomingEmail = "1";
    } else {
        customerModel.CRMSaveIncomingEmail = "0";
    }
    if($("#user-savetocrm-outgoingmail .ui.checkbox").checkbox("is checked")) {
        customerModel.CRMSaveOutgoingEmail = "1";
    } else {
        customerModel.CRMSaveOutgoingEmail = "0";
    }
    if($("#user-basecolor input").spectrum("get")) {
        customerModel.CustomerBaseColor = $("#user-basecolor input").spectrum("get").toHexString();
    } else {
        customerModel.CustomerBaseColor = "";
    }
    customerModel.Logo = dbLogo;
    customerModel.FormRecipient = $("#user-formrecipient input").val();
    if($("#user-password input").val()) {
        customerModel.CustomerPassword = $("#user-password input").val();
    }
    return customerModel;
}
function saveUserDetails() {
    clearErrors();
    let customerModel = getUserDetails();
    // #region VALIDATE EMPTY FIELDS
    if(!customerModel.CustomerName) {
        $(".ui.form").addClass("error");
        $("#user-name").addClass("error");
        return false;
    }
    if((!isValidEmail(customerModel.CustomerEmail)) &&
    (customerModel.CustomerEmail && !isValidEmail(customerModel.CustomerEmail))) {
        $(".ui.form").addClass("error");
        $("#user-customeremail").addClass("error");
        $(".ui.form .ui.error.message .header").text(w_invalid_email_h);
        $(".ui.form .ui.error.message p").text(w_invalid_email_p);
        return false;
    }
    if(customerModel.CustomerPassword && customerModel.CustomerPassword.length < 8) {
        $(".ui.form").addClass("error");
        $("#user-customerpassword").addClass("error");
        $(".ui.form .ui.error.message .header").text(w_invalid_password_h);
        $(".ui.form .ui.error.message p").text(w_invalid_password_p);
        return false;
    }
    // #endregion
    updateCustomerAJAX(customerModel);
}
// #endregion
// #region MAIN METHODS
function setData() {
    // #region SET DISPLAY SETTINGS
    $("#user-language .ui.dropdown").dropdown("set selected", mainCustomer.CustomerLanguage);
    $("#user-theme .ui.dropdown").dropdown("set selected", mainCustomer.CustomerTheme);
    // #region SET BASE COLOR
    var isValidHex  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(mainCustomer.CustomerBaseColor);
    let initialBaseColor = (mainCustomer.CustomerBaseColor && isValidHex) ? mainCustomer.CustomerBaseColor : "";
    let colorParams = {
        color: initialBaseColor,
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
        allowEmpty: true,
        palette: [
            // add theme color scheme
            ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
            ["#263238","#455A64","#607D8B","#90A4AE","#A1887F","#795548","#5d4037","#3e2723"],
            ["#9575CD","#673AB7","#512DA8","#311B92","#7986cb","#3f51b5","#303F9F","#1A237E"],
            ["#eb144c","#ff6900","#fcb900","#00d084","#abb8c3","#8ed1fc","#0693e3","#9900ef"],
            ["#b80000","#db3e00","#fccb00","#008b02","#006b76","#1273de","#004dcf","#5300eb"],
            ["#c00000","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
            ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
            ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ]
    };
    colorParams.move = function(color) {
        if(color) {
            document.documentElement.style.setProperty('--color-primary', color.toHexString());
            document.documentElement.style.setProperty('--color-ui-bar-link', color.toHexString());
        }
    };
    colorParams.hide = function(color) {
        if(color) {
            document.documentElement.style.setProperty('--color-primary', color.toHexString());
            document.documentElement.style.setProperty('--color-ui-bar-link', color.toHexString());
        }
    };
    $("#user-basecolor input").spectrum(colorParams);
    // #endregion
    // #endregion
    // #region SET EMAIL SETTINGS
    $("#user-savetocrm-incomingmail .ui.checkbox").checkbox();
    $("#user-savetocrm-outgoingmail .ui.checkbox").checkbox();
    if(parseInt(mainCustomer.CRMSaveIncomingEmail)) {
        $("#user-savetocrm-incomingmail .ui.checkbox").checkbox("set checked");
    } else {
        $("#user-savetocrm-incomingmail .ui.checkbox").checkbox("set unchecked");
    }
    if(parseInt(mainCustomer.CRMSaveOutgoingEmail)) {
        $("#user-savetocrm-outgoingmail .ui.checkbox").checkbox("set checked");
    } else {
        $("#user-savetocrm-outgoingmail .ui.checkbox").checkbox("set unchecked");
    }
    $("#user-mail-signature").html(mainCustomer.EmailSignature);
    $("#toolbar-tmplName input").val("");
    // #endregion    
    // #region SET CONTACT SETTINGS
    $("#user-name input").val(mainCustomer.CustomerName);
    $("#user-role input").val(mainCustomer.CustomerRole);
    $("#user-customeremail input").val(mainCustomer.CustomerEmail);
    $("#user-customerphone input").val(mainCustomer.CustomerPhone);
    // #endregion
    // #region SET COMPANY SETTINGS (LOGO, FORMRECIPIENT)
    dbLogo = mainCustomer.Logo;
    $("#user-formrecipient input").val(mainCustomer.FormRecipient);
    // #endregion
}
function wireUI() {
    $('.tabular.menu > .item').tab();

    // #region WIRE PASSWORD BUTTON
    $("#user-password-change .ui.button").click(function() {
        $("#user-password").show();
        $("#user-password-change").hide();
    });
    // #endregion
    if(parseInt(mainCustomer.IsAdmin) == 0) {
        $("#user-savetocrm").hide();
    }
    // #region WIRE LOGO BUTTONS
    $("#user-logo-change").click(function() {
        galleryTarget = GalleryTarget.Logo;
        $("#modal-gallery").modal("show");
    });
    $("#user-logo-reset").click(function() {
        $("#logo > img").attr("src", "img/logo.png");
        dbLogo = "";
        $("#user-logo-reset").hide();
    });
    // #endregion
    $("#user-terminate-btn").click(function() {
        $("#modal-terminate").modal("show");
    });
    $("#modal-terminate-proceed").click(function() {
        let data = { st: $("#st").val() };
        let req = $.ajax({
            method: "DELETE",
            url: accountAPI,
            data: data,
            dataType: "json"
        });
        req.done(function(res) {
            baseProcess(res,function() {
                location.reload();
            });
        });
        req.fail(handleAPIError);
        req.always(function() {
        });
    });

    // #region WIRE SAVE BUTTON
    $("#account-save").click(saveUserDetails);
    // #endregion
}
function translateAccount() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            // UI - BAR
            $("#title").text("Configuración");
            $("#account-save span").text("Grabar Cambios");
            // TAB NAMES
            $(".tabular.menu > .item[data-tab='display'] span").text("Visualización");
            $(".tabular.menu > .item[data-tab='email'] span").text("Correo");
            $(".tabular.menu > .item[data-tab='contact'] span").text("Contacto");
            $(".tabular.menu > .item[data-tab='company'] span").text("Compañía");
            // DISPLAY TAB
            $("#user-language > label").text("Lenguaje");
            $("#user-language .ui.dropdown .item[data-value='en'] span").text("Inglés");
            $("#user-language .ui.dropdown .item[data-value='es'] span").text("Español");
            $("#user-theme > label").text("Temática");
            $("#user-theme .ui.dropdown .item[data-value='light'] span").text("Claro");
            $("#user-theme .ui.dropdown .item[data-value='neonblue'] span").text("Azul Oscuro");
            $("#user-theme .ui.dropdown .item[data-value='neonred'] span").text("Rojo Oscuro");
            $("#user-theme .ui.dropdown .item[data-value='neongreen'] span").text("Verde Oscuro");
            let languageText = $("#user-language .ui.dropdown .text span");
            switch(mainCustomer.CustomerLanguage) {
                case "en":
                    languageText.text("Inglés");
                    break;
                case "es":
                    languageText.text("Español");
                    break;
            }
            let themeText = $("#user-theme .ui.dropdown .text span");
            switch(mainCustomer.CustomerTheme) {
                case "light":
                    themeText.text("Claro");
                    break;
                case "neonblue":
                    themeText.text("Azul Oscuro");
                    break;
                case "neonred":
                    themeText.text("Rojo Oscuro");
                    break;
                case "neongreen":
                    themeText.text("Verde Oscuro");
                    break;
            }
            $("#user-basecolor > label").text("Color de Base");
            // EMAIL TAB
            $("#user-password-change span").text("Cambiar Clave");
            $("#user-password-change > label").text("Clave");
            $("#user-password > label").text("Clave");
            $("#user-savetocrm > label").text("Correo a CRM");
            $("#user-savetocrm-incomingmail label").text("Generar clientes de remitentes de correos");
            $("#user-savetocrm-outgoingmail label").text("Generar clientes de destinarios de correos");
            $("#toolbar-html span").text("Simple / HTML");
            $("#user-signature > label").text("Firma de Correo");
            // CONTACT TAB
            $("#user-name > label").text("Nombre");
            $("#user-role > label").text("Título");
            $("#user-customeremail > label").text("Correo");
            $("#user-customerphone > label").text("Teléfono");
            // COMPANY TAB
            $("#user-logo > label").text("Logotipo");
            $("#user-logo-change > span").text("Cambiar Logotipo");
            $("#user-logo-reset > span").text("Recolocar Logotipo");
            $("#user-formrecipient > label").text("Destinatario de formularios en la página web");
            $("#user-terminate > label").text("Clausura de Cuenta");
            $("#user-terminate-btn > span").text("Cerrar Cuenta");
            // ERROR UI
            $(".ui-center .ui.error.message .header").text("Datos inválidos");
            $(".ui-center .ui.error.message p").text("Por favor, llene los datos requeridos");
            // MODAL - TERMINATE ACCOUNT
            $("#modal-terminate > .header span").text("Cancelar Cuenta");
            $("#modal-terminate > .content p").text("Toda la información relacionada con su cuenta sera eliminada. ¿Esta seguro que desea cancelar su cuenta?");
            $("#modal-terminate-proceed span").text("Sí");
            // MODAL - GALLERY IMAGES
            $("#modal-gallery > .header span").text("Galería");
            $("#gallery-tab-stockphotos span").text("Fotos de Stock");
            $("#gallery-tab-gallery span").text("Mis Imágenes");
            $("#gallery-stockphotos-search input").attr("placeholder","Buscar Categorías");
            $("#gallery-stockphotos-load .loader").text("Cargando");
            $("#gallery-upload > span").html("<i class='icon add'></i>Agregar Imagen");
            $("#gallery-upload .ui.progress .label").text("Subiendo Imagen");
            // UI-TOOLBAR
            $("#toolbar-tab-attachments span").text("Adjuntos");
            $("#toolbar-tab-formatting span").text("Estilos");
            $("#toolbar-tab-color span").text("Color");
            $("#toolbar-tab-templates span").text("Plantillas");
            $("#toolbar-attachment span").text("Agregar Adjunto");
            $("#toolbar-image span").text("Agregar Imagen");
            $("#toolbar-link span").text("Agregar Enlace");
            $("#toolbar-attachment span").text("Agregar Adjunto");
            $("#toolbar-size .default.text").text("Tamaño");
            $("#toolbar-font .default.text").text("Tipo");
            $("#toolbar-size2 .default.text").text("Tamaño");
            $("#toolbar-font2 .default.text").text("Tipo");
            $("#toolbar-bgcolor-text").text("Color de fondo");
            $("#toolbar-color-text").text("Color de letra");
            $("#toolbar-templates span").text("Abrir Plantillas");
            $("#toolbar-tmplName input").attr("placeholder", "Nombre de plantilla");
            $("#toolbar-savetemplate span").text("Grabar Plantilla");
            $("#toolbar-mergetags .default.text").text("Variables");
            $("#toolbar-mergetag-fname").text("Nombre");
            $("#toolbar-mergetag-lname").text("Apellido");
            $("#toolbar-mergetag-name").text("Nombre Completo");
            $("#toolbar-mergetag-email").text("Correo");
            $("#toolbar-mergetag-url").text("Enlace de anulación");
            // MODAL - ADD LINK
            $("#modal-add-link > .header > span").text("Agregar enlace");
            $("#add-link-type > label").text("Tipo de enlace");
            $("#add-link-type-web label").text("Web");
            $("#add-link-type-email label").text("Correo");
            $("#add-link-type-document label").text("Documento");
            $("#add-link-text-field > label").text("Description de enlace");
            $("#add-link-url-field > label").text("Enlace");
            $("#add-link-newtab label").text("Abrir en nueva pestaña");
            $("#modal-add-link .ui.error.message .header").text("Datos vacíos");
            $("#modal-add-link .ui.error.message p").text("Por favor, llene todos los datos para su enlace");
            $("#add-link-exit span").text("Salir");
            $("#add-link-save span").text("Agregar enlace");
            // MODAL - TEMPLATES
            $("#modal-templates > .header > span").text("Plantillas de correo");
            $("#templateMenu .templateAll").text("Todos");
            $("#templateMenu .templateCustom").text("Personalizados");
            break;
        default:
            break;
    }
}
function wireAccount() {
    setData();
    wireUI();
    // #region EXTRAS
    wireGallery();
    wireToolbar();
    templateLoad();
    // #endregion
    translateAccount();
}
// #endregion
// #region LAUNCH
async function launchAccount() {
    try {
        let req = await fetch(phoneAPI);
        let res = await req.json();
        baseProcess(res, function() {
            pfPhones = res.data;
            wireAccount();
        });
    } catch(ex) {
        toastr.error(w_server_error_h);
        console.log(ex);
    }
}
$(function() {
    $("#title").text("My Settings");    
    launchInterval = setInterval(function() {
        if(mainCustomer && mainCustomer.CustomerName) {
            launchAccount();
            clearInterval(launchInterval);
        }
    }, 100);
});
// #endregion