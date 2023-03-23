// #region GLOBAL VARIABLES
// #region DATA OBJECTS
var pfData = {}
function clean_pfData() { pfData = {} }
var pfLead = {}
function clean_pfLead() { pfLead = {} }
var pfContact = {}
function clean_pfContact() { pfContact = {} }
var pfAction = {}
function clean_pfAction() { pfAction = {} }
var pfLeadList = {}
function clean_pfLeadList() { pfLeadList = {} }
// #endregion
var isBroadcast = false;
var mousePosition = {'x': 0, 'y': 0};
let elementRange;
let elementSelection;
let elementTarget;
let sectionTarget;
let toolbarTarget;
let favicon;
let mainCustomer;
let query;
let launchInterval;
let userButton;
let userMenu;
// #endregion
// #region DICTIONARY
let w_emailsent = "Email Sent";
let w_emailsentfailed = "Email Delivery Failed";
let w_emailsaved = "Email Saved";
let w_emailsavedfailed = "Unable to Save Email";

let w_composer_auth_expired = "Authentication expired. Please log in again.";
let w_composer_no_recipient = "Message has no recipient";
let w_composer_credit_exceeded = "You have reached your sending quota";
let w_composer_max_recipients_exceeded = "Exceeded maximum limit of recipients";
let w_composer_max_free_recipients_exceeded = "Exceeded maximum limit of recipients for free account";

let w_attachmentfailed = "Attachment upload failed";
let w_attachmentnotfound = "No attachment found";
let w_attachmentempty = "Empty attachment";
let w_attachmentcorrupt = "Corrupt attachment";
let w_attachmenttoobig = "Max attachment size is 50 MB. Your attachment size is: ";
let w_attachment_uploading_title = "Attachment Uploading";
let w_attachment_uploading_msg = "Please wait until your attachment successfully uploads";
let w_attachment_uploading_title_plural = "Attachments Uploading";
let w_attachment_uploading_msg_plural = "Please wait until your attachments are successfully uploaded";

let w_img_api_upload_failed = "Image upload failed";
let w_img_api_upload_not_found = "No image found";
let w_img_api_upload_empty = "Empty image";
let w_img_api_upload_corrupt = "Corrupt image";
let w_img_api_upload_too_big = "Max image size is 50 MB. Your image size is: ";
let w_img_api_upload_wrong_format = "Image format not allowed: ";
let w_img_api_delete_error = "Error deleting image";

let w_video_api_upload_failed = "Video upload failed";
let w_video_api_upload_not_found = "No video found";
let w_video_api_upload_empty = "Empty video";
let w_video_api_upload_corrupt = "Corrupt video";
let w_video_api_upload_too_big = "Max video size is 300 MB. Your video size is: ";
let w_video_api_upload_wrong_format = "Video format not allowed: ";
let w_video_api_delete_error = "Error deleting video";

let w_mailtemplateerror = "Error loading templates";
let w_mailtemplatenamerequired = "Template name is required";
let w_mailtemplatecontentrequired = "Template content is required";
let w_mailtemplatenameinvalid = "Template name is invalid";
let w_mailtemplatesaveerror = "Error saving template";

let w_invalid_fields_h = "Invalid Fields";
let w_invalid_fields_p = "Enter valid data for all required fields";
let w_server_error_h = "Server Error";
let w_server_error_p = "Unable to save changes";
let w_invalid_email_h = "Invalid Email";
let w_invalid_email_p = "Please type in a valid email address";
let w_invalid_password_h = "Invalid Password";
let w_invalid_password_p = "Password must have at least 8 characters, and should include an uppercase letter, a number, and a symbol";
let w_email_already_registered_h = "Email is already registered to an account";
let w_email_already_registered_p = "Please type in another email address";

let w_demo_email_sending_restricted = "Email sending is disabled in demo account";
let w_demo_domain_registration_restricted = "Domain registration is disabled in demo account";

let w_gallery_img_dimensions = "Image Dimensions";
let w_gallery_img_studio = "Image Studio";
let w_gallery_img_name = "Image Name";
let w_gallery_img_by = "By";
let w_gallery_img_size = "Image Size";
let w_gallery_img_delete = "Delete";
let w_gallery_view_source = "View Source";
let w_gallery_no_results = "No results found";
// #endregion
// #region API ENDPOINTS
const jsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
var uuid;
var baseURL = "/";

let mainAPI = baseURL + "api/main.php";
let sessionValidateAPI = baseURL + "api/session-validate.php";
let loginAPI = baseURL + "api/login.php";

