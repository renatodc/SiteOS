// #region VARIABLES
// #region MAIL COUNTERS
var itemsChecked;
var itemsDeleted;
var itemsMoved;
var checkedBoxes;
var draggedRows;
// #endregion
// #region GLOBALS
var jqXHR;
var uuid;
var pfMailTarget = 0;
var preamble = "____________________________________________________________<br /><br />";
var mailIndex; // Used to splice array
var folderparam;
var mailFolderName;
let isInit = false;
let page = 0;
let mailCount;
let mailFactor;
// #endregion
// #region DRAGGING
var isDragging;
var c;
var c$;
var ctx;
var ogX;
var ogY;
var startRectX;
var startRectY;
var endRectX;
var endRectY;
var overText;
// #endregion
// #endregion
// #region DICTIONARY
let w_mail_status_delivered = "Delivered";
let w_mail_status_opened = "Opened";
let w_mail_status_clicked = "Clicked";
let w_mail_status_bounced = "Bounced";
let w_mail_status_failed = "Failed";
let w_mail_status_unsubscribed = "Unsubscribed";
let w_mail_status_complained = "Complained";

let w_mail_label_destroy = "Destroy";
let w_mail_label_notspam = "Not Spam";

let w_mail_initials_reply = "RE";
let w_mail_initials_forward = "FW";

let w_mail_loadtext_spam = "Cleaning spam";
let w_mail_loadtext_delete = "Deleting";

let w_mail_no_messages = "NO MESSAGES FOUND";
let w_mail_total = "Total";
let w_mail_loading = "Loading";

let w_mail_label_delete_checked = "Delete Checked";
let w_mail_label_mark_checked_spam = "Mark checked as spam";
let w_mail_label_mark_checked_new = "Mark checked as new";
let w_mail_label_move_checked = "Move checked to";

let w_mail_label_delete_all = "Delete All";
let w_mail_label_mark_all_spam = "Mark all as spam";
let w_mail_label_mark_all_new = "Mark all as new";
let w_mail_label_move_all = "Move all to";
// #endregion
// #region HELPER METHODS
function moveToTrashAJAX(msgUUID) {
    var moveToTrashRequest = $.ajax({
        method: "PATCH",
        url: mailAPI + "/" + msgUUID,
        dataType: "json",
        data: { moveToPlain: 1, plainFolder: "Trash" }
    });
    moveToTrashRequest.done(function(result, textStatus, jqXHR) {
        if(result.success == 1) {
            itemsDeleted++;
            if(itemsChecked == itemsDeleted) {
                $(".no-mail").hide();
                paintMailCount();
                toggleButtons(false);
                updateNewCount();
            }
        } else {
            alert(result.msg);
        }
    });
    moveToTrashRequest.fail(handleAPIError);
    moveToTrashRequest.always(function() {
    });
}
function destroyMailAJAX(msgUUID) {
    var destroyRequest = $.ajax({
        method: "DELETE",
        url: mailAPI + "/" + msgUUID,
        dataType: "json"
    });
    destroyRequest.done(function(result, textStatus, jqXHR) {
        if(result.success == 1) {
            itemsDeleted++;
            if(itemsChecked == itemsDeleted) {
                $(".no-mail").hide();
                paintMailCount();
                toggleButtons(false);
                updateNewCount();
            }
        } else {
            alert(result.msg);
        }
    });
    destroyRequest.fail(handleAPIError);
    destroyRequest.always(function() {
    });
}
function moveToSpamAJAX(msgUUID) {
    var moveToSpamRequest = $.ajax({
        method: "PATCH",
        url: mailAPI + "/" + msgUUID,
        dataType: "json",
        data: { moveToSpam: 1 }
    });
    moveToSpamRequest.done(function(result, textStatus, jqXHR) {
        if(result.success == 1) {
            itemsDeleted++;
            if(itemsChecked == itemsDeleted) {
                $(".no-mail").hide();
                paintMailCount();
                toggleButtons(false);
                updateNewCount();
            }
        } else {
            alert(result.msg);
        }
    });
    moveToSpamRequest.fail(handleAPIError);
    moveToSpamRequest.always(function() {
    });
}
function setAsNewAJAX(msgUUID) {
    $.each(pfMail, function(k,v) {
        if(v.UUID == msgUUID) {
            v.IsRead = 0;
        }
    });
    var setAsNewRequest = $.ajax({
        method: "PUT",
        url: mailAPI + "/" + msgUUID,
        dataType: "json"
        // data: { IsRead: 0 }
    });
    setAsNewRequest.done(function(result, textStatus, jqXHR) {
        if(result.success == 1) {
            itemsDeleted++;
            if(itemsChecked == itemsDeleted) {
                $(".no-mail").hide();
                updateNewCount();
            }
        } else {
            alert(result.msg);
        }
    });
    setAsNewRequest.fail(handleAPIError);
    setAsNewRequest.always(function() {
    });
}
function moveToInboxAJAX(msgUUID) {
    var moveToInboxRequest = $.ajax({
        method: "PATCH",
        url: mailAPI + "/" + msgUUID,
        dataType: "json",
        data: { moveToPlain: 1, plainFolder: "Inbox" }
    });
    moveToInboxRequest.done(function(result, textStatus, jqXHR) {
        if(result.success == 1) {
            itemsDeleted++;
            if(itemsChecked == itemsDeleted) {
                $(".no-mail").hide();
                paintMailCount();
                toggleButtons(false);
                updateNewCount();
            }
        } else {
            alert(result.msg);
        }
    });
    moveToInboxRequest.fail(handleAPIError);
    moveToInboxRequest.always(function() {
    });
}

function orderDelete(v) {
    let rowObj = $(v).parents("tr");
    let msgUUID = rowObj.attr("data-uuid");
    removeMail(msgUUID,rowObj);
    triggerDelete(msgUUID);
}
function orderMoveTo(v, text, value) {
    let msgUUID = $(v).parents("tr").attr("data-uuid");
    removeMail(msgUUID, $(v).parents("tr"));
    if(text.text() == "Inbox") {
        var moveToInboxRequest = $.ajax({
            method: "PATCH",
            url: mailAPI + "/" + msgUUID,
            dataType: "json",
            data: { moveToPlain: 1, plainFolder: "Inbox" }
        });
        moveToInboxRequest.done(function(result, textStatus, jqXHR) {
            if(result.success == 1) {
                itemsMoved++;
                if(itemsChecked == itemsMoved) {
                    $(".ui.main.page.dimmer").removeClass("active");
                }
            } else {
                alert(result.msg);
            }
        });
        moveToInboxRequest.fail(handleAPIError);
        moveToInboxRequest.always(function() {
        });
    } else {
        var moveToFolderRequest = $.ajax({
            method: "PATCH",
            url: mailAPI + "/" + msgUUID,
            dataType: "json",
            data: { moveToFolder: 1, folderDestUUID: value }
        });
        moveToFolderRequest.done(function(result, textStatus, jqXHR) {
            if(result.success == 1) {
                itemsMoved++;
                if(itemsChecked == itemsMoved) {
                    $(".ui.main.page.dimmer").removeClass("active");
                }
            } else {
                alert(result.msg);
            }
        });
        moveToFolderRequest.fail(handleAPIError);
        moveToFolderRequest.always(function() {
        });
    }
    if(pfMailTarget.UUID == msgUUID) {
        $(".ui-mail-content > .header").hide();
        $(".ui-mail-content > .message").hide();
        if(pfMail.length) {
            $(".ui-mail-content > .no-mail-selected").show();
        }
    }
}
function orderSpam(v) {
    let rowObj = $(v).parents("tr");
    let msgUUID = rowObj.attr("data-uuid");
    removeMail(msgUUID, rowObj);
    triggerSpam(msgUUID);
}
function orderSetAsNew(v) {
    let msgUUID = $(v).parents("tr").attr("data-uuid");
    $(v).parents("tr").find("a.dragMsg").addClass("new");
    setAsNewAJAX(msgUUID);
}

