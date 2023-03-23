// REQUIRES TOASTR
// #region VARIABLES
var viewHTML = false;
var myCodeMirror;
var htmlString = "";
var attachCount = 0;
var attachmentLinks = "";
var attachments = [];
var textDB = "";
var htmlDB = "";
var inlines = "";
var newUUID;
var msgTxtSize = 14;
var msgTxtSizePtr = 5;
var msgTxtSizes = [8,9,10,11,12,14,16,18,20,22,24,26,28,32,36,48,72];
var oldContent;
var newContent;
var oldAttr;
var tabTarget;
var lastKeyPressed;
var linkType;
var linkText;
var linkURL;
var linkTag;
// #endregion
// #region HELPER METHODS
function setMsgPtr() {
    for(var ptr=0;ptr<msgTxtSizes.length; ptr++) {
        if(msgTxtSizes[ptr] == msgTxtSize) {
            msgTxtSizePtr = ptr;
        }
    }
}
function increasemsgTxtSize() {
    msgTxtSizePtr++;
    if(msgTxtSizePtr == msgTxtSizes.length) {
        msgTxtSizePtr = 0;
    }
    msgTxtSize = msgTxtSizes[msgTxtSizePtr];
    $(".tb-size").dropdown("set selected",msgTxtSize.toString());
    msgTxtSize = parseInt(msgTxtSize);
}
function decreasemsgTextSize() {
    msgTxtSizePtr--;
    if(msgTxtSizePtr < 0) {
        msgTxtSizePtr = msgTxtSizes.length-1;
    }
    msgTxtSize = msgTxtSizes[msgTxtSizePtr];
    $(".tb-size").dropdown("set selected",msgTxtSize.toString());
    msgTxtSize = parseInt(msgTxtSize);
}
function modifyFragmentSize(newVal) {
    var newText = "<span style='font-size: " + newVal + "'";
    newText += ">" + elementSelection.toString() + "</span>";
    document.execCommand("insertHTML",false, newText);
}
// #endregion
// #region MAIN METHODS
function displayToolbar(toolbar) {
    if(elementTarget.offset().top < $(".ui-message").offset().top) {
        return false;
    }
    toolbar.css("top",elementTarget.offset().top - toolbar.height());
    if(elementTarget.offset().left + toolbar.width() + 10 >= $(document).width()) {
        toolbar.css("left",elementTarget.offset().left + elementTarget.width() - toolbar.width());
    } else {
        toolbar.css("left",elementTarget.offset().left);
    }
    if(toolbar.is(":hidden")) {
        toolbar.hide();
        toolbar.fadeIn(120);
    }
}
function setWriterEngine() {
    $(".ui-message img").off("mouseenter");
    $(".ui-message img").mouseenter(function() {
        elementTarget = $(this);
        elementTarget.css("cursor","pointer");
        elementTarget.css("outline","1px solid #000000");
        elementTarget.css("opacity","0.8");
        toolbarTarget = $(".toolbar-image");
        displayToolbar(toolbarTarget);
    });
    $(".ui-message img").off("mouseleave");
    $(".ui-message img").mouseleave(function() {
        $(".toolbar-image").hide();
        elementTarget.css("cursor","");
        elementTarget.css("opacity","");
        elementTarget.css("outline","");
    });
}
function templateLoad() {
    var templateRequest = $.ajax({
        method: "GET",
        url: mailTemplateAPI,
        dataType: "json"
    });
    templateRequest.done(function(res) {
        if(parseInt(res.success)) {
            $("#templateAll .ui.grid").html("");
            $("#templateCustom .ui.grid").html("");
            $(".tmpl").remove();
            pfTemplates = res.data;
            $.each(pfTemplates, function(k,v) {
                var housingTag = "<div class='eight wide column sectionHousing'>";
                housingTag += "<a href='#' class='sectionThumb' data-uuid='" + v.UUID + "' onclick='placeTemplate(" + k + ")'>";
                if(parseInt(v.IsPrivate)) {
                    housingTag += `<img src='https://${res.s3_bucket}.s3.${res.s3_region}.amazonaws.com/${mainCustomer.SubDomain}/templates-email/${v.UUID}.png' />`;
                } else {
                    housingTag += "<img src='img/mail-templates/lucrative/" + v.UUID + ".png' />";
                }
                housingTag += "</a>";
                housingTag += "<div class='secThumb-overlay bottom'>";
                if(parseInt(v.IsPrivate)) {
                    housingTag += "<a href='" + "#" + "' class='thumb-delete' title='Delete' data-uuid='" + v.UUID + "'><i class='icon trash'></i></a>";
                }
                housingTag += "<span class='sectionName' title='Section Name'>" + v.TemplateName + "</span>";
                housingTag += "</div>";
                housingTag += "</div>";
                $("#templateAll .ui.grid").append(housingTag);
                if(parseInt(v.IsPrivate)) {
                    $("#templateCustom .ui.grid").append(housingTag);
                }

                var tmplTag = "<div data-subject='" + v.TemplateName + "' data-uuid='" + v.UUID + "' class='tmpl tmpl" + k + "'>";
                tmplTag += v.TemplateContent;
                tmplTag += "</div>";
                $("body").append(tmplTag);
            });
            $(".sectionHousing").off("mouseenter");
            $(".sectionHousing").mouseenter(function() {
                $(this).find(".secThumb-overlay").fadeIn(120);
            });
            $(".sectionHousing").off("mouseleave");
            $(".sectionHousing").mouseleave(function() {
                $(this).find(".secThumb-overlay").fadeOut(120);
            });
            $("#templateGallery .ui.grid .sectionHousing .thumb-delete").off("click");
            $("#templateGallery .ui.grid .sectionHousing .thumb-delete").click(function() {
                uuid = $(this).parents(".sectionHousing").find(".sectionThumb").attr("data-uuid");
                var deleteTemplateRequest = $.ajax({
                    method: "DELETE",
                    dataType: "json",
                    url: mailTemplateAPI + "/" + uuid
                });
                deleteTemplateRequest.done(function() {
                    $("#templateGallery .sectionThumb[data-uuid='" + uuid + "']").parent().remove();
                    $(".tmpl[data-uuid='" + uuid + "']").remove();
                });
                deleteTemplateRequest.always(function() {
                });
            });
        } else {
            toastr.error(w_mailtemplateerror);
            console.log(res.errorMsg);
        }
    });
    templateRequest.fail(handleAPIError);
    templateRequest.always(function() {
    });
}
function placeTemplate(num) {
    var templateSelection = $(".tmpl" + num).html();
    $(".ui-message").html(templateSelection);
    if($("#modal-write-subject").length) {
        $("#modal-write-subject input").val($(".tmpl" + num).attr("data-subject"));
    }
    $(".tb-template-name input").val($(".tmpl" + num).attr("data-subject"));
    if($("#modal-write").length) {
        $("#modal-write").modal("show");
    }
    if($("#modal-adduser").length) {
        $("#modal-adduser").modal("show");
    }
    
    setWriterEngine();
}
// #endregion
// #region LAUNCH
function wireToolbar() {
    // #region ACTIVATE TABS
    $(".toolbar .menu .item").tab();
    $(".toolbar-tabs > .item").mousedown(function(e) {
        if($(this).hasClass("active")) {
            tabTarget = $(this);
        } else {
            tabTarget = null;
        }
    });
    $(".toolbar-tabs > .item").click(function(e) {
        if(tabTarget) {
            tabTarget.removeClass("active");
            var datatab = tabTarget.attr("data-tab");
            $(".toolbar > .ui.tab.segment[data-tab='" + datatab + "']").removeClass("active");
        }
    });
    // #endregion
    $(".tb-html").click(function() {
        let parentContainer = $(this).parents(".write-message");
        let messageContainer = parentContainer.find(".ui-message");
        if(viewHTML) {
            viewHTML = false;
            messageContainer.html(myCodeMirror.getValue());
            messageContainer.css("padding", "");
            $(".toolbar").show();
        } else {
            messageContainer.removeAttr("style");
            messageContainer.css("padding", "0px");
            $(".toolbar").hide();
            htmlString = indent.indentHTML(messageContainer.html(), '\t');
            messageContainer.html("");
            myCodeMirror = CodeMirror(messageContainer.get(0), {
                theme: "zenburn",
                mode: "htmlmixed",
                value: htmlString,
                indentUnit: 4,
                lineNumbers: true,
                lineWrapping: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                extraKeys: {
                    "Ctrl-Space": "autocomplete"
                },
                styleActiveLine: true,
                autoCloseTags: true,
                lint: false
            });
            viewHTML = true;
        }
    });

    // #region ATTACHMENTS TAB
    // #region ADD ATTACHMENT
    jqXHR = $(".toolbar-content #toolbar-attachment").fileupload({
        url: attachmentAPI,
        dataType: 'json',
        maxFileSize: 50000000, // 50 MB
        start: function(e) {
            attachCount = $("#modal-write-attachments .modal-write-attach").length;
        },
        send: function(e,data) {
            $("#modal-write-attachments").show();
            var attachPiece = "<div class='modal-write-attach'>";
            attachPiece += "<div class='ui grid'>";
            attachPiece += "<div class='ten wide column'>";
            attachPiece += "<i class='icon attach'></i>";
            attachPiece += "<span data-name='' class='name'>" + data.files[0].name + "</span>";
            attachPiece += "<span data-size='" + data.total + "' class='size'>" + filesize(data.total) + "</span>";
            attachPiece += "<a href='#' class='ibtn cancel'><i class='icon cancel'></i></a>";
            attachPiece += "</div>";
            attachPiece += "<div class='six wide column'>";
            attachPiece += "<div class='ui green active progress'>";
            attachPiece += "<div class='bar'>";
            attachPiece += "<div class='progress'></div>";
            attachPiece += "</div>";
            attachPiece += "</div>";
            attachPiece += "<i class='icon checkmark'></i>";
            attachPiece += "</div>";
            attachPiece += "</div>";
            attachPiece += "</div>";
            $("#modal-write-attachments").append(attachPiece);
            $("#modal-write-attachments .modal-write-attach").eq(attachCount).find("i.checkmark").hide();
            $("#modal-write").modal("refresh");
            $("#modal-write-attachments .modal-write-attach").eq(attachCount).find(".ui.progress").show();
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
        },
        process: function(e, data) {
            $("#modal-write-attachments .modal-write-attach").eq(attachCount).find(".ui.progress").progress("set total", data.total);
        },
        progressall: function (e, data) {
            $("#modal-write-attachments .modal-write-attach").eq(attachCount).find(".ui.progress").progress("set progress", data.loaded);
        },
        done: function (e, response) {
            let result = response.result;
            if(parseInt(result.code) == 1) {
                var file = result.data;
                var iconTarget = $("#modal-write-attachments .modal-write-attach").eq(attachCount).find("i.attach");
                var suffix = file.name.substring(file.name.indexOf(".")).toLowerCase();
                switch(suffix) {
                    case ".jpg":
                    case ".jpeg":
                    case ".png":
                    case ".gif":
                    case ".bmp":
                        iconTarget.replaceWith("<img src='" + file.url + "' />");
                        break;
                    case ".doc":
                    case ".docx":
                        iconTarget.replaceWith("<img src='img/icons/word.png' />");
                        break;
                    case ".pdf":
                    case ".pdfx":
                        iconTarget.replaceWith("<img src='img/icons/pdf.png' />");
                        break;
                    case ".xls":
                    case ".xlsx":
                        iconTarget.replaceWith("<img src='img/icons/excel.png' />");
                        break;
                    case ".html":
                    case ".css":
                    case ".js":
                    case ".php":
                        iconTarget.replaceWith("<i class='icon code'></i>");
                        break;
                    case ".sql":
                    case ".csv":
                        iconTarget.replaceWith("<i class='icon database'></i>");
                        break;
                    case ".zip":
                    case ".rar":
                        iconTarget.replaceWith("<i class='icon archive'></i>");
                        break;
                }
                var nameTarget = $("#modal-write-attachments .modal-write-attach").eq(attachCount).find("span.name");
                nameTarget.replaceWith("<a target='_blank' class='name' href='" + file.url + "'>" + file.name + "</a>");

                setTimeout(function() {
                    $("#modal-write-attachments .modal-write-attach").eq(attachCount).find(".ui.progress").fadeOut(400, function() {
                        $("#modal-write-attachments .modal-write-attach").eq(attachCount).find("i.checkmark").fadeIn(400);
                        attachCount++;
                    });
                }, 700);
            } else {
                handleAttachmentAPIError(result.code, result.msg);
            }
        },
        fail: function(e,data) {
            toastr.error(w_attachmentfailed);
            console.log(data.errorThrown);
            $("#modal-write-attachments .modal-write-attach").eq(attachCount).remove();
        }
    });
    // #endregion
    // #region ADD IMAGE
    $(".tb-add-image").on("mousedown", function(e) {
        elementSelection = window.getSelection();
        elementRange = elementSelection.getRangeAt(0).cloneRange();
        if($(elementRange.commonAncestorContainer).is($(".ui-message")) ||
            $(elementRange.commonAncestorContainer).parents(".ui-message").length) {
        } else {
        }
    });
    $(".tb-add-image").fileupload({
        url: attachmentAPI,
        dataType: 'json',
        maxFileSize: 50000000, // 50 MB
        done: function (e, response) {
            let result = response.result;
            if(parseInt(result.code) == 1) {
                var file = result.data;
                if(elementSelection != null) {
                    elementSelection.removeAllRanges();
                    elementSelection.addRange(elementRange);
                    if($(elementRange.commonAncestorContainer).is($(".ui-message")) ||
                        $(elementRange.commonAncestorContainer).parents(".ui-message").length) {
                        switch(elementSelection.type) {
                            case "Range":
                                var newImg = "<img data-name='" + file.name + "' class='inline' src='" + file.url + "' />";
                                document.execCommand("insertHTML",false, newImg);
                                break;
                            case "Caret":
                                var newImg = document.createElement("img");
                                newImg.className = "inline";
                                newImg.setAttribute("src", file.url);
                                newImg.setAttribute("data-name", file.name);
                                var frag = document.createDocumentFragment();
                                frag.appendChild(newImg);
                                elementRange.insertNode(frag);
                                break;
                        }
                    }
                }
            } else {
                handleAttachmentAPIError(result.code,result.msg);
            }            
        },
        fail: function(e,data) {
            toastr.error(w_attachmentfailed);
            console.log(data.errorThrown);
        }
    });
    $("#toolbar-img-change").fileupload({
        url: attachmentAPI,
        dataType: 'json',
        maxFileSize: 50000000, // 50 MB
        done: function (e, response) {
            let result = response.result;
            if(parseInt(result.code) == 1) {
                var file = result.data;
                if(elementTarget != null) {
                    elementTarget.attr("src",file.url);
                    elementTarget.attr("data-name",file.name);
                    elementTarget.removeAttr("style");
                    elementTarget.removeAttr("width");
                }
            } else {
                handleAttachmentAPIError(result.code,result.msg);
            }
        },
        fail: function(e,data) {
            toastr.error(w_attachmentfailed);
            console.log(data.errorThrown);
        }
    });
    $(".ui-center").scroll(function() {
        if(toolbarTarget != null) {
            displayToolbar(toolbarTarget);
        }
    });
    // #endregion
    // #region ADD LINK
    let isModalRooted = !!$(this).parents(".ui.modal").length;
    $("#modal-add-link").modal({ allowMultiple: isModalRooted });
    if(isModalRooted) {
        if($("#modal-write").length) {
        }
    } 

    $(".tb-add-link").mousedown(function(e) {
        if($("#modal-write").length) {
            MailStateSD.get(); // SAVE STATE
        }
        elementSelection = window.getSelection();
        if(elementSelection.rangeCount > 0) {
            elementRange = elementSelection.getRangeAt(0).cloneRange();
            if($(elementRange.commonAncestorContainer).is($(".ui-message")) ||
                $(elementRange.commonAncestorContainer).parents(".ui-message").length) {
                switch(elementSelection.type) {
                    case "Range":
                        $("#add-link-text input").val(elementSelection.toString());
                        $("#add-link-text").addClass("disabled");
                        break;
                    case "Caret":
                        $("#add-link-text").removeClass("disabled");
                        $("#add-link-text input").val("");
                        break;
                }
            } else {
                e.stopImmediatePropagation();
                console.log("cursor should be in textarea");
            }
        }
    });
    $(".tb-add-link").click(function() {
        $("#add-link-url input").val("");
        $("#modal-add-link").modal("show");
    });
    $("#modal-add-link #add-link-type-web").checkbox({
        onChecked: function() {
            $("#add-link-url-field label").html("Link URL");
            $("#add-link-url > i.icon").addClass("world");
            $("#add-link-url > i.icon").removeClass("envelope");
            $("#add-link-url > i.icon").removeClass("file");
        }
    });
    $("#modal-add-link #add-link-type-email").checkbox({
        onChecked: function() {
            $("#add-link-url-field label").html("Email Address");
            $("#add-link-url > i.icon").removeClass("world");
            $("#add-link-url > i.icon").addClass("envelope");
            $("#add-link-url > i.icon").removeClass("file");
        }
    });
    $("#modal-add-link #add-link-type-document").checkbox({
        onChecked: function() {
            $("#add-link-url-field label").html("Document URL");
            $("#add-link-url > i.icon").removeClass("world");
            $("#add-link-url > i.icon").removeClass("envelope");
            $("#add-link-url > i.icon").addClass("file");
        }
    });
    $("#modal-add-link #add-link-type-document").hide();
    $("#modal-add-link #add-link-newtab").checkbox();
    $("#modal-add-link #add-link-save").click(function(e) {
        $("#modal-add-link .ui.form").removeClass("error");
        $("#modal-add-link #add-link-text-field").removeClass("error");
        $("#modal-add-link #add-link-url-field").removeClass("error");
        linkType = $("#modal-add-link #add-link-type input[type='radio']:checked").val();
        linkText = $("#modal-add-link #add-link-text input").val();
        linkURL = $("#modal-add-link #add-link-url input").val();
        if(linkText == "" || linkURL == "") {
            e.preventDefault();
            $("#modal-add-link .ui.form").addClass("error");
            if(linkText == "") { $("#modal-add-link #add-link-text-field").addClass("error"); }
            if(linkURL == "") { $("#modal-add-link #add-link-url-field").addClass("error"); }
            return false;
        }
        if(linkType == "Email") {
            linkURL = "mailto:" + linkURL;
        }
        linkTag = "<a href='" + linkURL + "'";
        if($("#modal-add-link #add-link-newtab").checkbox("is checked")) {
            linkTag += " target='_blank'";
        }
        linkTag += ">" + linkText + "</a>";
        elementSelection.removeAllRanges();
        elementSelection.addRange(elementRange);
        if($("#modal-adduser").length) {
            document.execCommand("insertHTML",false, linkTag);
            $("#modal-adduser").modal("show");
        } else if($("#modal-write").length) {     
            $("#modal-write").modal("show");   
            setTimeout(function() {
                MailStateSD.set(); // RESTORE STATE
                document.execCommand("createLink",false, linkURL); 
            },900);  
        }
    });
    // #endregion
    // #endregion
    // #region STYLES TAB
    $(".tb-bold").mousedown(function() {
        document.execCommand("bold",false,null);
    });
    $(".tb-italic").mousedown(function() {
        document.execCommand("italic",false,null);
    });
    $(".tb-underline").mousedown(function() {
        document.execCommand("underline",false,null);
    });
    $(".tb-justifyleft").mousedown(function() {
        document.execCommand("justifyLeft",false,null);
    });
    $(".tb-justifycenter").mousedown(function() {
        document.execCommand("justifyCenter",false,null);
    });
    $(".tb-justifyright").mousedown(function() {
        document.execCommand("justifyRight",false,null);
    });
    $(".tb-justifyfull").mousedown(function() {
        document.execCommand("justifyFull",false,null);
    });

    $(".tb-sizeup").on("mousedown", function(e) {
        let messageContainer = $(this).parents(".write-message").find(".ui-message");
        elementSelection = window.getSelection();
        if(elementSelection.type != "None") {
            elementRange = elementSelection.getRangeAt(0).cloneRange();
        }
        elementTarget = messageContainer;
        increasemsgTxtSize();
    });
    $(".tb-sizeup").click(function() {
        var newSize = msgTxtSize + "px";
        if(elementSelection != null && elementSelection.type != "None") {
            elementSelection.removeAllRanges();
            elementSelection.addRange(elementRange);
            switch(elementSelection.type) {
                case "Range":
                    modifyFragmentSize(newSize);
                    break;
                case "Caret":
                    elementTarget.css("fontSize",newSize);
                    break;
            }
        } else {
            elementTarget.css("fontSize",newSize);
        }
    });
    $(".tb-sizedown").on("mousedown", function(e) {
        elementSelection = window.getSelection();
        if(elementSelection.type != "None") {
            elementRange = elementSelection.getRangeAt(0).cloneRange();
        }
        let messageContainer = $(this).parents(".write-message").find(".ui-message");
        elementTarget = messageContainer;
        decreasemsgTextSize();
    });
    $(".tb-sizedown").click(function() {
        var newSize = msgTxtSize + "px";
        if(elementSelection != null && elementSelection.type != "None") {
            elementSelection.removeAllRanges();
            elementSelection.addRange(elementRange);
            switch(elementSelection.type) {
                case "Range":
                    modifyFragmentSize(newSize);
                    break;
                case "Caret":
                    elementTarget.css("fontSize",newSize);
                    break;
            }
        } else {
            elementTarget.css("fontSize",newSize);
        }
    });
    $(".tb-size").on("mousedown", function(e) {
        e.preventDefault();
        if($(this).dropdown("is hidden")) {
            elementSelection = window.getSelection();
            elementRange = elementSelection.getRangeAt(0).cloneRange();
            let messageContainer = $(this).parents(".write-message").find(".ui-message");
            elementTarget = messageContainer;
        }
    });
    $(".tb-size").dropdown({
        direction: "upward",
        onChange: function(value, text, choice) {
            msgTxtSize = value;
            setMsgPtr();
            var newSize = value + "px";
            if(elementSelection != null && elementSelection.type != "None") {
                elementSelection.removeAllRanges();
                elementSelection.addRange(elementRange);
                switch(elementSelection.type) {
                    case "Range":
                        modifyFragmentSize(newSize);
                        break;
                    case "Caret":
                        elementTarget.css("fontSize",newSize);
                        break;
                }
            } else {
                elementTarget.css("fontSize",newSize);
            }
        }
    });
    $(".tb-font").on("mousedown", function() {
        if($(this).dropdown("is hidden")) {
            elementSelection = window.getSelection();
            if(elementSelection && elementSelection.rangeCount > 0) {
                elementRange = elementSelection.getRangeAt(0).cloneRange();
            }
        }
    });
    $(".tb-font").dropdown({
        direction: "upward",
        onChange: function(value, text, choice) {
            if(elementSelection != null) {
                elementSelection.removeAllRanges();
                elementSelection.addRange(elementRange);
                switch(elementSelection.type) {
                    case "Range":
                        var newText = "<span style='font-family: " + value + "'";
                        newText += ">" + elementSelection.toString() + "</span>";
                        document.execCommand("insertHTML",false, newText);
                        break;
                    case "Caret":
                        if(elementTarget) {
                            elementTarget.css("fontFamily", value);
                        }
                        break;
                }
            }
        }
    });

    $(".tb-reset").click(function() {
        if(newContent != $(".modal-write-message").html()) {
            oldContent = $(".user-mail-signature").html();
            oldAttr = $(".user-mail-signature").attr("style");
            $(".user-mail-signature").removeAttr("style");
            $(".user-mail-signature").html($(".user-mail-signature").text());
            msgTxtSize = 14;
            msgTxtSizePtr = 5;
            newContent = $(".user-mail-signature").html();
        }
    });
    $(".tb-redo").click(function() {
        let parentContainer = $(this).parents(".write-message");
        let messageContainer = parentContainer.find(".ui-message");
        messageContainer.html(oldContent);
        messageContainer.attr("style",oldAttr);
    });
    // #endregion
    // #region COLORS TAB
    let colorParams = {
        color: "#000000",
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
        allowEmpty: false,
        palette: [
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
        document.execCommand("foreColor",false, color.toHexString());
    };
    colorParams.hide = function(color) {
        document.execCommand("foreColor",false, color.toHexString());
    };
    $(".tb-color input").spectrum(colorParams);
    colorParams.move = function(color) {
        document.execCommand("backColor",false, color.toHexString());
    };
    colorParams.hide = function(color) {
        document.execCommand("backColor",false, color.toHexString());
    };
    $(".tb-bgcolor input").spectrum(colorParams);
    // #endregion
    // #region TEMPLATES TAB
    $(".tb-template-open").click(function() {
        $("#modal-templates").modal("show");
    });
    $("#templateMenu .item").tab({
        onVisible: function() {
            $("#modal-templates").modal("refresh");
        }
    });
    $(".templateAll").trigger("click");
    $(".tb-template-save").click(function() {
        let isModalRooted = !!$(this).parents(".ui.modal").length;
        let parentContainer = $(this).parents(".write-message");
        let templateName = parentContainer.find(".tb-template-name input").val();
        let templateContent = parentContainer.find(".ui-message").html();
        // #region VALIDATE
        if(templateName == "") {
            toastr.error(w_mailtemplatenamerequired);
            return false;
        }
        if(templateContent == "") {
            toastr.error(w_mailtemplatecontentrequired);
            return false;
        }
        if(!isValidString(templateName,true,true)) {
            toastr.error(w_mailtemplatenameinvalid);
            return false;
        }
        // #endregion
        if(isModalRooted) {
            $(".tb-template-save").parents(".ui.modal").find(".dimmer.save-template").addClass("active");
        } else {
            $(".ui.main.page.dimmer").addClass("active");
        }
        var templateRequest = $.ajax({
            method: "POST",
            url: mailTemplateAPI,
            dataType: "json",
            data: {
                templateName,
                templateContent
            }
        });
        templateRequest.done(function(result, textStatus, jqXHR) {
            if(parseInt(result.success)) {
                newUUID = result.newUUID;                
                if(isModalRooted) {
                    $(".tb-template-save").parents(".ui.modal").find(".dimmer.save-template2").addClass("active");
                } else {
                    $(".ui.main.page.dimmer").addClass("active");
                }
                html2canvas(parentContainer.find(".ui-message").get(0)).then(function(canvas) {
                    var templateCapRequest = $.ajax({
                        method: "POST",
                        url: mailTemplateThumbAPI,
                        dataType: "json",
                        data: {
                            UUID: newUUID,
                            base64: canvas.toDataURL("image/png")
                        }
                    });
                    templateCapRequest.done(function(result, textStatus, jqXHR) {
                        if(parseInt(result.success)) {
                            templateLoad();
                        } else {
                            toastr.error(w_mailtemplatesaveerror);
                            console.log("Error saving template thumb");
                            console.log(result.errorMsg);
                        }
                    });
                    templateCapRequest.fail(function() {
                        toastr.error(w_mailtemplatesaveerror);
                        console.log("Failed to save POST payload in mailTemplateThumbAPI");
                    });
                    templateCapRequest.always(function() {
                        if(isModalRooted) {
                            $(".tb-template-save").parents(".ui.modal").find(".dimmer.save-template2").removeClass("active");
                        } else {
                            $(".ui.main.page.dimmer").removeClass("active");
                        }
                    });
                }, function(error) {
                    console.log(error);
                    if(isModalRooted) {
                        $(".tb-template-save").parents(".ui.modal").find(".dimmer.save-template2").removeClass("active");
                    } else {
                        $(".ui.main.page.dimmer").removeClass("active");
                    }
                });
            } else {
                toastr.error(w_mailtemplatesaveerror);
                console.log(result.errorMsg);
            }
        });
        templateRequest.fail(function(err) {
            console.log(err);
        });
        templateRequest.always(function() {
            if(isModalRooted) {
                $(".tb-template-save").parents(".ui.modal").find(".dimmer.save-template").removeClass("active");
            } else {
                $(".ui.main.page.dimmer").removeClass("active");
            }
        });
    });
    $(".tb-template-merge").on("focusin", function() {
        elementSelection = window.getSelection();
        if(elementSelection.rangeCount > 0) {
            elementRange = elementSelection.getRangeAt(0).cloneRange();
        }
    });
    $(".tb-template-merge").dropdown({
        direction: "upward",
        action: 'select',
        onChange: function(value,item) {
            if(elementSelection != null) {
                elementSelection.removeAllRanges();
                if(elementRange != null) {
                    elementSelection.addRange(elementRange);
                    switch(elementSelection.type) {
                        case "Range":
                            document.execCommand("insertHTML",false, value);
                            break;
                        case "Caret":
                            document.execCommand("insertHTML",false, value);
                            break;
                    }
                }
            }
        }
    });
    // #endregion
}
// #endregion