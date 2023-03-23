// REQUIRES TOASTR
// #region VARIABLES
class MailState {
    constructor() {
        this.to = "";
        this.cc = "";
        this.bcc = "";
        this.subject = "";
        this.message = "";
        this.attachments = "";
        this.get = function () {
            this.to = $('#recipientTO').dropdown("get value");
            this.cc = $('#recipientCC').dropdown("get value");
            this.bcc = $('#recipientBCC').dropdown("get value");
            this.subject = $("#modal-write-subject input").val();
            this.message = $("#modal-write-message").html();
            this.attachments = $("#modal-write-attachments").html();
        }
        this.set = function () {
            $('#recipientTO').dropdown("set value", this.to);
            $('#recipientCC').dropdown("set value", this.cc);
            $('#recipientBCC').dropdown("set value", this.bcc);
            $("#modal-write-subject input").val(this.subject);
            $("#modal-write-message").html(this.message);
            $("#modal-write-attachments").html(this.attachments);
        }
    }
}
let MailStateSD;
// #endregion
// #region MAIN METHODS
function sendEmail(dest) {
    // RESET RECIPIENTS
    $('.recipient.ui.dropdown').dropdown("clear");
    // SET TO: RECIPIENT
    $('.ui.dropdown.recipient.rto').dropdown("set selected", dest);
    // RESET TABS
    $('.toolbar-content .menu .item').removeClass("active");
    $('.toolbar-content .ui.segment').removeClass("active");
    // RESET HTML EDITOR 
    if(viewHTML) {
        $("#modal-write #toolbar-html").trigger("click");
    }
    // RESET CONTENT
    $("#modal-write #modal-write-message").html("");
    // SHOW WRITE MODAL
    $("#modal-write").modal("show");
}
function filterEmail(email) {
    let filteredEmail = email;
    if((email.indexOf("<") > -1) && (email.indexOf(">") > -1) && (email.indexOf(">") > email.indexOf("<"))) {
        filteredEmail = email.substring(email.indexOf("<") + 1, email.indexOf(">"));
    }
    filteredEmail = filteredEmail.trim();
    return filteredEmail;
}
function validateMessage() {
    let errorCatched = false;
    $("#modal-write .ui.form").removeClass("error");
    $("#modal-write-to").removeClass("error");
    $("#modal-write-cc").removeClass("error");
    $("#modal-write-bcc").removeClass("error");
    $("#modal-write-subject").removeClass("error");
    $("#modal-write-message").css("color", "");
    $("#modal-write-message").css("border-color", "");
    $("#modal-write-message").css("background-color", "");
    let to = $("#recipientTO").dropdown("get value");
    let cc = $("#recipientCC").dropdown("get value");
    let bcc = $("#recipientBCC").dropdown("get value");
    // VALIDATE EMPTY STRINGS -> TO, SUBJECT, MESSAGE
    if(to == "") {
        $("#modal-write-to").addClass("error");
        errorCatched = true;
    }
    if($("#modal-write-subject input").val() == "") {
        $("#modal-write-subject").addClass("error");
        errorCatched = true;
    }
    if($("#modal-write-message").html() == "") {
        $("#modal-write-message").css("color", "rgba(159,58,56,1.0)");
        $("#modal-write-message").css("border-color", "rgba(224,180,180,1.0)");
        $("#modal-write-message").css("background-color", "rgba(255,246,246,1.0)");
        errorCatched = true;
    }
    if(errorCatched) {
        switch(mainCustomer && mainCustomer.CustomerLanguage) {
            case "es":
                $("#modal-write .ui.error.message .header").html("Campos de Correo Vacíos");
                $("#modal-write .ui.error.message p").html("Por favor, llene todos los campos requeridos");
                break;
            case "en":
                $("#modal-write .ui.error.message .header").html("Missing Email Fields");
                $("#modal-write .ui.error.message p").html("Please fill out all required fields");
                break;
        }
        return false;
    }
    return true;
}
function encodeAttachments() {
    // #region Validate Uploads
    let attachmentsMissing = false;
    $("#modal-write-attachments .modal-write-attach").each(function() {
        let link = $(this).find(".name").attr("href");
        if(!link) {
            attachmentsMissing = true;
        }
    });
    if(attachmentsMissing) {
        if($("#modal-write-attachments .modal-write-attach").length > 1) {
            toastr.warning(w_attachment_uploading_msg_plural, w_attachment_uploading_title_plural);
        } else {
            toastr.warning(w_attachment_uploading_msg, w_attachment_uploading_title);
        }
        return false;
    }
    // #endregion
    attachmentLinks = "";
    attachments = [];
    $("#modal-write-attachments .modal-write-attach").each(function(index) {
        if(index != 0) { attachmentLinks += ","; }
        let link = $(this).find(".name").attr("href");
        attachmentLinks += link;
        let name = $(this).find(".name").html();
        let contentType = "text/html";
        let suffix = name.substring(name.indexOf(".")).toLowerCase();
        switch(suffix) {
            case ".jpg":
                contentType = "image/jpg";
                break;
            case ".jpeg":
                contentType = "image/jpeg";
                break;
            case ".png":
                contentType = "image/png";
                break;
            case ".gif":
                contentType = "image/gif";
                break;
            case ".bmp":
                contentType = "image/bmp";
                break;
            case ".doc":
                contentType = "application/doc";
                break;
            case ".docx":
                contentType = "application/docx";
                break;
            case ".pdf":
                contentType = "application/pdf";
                break;
            case ".pdfx":
                contentType = "application/pdfx";
                break;
            case ".xls":
                contentType = "application/xls";
                break;
            case ".html":
                contentType = "text/html";
                break;
            case ".css":
                contentType = "text/css";
                break;
            case ".js":
                contentType = "text/js";
                break;
            case ".php":
                contentType = "text/php";
                break;
            case ".sql":
                contentType = "text/sql";
                break;
            case ".csv":
                contentType = "text/csv";
                break;
            case ".zip":
                contentType = "application/zip";
                break;
            case ".rar":
                contentType = "application/rar";
                break;
        }
        let attachment = {
            "url": link,
            "content-type": contentType,
            "name": name,
            "size": $(this).find(".size").attr("data-size")
        };
        attachments.push(attachment);
    });
    if(attachments.length) {
        attachments = JSON.stringify(attachments);
    } else {
        attachments = "";
    }
    return true;
}
// #endregion
// #region LAUNCH
function wireComposer() {
    // #region WIRE UI
    $(".modal-write-message").bind('dragover drop', function(event){
        event.preventDefault();
        return false;
    });
    $(".ui.button.cc").click(function() {
        $("#modal-write-cc").toggle();
        if($("#modal-write-cc").css("display") == "none" && $("#modal-write-bcc").css("display") == "none") {
            $(".extrarecipients").hide();
        } else {
            $(".extrarecipients").css("display","flex");
        }
        $("#modal-write").modal("refresh");
    });
    $(".ui.button.bcc").click(function() {
        $("#modal-write-bcc").toggle();
        if($("#modal-write-cc").css("display") == "none" && $("#modal-write-bcc").css("display") == "none") {
            $(".extrarecipients").hide();
        } else {
            $(".extrarecipients").css("display","flex");
        }
        $("#modal-write").modal("refresh");
    });
    setWriterEngine();
    wireToolbar();
    // #endregion
    // #region WIRE ACTIONS
    $("#modal-write-discard").click(function() {
        $('.recipient.ui.dropdown').dropdown("clear");
        $("#modal-write-subject input").val("");
        $("#modal-write-message").html("");
        attachCount = 0;
        $("#modal-write-message .modal-write-attach").remove();
    });
    $("#modal-write-save").click(function() {
        // CONVERT TO PLAIN VIEW FOR CONTENT EXTRACTION
        if(viewHTML) {
            $("#modal-write #toolbar-html").trigger("click");
        }
        // PREPARE PARAMS
        if(!encodeAttachments()) {
            return false;
        }
        let params = {
            MailTo: $('#recipientTO').dropdown("get value"),
            MailCC: $('#recipientCC').dropdown("get value"),
            MailBCC: $('#recipientBCC').dropdown("get value"),
            MailSubject: $("#modal-write-subject input").val(),
            MailBodyPlain: $("#modal-write-message").text(),
            MailBodyHTML: $("#modal-write-message").html(),
            MailAttachments: attachments,
            st: $("#st").val()
        }
        // SAVE MESSAGE
        $("#modal-write .ui.dimmer.save-message").addClass("active");
        let req = $.ajax({
            method: "POST",
            url: mailAPI,
            dataType: "json",
            data: params
        });
        req.done(function(result, textStatus, jqXHR) {
            if(parseInt(result.success)) {
                console.log("EMAIL SAVED");
                toastr.success(w_emailsaved);
            } else {
                console.log("UNABLE TO SAVE EMAIL");
                console.log(result.errorMsg);
                toastr.error(w_emailsavedfailed);
            }
        });
        req.fail(function() {
        });
        req.always(function() {
            $("#modal-write .ui.dimmer.save-message").removeClass("active");
        });
    });
    $("#modal-write-send").click(function() {
        // CONVERT TO PLAIN VIEW FOR CONTENT EXTRACTION
        if(viewHTML) {
            $("#modal-write #toolbar-html").trigger("click");
        }
        // EMPTY CC AND BCC FIELDS IF HIDDEN
        if(!$(".extrarecipients").is(":visible")) {
            $('#recipientCC').dropdown("set value", "");
            $('#recipientBCC').dropdown("set value", "");
        }
        // VALIDATION
        if(validateMessage()) {
            $("#modal-write .ui.form").removeClass("error");
        } else {
            $("#modal-write .ui.form").addClass("error");
            return false;
        }
        // PREPARE PARAMS
        if(!encodeAttachments()) {
            return false;
        }
        let params = {
            to: $('#recipientTO').dropdown("get value"),
            cc: $('#recipientCC').dropdown("get value"),
            bcc: $('#recipientBCC').dropdown("get value"),
            msgSubject: $("#modal-write-subject input").val(),
            msgContent: $("#modal-write-message").html(),
            attachments,
            attachmentLinks,
            st: $("#st").val()
        };
        if(isBroadcast) {
            params["IsBroadcast"] = 1;
        }
        // SEND MESSAGE
        $("#modal-write .ui.dimmer.send-message").addClass("active");
        let req = $.ajax({
            method: "POST",
            url: sendMailAPI,
            dataType: "json",
            data: params
        });
        req.done(function(res, textStatus, jqXHR) {
            if(parseInt(res.code) == 1) {
                console.log("EMAIL SENT");
                toastr.success(w_emailsent);
                if(isBroadcast) {
                    launchBroadcasts(false);
                }
            } else {
                console.log("EMAIL DELIVERY FAILED");
                console.log(res.msg);
                switch(parseInt(res.code)) {
                    case 2:
                        toastr.error(w_composer_auth_expired, w_emailsentfailed);
                        break;
                    case 3:
                        toastr.error(w_composer_no_recipient, w_emailsentfailed);
                        break;
                    case 4:
                        toastr.error(w_composer_credit_exceeded, w_emailsentfailed);
                        break;
                    case 5:
                        toastr.error(w_composer_max_recipients_exceeded, w_emailsentfailed);
                        break;
                    case 6:
                        toastr.error(w_composer_max_free_recipients_exceeded, w_emailsentfailed);
                        break;
                    case 0:
                    default:
                        toastr.error(res.msg, w_emailsentfailed);
                        break;
                }
            }
        });
        req.fail(function(jqXHR, textStatus, errorThrown) {
            console.log("EMAIL DELIVERY FAILED");
            console.log(errorThrown);
            toastr.error(w_emailsentfailed);
        });
        req.always(function() {
            $("#modal-write .ui.dimmer.send-message").removeClass("active");
        });
    });
    // #endregion
}
function wireDropdownsWithLeadContacts() {
    var leadContactEmailRequest = $.ajax({
        method: "GET",
        url: leadcontactAPI,
        dataType: "json"
    });
    leadContactEmailRequest.done(function(res) {
        baseProcess(res, function() {
            var crmEmails = res.data;
            $.each(crmEmails, function(k,v) {
                var newOption = "<div class='item' data-value=" + v.ContactEmail + ">" + v.ContactEmail + "</div>";
                $('.recipient.ui.dropdown > .menu').append(newOption);
            });
        });
        $('.recipient.ui.dropdown').dropdown({
            allowAdditions: true,
            showOnFocus: false
        });
    });
    leadContactEmailRequest.fail(handleAPIError);
    leadContactEmailRequest.always(function() {
    });
}
let mailComposerInterval;
$(function() {
    mailComposerInterval = setInterval(function() {
        if(mainCustomer && mainCustomer.CustomerName) {
            MailStateSD = new MailState();
            wireComposer();
            wireDropdownsWithLeadContacts();
            templateLoad();
            clearInterval(mailComposerInterval);
        }
    }, 100);
});
// #endregion