function triggerSpam(msgUUID) {
    if($("#title").text() == "Spam") {
        moveToInboxAJAX(msgUUID);
    } else {
        moveToSpamAJAX(msgUUID);
    }
    if(pfMailTarget.UUID == msgUUID) {
        $(".ui-mail-content > .header").hide();
        $(".ui-mail-content > .message").hide();
        if(pfMail.length) {
            $(".ui-mail-content > .no-mail-selected").show();
        }
    }
}
function triggerDelete(msgUUID) {
    if($("#title").text() == "Trash") {
        destroyMailAJAX(msgUUID);
    } else {
        moveToTrashAJAX(msgUUID);
    }
    if(pfMailTarget.UUID == msgUUID) {
        $(".ui-mail-content > .header").hide();
        $(".ui-mail-content > .message").hide();
        if(pfMail.length) {
            $(".ui-mail-content > .no-mail-selected").show();
        }
    }
}
function removeMail(mailUUID, rowObj) {
    // REMOVE FROM UI
    if(rowObj && typeof rowObj.remove === 'function') {
        rowObj.remove();
    } else {
        $(".mail-grid tbody > tr[data-uuid='" + mailUUID + "']").remove();
    }
    $(".mail-grid").trigger("update");
    // REMOVE FROM MEMORY ARRAY
    mailIndex = 0;
    $.each(pfMail, function(mailPointer,mailObj) { 
        if(mailObj.UUID == mailUUID) {
            mailIndex = mailPointer; 
        } 
    });
    pfMail.splice(mailIndex,1);
}
// #endregion
// #region MAIL FOLDERS
function wireFolderModal() {
    $("#modal-folder-save").off("click");
    $("#modal-folder-save").click(function() {
        let folderName = $("#folder-name input").val();
        let folderSaveRequest = $.ajax({
            method: "PUT",
            url: mailFolderAPI + "/" + uuid,
            dataType: "json",
            data: { folderName, st: $("#st").val() }
        });
        folderSaveRequest.done(function(res) {
            if(parseInt(res.success)) {
                location.reload();
            } else {
                $("#modal-add-folder").modal("show");
                $("#modal-add-folder .ui.form").addClass("warning");
            }
        });
        folderSaveRequest.fail(handleAPIError);
        folderSaveRequest.always(function() {
        });
    });
    $("#modal-folder-delete").off("click");
    $("#modal-folder-delete").click(function() {
        let folderDeleteRequest = $.ajax({
            method: "DELETE",
            url: mailFolderAPI + "/" + uuid,
            dataType: "json",
            data: { st: $("#st").val() }
        });
        folderDeleteRequest.done(function(res) {
            if(parseInt(res.success)) {
                location.replace("/mail");
            }
        });
        folderDeleteRequest.fail(handleAPIError);
        folderDeleteRequest.always(function() {
        });
    });
}
function wireAddFolderModal() {
    $("#modal-add-folder .ui.form .ui.info.message").hide();
    // FOLDER MENU
    $("#mail-add-folder").off("click");
    $("#mail-add-folder").click(function() {
        $("#modal-add-folder .ui.form").removeClass("info");
        $("#modal-add-folder .ui.form").removeClass("warning");
        $("#modal-add-folder .ui.form").removeClass("error");
        $("#modal-add-folder").modal("show");
        $("#modal-add-folder").off("keyup");
        $("#modal-add-folder").keyup(function(event) {
            if(event.which == 13) {
                $("#add-folder-save").trigger("click");
            }
        });
    });
    $("#add-folder-save").off("click");
    $("#add-folder-save").click(function() {
        $("#modal-add-folder .ui.form").removeClass("info");
        $("#modal-add-folder .ui.form").removeClass("warning");
        $("#modal-add-folder .ui.form").removeClass("error");
        let folderName = $("#add-folder-name input").val();
        if(folderName == "") {
            $("#modal-add-folder .ui.form").addClass("error");
            $("#modal-add-folder .add-folder-name-field").addClass("error");
            return false;
        } else {
            $("#modal-add-folder .ui.form").removeClass("error");
            $("#modal-add-folder .add-folder-name-field").removeClass("error");
        }

        $(".ui.main.page.dimmer").addClass("active");
        let folderSaveRequest = $.ajax({
            method: "POST",
            url: mailFolderAPI,
            dataType: "json",
            data: { folderName, st: $("#st").val() }
        });
        folderSaveRequest.done(function(res) {
            if(parseInt(res.success)) {
                window.location.replace("/mail?folder=" + res.newUUID);
            } else {
                $("#modal-add-folder").modal("show");
                $("#modal-add-folder .ui.form").addClass("warning");
            }
        });
        folderSaveRequest.fail(handleAPIError);
        folderSaveRequest.always(function() {
            $(".ui.main.page.dimmer").removeClass("active");
        });
    });
}
function paintMailFolders() {
    var newListRow = "";
    mailFolderName = "Inbox";
    $("#nav-mail-list").html("");
    $.each(pfMailFolder, function(k,v) {
        if(v.UUID == folderparam) {
            mailFolderName = v.FolderName;
        }
        if(v.FolderName != "Inbox") {
            newListRow = "<li class='sub-link dropzone' data-uuid='" + v.UUID + "'>";
            switch(v.FolderName) {
                case "Sent":
                    newListRow += "<a class='folder-sent' href='/mail?folder=" + v.UUID + "'>";
                    newListRow += "<i class='icon send'></i>";
                    newListRow += "<span>" + v.FolderName + "</span>";
                    break;
                case "Spam":
                    newListRow += "<a class='folder-spam' href='/mail?folder=" + v.UUID + "'>";
                    newListRow += "<i class='icon ban'></i>";
                    newListRow += "<span>" + v.FolderName + "</span>";
                    break;
                case "Trash":
                    newListRow += "<a class='folder-trash' href='/mail?folder=" + v.UUID + "'>";
                    newListRow += "<i class='icon trash'></i>";
                    newListRow += "<span>" + v.FolderName + "</span>";
                    break;
                case "Drafts":
                    newListRow += "<a class='folder-drafts' href='/mail?folder=" + v.UUID + "'>";
                    newListRow += "<i class='icon edit'></i>";
                    newListRow += "<span>" + v.FolderName + "</span>";
                    break;
                default:
                    newListRow += "<a class='' href='/mail?folder=" + v.UUID + "'>";
                    newListRow += "<i class='icon folder'></i>";
                    newListRow += "<span>" + escapeHtml(v.FolderName) + "</span>";
                    newListRow += "<span class='color-main'>";
                    if(v.NewCount && v.NewCount > 0) {
                        newListRow += "(" + v.NewCount + ")";
                    }
                    newListRow += "</span>";
                    break;
            }
            newListRow += "</a></li>";
            $("#nav-mail-list").append(newListRow);
        } else {
            if(v.NewCount && v.NewCount > 0) {
                $("#counter-inbox-new").text("(" + v.NewCount + ")");
            }
        }
    });
    newListRow = "<li class='sub-link'><a href='#' id='mail-add-folder'><i class='icon add'></i><span>Add Folder</span></a></li>";
    $("#nav-mail-list").append(newListRow);
    $("#nav-mail-list").slideDown(200);
    wireMailFolder();
}
function wireMailFolder() {
    $("#title").text(mailFolderName);
    $("#logo").off("click");
    $("#logo").click(function() {
        if(folderparam) {
            let isCustomFolder = false;
            let specialFolders = ["Sent","Spam","Trash","Drafts"];
            $.each(pfMailFolder, function(k,v) {
                if(v.UUID == folderparam && !specialFolders.includes(v.FolderName)) {
                    uuid = v.UUID;
                    $("#folder-name input").val(v.FolderName);
                    isCustomFolder = true;
                }
            });
            if(isCustomFolder) {
                $("#modal-folder").modal("show");
            }
        }
    });
    if(mailFolderName == "Sent" || mailFolderName == "Drafts") {
        $("#mail-spam").remove();
    }
}
function updateNewCount() {
    // CALCULATE NEW COUNT OF CURRENT FOLDER BASED ON UI/MEMORY
    var newUICount = 0;
    $.each(pfMail, function(k,v) {
        if(v.IsRead == 0) newUICount++;
    });
    // UPDATE MEMORY pfMailFolder
    $.each(pfMailFolder, function(k,v) {
        if(v.FolderName == mailFolderName) {
            v.NewCount = newUICount;
        }
    });

    // UPDATE COUNTER UI
    $.each(pfMailFolder, function(k,v) {
        switch(v.FolderName) {
            case "Inbox":
                if(v.NewCount && v.NewCount > 0) {
                    $("#counter-inbox-new").text("(" + v.NewCount + ")");
                } else {
                    $("#counter-inbox-new").text("");
                }
                break;
            case "Sent":
            case "Spam":
            case "Trash":
            case "Drafts":
                break;
            default:
                if(v.NewCount && v.NewCount > 0) {
                    $("#nav-mail-list li[data-uuid='" + v.UUID + "'] span.color-main").text("(" + v.NewCount + ")");
                } else {
                    $("#nav-mail-list li[data-uuid='" + v.UUID + "'] span.color-main").text("");
                }
                break;
        }
    });
}
// #endregion
// #region MAIL COMPOSER
function clearWriteModal() {
    $("#modal-write .ui.form").removeClass("error");
    $("#modal-write-from").removeClass("error");
    $("#modal-write-to").removeClass("error");
    $("#modal-write-cc").removeClass("error");
    $("#modal-write-bcc").removeClass("error");
    $("#modal-write-subject").removeClass("error");
    $("#modal-write-message").css("color", "");
    $("#modal-write-message").css("border-color", "");
    $("#modal-write-message").css("background-color", "");
}
function launchComposer(withPreamble, emptyMsg, emptyAttachments) {
    clearWriteModal();
    $('.recipient.ui.dropdown').dropdown("clear");
    $("#toolbar-tmplName input").val("");
    // EMAIL CONTENT INSERTION
    if(emptyMsg) {
        $("#modal-write-subject input").val("");
        if(mainCustomer.EmailSignature) {
            $("#modal-write-message").html("<br /><br />" + mainCustomer.EmailSignature);
        } else {
            $("#modal-write-message").html("");
        }
    } else {
        setComposerMessageContent(withPreamble);
    }
    // #region ATTACHMENTS
    attachCount = 0;
    $("#modal-write-attachments").hide();
    $("#modal-write-attachments .modal-write-attach").remove();
    if(!emptyAttachments) {
        setWriteAttachments();
    }
    // #endregion
    $("#modal-write").modal("show");
    $("body").css("cursor","auto");
    if(viewHTML) {
        viewHTML = false;
        $(".modal-write-message").css("padding", "");
        $(".toolbar").show();
    }
    $(".extrarecipients").hide();
    $("#modal-write-cc").hide();
    $("#modal-write-bcc").hide();
}
function setSubject(prefix) {
    if(prefix && !pfMailTarget.MailSubject.toUpperCase().startsWith(prefix)) {
        $("#modal-write-subject input").val(prefix + " " + pfMailTarget.MailSubject);
    } else {
        $("#modal-write-subject input").val(pfMailTarget.MailSubject);
    }
}
function setComposerMessageContent(withPreamble) {
    let msgPrefix;
    if(withPreamble) {
        if(mainCustomer.EmailSignature) {
            msgPrefix = "<br /><br />" + mainCustomer.EmailSignature + preamble;
        } else {
            msgPrefix = "<br /><br />" + preamble;
        }
    } else {
        msgPrefix = "";
    }
    if(pfMailTarget.MailBodyFiltered) {
        $("#modal-write-message").html(msgPrefix + pfMailTarget.MailBodyFiltered);
    } else if(pfMailTarget.MailBodyPlain) {
        $("#modal-write-message").text(msgPrefix + pfMailTarget.MailBodyPlain);
    }
}
function setWriteAttachments() {
    if(pfMailTarget.MailAttachments != null || pfMailTarget.MailAttachments == "") {
        if(pfMailTarget.MailAttachments.length) {
            $("#modal-write-attachments").show();
            $.each(pfMailTarget.MailAttachments, function(k,v) {
                var attachPiece = "<div class='modal-write-attach'>";
                attachPiece += "<div class='ui grid'>";
                attachPiece += "<div class='ten wide column'>";
                attachPiece += "<i class='icon attach'></i>";
                attachPiece += "<a target='_blank' class='name' href='" + v.url + "'>" + v.name + "</a>";
                attachPiece += "<span data-size='" + v.size + "'class='size'>" + filesize(v.size) + "</span>";
                attachPiece += "<a href='#' class='ibtn cancel'><i class='icon cancel'></i></a>";
                attachPiece += "</div>";
                attachPiece += "<div class='six wide column'>";
                attachPiece += "<i class='icon checkmark'></i>";
                attachPiece += "</div>";
                attachPiece += "</div>";
                attachPiece += "</div>";
                $("#modal-write-attachments").append(attachPiece);
                $("#modal-write-attachments .modal-write-attach").eq(attachCount).find(".cancel").click(function() {
                    if($(this).parents(".modal-write-attach").find("i.checkmark").is(":hidden")) {
                    } else {
                        attachCount--;
                    }
                    $(this).parents(".modal-write-attach").remove();
                    if(attachCount == 0) {
                        $("#modal-write-attachments").hide();
                    }
                });
                var iconTarget = $("#modal-write-attachments .modal-write-attach").eq(attachCount).find("i.attach");
                switch(v["content-type"]) {
                    case "image/jpg":
                    case "image/jpeg":
                    case "image/png":
                    case "image/gif":
                    case "image/bmp":
                        iconTarget.replaceWith("<img src='" + v.url + "' />");
                        break;
                    case "application/doc":
                    case "application/docx":
                        iconTarget.replaceWith("<img src='img/icons/word.png' />");
                        break;
                    case "application/pdf":
                    case "application/pdfx":
                        iconTarget.replaceWith("<img src='img/icons/pdf.png' />");
                        break;
                    case "application/xls":
                        iconTarget.replaceWith("<img src='img/icons/excel.png' />");
                        break;
                    case "application/html":
                    case "application/css":
                    case "application/js":
                    case "application/php":
                        iconTarget.replaceWith("<i class='icon code'></i>");
                        break;
                    case "application/sql":
                    case "application/csv":
                        iconTarget.replaceWith("<i class='icon database'></i>");
                        break;
                    case "application/zip":
                    case "application/rar":
                        iconTarget.replaceWith("<i class='icon archive'></i>");
                        break;
                    default:
                        break;
                }
                attachCount++;
            });
        }
    }
}
// #endregion
// #region MAIL RENDERING
function paintMails() {
    mailFolderName = "Inbox";
    $.each(pfMailFolder, function(k,v) {
        if(v.UUID == folderparam) {
            mailFolderName = v.FolderName;
        }
    });
    $(".mail-grid").hide();
    $(".mail-grid tbody").html("");
    $.each(pfMail, function(k,v) {
        // MAIL ROW PAINT
        var newRow = "<tr id='pfMailRow" + v.UUID + "' data-uuid='" + v.UUID + "'>";
        newRow += "<td class='col-check'>" + "<div class='ui fitted checkbox'><input type='checkbox' class='hidden'/></div>" + "</td>";

        newRow += "<td class='col-link'>";
        newRow += "<a class='dragMsg " + (v.IsRead == "0" ? "new" : "") + "' href='#' data-uuid='" + v.UUID + "'>";
        newRow += "<span class='mail-from'>";
        if(mailFolderName == "Sent") {
            newRow += (v.MailTo ? escapeHtml(v.MailTo) : '');
        } else {
            newRow += (v.MailFrom ? escapeHtml(v.MailFrom) : '');
        }
        newRow += "</span>";
        newRow += "<p class='mail-subject'>";
        newRow += (v.MailSubject ? escapeHtml(v.MailSubject) : '');
        newRow += "</p>";
        newRow += "<p class='mail-msg'>";
        newRow += (v.MailBodyPlain ? escapeHtml(v.MailBodyPlain.replace(/<\/?[^>]+(>|$)/g, " ").replace(/_/g,"")) : '');
        newRow += "</p>";
        newRow += "</a>";
        newRow += "</td>";

        newRow += "<td class='col-data'><p>" + (isValidDate(v.DateSent) ? getshortdt(v.DateSent) : '') + "</p></td>";
        newRow += "</tr>";
        $(".mail-grid tbody").append(newRow);
        // ROW CLICK - CHECK BEHAVIOR 1
        $("#pfMailRow" + v.UUID).click(function(e) {
            var checkContainer = $("#pfMailRow" + v.UUID + " .col-check .checkbox");
            var linkContainer = $("#pfMailRow" + v.UUID + " .col-link");
            if(checkContainer.has(e.target).length === 0
                && linkContainer.has(e.target).length === 0) {
                $("#pfMailRow" + v.UUID + " .col-check .checkbox").checkbox("toggle");
            }
            if(e.shiftKey) {
                var firstCheck = $("td.col-check input[type='checkbox']:checked:first");
                var firstIndex = $(firstCheck).parents("tr").index();
                var lastCheck = $("td.col-check input[type='checkbox']:checked:last");
                var lastIndex = $(lastCheck).parents("tr").index();
                var checkIndex = $("#pfMailRow" + v.UUID).index();
                if(firstIndex == checkIndex) {
                    checkIndex = lastIndex;
                }
                $(".mail-grid tbody tr").slice(firstIndex,checkIndex+1).find(".col-check > div:visible").checkbox("check");
                document.getSelection().removeAllRanges();
            }
            if(pfMail.length == $("td.col-check input[type='checkbox']:checked").length) {
                $(".col-head-check .ui.checkbox").checkbox("set checked");
            }
        });
        $("#pfMailRow" + v.UUID + " .col-link a").on("touchend click", function(e) {
            $(this).removeClass("new");
            setMessageContent(v.UUID);
            $("body").css("cursor","auto");
        });
        // ROW DRAG SELECTION
        $("#pfMailRow" + v.UUID).mouseout(function() {
            var isChecked = $("#pfMailRow" + v.UUID + " .col-check .checkbox").checkbox("is checked");
            if(isDragging && !isChecked) {
                $("#pfMailRow" + v.UUID).trigger("click");
            }
        });
        $("#pfMailRow" + v.UUID).mouseover(function() {
            var isChecked = $("#pfMailRow" + v.UUID + " .col-check .checkbox").checkbox("is checked");
            if(isDragging && !isChecked) {
                $("#pfMailRow" + v.UUID).trigger("click");
            }
        });
    });

    if($(".mail-grid tbody > tr").length) {
        $(".mail-grid").css("display","table");
        toggleButtons(true);  
        // ENABLE DRAGGING
        wireDragSelection();
        if(!$(".ui-mail-content > .header").is(":visible")) {
            $(".ui-mail-content > .no-mail-selected").show();
        }
    } 
}
function showZeroResults() {
    $(".col-head-check .ui.checkbox").checkbox("set unchecked");
    $(".no-mail").html(`<p>${w_mail_no_messages}</p>`);
    $(".mail-grid").hide();
    $(".ui-mail-content > .no-mail-selected").hide();
    $(".no-mail").show();
    $("#ui-counter-total").html("");
}
function paintMailCount() {
    switch(pfMail.length) {
        case 0:
            showZeroResults();
            break;
        case 1:
            $("#ui-counter-total").html(`1<span> ${w_mail_total}</span>`);
            queryPass();
            break;
        default:
            $("#ui-counter-total").html(`${pfMail.length}<span> ${w_mail_total}</span>`);
            queryPass();
            break;
    }
    checkedBoxes = $("td.col-check input[type='checkbox']:checked");
    if(checkedBoxes.length == 0) {
        $(".col-head-check .ui.checkbox").checkbox("set unchecked");
        $("#mail-delete span").text(`${w_mail_label_delete_all}`);
        $("#mail-spam").attr("data-tooltip", `${w_mail_label_mark_all_spam}`);
        $("#mail-new").attr("data-tooltip", `${w_mail_label_mark_all_new}`);
        $("#mail-move .default.text").text(`${w_mail_label_move_all}`);
        $("#ui-counter-selected").hide();
        $("#ui-counters").attr("class", "one");
    }
}
function queryPass() {
    var mailsFiltered = 0;
    $(".mail-grid tbody tr").each(function(i) {
        if(query) {
            if($(this).text().toLowerCase().indexOf(query) > -1) {
                $(this).css("display","table-row");
                mailsFiltered++;
            } else {
                $(this).hide();
            }
        } else {
            $(this).css("display","table-row");
            mailsFiltered++;
        }
    });
    if(mailsFiltered) {
        $("#ui-counter-total").html((mailsFiltered == 1) ? `1<span> ${w_mail_total}</span>` : `${mailsFiltered}<span> ${w_mail_total}</span>`);
        $(".no-mail").hide();
        $(".mail-grid").css("display","table");
    } else {
        showZeroResults();
    }
}
function setMessageContent(uuid) {
    $.each(pfMail, function(k,v) {
        if(v.UUID == uuid) {
            v.IsRead = 1;
        }
    });
    updateNewCount();
    $(".ui-mail-content > .header").hide();
    $(".ui-mail-content > .message").hide();
    $(".ui-mail-content > .no-mail-selected").hide();
    $(".mail-loader").show();
    var mailRequest = $.ajax({
        method: "PATCH",
        url: mailAPI + "/" + uuid,
        dataType: "json",
        data: { getMessage: 1 }
    });
    mailRequest.done(function(result, textStatus, jqXHR) {
        if(parseInt(result.success)) {
            pfMailTarget = result.mail;
            if(pfMailTarget.MailAttachments) {
                try {
                    if(pfMailTarget.MailAttachments.length > 3) {
                        pfMailTarget.MailAttachments = JSON.parse(pfMailTarget.MailAttachments);
                    } else {
                        pfMailTarget.MailAttachments = "";
                    }
                } catch(err) {
                    pfMailTarget.MailAttachments = "";
                }
            }

            switch(pfMailTarget.MailFolder) {
                case "Sent":
                    $("#mc-reply").hide();
                    $("#mc-reply-all").hide();
                    $("#mc-forward").show();
                    $("#mc-stats").hide();
                    $("#mc-edit").hide();
                    $(".ui-mail-content > .header .mc-from").text(pfMailTarget.MailTo);
                    $(".ui-mail-content > .header .mc-from").click(function() {
                        launchComposer(true, false, false);
                        $('#recipientTO').dropdown("set selected", pfMailTarget.MailTo);
                    });
                    break;
                case "Drafts":
                    $("#mc-reply").hide();
                    $("#mc-reply-all").hide();
                    $("#mc-forward").hide();
                    $("#mc-stats").hide();
                    $("#mc-edit").css("display","inline-block");
                    $(".ui-mail-content > .header .mc-from").text(pfMailTarget.MailTo);
                    $(".ui-mail-content > .header .mc-from").click(function() {
                        launchComposer(false, false, false);
                        $('#recipientTO').dropdown("set selected", pfMailTarget.MailTo);
                    });
                    break;
                default:
                    $("#mc-reply").show();
                    $("#mc-reply-all").show();
                    $("#mc-forward").show();
                    $("#mc-stats").hide();
                    $("#mc-edit").hide();
                    $(".ui-mail-content > .header .mc-from").text(pfMailTarget.MailFrom);
                    $(".ui-mail-content > .header .mc-from").click(function() {
                        launchComposer(true, false, true);
                        $('#recipientTO').dropdown("set selected", pfMailTarget.MailFrom);
                    });
                    break;
            }
            $(".ui-mail-content > .header .mc-subject").text(pfMailTarget.MailSubject);
            $(".ui-mail-content > .header .mc-timestamp").text(getfullddt(pfMailTarget.DateSent));
            // EMAIL CONTENT INSERTION
            if(pfMailTarget.MailBodyFiltered) {
                $(".ui-mail-content > .message .content").html(pfMailTarget.MailBodyFiltered);
            } else if(pfMailTarget.MailBodyPlain) {
                $(".ui-mail-content > .message .content").text(pfMailTarget.MailBodyPlain);
            }
            //#region Status Tags
            $("#status-tags").html("");
            if(pfMailTarget.MailFolder == "Sent") {
                if(parseInt(pfMailTarget.IsDelivered)) {
                    $("#status-tags").append(`<a href='#' class='ui small label'><i class='icon check'></i><span>${w_mail_status_delivered}</span></a>`);
                }
                if(parseInt(pfMailTarget.IsOpened)) {
                    $("#status-tags").append(`<a href='#' class='ui green small label'><i class='icon check'></i><span>${w_mail_status_opened}</span></a>`);
                }
                if(parseInt(pfMailTarget.IsClicked)) {
                    $("#status-tags").append(`<a href='#' class='ui green small label'>${w_mail_status_clicked}</a>`);
                }
                if(parseInt(pfMailTarget.IsBounced)) {
                    $("#status-tags").append(`<a href='#' class='ui orange small label'><i class='icon cancel'></i><span>${w_mail_status_bounced}</span></a>`);
                }
                if(parseInt(pfMailTarget.IsFailed)) {
                    $("#status-tags").append(`<a href='#' class='ui red small label'><i class='icon cancel'></i><span>${w_mail_status_failed}</span></a>`);
                }
                if(parseInt(pfMailTarget.IsUnsubscribed)) {
                    $("#status-tags").append(`<a href='#' class='ui yellow small label'>${w_mail_status_unsubscribed}</a>`);
                }
                if(parseInt(pfMailTarget.IsComplained)) {
                    $("#status-tags").append(`<a href='#' class='ui yellow small label'>${w_mail_status_complained}</a>`);
                }
                
                if($("#status-tags").text().length) {
                    $("#status-tags").show();
                    $("#mc-stats").css("display","inline-block");
                } else {
                    $("#status-tags").hide();
                }
            }
            //#endregion
            $(".read-attachments").html("");
            $.each(pfMailTarget.MailAttachments, function(k,v) {
                var attachPiece = "<div class='modal-write-attach'>";
                switch(v["content-type"]) {
                    case "image/jpg":
                    case "image/jpeg":
                    case "image/png":
                    case "image/gif":
                    case "image/bmp":
                        attachPiece += "<img src='" + v.url + "' />";
                        break;
                    case "application/doc":
                    case "application/docx":
                        attachPiece += "<img src='img/icons/word.png' />";
                        break;
                    case "application/pdf":
                    case "application/pdfx":
                        attachPiece += "<img src='img/icons/pdf.png' />";
                        break;
                    case "application/xls":
                        attachPiece += "<img src='img/icons/excel.png' />";
                        break;
                    case "application/html":
                    case "application/css":
                    case "application/js":
                    case "application/php":
                        attachPiece += "<i class='icon code'></i>";
                        break;
                    case "application/sql":
                    case "application/csv":
                        attachPiece += "<i class='icon database'></i>";
                        break;
                    case "application/zip":
                    case "application/rar":
                        attachPiece += "<i class='icon archive'></i>";
                        break;
                    default:
                        attachPiece += "<i class='icon attach'></i>";
                        break;
                }
                attachPiece += "<a target='_blank' class='name' href='" + v.url + "'>" + v.name + "</a>";
                attachPiece += "<span class='size'>" + filesize(v.size) + "</span>";
                attachPiece += "</div>";
                $(".read-attachments").append(attachPiece);
            });
            $(".ui-mail-content > .header").show();
            $(".ui-mail-content > .message").show();
        } else {
            alert(result.msg);
        }
    });
    mailRequest.fail(handleAPIError);
    mailRequest.always(function() {
        $(".mail-loader").hide();
    });
}
function toggleButtons(display) {
    if(display) {
        $("#mail-spam").css("display","inline-block");
        $("#mail-delete").css("display","inline-block");
        $("#mail-move").css("display","inline-block");
        $("#mail-new").css("display","inline-block");
    } else {
        if(!$(".mail-grid tbody > tr").length) {
            $("#mail-move").hide();
            $("#mail-delete").hide();
            $("#mail-spam").hide();
            $("#mail-new").hide();
        }
        checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        if(checkedBoxes.length == 0) {
            $(".col-head-check .ui.checkbox").checkbox("set unchecked");
            $("#mail-delete span").text(`${w_mail_label_delete_all}`);
            $("#mail-spam").attr("data-tooltip", `${w_mail_label_mark_all_spam}`);
            $("#mail-new").attr("data-tooltip", `${w_mail_label_mark_all_new}`);
            $("#mail-move .default.text").text(`${w_mail_label_move_all}`);
            $("#ui-counter-selected").hide();
            $("#ui-counters").attr("class", "one");
        }
    }
}
// #endregion
// #region MAIN METHODS
function wireActions() {
    wireAddFolderModal();
    wireFolderModal();
    wireActionMenu();
    wireViewer();
    wireControls();

    translateMail();
    // SORT AFTER TRANSLATE SET
    $(".mail-grid").tablesorter({
        headers: {
            0: { sorter: false }
        }
    });
}
function wireActionMenu() {
    $("#ui-search input").keyup(function(e) {
        query = $("#ui-search input").val().toLowerCase();
        paintMailCount();
    });
    $("#mail-send").click(function() {
        launchComposer(false, true, true);
    });
    $("#mail-sync").mousedown(function() {
        $(".mail-grid tbody").html("");
        $(".no-mail").html(`<div class='ui active inverted dimmer'><div class='ui text loader'>${w_mail_loading}</div></div>`);
        $(".no-mail").show();
        page = 0;
        launchMail();

        $("#ui-counter-selected").hide();
        $("#ui-counters").attr("class", "one");
    });
    $("#mail-new").mousedown(function() {
        checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        itemsChecked = checkedBoxes.length;
        itemsDeleted = 0;
        if(itemsChecked > 0 || $(".mail-grid tbody > tr").length) { // CHECKED OR ALL
            if(itemsChecked == 0) { // ALL
                checkedBoxes = $("td.col-check input[type='checkbox']");
                itemsChecked = checkedBoxes.length;
            }
            $(".no-mail").html("<div class='ui active inverted dimmer'><div class='ui loader'></div></div>");
            $(".no-mail").show();
            $.each(checkedBoxes, function(k,v) {
                if(k && (k % 20 == 0)) {
                    setTimeout(function() {
                        orderSetAsNew(v);
                    }, 1000);
                } else {
                    orderSetAsNew(v);
                }
            });
        } else {
            return false;
        }
    });
    wireFolderDropDown();
    $("#mail-spam").mousedown(function() {
        checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        itemsChecked = checkedBoxes.length;
        itemsDeleted = 0;
        if(itemsChecked > 0 || $(".mail-grid tbody > tr").length) { // CHECKED OR ALL
            if(itemsChecked == 0) { // ALL
                checkedBoxes = $("td.col-check input[type='checkbox']");
                itemsChecked = checkedBoxes.length;
            }
            $(".no-mail").html(`<div class='ui active dimmer spamDimmer'><div class='ui text loader'>${w_mail_loadtext_spam}</div></div>`);
            $(".no-mail").show();
            $.each(checkedBoxes, function(k,v) {
                if(k && (k % 20 == 0)) {
                    setTimeout(function() {
                        orderSpam(v);
                    }, 1000);
                } else {
                    orderSpam(v);
                }
            });
        } else {
            return false;
        }
    });
    $("#mail-delete").mousedown(function() {
        checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        itemsChecked = checkedBoxes.length;
        itemsDeleted = 0;
        if(itemsChecked > 0 || $(".mail-grid tbody > tr").length) { // CHECKED OR ALL
            if(itemsChecked == 0) { // ALL
                checkedBoxes = $("td.col-check input[type='checkbox']");
                itemsChecked = checkedBoxes.length;
            }
            $(".no-mail").html(`<div class='ui active dimmer deleteDimmer'><div class='ui text loader'>${w_mail_loadtext_delete}</div></div>`);
            $(".no-mail").show();
            $.each(checkedBoxes, function(k,v) {
                if(k && (k % 20 == 0)) {
                    setTimeout(function() {
                        orderDelete(v);
                    }, 1000);
                } else {
                    orderDelete(v);
                }
            });
        } else {
            return false;
        }
    });
}
function wireFolderDropDown() {
    $("#mail-move .menu").html("");
    $("#mc-move .menu").html("");
    $.each(pfMailFolder, function(k,v) {
        if(v.FolderName != "Sent" && v.FolderName != "Spam" && v.FolderName != "Trash" && v.FolderName != "Drafts") {
            var folderChoice = "<div class='item' data-value='" + (v.FolderName == "Inbox" ? v.FolderName : v.UUID) + "'>";
            switch(v.FolderName) {
                case "Inbox":
                    folderChoice += "<i class='icon inbox'></i>";
                    break;
                case "Sent":
                    folderChoice += "<i class='icon send'></i>";
                    break;
                case "Spam":
                    folderChoice += "<i class='icon ban'></i>";
                    break;
                case "Trash":
                    folderChoice += "<i class='icon trash'></i>";
                    break;
                case "Drafts":
                    folderChoice += "<i class='icon edit'></i>";
                    break;
                default:
                    folderChoice += "<i class='icon folder'></i>";
                    break;
            }
            folderChoice += "<span>" + escapeHtml(v.FolderName) + "</span>";
            folderChoice += "</div>";
            $("#mail-move .menu").append(folderChoice);
            $("#mc-move .menu").append(folderChoice);
        }
    });
    if($("#mail-move .menu .item").length > 1 && ($("#title").text() != "Sent") && ($("#title").text() != "Drafts")) {
        $("#mail-move").dropdown({
            action: 'select',
            allowReselection: 'true',
            onChange: function(value, text, choice) {
                checkedBoxes = $("td.col-check input[type='checkbox']:checked");
                itemsChecked = checkedBoxes.length;
                itemsMoved = 0;
                if(itemsChecked > 0 || $(".mail-grid tbody > tr").length) { // CHECKED OR ALL
                    if(itemsChecked == 0) { // ALL
                        checkedBoxes = $("td.col-check input[type='checkbox']");
                        itemsChecked = checkedBoxes.length;
                    }
                    if($("#title").text() == text.text()) { // IF DROPPING TO SAME FOLDER
                        return false;
                    }
                    $(".ui.main.page.dimmer").addClass("active");
                    $.each(checkedBoxes, function(k,v) {
                        if(k && (k % 20 == 0)) {
                            setTimeout(function() {
                                orderMoveTo(v, text, value);
                            }, 1000);
                        } else {
                            orderMoveTo(v, text, value);
                        }
                    });
                    paintMailCount();
                    updateNewCount();
                    toggleButtons(false);
                    $("#mail-move .default.text").text(`${w_mail_label_move_all}`);
                } else {
                    return false;
                }
            }
        });
    } else {
        $("#mail-move").remove();
    }
    $("#mc-move").dropdown({
        action: 'select',
        allowReselection: true,
        onChange: function(value, text, choice) {
            $(".ui.main.page.dimmer").addClass("active");
            if($("#title").text() == text.text()) { // IF DROPPING TO SAME FOLDER
                $(".ui.main.page.dimmer").removeClass("active");
                return false;
            }
            removeMail(pfMailTarget.UUID);
            $(".ui-mail-content > .header").hide();
            $(".ui-mail-content > .message").hide();
            if(pfMail.length) {
                $(".ui-mail-content > .no-mail-selected").show();
            }
            paintMailCount();
            updateNewCount();
            toggleButtons(false);
            if(text.text() == "Inbox") {
                var moveToInboxRequest = $.ajax({
                    method: "PATCH",
                    url: mailAPI + "/" + pfMailTarget.UUID,
                    dataType: "json",
                    data: { moveToPlain: 1, plainFolder: "Inbox" }
                });
                moveToInboxRequest.done(function(result, textStatus, jqXHR) {
                    if(result.success == 1) {
                        $(".ui.main.page.dimmer").removeClass("active");
                    } else {
                        alert(result.msg);
                    }
                });
                moveToInboxRequest.fail(handleAPIError);
                moveToInboxRequest.always(function() {
                });
            } else {
                var moveToFolderRequest = $.ajax({
                    method: "PATCH",
                    url: mailAPI + "/" + pfMailTarget.UUID,
                    dataType: "json",
                    data: { moveToFolder: 1, folderDestUUID: value }
                });
                moveToFolderRequest.done(function(result, textStatus, jqXHR) {
                    if(result.success == 1) {
                        $(".ui.main.page.dimmer").removeClass("active");
                    } else {
                        alert(result.msg);
                    }
                });
                moveToFolderRequest.fail(handleAPIError);
                moveToFolderRequest.always(function() {
                });
            }
        }
    });
}
function wireViewer() {
    $("#mc-reply").click(function() {
        launchComposer(true, false, true);
        $('#recipientTO').dropdown("set selected", pfMailTarget.MailFrom);
        setSubject(`${w_mail_initials_reply}:`);
    });
    $("#mc-reply-all").click(function() {
        launchComposer(true, false, true);
        $('#recipientTO').dropdown("set selected", pfMailTarget.MailFrom);
        $('#recipientCC').dropdown("set selected", pfMailTarget.MailCC);
        $('#recipientBCC').dropdown("set selected", pfMailTarget.MailBCC);
        setSubject(`${w_mail_initials_reply}:`);
    });
    $("#mc-forward").click(function() {
        launchComposer(true, false, false);
        setSubject(`${w_mail_initials_forward}:`);
    });
    $("#mc-edit").click(function() {
        launchComposer(false, false, false);
        $('#recipientTO').dropdown("set selected", pfMailTarget.MailTo);
        $('#recipientCC').dropdown("set selected", pfMailTarget.MailCC);
        $('#recipientBCC').dropdown("set selected", pfMailTarget.MailBCC);
        $("#modal-write-subject input").val(pfMailTarget.MailSubject);
        $("#modal-write-message").html(pfMailTarget.MailBodyFiltered);
    });
    $("#mc-stats").click(function() {
        if(!pfMailTarget.RecipientsDelivered && 
            !pfMailTarget.RecipientsOpened && 
            !pfMailTarget.RecipientsClicked && 
            !pfMailTarget.RecipientsBounced && 
            !pfMailTarget.RecipientsFailed &&
            !pfMailTarget.RecipientsUnsubscribed &&
            !pfMailTarget.RecipientsComplained) {
                $("#stats-status").hide();
            } else {
                $("#stats-status").show();
            }

        if(pfMailTarget.RecipientsDelivered) {
            $("#recipients-delivered td:nth-child(2)").text(pfMailTarget.RecipientsDelivered);
            $("#recipients-delivered td:last-child").text(isValidDate(pfMailTarget.DTDelivered) ? getshortdt(pfMailTarget.DTDelivered) : '');
            $("#recipients-delivered").show();
        } else {
            $("#recipients-delivered").hide();
        }
        if(pfMailTarget.RecipientsOpened) {
            $("#recipients-opened td:nth-child(2)").text(pfMailTarget.RecipientsOpened);
            $("#recipients-opened td:last-child").text(isValidDate(pfMailTarget.DTOpened) ? getshortdt(pfMailTarget.DTOpened) : '');
            $("#recipients-opened").show();
        } else {
            $("#recipients-opened").hide();
        }
        if(pfMailTarget.RecipientsClicked) {
            $("#recipients-clicked td:nth-child(2)").text(pfMailTarget.RecipientsClicked);
            $("#recipients-clicked td:last-child").text(isValidDate(pfMailTarget.DTClicked) ? getshortdt(pfMailTarget.DTClicked) : '');
            $("#recipients-clicked").show();
        } else {
            $("#recipients-clicked").hide();
        }
        if(pfMailTarget.RecipientsBounced) {
            $("#recipients-bounced td:nth-child(2)").text(pfMailTarget.RecipientsBounced);
            $("#recipients-bounced td:last-child").text(isValidDate(pfMailTarget.DTBounced) ? getshortdt(pfMailTarget.DTBounced) : '');
            $("#recipients-bounced").show();
        } else {
            $("#recipients-bounced").hide();
        }
        if(pfMailTarget.RecipientsFailed) {
            $("#recipients-failed td:nth-child(2)").text(pfMailTarget.RecipientsFailed);
            $("#recipients-failed td:last-child").text(isValidDate(pfMailTarget.DTFailed) ? getshortdt(pfMailTarget.DTFailed) : '');
            $("#recipients-failed").show();
        } else {
            $("#recipients-failed").hide();
        }
        if(pfMailTarget.RecipientsUnsubscribed) {
            $("#recipients-unsubscribed td:nth-child(2)").text(pfMailTarget.RecipientsUnsubscribed);
            $("#recipients-unsubscribed td:last-child").text(isValidDate(pfMailTarget.DTUnsubscribed) ? getshortdt(pfMailTarget.DTUnsubscribed) : '');
            $("#recipients-unsubscribed").show();
        } else {
            $("#recipients-unsubscribed").hide();
        }
        if(pfMailTarget.RecipientsComplained) {
            $("#recipients-complained td:nth-child(2)").text(pfMailTarget.RecipientsComplained);
            $("#recipients-complained td:last-child").text(isValidDate(pfMailTarget.DTComplained) ? getshortdt(pfMailTarget.DTComplained) : '');
            $("#recipients-complained").show();
        } else {
            $("#recipients-complained").hide();
        }

        if(!pfMailTarget.TrackedIP && 
            !pfMailTarget.TrackedCountry && 
            !pfMailTarget.TrackedCity && 
            !pfMailTarget.TrackedUserAgent && 
            !pfMailTarget.TrackedDeviceType &&
            !pfMailTarget.TrackedClientType &&
            !pfMailTarget.TrackedClientName &&
            !pfMailTarget.TrackedClientOS) {
                $("#stats-recipient").hide();
            } else {
                $("#stats-recipient").show();
            }

        if(pfMailTarget.TrackedIP) {
            $("#trackedip td:last-child").text(pfMailTarget.TrackedIP);
            $("#trackedip").show();
        } else {
            $("#trackedip").hide();
        }
        if(pfMailTarget.TrackedCountry) {
            $("#trackedcountry td:last-child").text(pfMailTarget.TrackedCountry);
            $("#trackedcountry").show();
        } else {
            $("#trackedcountry").hide();
        }
        if(pfMailTarget.TrackedRegion) {
            $("#trackedregion td:last-child").text(pfMailTarget.TrackedRegion);
            $("#trackedregion").show();
        } else {
            $("#trackedregion").hide();
        }
        if(pfMailTarget.TrackedCity) {
            $("#trackedcity td:last-child").text(pfMailTarget.TrackedCity);
            $("#trackedcity").show();
        } else {
            $("#trackedcity").hide();
        }
        if(pfMailTarget.TrackedUserAgent) {
            $("#trackeduseragent td:last-child").text(pfMailTarget.TrackedUserAgent);
            $("#trackeduseragent").show();
        } else {
            $("#trackeduseragent").hide();
        }
        if(pfMailTarget.TrackedDeviceType) {
            $("#trackeddevicetype td:last-child").text(pfMailTarget.TrackedDeviceType);
            $("#trackeddevicetype").show();
        } else {
            $("#trackeddevicetype").hide();
        }
        if(pfMailTarget.TrackedClientType) {
            $("#trackedclienttype td:last-child").text(pfMailTarget.TrackedClientType);
            $("#trackedclienttype").show();
        } else {
            $("#trackedclienttype").hide();
        }
        if(pfMailTarget.TrackedClientName) {
            $("#trackedclientname td:last-child").text(pfMailTarget.TrackedClientName);
            $("#trackedclientname").show();
        } else {
            $("#trackedclientname").hide();
        }
        if(pfMailTarget.TrackedClientOS) {
            $("#trackedclientos td:last-child").text(pfMailTarget.TrackedClientOS);
            $("#trackedclientos").show();
        } else {
            $("#trackedclientos").hide();
        }
        $("#modal-stats").modal("show");
    });
    $("#mc-new").click(function() {
        itemsChecked = 1;
        itemsDeleted = 0;
        $(".no-mail").html("<div class='ui active inverted dimmer'><div class='ui loader'></div></div>");
        $(".no-mail").show();
        msgUUID = pfMailTarget.UUID;
        $(".mail-grid tbody > tr[data-uuid='" + msgUUID + "']").find("a.dragMsg").addClass("new");
        setAsNewAJAX(msgUUID);
    });
    $("#mc-spam").click(function() {
        itemsChecked = 1;
        itemsDeleted = 0;
        // $(".mail-grid tbody").hide();
        $(".no-mail").html(`<div class='ui active dimmer spamDimmer'><div class='ui text loader'>${w_mail_loadtext_spam}</div></div>`);
        $(".no-mail").show();
        msgUUID = pfMailTarget.UUID; 
        removeMail(msgUUID);
        triggerSpam(msgUUID);
    });
    $("#mc-delete").click(function() {
        itemsChecked = 1;
        itemsDeleted = 0;
        // $(".mail-grid tbody").hide();
        $(".no-mail").html(`<div class='ui active dimmer deleteDimmer'><div class='ui text loader'>${w_mail_loadtext_delete}</div></div>`);
        $(".no-mail").show();
        msgUUID = pfMailTarget.UUID; 
        removeMail(msgUUID);
        triggerDelete(msgUUID);
    });
}
function wireControls() {
    // MODAL COMPOSE PREP (should go in mail-composer)
    $("#modal-write").modal({ autofocus: false, closable: false });
    // #region SPECIAL FOLDER CONFIGURATIONS
    if($("#title").text() == "Trash") {
        $("#mail-delete").html(`<i class='icon remove circle'></i><span>${w_mail_label_destroy}</span>`);
    }
    if($("#title").text() == "Spam") {
        $("#mail-spam").html("<i class='icon undo'></i>");
        $("#mail-spam").attr("data-tooltip",`${w_mail_label_notspam}`);
    }
    // #endregion
    // #region KEYBOARD SHORTCUTS
    $("body").keyup(function(event) {
        if(event.which == 46) { // DELETE
            // $("#mail-delete").trigger("mousedown");
        }
    });
    // #endregion
    let pages = mailCount / mailFactor;
    if(mailCount > mailFactor) {
        $("#mail-page-container").show();
        for(let i=0;i<pages;i++) {
            let pageOption = `<div class='item' data-value='${i}'>${i+1}</div>`;
            $("#mail-page .menu").append(pageOption);
        }
        $("#mail-page").dropdown();
        $("#mail-page").dropdown("set selected","0");
        $("#mail-page").dropdown({
            onChange: function(value,text) {
                page = value;
                $("td.col-check > div").checkbox("uncheck");
                toggleButtons(false);
                launchMail();
            }
        });
    } else {
        $("#mail-page-container").hide();
    }
}