let accountAPI = baseURL + "api/account.php";
let accountsAPI = baseURL + "api/accounts.php";
let analyticsAPI = baseURL + "api/analytics.php";
let attachmentAPI = baseURL + "api/attachment.php";
let broadcastAPI = baseURL + "api/broadcast.php";
let builderAPI = baseURL + "api/builder.php";
let filterAPI = baseURL + "api/filter.php";
let folderCabAPI = baseURL + "api/foldercab.php";
let imgAPI = baseURL + "api/img.php";
let leadAPI = baseURL + "api/lead.php";
let leadcfAPI = baseURL + "api/leadcf.php";
let leadactionAPI = baseURL + "api/leadaction.php";
let leadcontactAPI = baseURL + "api/leadcontact.php";
let leadcontactcfAPI = baseURL + "api/leadcontactcf.php";
let leadlistAPI = baseURL + "api/leadlist.php";
let leadsearchAPI = baseURL + "api/leadsearch.php";
let mailAPI = baseURL + "api/mail.php";
let mailFolderAPI = baseURL + "api/mailfolder.php";
let mailFolderGenAPI = baseURL +  "api/mailfoldergen.php";
let mailTemplateAPI = baseURL + "api/mailtemplate.php";
let mailTemplateThumbAPI = baseURL + "api/mailtemplatethumb.php";
let templateAPI = baseURL + "api/templates.php";
let videoAPI = baseURL + "api/video.php";

let accountsViewSettingsAPI = baseURL + "api/viewsettings-accounts.php";
let broadcastsViewSettingsAPI = baseURL + "api/viewsettings-broadcasts.php";
let leadsViewSettingsAPI = baseURL + "api/viewsettings-leads.php";

let sendMailAPI = baseURL + "mail/email-send.php";
let inviteAPI = baseURL + "mail/member-invite.php";