// #region BEHAVIORS
function setDragBehavior() {
    interact('.dragMsg').draggable({
        inertia: true,
        autoScroll: true,
        onstart: function(event) {
            $(".msg-hover").css("top", event.pageY);
            $(".msg-hover").css("left", event.pageX);
            $(".msg-hover").show();
            draggedRows = $("td.col-check input[type='checkbox']:checked");
            itemsChecked = draggedRows.length;
        },
        onmove: dragMoveListener,
        onend: function (event) {
            $(".msg-hover").hide();
        }
    });
    function dragMoveListener (event) {
        $(".msg-hover").css("top", event.pageY);
        $(".msg-hover").css("left", event.pageX);
    }
    window.dragMoveListener = dragMoveListener;
    interact('.dropzone').dropzone({
        ondropactivate: function (event) {
        },
        ondragenter: function (event) {
            $(event.target).css("background-color","#1C84C3");
            $(event.target).css("color","#FFFFFF");
            $(event.target).find("i").css("color","#FFFFFF");
            $(event.target).find("a").css("background-color","#1C84C3");
            $(event.target).find("a").css("color","#FFFFFF");
        },
        ondragleave: function (event) {
            $(event.target).css("background-color","");
            $(event.target).css("color","");
            $(event.target).find("i").css("color","");
            $(event.target).find("a").css("background-color","");
            $(event.target).find("a").css("color","");
        },
        ondrop: function (event) {
            itemsMoved = 0;
            if(($("#title").text() == $(event.target).text()) ||
                (($("#title").text() == "Drafts") && ($(event.target).text() != "Sent" && $(event.target).text() != "Trash")) ||
                (($("#title").text() == "Sent") && ($(event.target).text() != "Drafts" && $(event.target).text() != "Trash")) ||
                (($("#title").text() != "Sent" && ($("#title").text() != "Drafts") && ($("#title").text() != "Trash")) && ($(event.target).text() == "Drafts" || $(event.target).text() == "Sent"))
                ) {
                var itemSelector = $(event.target);
                if(!$(event.target).hasClass("inbox")) {
                    itemSelector = itemSelector.find("a");
                }
                itemSelector.animate({
                    backgroundColor: "#c50000",
                    color: "#FFFFFF"
                }, 600, "easeOutQuad", function() {
                    itemSelector.animate({
                        backgroundColor: "#FAFAFA",
                        color: "#666666"
                    }, 600, "easeOutQuad", function() {
                        itemSelector.css("backgroundColor","");
                        itemSelector.css("color","");
                    });
                });
                itemSelector.find("i").animate({
                    color: "#FFFFFF"
                }, 600, "easeOutQuad", function() {
                    itemSelector.find("i").animate({
                        color: "#e0e0e0"
                    }, 600, "easeOutQuad", function() {
                        itemSelector.find("i").css("color","");
                    });
                });
                return false;
            }
            $(".ui.main.page.dimmer").addClass("active");
            var dragIsChecked = false;
            $.each(draggedRows, function(k,v) {
                msgUUID = $(v).parents("tr").attr("data-uuid");
                $(v).parents("tr").remove();
                $(".mail-grid").trigger("update");

                if($(event.relatedTarget).attr("data-uuid") == msgUUID) {
                    dragIsChecked = true;
                }

                var cIndex = 0;
                $.each(pfMail, function(a,b) { if(b.UUID == msgUUID) { cIndex = a; } });
                pfMail.splice(cIndex,1);

                var folderDestUUID = $(event.target).attr("data-uuid");
                if($(event.target).hasClass("inbox")) {
                    var moveToInboxRequest = $.ajax({
                        method: "PATCH",
                        url: mailAPI + "/" + msgUUID,
                        dataType: "json",
                        data: { moveToPlain: 1, plainFolder: "Inbox" }
                    });
                    moveToInboxRequest.done(function(result, textStatus, jqXHR) {
                        if(result.success == 1) {
                            itemsMoved++;
                            if(itemsChecked == itemsMoved) {
                                $(".ui.main.page.dimmer").removeClass("active");
                            }
                        } else {
                            alert(result.msg);
                        }
                    });
                    moveToInboxRequest.fail(handleAPIError);
                    moveToInboxRequest.always(function() {
                    });
                } else {
                    var moveToFolderRequest = $.ajax({
                        method: "PATCH",
                        url: mailAPI + "/" + msgUUID,
                        dataType: "json",
                        data: { moveToFolder: 1, folderDestUUID: folderDestUUID }
                    });
                    moveToFolderRequest.done(function(result, textStatus, jqXHR) {
                        if(result.success == 1) {
                            itemsMoved++;
                            if(itemsChecked == itemsMoved) {
                                $(".ui.main.page.dimmer").removeClass("active");
                            }
                        } else {
                            alert(result.msg);
                        }
                    });
                    moveToFolderRequest.fail(handleAPIError);
                    moveToFolderRequest.always(function() {
                    });
                }

                if(pfMailTarget.UUID == msgUUID) {
                    $(".ui-mail-content > .header").hide();
                    $(".ui-mail-content > .message").hide();
                    if(pfMail.length) {
                        $(".ui-mail-content > .no-mail-selected").show();
                    }
                }
            });
            if(!dragIsChecked) {
                msgUUID = $(event.relatedTarget).attr("data-uuid");
                $(event.relatedTarget).parents("tr").remove();
                $(".mail-grid").trigger("update");

                var cIndex = 0;
                $.each(pfMail, function(a,b) { if(b.UUID == msgUUID) { cIndex = a; } });
                pfMail.splice(cIndex,1);

                var folderDestUUID = $(event.target).attr("data-uuid");
                if($(event.target).hasClass("inbox")) {
                    var moveToInboxRequest = $.ajax({
                        method: "PATCH",
                        url: mailAPI + "/" + msgUUID,
                        dataType: "json",
                        data: { moveToPlain: 1, plainFolder: "Inbox" }
                    });
                    moveToInboxRequest.done(function(result, textStatus, jqXHR) {
                        if(result.success == 1) {
                            $(".ui.main.page.dimmer").removeClass("active");
                        } else {
                            alert(result.msg);
                        }
                    });
                    moveToInboxRequest.fail(handleAPIError);
                    moveToInboxRequest.always(function() {
                    });
                } else {
                    var moveToFolderRequest = $.ajax({
                        method: "PATCH",
                        url: mailAPI + "/" + msgUUID,
                        dataType: "json",
                        data: { moveToFolder: 1, folderDestUUID: folderDestUUID }
                    });
                    moveToFolderRequest.done(function(result, textStatus, jqXHR) {
                        if(result.success == 1) {
                            $(".ui.main.page.dimmer").removeClass("active");
                        } else {
                            alert(result.msg);
                        }
                    });
                    moveToFolderRequest.fail(handleAPIError);
                    moveToFolderRequest.always(function() {
                    });
                }

                if(pfMailTarget.UUID == msgUUID) {
                    $(".ui-mail-content > .header").hide();
                    $(".ui-mail-content > .message").hide();
                    if(pfMail.length) {
                        $(".ui-mail-content > .no-mail-selected").show();
                    }
                }
            }
            paintMailCount();
            updateNewCount();
            toggleButtons(false);
        },
        ondropdeactivate: function (event) {
            $(event.target).css("background-color","");
            $(event.target).css("color","");
            $(event.target).find("i").css("color","");
            $(event.target).find("a").css("background-color","");
            $(event.target).find("a").css("color","");
        }
    });
}
function setCheckBehavior() {
    // CHECK BEHAVIOR 2
    $("td.col-check > div").checkbox({
        onChecked : function() {
            toggleButtons(true);
            $(this).parents("tr").find("td").css("background", "var(--color-table-row-hover-bg)");
            checkedBoxes = $("td.col-check input[type='checkbox']:checked").length;
            switch(mainCustomer.CustomerLanguage) {
                case "es":
                    var pluralPlaceholder = (checkedBoxes > 1) ? "s" : "";
                    $("#ui-counter-selected").html(checkedBoxes + "<span> Marcado" + pluralPlaceholder + "</span>");
                    break;
                default:
                    $("#ui-counter-selected").html(checkedBoxes + "<span> Checked</span>");
                    break;
            }
            
            $("#mail-delete span").text(`${w_mail_label_delete_checked}`);
            $("#mail-spam").attr("data-tooltip", `${w_mail_label_mark_checked_spam}`);
            $("#mail-new").attr("data-tooltip", `${w_mail_label_mark_checked_new}`);
            $("#mail-move .default.text").html(`${w_mail_label_move_checked}`);
            $("#ui-counter-selected").css("display","block");
            $("#ui-counters").attr("class", "two");
        },
        onUnchecked : function() {
            $(this).parents("tr").find("td").removeAttr("style");
            $(".col-head-check .ui.checkbox").checkbox("set unchecked");
            checkedBoxes = $("td.col-check input[type='checkbox']:checked").length;
            switch(mainCustomer.CustomerLanguage) {
                case "es":
                    var pluralPlaceholder = (checkedBoxes > 1) ? "s" : "";
                    $("#ui-counter-selected").html(checkedBoxes + "<span> Marcado" + pluralPlaceholder + "</span>");
                    break;
                default:
                    $("#ui-counter-selected").html(checkedBoxes + "<span> Checked</span>");
                    break;
            }            
            if(checkedBoxes == 0) {
                $("#mail-delete span").text(`${w_mail_label_delete_all}`);
                $("#mail-spam").attr("data-tooltip", `${w_mail_label_mark_all_spam}`);
                $("#mail-new").attr("data-tooltip", `${w_mail_label_mark_all_new}`);
                $("#mail-move .default.text").text(`${w_mail_label_move_all}`);

                $("#ui-counter-selected").hide();
                $("#ui-counters").attr("class", "one");
            }
        }
    });
    $(".col-head-check .ui.checkbox").checkbox({
        onChecked : function() {
            $("td.col-check > div").checkbox("check");
        },
        onUnchecked : function() {
            $("td.col-check > div").checkbox("uncheck");
        }
    });
    $("body").off("mouseup");
    $("body").mouseup(function(e) {
        var leadsTable = $(".mail-grid");
        var leadsButtons = $("#ui-bar .ui.button");
        var mailDropDown = $("#mail-move");
        var mailDeleteButton = $("#mail-delete");
        var toprightButton = $(".settingsButton");
        var toprightMenu = $(".settingsMenu");
        var listLeadModal = $("#modal-list");
        if (!leadsTable.is(e.target) // if the target of the click isn't the container...
            && leadsTable.has(e.target).length === 0  // ... nor a descendant of the container
            && !leadsButtons.is(e.target) // nor the button itself
            && leadsButtons.has(e.target).length === 0
            && !mailDropDown.is(e.target) // nor the button itself
            && mailDropDown.has(e.target).length === 0
            && !toprightButton.is(e.target) // nor the button itself
            && toprightButton.has(e.target).length === 0
            && !mailDeleteButton.is(e.target) // nor the button itself
            && mailDeleteButton.has(e.target).length === 0
            && !toprightMenu.is(e.target) // nor the button itself
            && toprightMenu.has(e.target).length === 0
            && !listLeadModal.is(e.target) // nor the button itself
            && listLeadModal.has(e.target).length === 0 ) // nor the button itself
        {
            $("td.col-check > div").checkbox("uncheck");
        }
    });
}
function wireDragSelection() {
    isDragging = false;
    c$ = $("#dragSelection");
    overText = false;
    $(".mail-grid tbody td span").off("hover");
    $(".mail-grid tbody td span").hover(function() {
        overText = true;
    }, function() {
        overText = false;
    });
    
    $(".mail-grid").off("mousedown");
    $(".mail-grid").mousedown(function(e) {
        if(!overText) {
            isDragging = true;
            c$.show();
            ogX = e.clientX;
            ogY = e.clientY;
        }
    });
    $(".mail-grid").off("mousemove");
    $(".mail-grid").mousemove(function(e) {
        if(isDragging) {
            startRectX = Math.min(ogX, e.clientX);
            endRectX = Math.max(ogX, e.clientX);
            startRectY = Math.min(ogY, e.clientY);
            endRectY = Math.max(ogY, e.clientY);
            c$.css("top",startRectY);
            c$.css("left",startRectX);
            c$.css("height", endRectY - startRectY);
            c$.css("width", endRectX - startRectX);
            c$.css("border", "1px solid #1C84C3");
        }
    });
    $(".mail-grid").off("mouseleave");
    $(".mail-grid").mouseleave(function() {
        isDragging = false;
        c$.css("border", "none");
        c$.css("height", 0);
        c$.css("width", 0);
        c$.hide();
    });
    $(".mail-grid").off("mouseup");
    $(".mail-grid").mouseup(function() {
        isDragging = false;
        c$.css("border", "none");
        c$.css("height", 0);
        c$.css("width", 0);
        c$.hide();
    });
}
// #endregion
function translateMail() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            switch($("#title").text()) {
                case "Inbox":
                    $("#title").text("Bandeja");
                    break;
                case "Sent":
                    $("#title").text("Envíados");
                    break;
                case "Spam":
                    $("#mail-spam").attr("data-tooltip","No es Spam");
                case "Trash":
                    $("#title").text("Basura");
                    $("#mail-delete").html("<i class='icon remove circle'></i><span>Destruir</span>");
                    break;
                case "Drafts":
                    $("#title").text("Revisiones");
                    break;
            }
            //#region DICTIONARY
            w_mail_status_delivered = "Envíado";
            w_mail_status_opened = "Abierto";
            w_mail_status_clicked = "Clickeado";
            w_mail_status_bounced = "Reboto";
            w_mail_status_failed = "Fallo";
            w_mail_status_unsubscribed = "Desuscrito";
            w_mail_status_complained = "Quejo";
            
            w_mail_label_destroy = "Destruir";
            w_mail_label_notspam = "No es Spam";

            w_mail_initials_reply = "RE";
            w_mail_initials_forward = "FW";

            w_mail_loadtext_spam = "Limpiando spam";
            w_mail_loadtext_delete = "Borrando";

            w_mail_no_messages = "NO HAY MENSAJES";
            w_mail_total = "Total";
            w_mail_loading = "Cargando";
            
            w_mail_label_delete_checked = "Borrar marcados";
            w_mail_label_mark_checked_spam = "Definir marcados como spam";
            w_mail_label_mark_checked_new = "Definir marcados como nuevo";
            w_mail_label_move_checked = "Mover marcados a";

            w_mail_label_delete_all = "Borrar todo";
            w_mail_label_mark_all_spam = "Marcar todo como spam";
            w_mail_label_mark_all_new = "Marcar todo como nuevo";
            w_mail_label_move_all = "Mover todo a";
            //#endregion
            // DATE COLUMN SORT PREFERENCE
            $("th.col-head-date").removeClass("sorter-mmddyy");
            $("th.col-head-date").addClass("sorter-ddmmyy");
            // MAIL
            $(".no-mail-selected p").text("Elige un mensaje para leer");
            $(".ui.main.page.dimmer .ui.text.loader").text("Cargando");
            $(".mail-loader .ui.text.loader").text("Cargando");
            $("th.col-head-message span").text("Mensaje");
            $("th.col-head-date span").text("Fecha");
            $(".ui-mail-list .no-mail p").text("No hay mensajes");
            $("#mc-reply span").text("Responder");
            $("#mc-reply-all span").text("Responder a todos");
            $("#mc-forward span").text("Reenvíar");
            $("#mc-edit span").text("Editar");
            $("#mc-stats span").text("Estadisticas");
            $("#mc-move .default.text").text("Mover a");
            $("#mc-source").attr("data-tooltip", "Ver fuente");
            $("#mc-new").attr("data-tooltip", "Marcar como nuevo");
            $("#mc-spam").attr("data-tooltip", "Marcar como spam");
            $("#mc-delete").attr("data-tooltip", "Borrar mensaje");
            $("#mail-page-label").text("Página");
            
            // MAIL - LEFT MENU
            $(".folder-sent span").text("Envíados");
            $(".folder-trash span").text("Basura");
            $(".folder-drafts span").text("Revisiones");
            $("#mail-add-folder span").text("Agregar Carpeta");
            
            // MAIL - UI BAR
            $("#ui-search input").attr("placeholder","Buscar");
            $("#mail-send span").text("Componer");
            $("#mail-sync").attr("data-tooltip", "Sincronizar");
            $("#mail-new").attr("data-tooltip", "Marcar todo como nuevo");
            $("#mail-spam").attr("data-tooltip", "Marcar todo como spam");
            $("#mail-move .default.text").text("Mover todo a");
            $("#mail-delete span").text("Borrar todo");
            // MAIL - MODAL - ADD FOLDER 
            $("#modal-add-folder > .header > span").text("Agregar Carpeta");
            $("#add-folder-name input").attr("placeholder","Nombre de la carpeta");
            $("#modal-add-folder .ui.error.message h1").text("El nombre de la carpeta esta vacía");
            $("#modal-add-folder .ui.error.message p").text("Por favor, escriba un nombre para su nueva carpeta");
            $("#modal-add-folder .ui.warning.message h1").text("Error de servidor");
            $("#modal-add-folder .ui.warning.message p").text("La carpeta no se pudo crear en estos momentos. Por favor, intente de nuevo mas tarde, o contactenos para asistirle");
            $("#modal-add-folder .ui.info.message h1").text("Nombre de la carpeta ya existe");
            $("#modal-add-folder .ui.info.message p").text("Escriba otro nombre para su nueva carpeta");
            $("#add-folder-save span").text("Agregar Carpeta");
            // MAIL - MODAL - EDIT FOLDER 
            $("#modal-folder > .header > span").text("Detalles de la carpeta");
            $("#modal-folder .folder-name-field label").text("Nombre de la carpeta");
            $("#folder-name input").attr("placeholder","Nombre de la carpeta");
            $("#modal-folder .ui.error.message h1").text("El nombre de la carpeta esta vacía");
            $("#modal-folder .ui.error.message p").text("Por favor, escriba un nombre para su nueva carpeta");
            $("#modal-folder-delete span").text("Borrar Carpeta");
            $("#modal-folder-save span").text("Grabar Cambios");
            // MAIL COMPOSE
            $("#modal-write > .header > span").text("Envíar Mensaje");
            $("#modal-write .ccbuttons .or").attr("data-text","o");
            $("#recipientTO .default.text").text("Para");
            $("#modal-write-subject input").attr("placeholder", "Asunto");
            $(".tb-html span").text("Simple / HTML");
            $("#modal-write-attachments label").text("Adjuntos");
            $("#modal-write .ui.error.message .header").text("Datos vacíos");
            $("#modal-write .ui.error.message p").text("Por favor, llene los datos requeridos del formulario para enviar su correo");
            $("#modal-write .ui.dimmer.save-template .loader").text("Grabando plantilla");
            $("#modal-write .ui.dimmer.save-template2 .loader").text("Grabando plantilla");
            $("#modal-write .ui.dimmer.save-message .loader").text("Grabando mensaje");
            $("#modal-write .ui.dimmer.send-message .loader").text("Envíando mensaje");
            $("#modal-write-discard span").text("Salir");
            $("#modal-write-save span").text("Grabar");
            $("#modal-write-send span").text("Envíar");
            $(".modal-write-message").addClass("es");
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
            // MODAL - STATS
            $("#modal-stats > .header > span").text("Estadisticas de correo");
            $("#recipients-delivered td:first-child").text("Envíado a");
            $("#recipients-opened td:first-child").text("Abierto por");
            $("#recipients-clicked td:first-child").text("Clickeado por");
            $("#recipients-bounced td:first-child").text("Reboto para");
            $("#recipients-failed td:first-child").text("Fallo para");
            $("#recipients-unsubscribed td:first-child").text("Desuscrito por");
            $("#recipients-complained td:first-child").text("Quejado por");
            $("#trackedip td:first-child").text("Dirección IP");
            $("#trackedcountry td:first-child").text("País");
            $("#trackedregion td:first-child").text("Region");
            $("#trackedcity td:first-child").text("Ciudad");
            $("#trackeduseragent td:first-child").text("Agente de Usuario");
            $("#trackeddevicetype td:first-child").text("Tipo de Equipo");
            $("#trackedclienttype td:first-child").text("Tipo de Cliente");
            $("#trackedclientname td:first-child").text("Nombre de Cliente");
            $("#trackedclientos td:first-child").text("Sistema Operativo");
            $("#modal-stats-exit span").text("Regresar");
            break;
        case "en":
        default:
            $(".modal-write-message").addClass("en");          
            break;
    }
}
// #endregion
// #region LAUNCH
function launchMail() {
    folderparam = getParameterByName("folder");
    query = getParameterByName("q");
    $("#ui-search input").val(query);
    if(folderparam) {
        calcAPI = mailAPI + "/" + folderparam;
    } else {
        calcAPI = mailAPI;
    }
    let req = $.ajax({
        method: "PATCH",
        url: calcAPI,
        data: { page },
        dataType: "json"
    });
    req.done(wireMail);
    req.fail(handleAPIError);
    req.always(function() {
    });
}
function wireMail(result) {
    if(parseInt(result.success)) {
        pfMail = result.mail;
        pfMailFolder = result.mailfolder;
        mailCount = result.count;
        mailFactor = result.factor;
        paintMails();
        paintMailCount();
        if(!isInit) {
            paintMailFolders();
        } else {
            updateNewCount();
        }
        if($(window).width() > 600) {
            setDragBehavior();
        }
        if(!isInit) {
            wireActions();
            isInit = true;
        }
        $(".mail-grid").trigger("update");
        setCheckBehavior();
    } else {
        toastr.error(w_server_error_h);
        console.log(result.msg);
    }
}
$(function() {
    $(".no-mail").html("<div class='ui active inverted dimmer'><div class='ui loader'></div></div>");
    $(".no-mail").show();
    launchInterval = setInterval(function() {
        if(mainCustomer && mainCustomer.CustomerName) {
            launchMail();
            clearInterval(launchInterval);
        }
    }, 100);
});
// #endregion