let clearBitAPI = "https://person.clearbit.com/v1/people/email/";
var clearBitEmail;
// #endregion
// #region HELPER METHODS
// #region VALIDATION
function isValidEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function isValidString(str,allowDash,allowSpace) {  
    let re = /^[\w]+$/; // ^ = start of string; \w = alphanumberic string (0-9,a-z,A-Z); + = 1 or more times; $ = end of string
    if(allowDash && allowSpace) {
        re = /^[\w- ]+$/;
    } else if(allowDash) {
        re = /^[\w-]+$/;
    } else if(allowSpace) {
        re = /^[\w ]+$/;
    }
    return re.test(str);
}
// #endregion
// #region URL PARSING
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
function getAbsoluteURL(url) {
    var fixedPrefix = "http";
    var lcURL = url.toLowerCase();
    if(lcURL.indexOf("http://") === 0 || lcURL.indexOf("https://") === 0) {
        return url;
    } else {
        var newURL = fixedPrefix + "://" + url;
        return newURL;
    }
}
// #endregion
// #region NUMBER PARSING
function getPrice(price) {
    return parseFloat(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(1);
}
function getPriceFlat(price) {
    return parseFloat(price).toFixed(2);
}
// #endregion
// #region STRING PARSING
function getHTML(str) {
    var htmlString = str.replace(/(\r\n|\n|\r)/g,"<br />");
    return htmlString;
}
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
// #endregion
// #region API HANDLERS
function baseProcess(res, success) {
    switch(parseInt(res.code)) {
        case 1:
            success.call(this);
            break;
        case 0:
        default:
            toastr.error(w_server_error_h);
            console.log(res.msg);
            return;
    }
}
function handleAttachmentAPIError(code,msg = "") {
    switch(parseInt(code)) {
        case 2:
            toastr.error(w_attachmentnotfound);
            break;
        case 3:
            toastr.error(w_attachmentcorrupt);
            break;
        case 4:
            toastr.error(w_attachmentempty);
            break;
        case 5:
            toastr.error(`${w_attachmenttoobig}${msg}`);
            break;
        case 0:
        default:
            toastr.error(w_attachmentfailed);
            console.log(msg);
            break;
    }
}
function handleImgAPIError(code,msg = "") {
    switch(parseInt(code)) {
        case 2:
            toastr.error(w_img_api_upload_not_found);
            break;
        case 3:
            toastr.error(w_img_api_upload_corrupt);
            break;
        case 4:
            toastr.error(w_img_api_upload_empty);
            break;
        case 5:
            toastr.error(`${w_img_api_upload_too_big}${msg}`);
            break;
        case 6:
            toastr.error(`${w_img_api_upload_wrong_format}${msg}`);
            break;
        case 0:
        default:
            toastr.error(w_img_api_upload_failed);
            console.log(msg);
            break;
    }
}
function handleAPIError(xhr) {
    toastr.error(w_server_error_h);
    console.log(xhr);
}
// #endregion
// #endregion
// #region MAIN METHODS
function translate() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            // LEFT MENU
            $("#module-mail span:first-of-type").text("Bandeja");
            $("#module-builder span:first-of-type").text("Página Web");
            $("#module-analytics span:first-of-type").text("Analítica");
            $("#module-leads span:first-of-type").text("Clientes");
            $("#module-accounts span").text("Cuentas de Correo");
            $("#module-filter span").text("Filtro de Spam");
            $("#module-domain span").text("Nombre de Dominio");
            $("#module-phones span").text("Teléfonos");
            $("#module-files span:first-of-type").text("Archivos");

            // RIGHT MENU
            $("#user-logout span").text("Cerrar");
            $("#user-settings span").text("Configuración");
            $("#quick-outgoing-email").text("Correos Envíados");
            $("#quick-incoming-email").text("Correos Recibidos");
            $("#quick-support span").text("Preguntas/Soporte");

            // DICTIONARY
            w_emailsent = "Correo Envíado";
            w_emailsentfailed = "Envío de correo ha fallado";
            w_emailsaved = "Correo Grabado";
            w_emailsavedfailed = "No se pudo grabar el correo";

            w_composer_auth_expired = "Autenticación caducada. Inicie sesión de nuevo.";
            w_composer_no_recipient = "El mensaje no tiene destinatario";
            w_composer_credit_exceeded = "Ha alcanzado su cuota de envíos";
            w_composer_max_recipients_exceeded = "Superó el límite máximo de destinatarios";
            w_composer_max_free_recipients_exceeded = "Se superó el límite máximo de destinatarios de la cuenta gratuita";

            w_attachmentfailed = "Subida del adjunto ha fallado";
            w_attachmentnotfound = "Adjunto no ha sido encontrado";
            w_attachmentempty = "Adjunto vacío";
            w_attachmentcorrupt = "Adjunto corrupto";
            w_attachmenttoobig = "Tamaño máximo del adjunto es de 50 MB. Tu adjunto pesa: ";
            w_attachment_uploading_title = "Subiendo Adjunto";
            w_attachment_uploading_msg = "Por favor espere a que su adjunto termine de subir";
            w_attachment_uploading_title_plural = "Subiendo Adjuntos";
            w_attachment_uploading_msg_plural = "Por favor espere a que sus adjuntos terminen de subir";
            
            w_img_api_upload_failed = "Subida de la imagen ha fallado";
            w_img_api_upload_not_found = "Imagen no ha sido encontrada";
            w_img_api_upload_empty = "Imagen vacía";
            w_img_api_upload_corrupt = "Imagen corrupta";
            w_img_api_upload_too_big = "Tamaño máximo de la imagen es de 50 MB. Tu imagen pesa: ";
            w_img_api_upload_wrong_format = "Formato de imagen no esta permitido: ";
            w_img_api_delete_error = "Error al borrar imagen";

            w_video_api_upload_failed = "Subida del video ha fallado";
            w_video_api_upload_not_found = "Video no ha sido encontrado";
            w_video_api_upload_empty = "Video vacío";
            w_video_api_upload_corrupt = "Video corrupto";
            w_video_api_upload_too_big = "Tamaño máximo del video es de 300 MB. Tu video pesa: ";
            w_video_api_upload_wrong_format = "Formato de video no esta permitido: ";
            w_video_api_delete_error = "Error al borrar video";

            w_mailtemplateerror = "Error al cargar plantillas";
            w_mailtemplatenamerequired = "Nombre de plantilla es requerido";
            w_mailtemplatecontentrequired = "Contenido de plantilla es requerido";
            w_mailtemplatenameinvalid = "Nombre de plantilla es inválido";
            w_mailtemplatesaveerror = "Error al grabar plantilla";
            w_invalid_fields_h = "Datos inválidos";
            w_invalid_fields_p = "Ingrese datos válidos a los campos requeridos";
            w_server_error_h = "Error del servidor";
            w_server_error_p = "No se pudo grabar los cambios";
            w_invalid_email_h = "Correo Inválido";
            w_invalid_email_p = "Ingrese una dirección de correo electrónico válido";
            w_invalid_password_h = "Contraseña Inválida";
            w_invalid_password_p = "Contraseña debe tener por lo menos 8 caracteres, y debería contener por lo menos una letra mayúscula, un número, y un símbolo";
            w_email_already_registered_h = "Correo electrónico ya esta registrado a una cuenta";
            w_email_already_registered_p = "Por favor, ingrese otro correo electrónico";

            w_demo_email_sending_restricted = "Envío de correos esta deshabilitado en la cuenta de demostración";
            w_demo_domain_registration_restricted = "Registración de dominio esta deshabilitado en la cuenta de demostración";

            w_gallery_img_dimensions = "Dimensiones de Imagen";
            w_gallery_img_studio = "Estudio de Imagen";
            w_gallery_img_name = "Nombre de Imagen";
            w_gallery_img_by = "Por";
            w_gallery_img_size = "Tamaño de Imagen";
            w_gallery_img_delete = "Borrar";
            w_gallery_view_source = "Ver Fuente";
            w_gallery_no_results = "No se encontro resultados";
            break;
    }
}
async function logout() {
    try {
        await fetch(mainAPI, {
            method: "POST"
        });
        location.replace("/index");
    }
    catch(err) {
        console.log(err);
    }
}
// #endregion
// #region LAUNCH
async function loadMain() {
    try {
        let req = await fetch(mainAPI);
        let res = await req.json();
        if(parseInt(res.code)) {
            mainCustomer = res.data;
            
            // SET EMAIL 
            if(mainCustomer.CompanyEmail) {
                $("#quick-email").html(mainCustomer.CompanyEmail);
            } else {
                $("#quick-email").parent().hide();
            }
            // SET PHONE
            if(mainCustomer.CompanyPhone) {
                $("#quick-phone").html(mainCustomer.CompanyPhone);
            } else {
                $("#quick-phone").parent().hide();
            }

            translate();
            switch(mainCustomer.CustomerTheme) {
                case "light":
                    $(".inverted").removeClass("inverted");
                    break;
            }
            if(mainCustomer.Logo) {
                $("#logo > img").attr("src", mainCustomer.Logo);
            }
            if(mainCustomer.CustomerBaseColor) {
                document.documentElement.style.setProperty('--color-primary', mainCustomer.CustomerBaseColor);
                document.documentElement.style.setProperty('--color-ui-bar-link', mainCustomer.CustomerBaseColor);
            }
        } else {
            console.log(res.msg);
        }
    }
    catch(err) {
        console.log(err);
    }
}
$(function() {
    toastr.options.positionClass = "toast-bottom-right";
    // #region TOP RIGHT MENUBUTTON
    userButton = $(".userButton");
    userMenu = $(".userMenu");
    userButton.mouseenter(function(e) {
        if(!userMenu.is(":visible")) {
            userMenu.toggle();
        }
    });
    userButton.mouseleave(function(e) {
        if(e.pageX < userButton.offset().left ||
            e.pageX > (userButton.offset().left + userButton.width()) ||
            e.pageY < userButton.offset().top ||
            e.pageY > (userMenu.offset().top + userMenu.height()) ||
            !userMenu.is(":visible")
        ) {
            userMenu.toggle();
        }
    });    
    userMenu.mouseleave(function(e) {
        if(e.pageX < userButton.offset().left ||
            e.pageX > (userButton.offset().left + userButton.width()) ||
            e.pageY < userButton.offset().top ||
            e.pageY > (userMenu.offset().top + userMenu.height()) ||
            !userMenu.is(":visible")
        ) {
            userMenu.toggle();
        }            
    });
    $("#user-settings").on("touchend", function() {
        location.href = "/account";
    });
    // #endregion

    // #region RESPONSIVE
    $("#mobile").click(function(e) {
        $(".ui-body .ui-left").css("zIndex",6);
        $(".ui-body .ui-center").css("zIndex",5);
        $(".ui-body .ui-left").animate({width:'toggle'},200);
    });
    $(window).resize(function() {
        if($(window).width() > 800) {
            $(".ui-body .ui-left").removeAttr("style");
        }
    });
    // #endregion

    // #region MOUSE POSITION HOOK
    $(document).bind('mousemove', function(e) {
        // console.log(`x: ${e.pageX}`);
        // console.log(`y: ${e.pageY}`);
        mousePosition = {'x': e.pageX, 'y': e.pageY};
    });
    // #endregion

    // #region LOGOUT
    $("#user-logout").click(logout);
    $("#user-logout").on("touchend",logout);
    // #endregion

    // #region SESSION VALIDITY CHECK
    setInterval(async function() {
        let req = await fetch(sessionValidateAPI);
        let res = await req.json();
        if(!parseInt(res.code)) {
            location.reload();
        }
    }, 600000); // every 10 min
    // #endregion

    loadMain();
});
// #endregion