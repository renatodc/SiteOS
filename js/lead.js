// #region VARIABLES
let emailMatcher = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// #endregion
// #region DICTIONARY
let w_lead_contactemail_exists = "Contact Email already exists in CRM";
// #endregion
// #region LEAD METHODS
function deleteLeadAJAX() {
    $(".ui.main.page.dimmer").addClass("active");
    var deleteLeadRequest = $.ajax({
        method: "DELETE",
        url: leadAPI
    });
    deleteLeadRequest.done(function() {
        window.location.replace("/leads");
    });
    deleteLeadRequest.fail(handleAPIError);
    deleteLeadRequest.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
function updateLeadAJAX() {
    $(".ui.main.page.dimmer").addClass("active");
    var payload = {
        LeadName: pfData.LeadName,
        LeadStatus: pfData.LeadStatus,
        LeadNoteboard: pfData.LeadNoteboard,
        PrimaryContactID: pfData.PrimaryContactID
    };
    for(var i=0;i<20;i++) {
        payload["CF" + i] = pfData["CF" + i];
    }
    var updateRequest = $.ajax({
        method: "PUT",
        url: leadAPI,        
        dataType: "json",
        data: payload
    });
    updateRequest.done(function() {
        window.location.reload();
    });
    updateRequest.fail(handleAPIError);
    updateRequest.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
function updateLeadNoteboardAJAX() {
    pfData.LeadNoteboard = $(".lead-noteboard textarea").val();
    var updateLeadNoteboardRequest = $.ajax({
        method: "PUT",
        dataType: "json",
        url: leadAPI,
        data: {
            LeadNoteboard: pfData.LeadNoteboard
        }
    });
    updateLeadNoteboardRequest.done(function() {
    });
    updateLeadNoteboardRequest.fail(handleAPIError);
    updateLeadNoteboardRequest.always(function() {
    });
}
function updateLeadStatusAJAX(value, text) {
    pfData.LeadStatus = value;
    $(".lead-status .ui.dropdown .text").text(text);
    var updateLeadStatusRequest = $.ajax({
        method: "PUT",
        dataType: "json",
        url: leadAPI,
        data: {
            LeadStatus: pfData.LeadStatus
        }
    });
    updateLeadStatusRequest.done(function() {
    });
    updateLeadStatusRequest.fail(handleAPIError);
    updateLeadStatusRequest.always(function() {
    });
}
//-------------------------------------
function setLeadMetaData() {
    $("#title").text(pfData.LeadName);
    if(pfData.LeadCF) {
        $.each(pfData.LeadCF, function(k,v) {
            var fieldValue = pfData["CF" + v.ValuePos];
            if(fieldValue && $(".h-" + parseName(v.FieldName)).length == 0) {
                $(".lead-header").show();
                switch(v.FieldType) {
                    case "Input":
                    case "Textarea":
                    case "Email":
                    case "Phone":
                    case "Integer":
                    case "Decimal":
                    case "Dropdown":
                    case "Singlechoice":
                        $(".lead-header").append("<h4 class='h-" + parseName(v.FieldName) + "'><i class='icon " + v.FieldIcon + "'></i>" + (fieldValue ? fieldValue : v.FieldDefault ? v.FieldDefault : '') + "</h4>");
                        break;
                    case "Link":
                        var absoluteURL = getAbsoluteURL(fieldValue);
                        $(".lead-header").append("<h5 class='h-" + parseName(v.FieldName) + "'><a target='_blank' href='" + absoluteURL + "'><i class='icon " + v.FieldIcon + "'></i>" + fieldValue + "</a></h5>");
                        break;
                    case "Location":
                        var paramLocation = encodeURI(fieldValue);
                        $(".lead-header").append("<h3 class='h-" + parseName(v.FieldName) + "'><a target='_blank' href='http://www.google.com/maps/place/" + paramLocation + "'><i class='icon " + v.FieldIcon + "'></i>" + fieldValue + "</a></h3>");
                        break;
                    case "Date":
                        var sugarDT = Sugar.Date.create(fieldValue, { fromUTC: false });
                        var dtvalue = Sugar.Date.format(sugarDT, '%x');
                        $(".lead-header").append("<h4 class='h-" + parseName(v.FieldName) + "'><i class='icon " + v.FieldIcon + "'></i>" + dtvalue + "</h4>");
                        break;
                    case "DateTime":
                        var sugarDT = Sugar.Date.create(fieldValue, { fromUTC: false });
                        var dtvalue = Sugar.Date.format(sugarDT, '%c');
                        $(".lead-header").append("<h4 class='h-" + parseName(v.FieldName) + "'><i class='icon " + v.FieldIcon + "'></i>" + dtvalue + "</h4>");
                        break;
                    case "Time":
                        var sugarDT = Sugar.Date.create(fieldValue, { fromUTC: false });
                        var dtvalue = Sugar.Date.format(sugarDT, '%X');
                        $(".lead-header").append("<h4 class='h-" + parseName(v.FieldName) + "'><i class='icon " + v.FieldIcon + "'></i>" + dtvalue + "</h4>");
                        break;
                    case "Multichoice":
                        var optArray = fieldValue.split(",");
                        var optString = "";
                        for(var i=0;i<optArray.length;i++) {
                            optString += optArray[i];
                            if(i<optArray.length-1) {
                                optString += ", ";
                            }
                        }
                        var optDefault = v.FieldDefault.split(",");
                        var optStringDefault = "";
                        for(var i=0;i<optDefault.length;i++) {
                            optStringDefault += optDefault[i];
                            if(i<optDefault.length-1) {
                                optStringDefault += ", ";
                            }
                        }
                        $(".lead-header").append("<h4 class='h-" + parseName(v.FieldName) + "'><i class='icon " + v.FieldIcon + "'></i>" + (optString ? optString : optStringDefault ? optStringDefault : '') + "</h4>");
                        break;
                    case "Checkbox": 
                        break;
                    case "Progress":
                        $(".lead-header").append("<h4 class='h-" + parseName(v.FieldName) + "'><i class='icon " + v.FieldIcon + "'></i>" + (fieldValue ? fieldValue + "%" : v.FieldDefault ? v.FieldDefault + "%": '') + "</h4>");
                        break;
                    case "Rating":
                        var ratingVal = (fieldValue ? parseInt(fieldValue) : v.FieldDefault ? parseInt(v.FieldDefault) : 0);
                        var ratingString = "";
                        for(var i=0;i<ratingVal;i++) {
                            ratingString += "<i class='icon " + v.FieldPlaceholder.toLowerCase() + "'></i>";
                        }
                        $(".lead-header").append("<h4 class='h-" + parseName(v.FieldName) + "'>" + ratingString + "</h4>");
                        break;
                    default:
                        //cf += "<input type='text' name='detail-source' placeholder='' />";
                        break;
                }
            }
        });
    }
}
function setLeadUI() {
    setLeadMetaData();
    $("#logo").off("click");
    $("#logo").click(function() {
        $(".field-edit-btn").hide();
        $("#cf-add-field").hide();
        // AUTO TITLE
        if($("#modal-detail #detail-name input").val().trim() == "") {
            $("#modal-detail > .header").html("<i class='icon user'></i><span>Lead Details</span>");
        }
        $("#modal-detail").modal({ closable: false }).modal('show');
        if(pfData.LeadCF) {
            $.each(pfData.LeadCF, function(k,v) {
                var fvalue = pfData["CF" + v.ValuePos];
                switch(v.FieldType) {
                    case "Date":
                    case "DateTime":
                    case "Time":
                        if(!$("#modal-detail .field-" + parseName(v.FieldName)).hasClass("calendar")) {
                            $("#modal-detail .field-" + parseName(v.FieldName)).addClass("calendar");
                        }
                        if(!$("#modal-detail .field-" + parseName(v.FieldName)).hasClass("ui")) {
                            $("#modal-detail .field-" + parseName(v.FieldName)).addClass("ui");
                        }                     
                        var sugarDT = Sugar.Date.create("now", { fromUTC: false });
                        if(fvalue) {
                            sugarDT = Sugar.Date.create(fvalue, { fromUTC: false });
                        } else {
                            switch(v.FieldDefault) {
                                case "Based Off":
                                    sugarDT = Sugar.Date.addSeconds(sugarDT, v.FieldPlaceholder);
                                    break;
                                case "Static":
                                    sugarDT = Sugar.Date.create(v.FieldPlaceholder, { fromUTC: false });
                                    break;
                            }
                        }
                        var dtvalue = Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                        $("#modal-detail .field-" + parseName(v.FieldName) + " input").val(dtvalue); 
                        $("#modal-detail .field-" + parseName(v.FieldName)).calendar({ type: v.FieldType.toLowerCase(), today: true });    
                        break;
                    case "Dropdown":
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown();
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("set selected", (fvalue ? fvalue : v.FieldDefault ? v.FieldDefault : ""));
                        break;
                    case "Singlechoice":
                    case "Checkbox":
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.checkbox").checkbox();
                        break;
                    case "Multichoice":
                        if(v.HasDropdown == "1") {
                            var optSelected = fvalue.split(",");
                            var optDefault = v.FieldDefault.split(",");
                            $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown();
                            $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("set selected", (fvalue ? optSelected : v.FieldDefault ? optDefault : ""));
                        } else {
                            $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.checkbox").checkbox();
                        }
                        break;
                    case "Progress":
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.progress").progress();
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.progress").progress("set percent", (fvalue ? fvalue : v.FieldDefault ? v.FieldDefault : ""));
                        break;
                    case "Rating":
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.rating").rating();
                        break;
                }
            });
        }
        $("#modal-detail .ui.form").removeClass("error");
        $("#detail-name").removeClass("error");
        // $("#modal-detail").off("keyup");
        // $("#modal-detail").keyup(function(event) {
        //     if(event.which == 13) {
        //         $("#modal-detail-save").trigger("click");
        //     }
        // });
    });
    $(".lead-status .ui.dropdown").dropdown();
    $(".lead-status .ui.dropdown").dropdown("set selected", pfData.LeadStatus);
    $(".lead-status .ui.dropdown").dropdown({ onChange: updateLeadStatusAJAX });
    $(".lead-noteboard textarea").val(pfData.LeadNoteboard);
    $(".lead-noteboard textarea").keyup(updateLeadNoteboardAJAX);
    $(".lead-noteboard textarea").focusout(updateLeadNoteboardAJAX);
    $("#lead-noteboard-save").click(updateLeadNoteboardAJAX);
}
function setLeadModal() {
    // SET LEAD NAME
    $("#modal-detail input[name='detail-name']").val(pfData.LeadName);
    $("#modal-detail input[name='detail-location']").val(pfData.LeadLocation);
    $("#modal-detail input[name='detail-source']").val(pfData.LeadSource);
    // AUTO TITLE
    if(pfData.LeadName) {
        $("#modal-detail > .header").html("<i class='icon user'></i><span></span>");
        $("#modal-detail > .header span").text(pfData.LeadName + " - Lead Details");
    } else {
        $("#modal-detail > .header").html("<i class='icon user'></i><span>Lead Details</span>");
    }
    // PAINT CUSTOM FIELDS
    if(pfData.LeadCF) {
        $.each(pfData.LeadCF, function(k,v) {
            var fieldFrame = "<div class='field field-" + parseName(v.FieldName) + "' data-id='" + v.ID + "'>";

            fieldFrame += "<a href='#' class='field-edit-btn cancel'";
            fieldFrame += "><i class='icon cancel'></i></a>";
            fieldFrame += "<a href='#' class='field-edit-btn edit'";
            if($(".leadcf > .fields > .field").length % 2 == 0 && $(".leadcf > .fields > .field").length > 1) {   
                fieldFrame += " data-tooltip='Edit Field' data-inverted=''";
            }
            fieldFrame += "><i class='icon browser'></i></a>";

            fieldFrame += "<label>" + escapeHtml(v.FieldName.replace("_"," ")) + "</label>";
            fieldFrame += paintCF(v);
            fieldFrame += "</div>";
            if($(".leadcf > .fields > .field").length % 2 == 0) {
                var newRow = "<div class='two fields'>";
                newRow += fieldFrame;
                newRow += "</div>";
                $(".leadcf").append(newRow);
            } else {
                $(".leadcf > .fields:last-child").append(fieldFrame);
            }
            $(".field-" + parseName(v.FieldName) + " .cancel.field-edit-btn").click(function() {
                // $("#modal-field-delete-confirmation").modal('setting', { allowMultiple: true }).modal("show");
                $("#modal-field-delete-confirmation").modal("show");
                $("#modal-field-delete-confirmation-yes").off("click");
                $("#modal-field-delete-confirmation-yes").click(function() {
                    deleteCustomFieldAJAX(v.ID);
                });
                $("#modal-field-delete-confirmation-no").off("click");
                $("#modal-field-delete-confirmation-no").click(function() {
                    setTimeout(function() {
                        $("#modal-detail").modal({ allowMultiple: true, closable: false }).modal('show');
                    }, 750);
                });
                // $(".h-" + parseName(v.FieldName)).remove();
                // $(".field-" + parseName(v.FieldName)).remove();
            });
            $(".field-" + parseName(v.FieldName) + " .edit.field-edit-btn").click(function() {
                editFieldModal(v, false);
            });
            switch(v.FieldType) {
                case "Progress":
                    $(".field-" + parseName(v.FieldName) + " .ui.progress").progress("set total", 100);
                    $(".field-" + parseName(v.FieldName) + " .ui.icon.buttons > .increment").click(function() {
                        $(".field-" + parseName(v.FieldName) + " .ui.progress").progress("increment", (v.FieldMin ? parseInt(v.FieldMin) : 10));
                    });
                    $(".field-" + parseName(v.FieldName) + " .ui.icon.buttons > .decrement").click(function() {
                        $(".field-" + parseName(v.FieldName) + " .ui.progress").progress("decrement", (v.FieldMin ? parseInt(v.FieldMin) : 10));
                    });
                    break;
            }
        });
    }
    // AUTO TITLE
    $("#modal-detail input[name='detail-name']").keyup(function() {
        var nameValue = $("#modal-detail input[name='detail-name']").val();
        if(nameValue) {            
            $("#modal-detail > .header").html("<i class='icon user'></i><span></span>");
            $("#modal-detail > .header span").text(nameValue + " - Lead Details");
        } else {
            $("#modal-detail > .header").html("<i class='icon user'></i><span>Lead Details</span>");
        }
    });
    // HOOK BUTTONS
    $("#modal-detail-edit").click(function() {
        if($(".field-edit-btn").is(":visible")) {
            $(".field-edit-btn").hide();
            $("#cf-add-field").hide();
        } else {
            $(".field-edit-btn").show();
            $("#cf-add-field").show();
        }
    });
    $("#cf-add").click(function() {
        $("#modal-field #field-name input").val("");
        $("#modal-field #field-icon > .ui.dropdown > i").removeClass();
        $("#modal-field #field-icon > .ui.dropdown > i").addClass("icon browser");
        $("#modal-field #field-name > .ui.input > i").removeClass();
        $("#modal-field #field-name > .ui.input > i").addClass("icon browser");
        $("#fieldtype-phone").parents(".card").hide();
        $("#fieldtype-email").parents(".card").hide();
        $("#modal-field-save").off("click");
        $("#modal-field-save").click(function() {
            saveFieldModal(false, false);
        });
        // HELPER CALLS AND LAUNCH MODAL
        $(".field-edit-btn").hide();
        $("#cf-add-field").hide();
        $("#modal-field").css("zIndex","1002");
        $("#modal-field").modal({ closable: false }).modal('show');
    });
    $("#modal-detail-delete").click(deleteLeadAJAX);
    $("#modal-detail-save").click(function() {
        var passedValidation = true;
        // SAVE NAME FIELD
        pfData.LeadName = $("#modal-detail input[name='detail-name']").val();    
        pfData.LeadLocation = $("#modal-detail input[name='detail-location']").val();
        pfData.LeadSource = $("#modal-detail input[name='detail-source']").val();        
        // LEAD NAME VALIDATION
        if(pfData.LeadName == "") {
            $("#detail-name").addClass("error");
            passedValidation = false;
        } else {
            $("#detail-name").removeClass("error");
        }
        // SAVE CUSTOM FIELDS
        if(pfData.LeadCF) {
            $.each(pfData.LeadCF, function(k,v) {
                var fieldValue = "";
                switch(v.FieldType) {
                    case "Input":
                    case "Email":
                    case "Phone":
                    case "Link":
                    case "Location":
                    case "Integer":
                    case "Decimal":
                        fieldValue = $("#modal-detail input[name='detail-" + parseName(v.FieldName) + "']").val();
                        break;
                    case "Textarea":
                        fieldValue = $("#modal-detail textarea[name='detail-" + parseName(v.FieldName) + "']").val();
                        break;
                    case "Date":
                    case "DateTime":
                    case "Time":
                        var fieldDTValue = $("#modal-detail .field-" + parseName(v.FieldName) + " input").val(); 
                        var sugarDT;
                        if(fieldDTValue) {
                            sugarDT = Sugar.Date.create(fieldDTValue, { fromUTC: false });
                            fieldValue = Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                        } else {
                            if(v.IsRequired == "0") {
                                sugarDT = Sugar.Date.create("now", { fromUTC: false });
                                switch(v.FieldDefault) {
                                    case "Based Off":
                                        sugarDT = Sugar.Date.addSeconds(sugarDT, v.FieldPlaceholder);
                                        break;
                                    case "Static":
                                        sugarDT = Sugar.Date.create(v.FieldPlaceholder, { fromUTC: false });
                                        break;
                                }
                                fieldValue = Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                            }
                        }
                        break;
                    case "Dropdown":
                        fieldValue = $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("get value");
                        break;
                    case "Singlechoice":
                        var optArray = v.FieldSelections.split(",");
                        for(var i=0;i<optArray.length;i++) {
                            if($("#modal-detail .field-" + parseName(v.FieldName) + " #sc-" + parseName(v.FieldName) + "-" + parseName(optArray[i])).checkbox('is checked')) {
                                fieldValue = optArray[i];
                                i = optArray.length;
                            }
                        }
                        break;
                    case "Checkbox":
                        fieldValue = $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.checkbox").checkbox('is checked');
                        break;
                    case "Multichoice":
                        if(v.HasDropdown == "1") {
                            fieldValue = $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("get value");
                        } else {
                            var optArray = v.FieldSelections.split(",");
                            var optSelected = [];
                            for(var i=0;i<optArray.length;i++) {
                                if($("#modal-detail .field-" + parseName(v.FieldName) + " #mc-" + parseName(v.FieldName) + "-" + parseName(optArray[i])).checkbox('is checked')) {
                                    optSelected.push(optArray[i]);
                                }
                            }
                            fieldValue = optSelected.toString();
                        }
                        break;
                    case "Progress":
                        fieldValue = $(".field-" + parseName(v.FieldName) + " .ui.progress").progress("get percent");
                        break;
                    case "Rating":
                        fieldValue = $(".field-" + parseName(v.FieldName) + " .ui.rating").rating("get rating");
                        break;
                }
                if($("#modal-detail .field-" + parseName(v.FieldName)).hasClass("error")) {
                    $("#modal-detail .field-" + parseName(v.FieldName)).removeClass("error");
                }
                if(v.IsRequired == "1" && !fieldValue) {
                    passedValidation = false;
                    $("#modal-detail .field-" + parseName(v.FieldName)).addClass("error");
                }
                if(v.IsRequired == "1" && v.FieldType == "Integer") {
                    if((v.FieldMin && (parseInt(fieldValue) < parseInt(v.FieldMin))) ||
                       (v.FieldMax && (parseInt(fieldValue) > parseInt(v.FieldMax)))) {
                        passedValidation = false;
                        $("#modal-detail .field-" + parseName(v.FieldName)).addClass("error");
                    }
                }
                if(v.IsRequired == "1" && v.FieldType == "Decimal") {
                    if((v.FieldMin && (parseFloat(fieldValue) < parseFloat(v.FieldMin))) ||
                       (v.FieldMax && (parseFloat(fieldValue) > parseFloat(v.FieldMax)))) {
                        passedValidation = false;
                        $("#modal-detail .field-" + parseName(v.FieldName)).addClass("error");
                    }
                }
                pfData["CF" + v.ValuePos] = fieldValue;
            });
        }

        if(passedValidation) { 
            $("#modal-detail .ui.form").removeClass("error");
        } else {
            $("#modal-detail .ui.form").addClass("error");
            return false;
        }

        setLeadMetaData();
        $("#modal-detail").off("keyup");
        updateLeadAJAX();
    });
}
function setLeadDetails() {
    setLeadUI();
    setLeadModal();
    setCustomFieldModal();
}
//#endregion 
// #region CLEARBIT METHODS
function ClearBitEnrichmentAJAX() {
    $("#modal-add-contact .ui.form").addClass("loading");
    var ClearBitEnrichmentRequest = $.ajax({
        method: "GET",
        url: clearBitAPI + "/" + clearBitEmail,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(mainCustomer.ClearBitKey + ":" + ""));
        }
    });
    ClearBitEnrichmentRequest.done(function(CBResult, textStatus, xhr) {
        console.log(CBResult); // FULL CLEARBIT RESPONSE
        if(xhr.status == 200) {
            $("#modal-add-contact input[name='contact-name']").val(CBResult.name.fullName);
            $("#modal-add-contact input[name='contact-title']").val(CBResult.employment.title);
            $("#modal-add-contact input[name='contact-website']").val(CBResult.site);
            $("#modal-add-contact input[name='contact-location']").val(CBResult.location);
            $("#modal-add-contact input[name='contact-avatar']").val(CBResult.avatar);
            $("#modal-add-contact input[name='contact-bio']").val(CBResult.bio); //printProperties(CBResult)
            $("#modal-add-contact input[name='contact-facebook']").val(CBResult.facebook.handle);
            $("#modal-add-contact input[name='contact-linkedin']").val(CBResult.linkedin.handle);
            $("#modal-add-contact input[name='contact-twitter']").val(CBResult.twitter.handle); 
        } else if(xhr.status == 202) {
            $("#modal-add-contact .ui.form .info").show();
        } else {
            $("#modal-add-contact .ui.form").addClass("warning");
            console.log(xhr.status); // CLEARBIT RESPONSE CODE
        }
    });
    ClearBitEnrichmentRequest.fail(function(xhr, textStatus, errorThrown) {
        $("#modal-add-contact .ui.form").removeClass("loading");
        $("#modal-add-contact .ui.form").addClass("warning");
        console.log(xhr.status); // CLEARBIT RESPONSE CODE
        console.log("Error Thrown: " + errorThrown); // CLEARBIT RESPONSE CODE
    });
    ClearBitEnrichmentRequest.always(function() {
        $("#modal-add-contact .ui.form").removeClass("loading");
    });
}
function AutoPopulateContact() {
    let clearBitEmail = $("#modal-add-contact input[name='contact-email']").val();
    if(isValidEmail(clearBitEmail)) {
        $("#modal-add-contact .ui.form").removeClass("error");
        $("#modal-add-contact-email").removeClass("error");
        $("#modal-add-contact .ui.form").removeClass("warning");
        $("#modal-add-contact .ui.form .info").hide();
        ClearBitEnrichmentAJAX(clearBitEmail);
    } else {
        $("#modal-add-contact .ui.form").addClass("error");
        $("#modal-add-contact-email").addClass("error");
    }
}
function printProperties(object1) {
    var transcript = "";
    for (var property1 in object1) {
        switch(typeof(object1[property1])) {
            case "string":
                if(object1[property1]) {
                    transcript = transcript + property1 + ": " + object1[property1] + "<br />";
                }
                break;
            case "object":
                transcript = transcript + printProperties(object1[property1]);
                break;
            default:
                //transcript = transcript + object1[property1] + "<br />";
                break;
        }
    }
    return transcript;
}
//#endregion 
// #region LEAD CONTACT METHODS
function appendPill() {
    var newPill = paintPill();
    $(".lead-contacts ul").append(newPill);
    $(".lead-contacts li .actions a").popup();
}
function paintPill() {
    var newPill = "<li id='pfContact" + pfContact.ID + "' data-id='" + pfContact.ID +"'>";
    newPill += "<a href='#' class='star " + (pfData.PrimaryContactID == pfContact.ID ? "primary" : "") + "'><i class='icon star'></i></a>";
    if(pfContact.ContactAvatar) {
        newPill += "<div class='avatar'><a href='" + pfContact.ContactAvatar + "' target='_blank'><img src='" + pfContact.ContactAvatar + "' /></a></div>";
    }
    newPill += "<div class='actions'>";
    if(pfContact.ContactPhone) {
        var phoneString = pfContact.ContactPhone.replace(/\D/g,'');
        if(mainCustomer.ConfigUsePhone) {
            newPill += "<a class='w_call' data-phone='" + phoneString + "' href='#' onclick='phoneCall(" + phoneString + "," + pfContact.ID + ")'" +  " data-content='Call: ";
        } else {
            newPill += "<a class='w_call' data-phone='" + phoneString + "' href='tel:" + phoneString + "'" +  " data-content='*Call: ";
        }
        newPill += phoneString + "' data-position='bottom center'><i class='icon phone'></i></a>";
    } else {
        newPill += "<a href='#' class='disabled'><i class='icon phone'></i></a>";
    }
    if(pfContact.ContactEmail) {
        var emailMatch = pfContact.ContactEmail.match(emailMatcher);
        var emailString = (emailMatch && (emailMatch.length > 0)) ? emailMatch[0] : "";
        newPill += "<a class='w_email' data-email='" + emailString + "' href='#' onclick='sendEmail(\"" + emailString + "\")'" + " data-content='Email: ";
        newPill += emailString + "' data-position='bottom center'><i class='icon envelope'></i></a>";
    } else {
        newPill += "<a href='#' class='disabled'><i class='icon envelope'></i></a>";
    }
    if(phoneString) {
        if(mainCustomer.ConfigUseSMS && mainCustomer.CompanyPhone) {
            newPill += "<a href='#' onclick='phoneSMS(" + phoneString + ")'" + " data-content='SMS: ";
        } else {
            newPill += "<a href='sms:" + phoneString + "'" + " data-content='*SMS: ";
        }
        newPill += phoneString + "' data-position='bottom center'><i class='icon comment'></i></a>";
    } else {
        newPill += "<a href='#' class='disabled'><i class='icon comment'></i></a>";
    }
    
    if(pfData.LeadContactCF) {
        $.each(pfData.LeadContactCF, function(k,v) {
            var fvalue = pfContact["CF" + v.ValuePos];
            if(v.IsPillAction == "1" && fvalue) {
                switch(v.FieldType) {
                    case "Email":
                        if(mainCustomer.CompanyEmail) {
                            newPill += "<a class='w_email' data-email='" + fvalue + "' href='#' onclick='sendEmail(\"" + fvalue + "\")'" + " data-content='Email: ";
                        } else {
                            newPill += "<a class='w_email' data-email='" + fvalue + "' href='mailto:" + fvalue + "'" + " data-content='*Email: ";
                        }
                        newPill += fvalue + "' data-position='bottom center'><i class='icon envelope'></i></a>";
                        break;
                    case "Phone":
                        var phoneString = fvalue.replace(/\D/g,'');
                        if(mainCustomer.ConfigUsePhone) {
                            newPill += "<a class='w_call' data-phone='" + fvalue + "' href='#' onclick='phoneCall(" + phoneString + "," + pfContact.ID + ")'" +  " data-content='Call: ";
                        } else {
                            newPill += "<a class='w_call' data-phone='" + fvalue + "' href='tel:" + phoneString + "'" +  " data-content='*Call: ";
                        }
                        newPill += fvalue + "' data-position='bottom center'><i class='icon " + v.FieldIcon + "'></i></a>";
                        if(phoneString) {
                            if(mainCustomer.ConfigUseSMS) {
                                newPill += "<a href='#' onclick='phoneSMS(" + phoneString + ")'" + " data-content='SMS: ";
                            } else {
                                newPill += "<a href='sms:" + phoneString + "'" + " data-content='*SMS: ";
                            }
                            newPill += fvalue + "' data-position='bottom center'><i class='icon " + v.FieldIcon + "'></i></a>";
                        }
                        break;
                    case "Link":
                        var websiteURL = getAbsoluteURL(fvalue);
                        newPill += "<a target='_blank' href='" + websiteURL + "'";
                        newPill += " data-content='" + fvalue + "' data-position='bottom center'><i class='icon " + v.FieldIcon + "'></i></a>";
                        break;
                }
            }
        });
    }

    newPill += "</div>";
    newPill += "<div class='names'>";
    newPill += "<a href='#'>";
    if(pfContact.ContactTitle) {
        // newPill += "<h1>" + (pfContact.ContactName ? pfContact.ContactName : '') + "<i class='icon pencil'></i></h1>";
        newPill += "<h1>" + (pfContact.ContactName ? escapeHtml(pfContact.ContactName) : '') + "</h1>";
        newPill += "<p>" + (pfContact.ContactTitle ? escapeHtml(pfContact.ContactTitle) : '') + "</p>";
    } else {
        // newPill += "<h2>" + (pfContact.ContactName ? pfContact.ContactName : '') + "<i class='icon pencil'></i></h2>";
        newPill += "<h2>" + (pfContact.ContactName ? escapeHtml(pfContact.ContactName) : '') + "</h2>";
    }
    newPill += "</a>";
    newPill += "</div>";
    newPill += "</li>";
    return newPill;
}
function setPillStarClick() {
    $("#pfContact" + pfContact.ID + " > .star").off("click");
    $("#pfContact" + pfContact.ID + " > .star").click(function() {
        var dataID = $(this).parents("li").attr("data-id");
        $.each(pfData.Contacts, function(k,v) { if(v.ID == dataID) { pfContact = v; } });
        $(".lead-contacts li > .star").removeClass("primary");
        $(this).addClass("primary");
        pfData.PrimaryContactID = pfContact.ID;
        updatePCLeadAJAX();
    });
}
function setPillNameClick() {
    $("#pfContact" + pfContact.ID + " .names a").off("click");
    $("#pfContact" + pfContact.ID + " .names a").click(function() {
        $(this).blur();
        var dataID = $(this).parents("li").attr("data-id");
        $.each(pfData.Contacts, function(k,v) { if(v.ID == dataID) { pfContact = v; } });
        setPillEditing();
    });
}
function setPillLinkStates() {
    $(".lead-contacts li .names a").off("hover");
    $(".lead-contacts li .names a").hover(function() {
        // $(this).find("h1 i").show();
        // $(this).find("h2 i").show();
    }, function() {
        // $(this).find("h1 i").hide();
        // $(this).find("h2 i").hide();
    });
}
function setPillEditing() {
    // DISPLAY CONTACT MODAL UI
    $("#modal-add-contact .ui.form").removeClass("error");
    $("#modal-add-contact-email").removeClass("error");
    $("#modal-add-contact .ui.form").removeClass("warning");
    $("#modal-add-contact .ui.form .info").hide();
    $("#modal-add-contact-delete").show();
    $("#modal-add-contact").modal({ closable: false }).modal('show');
    if(pfContact.ContactName) {
        $("#modal-add-contact > .header").html("<i class='icon user'></i><span></span>");
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                $("#modal-add-contact > .header span").text(pfContact.ContactName + " - Detalles del Contacto");
                break;
            default:
                $("#modal-add-contact > .header span").text(pfContact.ContactName + " - Contact Details");
                break;
        }
    } else {
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                $("#modal-add-contact > .header").html("<i class='icon user'></i><span>Detalles del Contacto</span>");
                break;
            default:
                $("#modal-add-contact > .header").html("<i class='icon user'></i><span>Contact Details</span>");
                break;
        }
    }

    // SET CONTACT INPUT FIELDS
    $("#modal-add-contact input[name='contact-name']").val(pfContact.ContactName);
    $("#modal-add-contact input[name='contact-title']").val(pfContact.ContactTitle);
    $("#modal-add-contact input[name='contact-avatar']").val(pfContact.ContactAvatar);
    $("#modal-add-contact input[name='contact-phone']").val(pfContact.ContactPhone);
    $("#modal-add-contact input[name='contact-email']").val(pfContact.ContactEmail);
    $("#modal-add-contact input[name='contact-location']").val(pfContact.ContactLocation);
    
    // TEST: SET CF values and sc, ch, mc
    activateLeadContactCustomFields();
    if(pfData.LeadContactCF) {
        $.each(pfData.LeadContactCF, function(k,v) {
            var fvalue = pfContact["CF" + v.ValuePos];
            switch(v.FieldType) {
                case "Input":
                case "Email":
                case "Phone":
                case "Link":
                case "Location":
                case "Integer":
                case "Decimal":
                    $("#modal-add-contact input[name='detail-" + parseName(v.FieldName) + "']").val(fvalue);
                    break;
                case "Textarea":
                    $("#modal-add-contact textarea[name='detail-" + parseName(v.FieldName) + "']").val(fvalue);
                    break;
                case "Date":
                case "DateTime":
                case "Time":
                    if(!$("#modal-add-contact .field-" + parseName(v.FieldName)).hasClass("calendar")) {
                        $("#modal-add-contact .field-" + parseName(v.FieldName)).addClass("calendar");
                    }
                    if(!$("#modal-add-contact .field-" + parseName(v.FieldName)).hasClass("ui")) {
                        $("#modal-add-contact .field-" + parseName(v.FieldName)).addClass("ui");
                    }                     
                    var sugarDT = Sugar.Date.create("now", { fromUTC: false });
                    if(fvalue) {
                        sugarDT = Sugar.Date.create(fvalue, { fromUTC: false });
                    } else {
                        switch(v.FieldDefault) {
                            case "Based Off":
                                sugarDT = Sugar.Date.addSeconds(sugarDT, v.FieldPlaceholder);
                                break;
                            case "Static":
                                sugarDT = Sugar.Date.create(v.FieldPlaceholder, { fromUTC: false });
                                break;
                        }
                    }
                    var dtvalue = Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " input").val(dtvalue); 
                    $("#modal-add-contact .field-" + parseName(v.FieldName)).calendar({ type: v.FieldType.toLowerCase(), today: true });    
                    break;
                case "Dropdown":
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown();
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("set selected", (fvalue ? fvalue : v.FieldDefault ? v.FieldDefault : ""));
                    break;
                case "Singlechoice":
                    var optArray = v.FieldSelections.split(",");
                    for(var i=0;i<optArray.length;i++) {
                        if(fvalue = optArray[i]) {
                            $("#modal-add-contact .field-" + parseName(v.FieldName) + " #sc-" + parseName(v.FieldName) + "-" + parseName(optArray[i])).checkbox('check');
                            i = optArray.length;
                        }
                    }
                    break;
                case "Checkbox":
                    if(fvalue == "true") {
                        $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.checkbox").checkbox('check');
                    }
                    break;
                case "Multichoice":
                    if(v.HasDropdown == "1") {
                        $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown();
                        $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("set selected", (fvalue ? fvalue : v.FieldDefault ? v.FieldDefault : ""));
                    } else {
                        var optArray = v.FieldSelections.split(",");
                        for(var i=0;i<optArray.length;i++) {
                            if(fvalue = optArray[i]) {
                                $("#modal-add-contact .field-" + parseName(v.FieldName) + " #sc-" + parseName(v.FieldName) + "-" + parseName(optArray[i])).checkbox('check');
                            }
                        }
                    }
                    break;
                case "Progress":
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.progress").progress("set percent", fvalue);
                    break;
                case "Rating":
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.rating").rating("set rating", fvalue);
                    break;
            }
        });
    }

    // UPDATE CONTACT ON SAVE
    $("#modal-add-contact-save").off("click");
    $("#modal-add-contact-save").click(function() {
        // #region VALIDATION
        var passedValidation = true;
        pfContact.ContactName = $("#modal-add-contact input[name='contact-name']").val();
        pfContact.ContactTitle = $("#modal-add-contact input[name='contact-title']").val();
        pfContact.ContactAvatar = $("#modal-add-contact input[name='contact-avatar']").val();
        pfContact.ContactPhone = $("#modal-add-contact input[name='contact-phone']").val();
        pfContact.ContactEmail = $("#modal-add-contact input[name='contact-email']").val();
        pfContact.ContactLocation = $("#modal-add-contact input[name='contact-location']").val();
        pfContact.ClearBit = 0;
        // TEST: SAVE CF values
        if(pfData.LeadContactCF) {
            $.each(pfData.LeadContactCF, function(k,v) {
                var fieldValue = "";
                switch(v.FieldType) {
                    case "Input":
                    case "Email":
                    case "Phone":
                    case "Link":
                    case "Location":
                    case "Integer":
                    case "Decimal":
                        fieldValue = $("#modal-add-contact input[name='detail-" + parseName(v.FieldName) + "']").val();
                        break;
                    case "Textarea":
                        fieldValue = $("#modal-add-contact textarea[name='detail-" + parseName(v.FieldName) + "']").val();
                        break;
                    case "Date":
                    case "DateTime":
                    case "Time":
                        var fieldDTValue = $("#modal-add-contact .field-" + parseName(v.FieldName) + " input").val(); 
                        var sugarDT;
                        if(fieldDTValue) {
                            sugarDT = Sugar.Date.create(fieldDTValue, { fromUTC: false });
                            fieldValue = Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                        } else {
                            if(v.IsRequired == "0") {
                                sugarDT = Sugar.Date.create("now", { fromUTC: false });
                                switch(v.FieldDefault) {
                                    case "Based Off":
                                        sugarDT = Sugar.Date.addSeconds(sugarDT, v.FieldPlaceholder);
                                        break;
                                    case "Static":
                                        sugarDT = Sugar.Date.create(v.FieldPlaceholder, { fromUTC: false });
                                        break;
                                }
                                fieldValue = Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                            }
                        }
                        break;
                    case "Dropdown":
                        fieldValue = $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("get value");
                        break;
                    case "Singlechoice":
                        var optArray = v.FieldSelections.split(",");
                        for(var i=0;i<optArray.length;i++) {
                            if($("#modal-add-contact .field-" + parseName(v.FieldName) + " #sc-" + parseName(v.FieldName) + "-" + parseName(optArray[i])).checkbox('is checked')) {
                                fieldValue = optArray[i];
                                i = optArray.length;
                            }
                        }
                        break;
                    case "Checkbox":
                        fieldValue = $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.checkbox").checkbox('is checked');
                        break;
                    case "Multichoice":
                        if(v.HasDropdown == "1") {
                            fieldValue = $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("get value");
                        } else {
                            var optArray = v.FieldSelections.split(",");
                            var optSelected = [];
                            for(var i=0;i<optArray.length;i++) {
                                if($("#modal-add-contact .field-" + parseName(v.FieldName) + " #mc-" + parseName(v.FieldName) + "-" + parseName(optArray[i])).checkbox('is checked')) {
                                    optSelected.push(optArray[i]);
                                }
                            }
                            fieldValue = optSelected.toString();
                        }
                        break;
                    case "Progress":
                        fieldValue = $(".field-" + parseName(v.FieldName) + " .ui.progress").progress("get percent");
                        break;
                    case "Rating":
                        fieldValue = $(".field-" + parseName(v.FieldName) + " .ui.rating").rating("get rating");
                        break;
                }
                if($("#modal-add-contact .field-" + parseName(v.FieldName)).hasClass("error")) {
                    $("#modal-add-contact .field-" + parseName(v.FieldName)).removeClass("error");
                }
                if(v.IsRequired == "1" && !fieldValue) {
                    passedValidation = false;
                    $("#modal-add-contact .field-" + parseName(v.FieldName)).addClass("error");
                }
                if(v.IsRequired == "1" && v.FieldType == "Integer") {
                    if((v.FieldMin && (parseInt(fieldValue) < parseInt(v.FieldMin))) ||
                       (v.FieldMax && (parseInt(fieldValue) > parseInt(v.FieldMax)))) {
                        passedValidation = false;
                        $("#modal-add-contact .field-" + parseName(v.FieldName)).addClass("error");
                    }
                }
                if(v.IsRequired == "1" && v.FieldType == "Decimal") {
                    if((v.FieldMin && (parseFloat(fieldValue) < parseFloat(v.FieldMin))) ||
                       (v.FieldMax && (parseFloat(fieldValue) > parseFloat(v.FieldMax)))) {
                        passedValidation = false;
                        $("#modal-add-contact .field-" + parseName(v.FieldName)).addClass("error");
                    }
                }
                pfContact["CF" + v.ValuePos] = fieldValue;
            });
        }
        if(!pfContact.ContactName) {
            passedValidation = false;
        }
        if(passedValidation) {
            $("#modal-add-contact .ui.form").removeClass("error");
        } else {
            $("#modal-add-contact .ui.form").addClass("error");
            return false;
        }
        // #endregion

        // #region UPDATE LEAD CONTACT
        $(".ui.main.page.dimmer").addClass("active");
        var payload = {
            ContactName: pfContact.ContactName,
            ContactTitle: pfContact.ContactTitle,
            ContactAvatar: pfContact.ContactAvatar,
            ContactPhone: pfContact.ContactPhone,
            ContactEmail: pfContact.ContactEmail,
            ContactLocation: pfContact.ContactLocation,
            ClearBit: pfContact.ClearBit
        };
        for(var i=0;i<20;i++) {
            payload["CF" + i] = pfContact["CF" + i];
        }
        let req = $.ajax({
            method: "PUT",
            dataType: "json",
            url: leadcontactAPI + "/" + pfContact.ID,
            data: payload
        });
        req.done(function(res) {
            switch(parseInt(res.code)) {
                case 1:
                    $("#modal-add-contact").modal("hide");
                    // #region UPDATE SOFT DB
                    $.each(pfData.Contacts, function(k,v) {
                        if(v.ID == pfContact.ID) {
                            v.ContactName = pfContact.ContactName;
                            v.ContactPhone = pfContact.ContactPhone;
                            v.ContactEmail = pfContact.ContactEmail;
                            v.ContactAvatar = pfContact.ContactAvatar;
                            v.ContactTitle = pfContact.ContactTitle;
                            v.ClearBit = pfContact.ClearBit;
                            if(pfData.LeadContactCF) {
                                $.each(pfData.LeadContactCF, function(cfck,cfcv) {
                                    v["CF" + cfcv.ValuePos] = pfContact["CF" + cfcv.ValuePos];
                                });
                            }
                        }
                    });
                    // #endregion
                    // #region UPDATE Pill
                    var pillIndex = $("#pfContact" + pfContact.ID).index();
                    $("#pfContact" + pfContact.ID).remove();
                    var newPill = paintPill();
                    if(pillIndex > 0) {
                        $(".lead-contacts ul li").eq(pillIndex - 1).after(newPill);
                    } else {
                        $(".lead-contacts ul").prepend(newPill);
                    }
                    // #endregion
                    // #region UPDATE/REATTACH Pill events
                    $(".lead-contacts li .actions a").popup();
                    setPillLinkStates();
                    setPillNameClick();
                    setPillStarClick();
                    clean_pfContact();
                    translatePills();
                    // #endregion
                    break;
                case 2:
                    toastr.error(w_lead_contactemail_exists);
                    break;
                case 0:
                default:
                    toastr.error(w_server_error_h);
                    console.log(res.msg);
                    return;
            }
        });
        req.fail(handleAPIError);
        req.always(function() {
            $(".ui.main.page.dimmer").removeClass("active");
        });
        // #endregion
    });
}
//#endregion 
// #region ADD LEAD CONTACT METHODS
function deleteContactAJAX() {
    $(".ui.main.page.dimmer").addClass("active");
    let req = $.ajax({
        method: "DELETE",
        dataType: "json",
        url: leadcontactAPI + "/" + pfContact.ID
    });
    req.done(function(res) {
        baseProcess(res, function() {
            // DELETE from Local Storage (pfData.Contact)
            var cIndex = 0;
            $.each(pfData.Contacts, function(k,v) { if(v.ID == pfContact.ID) { cIndex = k; } });
            pfData.Contacts.splice(cIndex,1);
            // DELETE Pill
            $("#pfContact" + pfContact.ID).remove();
            // SET No Pills
            if(parseInt(pfData.Contacts.length)) {
                $(".lead-contacts > .head-bar h3 counter").html(`${pfData.Contacts.length}`);
            } else {
                $(".lead-contacts > .head-bar h3 counter").html("");
                $(".lead-contacts .no-contacts").show();
            }
            // PC: DELETE/SET in Local Storage
            if(pfData.PrimaryContactID == pfContact.ID) {
                if(pfData.Contacts.length > 0) {
                    pfData.PrimaryContactID = pfData.Contacts[0].ID;
                    // PC: REPAINT STAR
                    $(".lead-contacts li > .star").removeClass("primary");
                    $("#pfContact" + pfData.PrimaryContactID + " > .star").addClass("primary");
                } else {
                    pfData.PrimaryContactID = null;
                }
                // PC: DELETE/SET in Database
                updatePCLeadAJAX();
            }
        });
    });
    req.fail(handleAPIError);
    req.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
function updatePCLeadAJAX() {
    $(".ui.main.page.dimmer").addClass("active");
    let req = $.ajax({
        method: "PUT",
        dataType: "json",
        url: leadAPI,
        data: { PrimaryContactID: pfData.PrimaryContactID }
    });
    req.done(function() {
        clean_pfContact();
    });
    req.fail(handleAPIError);
    req.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
function insertContactAJAX() {
    // #region VALIDATION
    var passedValidation = true;
    pfContact.LeadID = pfData.ID;
    pfContact.ContactName = $("#modal-add-contact input[name='contact-name']").val();
    pfContact.ContactTitle = $("#modal-add-contact input[name='contact-title']").val();
    pfContact.ContactAvatar = $("#modal-add-contact input[name='contact-avatar']").val();
    pfContact.ContactPhone = $("#modal-add-contact input[name='contact-phone']").val();
    pfContact.ContactEmail = $("#modal-add-contact input[name='contact-email']").val();
    pfContact.ContactLocation = $("#modal-add-contact input[name='contact-location']").val();
    pfContact.ClearBit = 0;
    // TEST: SET CF values
    if(pfData.LeadContactCF) {
        $.each(pfData.LeadContactCF, function(k,v) {
            var fieldValue = "";
            switch(v.FieldType) {
                case "Input":
                case "Email":
                case "Phone":
                case "Link":
                case "Location":
                case "Integer":
                case "Decimal":
                    fieldValue = $("#modal-add-contact input[name='detail-" + parseName(v.FieldName) + "']").val();
                    break;
                case "Textarea":
                    fieldValue = $("#modal-add-contact textarea[name='detail-" + parseName(v.FieldName) + "']").val();
                    break;
                case "Date":
                case "DateTime":
                case "Time":
                    var fieldDTValue = $("#modal-add-contact .field-" + parseName(v.FieldName) + " input").val(); 
                    var sugarDT;
                    if(fieldDTValue) {
                        sugarDT = Sugar.Date.create(fieldDTValue, { fromUTC: false });
                        fieldValue = Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                    } else {
                        if(v.IsRequired == "0") {
                            sugarDT = Sugar.Date.create("now", { fromUTC: false });
                            switch(v.FieldDefault) {
                                case "Based Off":
                                    sugarDT = Sugar.Date.addSeconds(sugarDT, v.FieldPlaceholder);
                                    break;
                                case "Static":
                                    sugarDT = Sugar.Date.create(v.FieldPlaceholder, { fromUTC: false });
                                    break;
                            }
                            fieldValue = Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                        }
                    }
                    break;
                case "Dropdown":
                    fieldValue = $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("get value");
                    break;
                case "Singlechoice":
                    var optArray = v.FieldSelections.split(",");
                    for(var i=0;i<optArray.length;i++) {
                        if($("#modal-add-contact .field-" + parseName(v.FieldName) + " #sc-" + parseName(v.FieldName) + "-" + parseName(optArray[i])).checkbox('is checked')) {
                            fieldValue = optArray[i];
                            i = optArray.length;
                        }
                    }
                    break;
                case "Checkbox":
                    fieldValue = $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.checkbox").checkbox('is checked');
                    break;
                case "Multichoice":
                    if(v.HasDropdown == "1") {
                        fieldValue = $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("get value");
                    } else {
                        var optArray = v.FieldSelections.split(",");
                        var optSelected = [];
                        for(var i=0;i<optArray.length;i++) {
                            if($("#modal-add-contact .field-" + parseName(v.FieldName) + " #mc-" + parseName(v.FieldName) + "-" + parseName(optArray[i])).checkbox('is checked')) {
                                optSelected.push(optArray[i]);
                            }
                        }
                        fieldValue = optSelected.toString();
                    }
                    break;
                case "Progress":
                    fieldValue = $(".field-" + parseName(v.FieldName) + " .ui.progress").progress("get percent");
                    break;
                case "Rating":
                    fieldValue = $(".field-" + parseName(v.FieldName) + " .ui.rating").rating("get rating");
                    break;
            }
            if($("#modal-add-contact .field-" + parseName(v.FieldName)).hasClass("error")) {
                $("#modal-add-contact .field-" + parseName(v.FieldName)).removeClass("error");
            }
            if(v.IsRequired == "1" && !fieldValue) {
                passedValidation = false;
                $("#modal-add-contact .field-" + parseName(v.FieldName)).addClass("error");
            }
            if(v.IsRequired == "1" && v.FieldType == "Integer") {
                if((v.FieldMin && (parseInt(fieldValue) < parseInt(v.FieldMin))) ||
                   (v.FieldMax && (parseInt(fieldValue) > parseInt(v.FieldMax)))) {
                    passedValidation = false;
                    $("#modal-add-contact .field-" + parseName(v.FieldName)).addClass("error");
                }
            }
            if(v.IsRequired == "1" && v.FieldType == "Decimal") {
                if((v.FieldMin && (parseFloat(fieldValue) < parseFloat(v.FieldMin))) ||
                   (v.FieldMax && (parseFloat(fieldValue) > parseFloat(v.FieldMax)))) {
                    passedValidation = false;
                    $("#modal-add-contact .field-" + parseName(v.FieldName)).addClass("error");
                }
            }
            pfContact["CF" + v.ValuePos] = fieldValue;
        });
    }
    if(!pfContact.ContactName) {
        passedValidation = false;
    }
    if(passedValidation) {
        $("#modal-add-contact .ui.form").removeClass("error");
    } else {
        $("#modal-add-contact .ui.form").addClass("error");
        return false;
    }
    // #endregion
    $(".ui.main.page.dimmer").addClass("active");
    let req = $.ajax({
        method: "POST",
        url: leadcontactAPI,
        dataType: "json",
        data: pfContact
    });
    req.done(function(res) {
        switch(parseInt(res.code)) {
            case 1:
                $("#modal-add-contact").modal("hide");
                pfContact.ID = res.newID;
                pfData.Contacts.push(pfContact);
                if(pfData.Contacts.length == 1) {
                    pfData.PrimaryContactID = pfContact.ID;
                    updateFirstPCLeadAJAX();
                } else {
                    // ADD Pill
                    $(".lead-contacts > .head-bar h3 counter").html(`(${pfData.Contacts.length})`);
                    $(".lead-contacts .no-contacts").hide();
                    appendPill();
                    setPillLinkStates();
                    setPillNameClick();
                    setPillStarClick();
                    clean_pfContact();
                    translatePills();
                }
                break;
            case 2:
                toastr.error(w_lead_contactemail_exists);
                return false;
            case 0:
            default:
                toastr.error(w_server_error_h);
                console.log(res.msg);
                return false;
        }
    });
    req.fail(handleAPIError);
    req.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
function updateFirstPCLeadAJAX() {
    $(".ui.main.page.dimmer").addClass("active");
    var updateFirstPCLeadRequest = $.ajax({
        method: "PUT",
        url: leadAPI,
        dataType: "json",
        data: { PrimaryContactID: pfData.PrimaryContactID }
    });
    updateFirstPCLeadRequest.done(function() {
        $(".lead-contacts .no-contacts").hide();
        appendPill();
        setPillLinkStates();
        setPillNameClick();
        setPillStarClick();
        clean_pfContact();
        translatePills();
    });
    updateFirstPCLeadRequest.fail(handleAPIError);
    updateFirstPCLeadRequest.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
//-------------------------------------
function addLeadContactCustomField() {
    $("#modal-field #field-name input").val("");
    $("#modal-field #field-icon > .ui.dropdown > i").removeClass();
    $("#modal-field #field-icon > .ui.dropdown > i").addClass("icon browser");
    $("#modal-field #field-name > .ui.input > i").removeClass();
    $("#modal-field #field-name > .ui.input > i").addClass("icon browser");
    $("#fieldtype-phone").parents(".card").show();
    $("#fieldtype-email").parents(".card").show();
    $("#modal-field-save").off("click");
    $("#modal-field-save").click(function() {
        saveFieldModal(false, true);
    });
    // HELPER CALLS AND LAUNCH MODAL
    $(".field-edit-btn").hide();
    $("#cfc-add-field").hide();
    $("#modal-field").css("zIndex","1002");
    $("#modal-field").modal({ closable: false }).modal('show');
}
function activateLeadContactCustomFields() {
    if(pfData.LeadContactCF) {
        $.each(pfData.LeadContactCF, function(k,v) {
            var fvalue = pfContact["CF" + v.ValuePos];
            switch(v.FieldType) {
                case "Date":
                case "DateTime":
                case "Time":
                    if(!$("#modal-add-contact .field-" + parseName(v.FieldName)).hasClass("calendar")) {
                        $("#modal-add-contact .field-" + parseName(v.FieldName)).addClass("calendar");
                    }
                    if(!$("#modal-add-contact .field-" + parseName(v.FieldName)).hasClass("ui")) {
                        $("#modal-add-contact .field-" + parseName(v.FieldName)).addClass("ui");
                    }                     
                    var sugarDT = Sugar.Date.create("now", { fromUTC: false });
                    if(fvalue) {
                        sugarDT = Sugar.Date.create(fvalue, { fromUTC: false });
                    } else {
                        switch(v.FieldDefault) {
                            case "Based Off":
                                sugarDT = Sugar.Date.addSeconds(sugarDT, v.FieldPlaceholder);
                                break;
                            case "Static":
                                sugarDT = Sugar.Date.create(v.FieldPlaceholder, { fromUTC: false });
                                break;
                        }
                    }
                    var dtvalue = Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " input").val(dtvalue); 
                    $("#modal-add-contact .field-" + parseName(v.FieldName)).calendar({ type: v.FieldType.toLowerCase(), today: true });    
                    break;
                case "Dropdown":
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown();
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("set selected", (fvalue ? fvalue : v.FieldDefault ? v.FieldDefault : ""));
                    break;
                case "Singlechoice":
                case "Checkbox":
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.checkbox").checkbox();
                    break;
                case "Multichoice":
                    if(v.HasDropdown == "1") {
                        var optSelected = fvalue.split(",");
                        var optDefault = v.FieldDefault.split(",");
                        $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown();
                        $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("set selected", (fvalue ? optSelected : v.FieldDefault ? optDefault : ""));
                    } else {
                        $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.checkbox").checkbox();
                    }
                    break;
                case "Progress":
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.progress").progress();
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.progress").progress("set percent", (fvalue ? fvalue : v.FieldDefault ? v.FieldDefault : ""));
                    break;
                case "Rating":
                    $("#modal-add-contact .field-" + parseName(v.FieldName) + " .ui.rating").rating();
                    break;
            }
        });
    }
}
function setContactDetails() {
    $("#modal-add-contact-auto").popup();
    $("#modal-add-contact-auto").hover(function() {
        $("#modal-add-contact-email input").css("borderColor","var(--color-primary)");
        $("#modal-add-contact-email input").css("backgroundColor","var(--color-input-highlight-bg)");
    }, function() {
        $("#modal-add-contact-email input").css("borderColor","");
        $("#modal-add-contact-email input").css("backgroundColor","");
    });
    $("#modal-add-contact-auto").click(AutoPopulateContact);
    $("#modal-add-contact-delete").click(deleteContactAJAX);
    $("#modal-add-contact-edit").click(function() {
        if($(".field-edit-btn").is(":visible")) {
            $(".field-edit-btn").hide();
            $("#cfc-add-field").hide();
        } else {
            $(".field-edit-btn").show();
            $("#cfc-add-field").show();
        }
    });
    
    // AUTO TITLE
    $("#modal-add-contact input[name='contact-name']").keyup(function() {
        var nameValue = $("#modal-add-contact input[name='contact-name']").val();
        if(nameValue) {
            $("#modal-add-contact > .header").html("<i class='icon user'></i><span></span>");
            switch(mainCustomer.CustomerLanguage) {
                case "es":
                    $("#modal-add-contact > .header span").text(nameValue + " - Detalles del Contacto");
                    break;
                default:
                    $("#modal-add-contact > .header span").text(nameValue + " - Contact Details");
                    break;
            }
        }
    });
    
    // TEST: PAINT LEAD CONTACT CFS in contact modal.
    if(pfData.LeadContactCF) {
        $.each(pfData.LeadContactCF, function(k,v) {
            var fieldFrame = "<div class='field field-" + parseName(v.FieldName) + "' data-id='" + v.ID + "'>";            
            fieldFrame += "<a href='#' class='field-edit-btn cancel'";
            fieldFrame += "><i class='icon cancel'></i></a>";
            fieldFrame += "<a href='#' class='field-edit-btn edit'";    
            fieldFrame += " data-tooltip='Edit Field' data-inverted=''";
            fieldFrame += "><i class='icon browser'></i></a>";
            fieldFrame += "<label>" + escapeHtml(v.FieldName.replace("_"," ")) + "</label>";
            fieldFrame += paintCF(v, true);
            fieldFrame += "</div>";
            if($("#modal-add-contact .fields:last > .field").length % 3 == 0) {
                var newRow = "<div class='three fields'></div>";
                $("#modal-add-contact .ui.form .ui.error.message").before(newRow);
                $("#modal-add-contact .fields:last").append(fieldFrame);
            } else {
                $("#modal-add-contact .fields:last > .field:last-child").after(fieldFrame);
            } 
            $(".field-" + parseName(v.FieldName) + " .cancel.field-edit-btn").click(function() {
                $("#modal-field-delete-confirmation").modal("show");
                $("#modal-field-delete-confirmation-yes").off("click");
                $("#modal-field-delete-confirmation-yes").click(function() {
                    deleteCustomFieldAJAX(v.ID, true);
                });
                $("#modal-field-delete-confirmation-no").off("click");
                $("#modal-field-delete-confirmation-no").click(function() {
                    setTimeout(function() {
                        $("#modal-add-contact").modal({ allowMultiple: true, closable: false }).modal('show');
                    }, 750);
                });
                // $(".h-" + parseName(v.FieldName)).remove();
                // $(".field-" + parseName(v.FieldName)).remove();
            });
            $(".field-" + parseName(v.FieldName) + " .edit.field-edit-btn").click(function() {
                editFieldModal(v, true);                
            });
            switch(v.FieldType) {
                case "Progress":
                    $(".field-" + parseName(v.FieldName) + " .ui.progress").progress("set total", 100);
                    $(".field-" + parseName(v.FieldName) + " .ui.icon.buttons > .increment").click(function() {
                        $(".field-" + parseName(v.FieldName) + " .ui.progress").progress("increment", (v.FieldMin ? parseInt(v.FieldMin) : 10));
                    });
                    $(".field-" + parseName(v.FieldName) + " .ui.icon.buttons > .decrement").click(function() {
                        $(".field-" + parseName(v.FieldName) + " .ui.progress").progress("decrement", (v.FieldMin ? parseInt(v.FieldMin) : 10));
                    });
                    break;
            }
        });
    }    
    var addFieldBtn = "<div class='field' id='cfc-add-field'>";
    addFieldBtn += "<a href='#' class='btn'>";
    addFieldBtn += "<i class='icon add'></i><span>Add Field</span>";
    addFieldBtn += "</a>";
    addFieldBtn += "</div>";
    if($("#modal-add-contact .fields:last > .field").length % 3 == 0) {
        var newRow = "<div class='three fields'></div>";
        $("#modal-add-contact .ui.form .ui.error.message").before(newRow);
        $("#modal-add-contact .fields:last").append(addFieldBtn);
    } else {
        $("#modal-add-contact .fields:last > .field:last-child").after(addFieldBtn);
    } 
    $("#cfc-add-field > .btn").click(addLeadContactCustomField);

    $("#lead-add-contact").click(function() {
        clean_pfContact();
        $(this).blur();

        // DISPLAY CONTACT MODAL UI
        $("#modal-add-contact .ui.form").removeClass("error");
        $("#modal-add-contact-email").removeClass("error");
        $("#modal-add-contact .ui.form").removeClass("warning");
        $("#modal-add-contact .ui.form .info").hide();
        $("#modal-add-contact-delete").hide();
        $("#modal-add-contact").modal({ closable: false }).modal('show');

        // CLEAR ALL CONTACT INPUT FIELDS
        $("#modal-add-contact input").val("");
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                $("#modal-add-contact > .header").html("<i class='icon user'></i><span>Detalles del Contacto</span>"); 
                break;
            default:
                $("#modal-add-contact > .header").html("<i class='icon user'></i><span>Contact Details</span>"); 
                break;
        }
        activateLeadContactCustomFields();

        // CREATE CONTACT ON SAVE
        $("#modal-add-contact-save").off("click");
        $("#modal-add-contact-save").click(insertContactAJAX);
    });

    // PAINT PILLS
    if(pfData.Contacts.length == 0) {
        $(".lead-contacts .no-contacts").show();
    }
    else {
        $(".lead-contacts .no-contacts").hide();
        $(".lead-contacts > .head-bar h3 counter").append(`(${pfData.Contacts.length})`);
        $.each(pfData.Contacts, function(k,v) {
            pfContact = v;
            appendPill();
            setPillNameClick();
            setPillStarClick();
            clean_pfContact();
        });
        setPillLinkStates();
    }
}
//#endregion 
// #region ACTION LOG METHODS
function insertActionAJAX() {
    $(".ui.main.page.dimmer").addClass("active");
//    console.log(pfAction);
    var insertActionRequest = $.ajax({
        method: "POST",
        url: leadactionAPI,
        dataType: "json",
        data: {
            LeadID: pfData.ID,
            ActionType: pfAction.ActionType,
            ActionStatus: pfAction.ActionStatus,
            ActionLink: pfAction.ActionLink,
            ActionData: pfAction.ActionData,
            ActionPrice: pfAction.ActionPrice,
            ActionFrom: pfAction.ActionFrom,
            ActionTo: pfAction.ActionTo,
            ActionStartDT: pfAction.ActionStartDT,
            ActionEndDT: pfAction.ActionEndDT
        }
    });
    insertActionRequest.done(function(response) {
        pfAction.ID = response.newID;
        pfData.Actions.push(pfAction);
        appendAction();
        setActionEditClick();
        setActionDeleteClick();
        $("#pfAction" + pfAction.ID + " .icon-col").popup();
        clean_pfAction();
        translateActionLog();
        if(pfData.Actions.length == 1) {
            $(".lead-actionlog table").show();
            $(".lead-actionlog .no-actions").hide();
        }
        $(".lead-actionlog > .head-bar counter").html(`(${pfData.Actions.length})`);
    });
    insertActionRequest.fail(handleAPIError);
    insertActionRequest.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
function updateActionAJAX() {
    $(".ui.main.page.dimmer").addClass("active");
    var updateActionRequest = $.ajax({
        method: "PUT",
        url: leadactionAPI + "/" + pfAction.ID,
        dataType: "json",
        data: {
            LeadID: pfData.ID,
            ActionType: pfAction.ActionType,
            ActionStatus: pfAction.ActionStatus,
            ActionLink: pfAction.ActionLink,
            ActionData: pfAction.ActionData,
            // ActionPrice: pfAction.ActionPrice,
            ActionFrom: pfAction.ActionFrom,
            ActionTo: pfAction.ActionTo,
            // ActionStartDT: pfAction.ActionStartDT,
            // ActionEndDT: pfAction.ActionEndDT
        }
    });
    updateActionRequest.done(function(response) {
//        console.log(response);
    });
    updateActionRequest.fail(handleAPIError);
    updateActionRequest.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
function deleteActionAJAX() {
    $(".ui.main.page.dimmer").addClass("active");
    var deleteActionRequest = $.ajax({
        method: "DELETE",
        url: leadactionAPI + "/" + pfAction.ID,
        dataType: "json"
    });
    deleteActionRequest.done(function(response) {
        var cIndex = 0;
        $.each(pfData.Actions, function(k,v) { if(v.ID == pfAction.ID) { cIndex = k; } });
        pfData.Actions.splice(cIndex,1);
        $("#pfAction" + pfAction.ID).remove();
        $(".lead-actionlog table").trigger("update");
        if(pfData.Actions.length == 0) {
            $(".lead-actionlog table").hide();
            $(".lead-actionlog .no-actions").show();
            $(".lead-actionlog > .head-bar counter").html("");
        } else {
            $(".lead-actionlog > .head-bar counter").html(`(${pfData.Actions.length})`);
        }
    });
    deleteActionRequest.fail(handleAPIError);
    deleteActionRequest.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
//-------------------------------------
function appendAction() {
    var newAction = paintAction();
    $(".lead-actionlog table tbody").prepend(newAction);
    $(".lead-actionlog table").trigger("update");
}
function paintAction() {
    var newAction = "<tr id='pfAction" + pfAction.ID + "' data-id='" + pfAction.ID + "' class='action-row ";
    switch(pfAction.ActionType) {
        case "Note":
            newAction += "action-note' data-type='Note'>";
            newAction += "<td class='icon-col' data-content='Note' data-position='right center' title='Note'>";
            newAction += "<i class='icon sticky note outline'></i>";
            newAction += "</td>";
            newAction += "<td class='desc-col'>";
            newAction += "<a href='#'>";
            newAction += "<div class='action-item'>";
            if(pfAction.ActionStatus) {
                newAction += "<div class='action-title'>" + escapeHtml(pfAction.ActionStatus) + "</div>";
            }
            newAction += "<div class='action-data'>" + getHTML(escapeHtml(pfAction.ActionData)) + "</div>";
            if(pfAction.ActionLink != null) {
                try {
                    if(pfAction.ActionLink.length) {
                        pfAction.ActionLink = JSON.parse(pfAction.ActionLink);
                    } else {
                        pfAction.ActionLink = "";
                    }
                } catch(err) {
                    pfAction.ActionLink = "";
                }
            }
            if(pfAction.ActionLink != null && pfAction.ActionLink.length) {
                attachCount = 0;            
                $.each(pfAction.ActionLink, function(k,v) {
                    var attachPiece = "<div class='action-attach'>";
                    attachPiece += "<i class='icon attach'></i>";
                    //attachPiece += "<a target='_blank' class='name' href='" + v.url + "'>" + v.name + "</a>";
                    attachPiece += "<span class='name'>" + v.name + "</span>";
                    attachPiece += "</div>";
                    var iconTarget = $("#pfAction" + pfAction.ID + " .action-attach").eq(attachCount).find("i.attach");
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
                            iconTarget.replaceWith("<i class='icon big code'></i>");
                            break;
                        case "application/sql":
                        case "application/csv":
                            iconTarget.replaceWith("<i class='icon big database'></i>");
                            break;
                        case "application/zip":
                        case "application/rar":
                            iconTarget.replaceWith("<i class='icon big archive'></i>");
                            break;
                        default:
                            break;
                    }
                    newAction += attachPiece;
                    attachCount++;
                });
            }
            newAction += "</div>";
            newAction += "</a>";
            newAction += "</td>";
            newAction += "<td class='time-col'>";
            if(isValidDate(pfAction.ActionStartDT)) {
                newAction += getCustomerFormatDate(pfAction.ActionStartDT);
            }
            newAction += "</td>";
            newAction += "<td class='user-col'>";
            if(pfAction.ActionFrom) {
                newAction += escapeHtml(pfAction.ActionFrom);
            }
            newAction += "</td>";
            newAction += "<td class='edit-col'><a href='#'><i class='icon pencil'></i></a></td>";
            newAction += "<td class='delete-col'><a href='#'><i class='icon trash'></i></a></td>";
            break;
        case "Outgoing Call":
            newAction += "action-oc' data-type='Call Outgoing'>";
            var tooltipContent = pfAction.ActionType + " - " + pfAction.ActionStatus;
            newAction += "<td class='icon-col' data-content='" + tooltipContent + "' data-position='right center' title='" + tooltipContent + "'>";
            newAction += "<i class='icons'><i class='icon phone'></i>";
            if(pfAction.ActionStatus == "Answered") {
                newAction += "<i class='icon check corner-tr'></i>";
            } else if(pfAction.ActionStatus == "Not Answered") {
                newAction += "<i class='icon cancel corner-tr'></i>";
            }
            newAction += "</i>";
            newAction += "<i class='icon arrow right'></i>";
            newAction += "</td>";
            newAction += "<td class='desc-col'>";
            newAction += "<div class='action-item'>";
            newAction += "<span class='action-title w_to'>To: </span>";
            newAction += "<span class='action-data'>" + escapeHtml(pfAction.ActionTo) + "</span>";
            newAction += "</div>";
            if(isValidDate(pfAction.ActionStartDT) && isValidDate(pfAction.ActionEndDT)) {
                var sugarStartDT = getJSDate(pfAction.ActionStartDT);
                var sugarEndDT = getJSDate(pfAction.ActionEndDT);
                var sugarSeconds = Sugar.Date.secondsUntil(sugarStartDT,sugarEndDT);
                newAction += "<div class='action-item'>";
                newAction += "<span class='action-title w_duration'>Duration: </span>";
                newAction += "<span class='action-data'>";
                var mInt = callDurationPad(parseInt(sugarSeconds/60));
                var sInt = callDurationPad(sugarSeconds%60);
                newAction += mInt + ":" + sInt;
                newAction += "</span>";
                newAction += "</div>";
            }
            if(pfAction.ActionLink) {
                newAction += "<div class='action-item'>";
                newAction += "<span class='action-title w_recording'>Recording: </span>";
                newAction += "<a class='action-data recording' target='_blank' href='" + pfAction.ActionLink + "'><i class='icon play'></i></a>";
                newAction += "</div>";
            }
            if(pfAction.ActionData) {
                newAction += "<div class='action-block'>";
                newAction += "<span class='action-title w_transcription'>Transcription: </span>";
                newAction += "<span class='action-data'>" + getHTML(escapeHtml(pfAction.ActionData)) + "</span>";
                newAction += "</div>";
            }
            newAction += "</td>";
            newAction += "<td class='time-col'>" + getCustomerFormatDate(pfAction.ActionStartDT) + "</td>";
            newAction += "<td class='user-col'>" + escapeHtml(pfAction.ActionFrom) + "</td>";
//            newAction += "<td class='edit-col'></td>";
            newAction += "<td class='edit-col'><a href='#'><i class='icon setting'></i></a></td>";
            newAction += "<td class='delete-col'><a href='#'><i class='icon trash'></i></a></td>";
            break;
        case "Incoming Call":
            newAction += "action-ic' data-type='Call Incoming'>";
            var tooltipContent = pfAction.ActionType + " - " + pfAction.ActionStatus;
            newAction += "<td class='icon-col' data-content='" + tooltipContent + "' data-position='right center' title='" + tooltipContent + "'>";
            newAction += "<i class='icons'><i class='icon phone'></i>";
            if(pfAction.ActionStatus == "Answered") {
                newAction += "<i class='icon check corner-tr'></i>";
            } else if(pfAction.ActionStatus == "Not Answered") {
                newAction += "<i class='icon cancel corner-tr'></i>";
            }
            newAction += "</i>";
            newAction += "<i class='icon arrow left'></i>";
            newAction += "</td>";
            newAction += "<td class='desc-col'>";
            newAction += "<div class='action-item'>";
            newAction += "<span class='action-title w_from'>From: </span>";
            newAction += "<span class='action-data'>" + escapeHtml(pfAction.ActionFrom) + "</span>";
            newAction += "</div>";
            if(isValidDate(pfAction.ActionStartDT) && isValidDate(pfAction.ActionEndDT)) {
                var sugarStartDT = getJSDate(pfAction.ActionStartDT);
                var sugarEndDT = getJSDate(pfAction.ActionEndDT);
                var sugarSeconds = Sugar.Date.secondsUntil(sugarStartDT,sugarEndDT);
                newAction += "<div class='action-item'>";
                newAction += "<span class='action-title w_duration'>Duration: </span>";
                newAction += "<span class='action-data'>";
                var mInt = callDurationPad(parseInt(sugarSeconds/60));
                var sInt = callDurationPad(sugarSeconds%60);
                newAction += mInt + ":" + sInt;
                newAction += "</span>";
                newAction += "</div>";
            }
            if(pfAction.ActionLink) {
                newAction += "<div class='action-item'>";
                newAction += "<span class='action-title w_recording'>Recording: </span>";
                newAction += "<a class='action-data recording' target='_blank' href='" + pfAction.ActionLink + "'><i class='icon play'></i></a>";
                newAction += "</div>";
            }
            if(pfAction.ActionData) {
                newAction += "<div class='action-block'>";
                newAction += "<span class='action-title w_transcription'>Transcription: </span>";
                newAction += "<span class='action-data'>" + getHTML(escapeHtml(pfAction.ActionData)) + "</span>";
                newAction += "</div>";
            }
            newAction += "</td>";
            newAction += "<td class='time-col'>" + getCustomerFormatDate(pfAction.ActionStartDT) + "</td>";
            newAction += "<td class='user-col'>" + escapeHtml(pfAction.ActionTo) + "</td>";
            newAction += "<td class='edit-col'></td>";
            newAction += "<td class='delete-col'><a href='#'><i class='icon trash'></i></a></td>";
            break;
        case "Outgoing Email":
            newAction += "action-oe' data-type='Email Outgoing'>";
            var tooltipContent = pfAction.ActionType;
            if(pfAction.ActionStatus == "Opened") {
                tooltipContent += " - Opened";
            }
            newAction += "<td class='icon-col' data-content='" + tooltipContent + "' data-position='right center' title='" + tooltipContent + "'>";
            newAction += "<i class='icons'><i class='icon envelope'></i>";
            if(pfAction.ActionStatus == "Opened") {
                newAction += "<i class='icon check corner-tr'></i>";
            }
            newAction += "</i>";
            newAction += "<i class='icon arrow right'></i>";
            newAction += "</td>";
            newAction += "<td class='mail-col'>";
            newAction += "<a href='#'>";

            newAction += "<div class='action-item'>";
            newAction += "<span class='action-title mail-way w_to'>To: </span>";
            newAction += "<span class='action-data mail-target'>" + escapeHtml(pfAction.ActionTo) + "</span>";
            newAction += "</div>";

            if(pfAction.ActionData) {
                newAction += "<div class='action-block'>";
                newAction += "<span class='action-title w_message'>Message: </span>";
                newAction += "<span class='action-data mail-content'>" + getHTML(escapeHtml(pfAction.ActionData)) + "</span>";
                newAction += "</div>";
            }
            newAction += "</a>";
            newAction += "</td>";

            newAction += "<td class='time-col'>" + getCustomerFormatDate(pfAction.ActionStartDT) + "</td>";
            newAction += "<td class='user-col'>" + escapeHtml(pfAction.ActionFrom) + "</td>";
            newAction += "<td class='edit-col'></td>";
            newAction += "<td class='delete-col'><a href='#'><i class='icon trash'></i></a></td>";
            break;
        case "Incoming Email":
            newAction += "action-ie' data-type='Email Incoming'>";
            var tooltipContent = pfAction.ActionType;
            if(pfAction.ActionStatus == "Opened") {
                tooltipContent += " - Opened";
            }
            newAction += "<td class='icon-col' data-content='" + tooltipContent + "' data-position='right center' title='" + tooltipContent + "'>";
            if(pfAction.ActionStatus == "Opened") {
                newAction += "<i class='icons'><i class='icon inbox'></i><i class='icon check corner-tr'></i></i>";
            } else {
                newAction += "<i class='icon inbox'></i>";
            }
            newAction += "<i class='icon arrow left'></i>";
            newAction += "</td>";
            newAction += "<td class='mail-col'>";
            newAction += "<a href='#'>";

            newAction += "<div class='action-item'>";   
            newAction += "<span class='action-title mail-way w_from'>From: </span>";
            newAction += "<span class='action-data mail-target'>" + escapeHtml(pfAction.ActionFrom) + "</span>";
            newAction += "</div>";

            if(pfAction.ActionData) {
                newAction += "<div class='action-block'>";
                newAction += "<span class='action-title w_message'>Message: </span>";
                newAction += "<span class='action-data mail-content'>" + getHTML(escapeHtml(pfAction.ActionData)) + "</span>";
                newAction += "</div>";
            }

            newAction += "</a>";
            newAction += "</td>";
            newAction += "<td class='time-col'>" + getCustomerFormatDate(pfAction.ActionStartDT) + "</td>";
            newAction += "<td class='user-col'>" + escapeHtml(pfAction.ActionTo) + "</td>";
            newAction += "<td class='edit-col'></td>";
            newAction += "<td class='delete-col'><a href='#'><i class='icon trash'></i></a></td>";
            break;
        case "Task":
            newAction += "action-task' data-type='Task'>";
            var tooltipContent = pfAction.ActionStatus + " " + pfAction.ActionType;
            newAction += "<td class='icon-col' data-content='" + tooltipContent + "' data-position='right center' title='" + tooltipContent + "'>";
            if(pfAction.ActionStatus == "Open") {
                newAction += "<i class='icon clipboard check'></i>";
            } else if(pfAction.ActionStatus == "Finished") {
                newAction += "<i class='icon checkmark' style='color: #14ae33'></i>";
            }
            newAction += "</td>";
            newAction += "<td class='desc-col'>";
            newAction += "<div class='action-item'>";
            newAction += "<span class='action-data'>" + getHTML(escapeHtml(pfAction.ActionData)) + "</span>";
            newAction += "</div>";
            if(isValidDate(pfAction.ActionEndDT)) {
                newAction += "<div class='action-item'>";  
                newAction += "<span class='action-title w_duedate'>Due Date: </span>";
                newAction += "<span class='action-data'>" + getCustomerFormatDate(pfAction.ActionEndDT); + "</span>";
                newAction += "</div>";
            }

            newAction += "</td>";
            newAction += "<td class='time-col'>" + getCustomerFormatDate(pfAction.ActionStartDT) + "</td>";
            newAction += "<td class='user-col'>";
            if(pfAction.ActionTo) {
                newAction += escapeHtml(pfAction.ActionTo);
            }
            newAction += "</td>";
            newAction += "<td class='edit-col'><a href='#'><i class='icon setting'></i></a></td>";
            newAction += "<td class='delete-col'><a href='#'><i class='icon trash'></i></a></td>";
            break;
        case "Successful Sale":
        case "Active Opportunity":
        case "Lost Opportunity":
            newAction += "action-sale' data-type='Sale'>";
            var tooltipContent = pfAction.ActionType;
            newAction += "<td class='icon-col' data-content='" + tooltipContent + "' data-position='right center' title='" + tooltipContent + "'>";
            newAction += "<i class='icons'>";

            if(pfAction.ActionType == "Successful Sale") {
                newAction += "<i class='icon dollar' style='color: #14ae33'></i>";
            } else if(pfAction.ActionType == "Active Opportunity") {
                newAction += "<i class='icon trophy'></i>";
            } else if(pfAction.ActionType == "Lost Opportunity") {
                newAction += "<i class='icon trophy'></i><i class='icon cancel corner'></i>";
            }

            newAction += "</i>";
            newAction += "</td>";
            newAction += "<td class='desc-col'>";

            newAction += "<div class='action-item'>";
            newAction += "<span class='action-data'>" + getHTML(escapeHtml(pfAction.ActionData)) + "</span>";
            newAction += "</div>";

            newAction += "<div class='action-item'>";
            newAction += "<span class='action-title' style='color: #14ae33; margin-right:2px;'>$</span>";
            newAction += "<span class='action-data'>" + getPrice(pfAction.ActionPrice) + " " + "<span class='action-status'>" + escapeHtml(pfAction.ActionStatus) + "</span>" + "</span>";
            newAction += "</div>";

            newAction += "</td>";
            newAction += "<td class='time-col'>" + getCustomerFormatDate(pfAction.ActionStartDT) + "</td>";
            newAction += "<td class='user-col'>";
            if(pfAction.ActionFrom) {
                newAction += escapeHtml(pfAction.ActionFrom);
            }
            newAction += "</td>";
            newAction += "<td class='edit-col'><a href='#'><i class='icon setting'></i></a></td>";
            newAction += "<td class='delete-col'><a href='#'><i class='icon trash'></i></a></td>";
            break;
    }
    newAction += "</tr>";
    return newAction;
}
function setActionEditClick() {
    $("#pfAction" + pfAction.ID + " .edit-col a").off("click");
    $("#pfAction" + pfAction.ID + " .edit-col a").click(function() {
        $(this).blur();
        clean_pfAction();
        var dataID = $(this).parents("tr").attr("data-id");
        $.each(pfData.Actions, function(k,v) { if(v.ID == dataID) { pfAction = v; } });
        switch(pfAction.ActionType) {
            case "Outgoing Call":
                var newIcon = "<i class='icons'><i class='icon phone'></i>";
                if(pfAction.ActionStatus == "Answered") {
                    newIcon += "<i class='icon cancel corner-tr'></i>";
                    pfAction.ActionStatus = "Not Answered";
                } else if(pfAction.ActionStatus == "Not Answered") {
                    newIcon += "<i class='icon check corner-tr'></i>";
                    pfAction.ActionStatus = "Answered";
                }
                newIcon += "</i>";
                newIcon += "<i class='icon arrow right'></i>";

                $("#pfAction" + pfAction.ID + " .icon-col").html(newIcon);
                $("#pfAction" + pfAction.ID + " .icon-col").attr("data-content", pfAction.ActionType + " - " + pfAction.ActionStatus);
                $("#pfAction" + pfAction.ID + " .icon-col").popup();
                updateActionAJAX();
                break;
            case "Note":
                $("#modal-log-note .ui.form").removeClass("error");
                $("#log-note-title").removeClass("error");
                $("#log-note-content").removeClass("error");
                // RESET TABS
                $('.toolbar-content-slim .menu .item').removeClass("active");
                $('.toolbar-content-slim .ui.segment').removeClass("active");
                // RESET HTML EDITOR 
                if(viewHTML) {
                    $("#log-note-content #toolbar-html").trigger("click");
                }
                // SET INPUT FIELDS
                $("#log-note-title input").val(pfAction.ActionStatus); 
                $("#log-note-editor").html("");
                // $("#log-note-editor").html(pfAction.ActionData);
                $("#log-note-editor").html(escapeHtml(pfAction.ActionData));
                // LOAD NOTE ATTACHMENTS (refer to mail.js example, line 1236)    
                $("#log-note-attachments").hide();
                $("#log-note-attachments .modal-write-attach").remove();
                
                if(pfAction.ActionLink != null && pfAction.ActionLink.length) {
                    attachCount = 0;            
                    $("#log-note-attachments").show();
                    $.each(pfAction.ActionLink, function(k,v) {
                        var attachPiece = "<div class='modal-write-attach'>";
                        attachPiece += "<div class='ui grid'>";
                        attachPiece += "<div class='ten wide column'>";
                        attachPiece += "<i class='icon big attach'></i>";
                        attachPiece += "<a target='_blank' class='name' href='" + v.url + "'>" + v.name + "</a>";
                        attachPiece += "<span data-size='" + v.size + "'class='size'>" + filesize(v.size) + "</span>";
                        attachPiece += "<a href='#' class='ibtn cancel'><i class='icon cancel'></i></a>";
                        attachPiece += "</div>";
                        attachPiece += "</div>";
                        attachPiece += "</div>";
                        $("#log-note-attachments").append(attachPiece);
                        $("#log-note-attachments .modal-write-attach").eq(attachCount).find(".cancel").click(function() {
                            if($(this).parents(".modal-write-attach").find("i.checkmark").is(":hidden")) {
            
                            } else {
                                attachCount--;
                            }
                            $(this).parents(".modal-write-attach").remove();
                            if(attachCount == 0) {
                                $("#log-note-attachments").hide();
                            }
                        });
                        var iconTarget = $("#log-note-attachments .modal-write-attach").eq(attachCount).find("i.attach");
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
                                iconTarget.replaceWith("<i class='icon big code'></i>");
                                break;
                            case "application/sql":
                            case "application/csv":
                                iconTarget.replaceWith("<i class='icon big database'></i>");
                                break;
                            case "application/zip":
                            case "application/rar":
                                iconTarget.replaceWith("<i class='icon big archive'></i>");
                                break;
                            default:
                                break;
                        }
                        attachCount++;
                    });
                }
                // SET UI
                $("#modal-log-note").modal({ allowMultiple: true, closable: false}).modal("show");
                $("#log-note-delete").show();
                $('.toolbar-content-slim .menu .item').tab();

                // BUTTON ACTIONS
                $("#log-note-save").off("click");
                $("#log-note-save").click(function() {
                    if(viewHTML) {
                        $("#modal-log-note #toolbar-html").trigger("click");
                    }
                    pfAction.ActionStatus = $("#log-note-title input").val();
                    pfAction.ActionData = $("#log-note-editor").html();
                    saveNoteAttachments();
                    if(pfAction.ActionData) {
                        $("#modal-log-note .ui.form").removeClass("error");
                        $("#log-note-content").removeClass("error");
                    } else {
                        $("#modal-log-note .ui.form").addClass("error");
                        $("#log-note-content").addClass("error");
                        return false;
                    }                   

                    var sugarStartDT = Sugar.Date.create(new Date(), { fromUTC: true });
                    pfAction.ActionStartDT = Sugar.Date.format(sugarStartDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                    updateActionAJAX(); // NULL values: ActionPrice

                    var actionIndex = $("#pfAction" + pfAction.ID).index();
                    $("#pfAction" + pfAction.ID).detach();
                    var newAction = paintAction();
                    if(actionIndex > 0) {
                        $(".lead-actionlog tbody tr").eq(actionIndex - 1).after(newAction);
                    } else {
                        $(".lead-actionlog tbody").prepend(newAction);
                    }
                    $(".lead-actionlog table").trigger("update");
                    setActionEditClick();
                    setActionDeleteClick();
                    translateActionLog();
                });
                break;
            case "Task":
                var newIcon;
                if(pfAction.ActionStatus == "Open") {
                    newIcon = "<i class='icon checkmark' style='color: #14ae33'></i>";
                    pfAction.ActionStatus = "Finished";
                } else if(pfAction.ActionStatus == "Finished") {
                    newIcon = "<i class='icon clipboard check'></i>";
                    pfAction.ActionStatus = "Open";
                }
                $("#pfAction" + pfAction.ID + " .icon-col").html(newIcon);
                $("#pfAction" + pfAction.ID + " .icon-col").attr("data-content", pfAction.ActionStatus + " " + pfAction.ActionType);
                $("#pfAction" + pfAction.ID + " .icon-col").popup();
                updateActionAJAX();
                break;
            case "Successful Sale":
            case "Active Opportunity":
            case "Lost Opportunity":
                var newIcon = "<i class='icons'>";

                if(pfAction.ActionType == "Successful Sale") {
                    newIcon += "<i class='icon trophy'></i>";
                    pfAction.ActionType = "Active Opportunity";
                } else if(pfAction.ActionType == "Active Opportunity") {
                    newIcon += "<i class='icon trophy'></i><i class='icon cancel corner'></i>";
                    pfAction.ActionType = "Lost Opportunity";
                } else if(pfAction.ActionType == "Lost Opportunity") {
                    newIcon += "<i class='icon dollar' style='color: #14ae33'></i>";
                    pfAction.ActionType = "Successful Sale";
                }

                newIcon += "</i>";

                $("#pfAction" + pfAction.ID + " .icon-col").html(newIcon);
                $("#pfAction" + pfAction.ID + " .icon-col").attr("data-content", pfAction.ActionType);
                $("#pfAction" + pfAction.ID + " .icon-col").popup();
                updateActionAJAX();
                break;
        }
        translateActionLog();
    });
    $("#pfAction" + pfAction.ID + " .mail-col > a").off("click");
    $("#pfAction" + pfAction.ID + " .mail-col > a").click(function() {
        $(this).blur();
        $("#modal-message-target label").html($(this).find(".mail-way").html());
        $("#modal-message-target span").html($(this).find(".mail-target").html());
        $("#modal-message-content").html($(this).find(".mail-content").html());
        $("#modal-message").modal("show");
    });
    $("#pfAction" + pfAction.ID + " .desc-col > a").off("click");
    $("#pfAction" + pfAction.ID + " .desc-col > a").click(function() {
        var dataID = $(this).parents("tr").attr("data-id");
        $(this).parents("#pfAction" + dataID).find(".edit-col a").trigger("click");
    });
}
function setActionDeleteClick() {
    $("#pfAction" + pfAction.ID + " .delete-col a").off("click");
    $("#pfAction" + pfAction.ID + " .delete-col a").click(function() {
        $(this).blur();
        var dataID = $(this).parents("tr").attr("data-id");
        $.each(pfData.Actions, function(k,v) { if(v.ID == dataID) { pfAction = v; } });
        deleteActionAJAX();
    });
}

function saveNoteAttachments() {
    attachments = [];
    $("#log-note-attachments .modal-write-attach").each(function(index) {
        var attachName = $(this).find(".name").html();
        var attachType = "text/html";
        var suffix = attachName.substring(attachName.indexOf(".")).toLowerCase();
        switch(suffix) {
            case ".jpg":
                attachType = "image/jpg";
                break;
            case ".jpeg":
                attachType = "image/jpeg";
                break;
            case ".png":
                attachType = "image/png";
                break;
            case ".gif":
                attachType = "image/gif";
                break;
            case ".bmp":
                attachType = "image/bmp";
                break;
            case ".doc":
                attachType = "application/doc";
                break;
            case ".docx":
                attachType = "application/docx";
                break;
            case ".pdf":
                attachType = "application/pdf";
                break;
            case ".pdfx":
                attachType = "application/pdfx";
                break;
            case ".xls":
                attachType = "application/xls";
                break;
            case ".html":
                attachType = "text/html";
                break;
            case ".css":
                attachType = "text/css";
                break;
            case ".js":
                attachType = "text/js";
                break;
            case ".php":
                attachType = "text/php";
                break;
            case ".sql":
                attachType = "text/sql";
                break;
            case ".csv":
                attachType = "text/csv";
                break;
            case ".zip":
                attachType = "application/zip";
                break;
            case ".rar":
                attachType = "application/rar";
                break;
        }
        var attachPiece = {
            "url": $(this).find(".name").attr("href"),
            "content-type": attachType,
            "name": attachName,
            "size": $(this).find(".size").attr("data-size")
        };
        attachments.push(attachPiece);
    });
    if(attachments.length > 0) {
        attachments = JSON.stringify(attachments);
    } else {
        attachments = "";
    }
    pfAction.ActionLink = attachments;
}

function wireContentToolbar() {
    // ATTACHMENTS
    jqXHR = $(".toolbar-content-slim #toolbar-attachment").fileupload({
        url: attachmentAPI,
        dataType: 'json',
        maxFileSize: 50000000, // 50 MB
        start: function(e) {
            attachCount = $("#log-note-attachments .modal-write-attach").length;
        },
        send: function(e,data) {
            $("#log-note-attachments").show();
            var attachPiece = "<div class='modal-write-attach'>";
            attachPiece += "<div class='ui grid'>";
            attachPiece += "<div class='ten wide column'>";
            attachPiece += "<i class='icon big attach'></i>";
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
            $("#log-note-attachments").append(attachPiece);
            $("#log-note-attachments .modal-write-attach").eq(attachCount).find("i.checkmark").hide();
            $("#modal-log-note").modal("refresh");
            $("#log-note-attachments .modal-write-attach").eq(attachCount).find(".ui.progress").show();
            $("#log-note-attachments .modal-write-attach").eq(attachCount).find(".cancel").click(function() {
                if($(this).parents(".modal-write-attach").find("i.checkmark").is(":hidden")) {
                } else {
                    attachCount--;
                }
                $(this).parents(".modal-write-attach").remove();
                if(attachCount == 0) {
                    $("#log-note-attachments").hide();
                }
            });
        },
        process: function(e, data) {
            $("#log-note-attachments .modal-write-attach").eq(attachCount).find(".ui.progress").progress("set total", data.total);
        },
        progressall: function (e, data) {
            $("#log-note-attachments .modal-write-attach").eq(attachCount).find(".ui.progress").progress("set progress", data.loaded);
        },
        done: function (e, response) {
            let result = response.result;
            if(parseInt(result.code) == 1) {
                var file = result.data;
                var iconTarget = $("#log-note-attachments .modal-write-attach").eq(attachCount).find("i.attach");
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
                        iconTarget.replaceWith("<img src='img/icons/excel.png' />");
                        break;
                    case ".html":
                    case ".css":
                    case ".js":
                    case ".php":
                        iconTarget.replaceWith("<i class='icon big code'></i>");
                        break;
                    case ".sql":
                    case ".csv":
                        iconTarget.replaceWith("<i class='icon big database'></i>");
                        break;
                    case ".zip":
                    case ".rar":
                        iconTarget.replaceWith("<i class='icon big archive'></i>");
                        break;
                }
                var nameTarget = $("#log-note-attachments .modal-write-attach").eq(attachCount).find("span.name");
                nameTarget.replaceWith("<a target='_blank' class='name' href='" + file.url + "'>" + file.name + "</a>");

                setTimeout(function() {
                    $("#log-note-attachments .modal-write-attach").eq(attachCount).find(".ui.progress").fadeOut(400, function() {
                        $("#log-note-attachments .modal-write-attach").eq(attachCount).find("i.checkmark").fadeIn(400);
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
            $("#log-note-attachments .modal-write-attach").eq(attachCount).remove();
        }
    });
}
function setActionLog() {
    // $("[contenteditable]").off("focusout");
    // $("[contenteditable]").focusout(function(){
    //     var element = $(this);        
    //     if (!element.text().trim().length) {
    //         element.empty();
    //     }
    // });
    // wireToolbar();
    wireContentToolbar();
    if(pfData.Actions.length == 0) {
        $(".lead-actionlog table").hide();
        $(".lead-actionlog .no-actions").show();
    } else {
        $(".lead-actionlog table").show();
        $(".lead-actionlog .no-actions").hide();        
        $(".lead-actionlog > .head-bar h3 counter").html(`(${pfData.Actions.length})`);
        $.each(pfData.Actions, function(k,v) {
            pfAction = v;
            appendAction();
            setActionEditClick();
            setActionDeleteClick();
            clean_pfAction();
        });
    }
    // NO ENTER KEYUP DUE TO TEXTAREA FIELDS AND LOG FRAGILITY
    $("#btn-log-call").click(function() {
        $("#modal-log-call .ui.form").removeClass("error");
        $("#modal-log-call #log-call-from").removeClass("error");
        $("#modal-log-call #log-call-to").removeClass("error");
        $("#modal-log-call #log-call-date").removeClass("error");
        $("#modal-log-call #log-call-time").removeClass("error");
        $("#modal-log-call").modal({ closable: false }).modal("show");

        // SET UI
        $("#log-call-delete").hide();
        $("#log-call-status .ui.checkbox").checkbox();
        $("#modal-log-call .radio").checkbox();
        $("#log-call-date").calendar({ type: 'date', today: true });
        $('#log-call-time').calendar({ type: 'time', today: true });

        // SET INPUT FIELDS
        $("#modal-log-call input[name='log-call-from']").val("");
        $("#modal-log-call input[name='log-call-to']").val("");
        $("#modal-log-call input[name='log-call-date']").val("");
        $("#modal-log-call input[name='log-call-time']").val("");
        $("#modal-log-call input[name='log-call-duration']").val("");
        $("#modal-log-call input[name='log-call-transcript']").val("");

        // BUTTON ACTIONS
        $("#log-call-save").off("click");
        $("#log-call-save").click(function() {
            clean_pfAction();

            pfAction.ActionFrom = $("#modal-log-call input[name='log-call-from']").val();
            pfAction.ActionTo = $("#modal-log-call input[name='log-call-to']").val();
            var lcDate = $("#modal-log-call input[name='log-call-date']").val();
            var lcTime = $("#modal-log-call input[name='log-call-time']").val();
            var lcDuration = $("#modal-log-call input[name='log-call-duration']").val();

            // Validation
            if(pfAction.ActionFrom && pfAction.ActionTo && lcDate && lcTime) {
                $("#modal-log-call .ui.form").removeClass("error");
                $("#modal-log-call #log-call-from").removeClass("error");
                $("#modal-log-call #log-call-to").removeClass("error");
                $("#modal-log-call #log-call-date").removeClass("error");
                $("#modal-log-call #log-call-time").removeClass("error");
            } else {
                $("#modal-log-call .ui.form").addClass("error");
                if(pfAction.ActionFrom == "") {
                    $("#modal-log-call #log-call-from").addClass("error");
                } else {
                    $("#modal-log-call #log-call-from").removeClass("error");
                }
                if(pfAction.ActionTo == "") {
                    $("#modal-log-call #log-call-to").addClass("error");
                } else {
                    $("#modal-log-call #log-call-to").removeClass("error");
                }
                if(lcDate == "") {
                    $("#modal-log-call #log-call-date").addClass("error");
                } else {
                    $("#modal-log-call #log-call-date").removeClass("error");
                }
                if(lcTime == "") {
                    $("#modal-log-call #log-call-time").addClass("error");
                } else {
                    $("#modal-log-call #log-call-time").removeClass("error");
                }
                return false;
            }

            if(!lcDuration) { lcDuration = 0; }
            var sugarStartDT = Sugar.Date.create(lcDate + " " + lcTime, { fromUTC: true });
            pfAction.ActionStartDT = Sugar.Date.format(sugarStartDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
            var sugarEndDT = Sugar.Date.clone(sugarStartDT);
            Sugar.Date.addMinutes(sugarEndDT, lcDuration);
            pfAction.ActionEndDT = Sugar.Date.format(sugarEndDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');

            pfAction.ActionStatus = ($("#log-call-status .ui.checkbox").checkbox('is checked') ? "Answered" : "Not Answered");
            pfAction.ActionType = $("#modal-log-call input[name='log-call-type']:checked").val();
            pfAction.ActionData = $("#modal-log-call textarea").val();

            // NULL values: ActionLink, ActionPrice

            insertActionAJAX();

            //clear form values?
        });

    });
    $("#btn-log-email").click(function() {
        $("#modal-log-email .ui.form").removeClass("error");
        $("#modal-log-email #log-email-from").removeClass("error");
        $("#modal-log-email #log-email-to").removeClass("error");
        $("#modal-log-email #log-email-date").removeClass("error");
        $("#modal-log-email #log-email-time").removeClass("error");
        $("#modal-log-email").modal({ closable: false }).modal("show");

        // SET UI
        $("#log-email-delete").hide();
        $("#modal-log-email .radio").checkbox();
        $("#log-email-date").calendar({ type: 'date', today: true });
        $('#log-email-time').calendar({ type: 'time', today: true });

        // SET INPUT FIELDS
        $("#modal-log-email input[name='log-email-from']").val("");
        $("#modal-log-email input[name='log-email-to']").val("");
        $("#modal-log-email input[name='log-email-date']").val("");
        $("#modal-log-email input[name='log-email-time']").val("");
        $("#modal-log-email textarea").val("");

        // BUTTON ACTIONS
        $("#log-email-save").off("click");
        $("#log-email-save").click(function() {
            clean_pfAction();
            // add validation

            pfAction.ActionFrom = $("#modal-log-email input[name='log-email-from']").val();
            pfAction.ActionTo = $("#modal-log-email input[name='log-email-to']").val();
            var lcDate = $("#modal-log-email input[name='log-email-date']").val();
            var lcTime = $("#modal-log-email input[name='log-email-time']").val();

            // Validation
            if(pfAction.ActionFrom && pfAction.ActionTo && lcDate && lcTime) {
                $("#modal-log-email .ui.form").removeClass("error");
                $("#modal-log-email #log-email-from").removeClass("error");
                $("#modal-log-email #log-email-to").removeClass("error");
                $("#modal-log-email #log-email-date").removeClass("error");
                $("#modal-log-email #log-email-time").removeClass("error");
            } else {
                $("#modal-log-email .ui.form").addClass("error");
                if(pfAction.ActionFrom == "") {
                    $("#modal-log-email #log-email-from").addClass("error");
                } else {
                    $("#modal-log-email #log-email-from").removeClass("error");
                }
                if(pfAction.ActionTo == "") {
                    $("#modal-log-email #log-email-to").addClass("error");
                } else {
                    $("#modal-log-email #log-email-to").removeClass("error");
                }
                if(lcDate == "") {
                    $("#modal-log-email #log-email-date").addClass("error");
                } else {
                    $("#modal-log-email #log-email-date").removeClass("error");
                }
                if(lcTime == "") {
                    $("#modal-log-email #log-email-time").addClass("error");
                } else {
                    $("#modal-log-email #log-email-time").removeClass("error");
                }
                return false;
            }

            var sugarStartDT = Sugar.Date.create(lcDate + " " + lcTime, { fromUTC: true });
            pfAction.ActionStartDT = Sugar.Date.format(sugarStartDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');

            pfAction.ActionType = $("#modal-log-email input[name='log-email-type']:checked").val();
            pfAction.ActionData = $("#modal-log-email textarea").val();

            // NULL values: ActionLink, ActionPrice
            insertActionAJAX();
        });
    });
    $("#btn-log-note").click(function() {
        $("#modal-log-note .ui.form").removeClass("error");
        $("#log-note-title").removeClass("error");
        $("#log-note-content").removeClass("error");
        $("#modal-log-note").modal({ closable: false }).modal("show");

        // SET UI
        $("#log-note-delete").hide();
        
        // RESET TABS
        $('.toolbar-content-slim .menu .item').removeClass("active");
        $('.toolbar-content-slim .ui.segment').removeClass("active");
        // RESET HTML EDITOR 
        if(viewHTML) {
            $("#log-note-content #toolbar-html").trigger("click");
        }
        // SET INPUT FIELDS
        $("#log-note-title input").val("");
        $("#log-note-editor").html("");
        
        $("#log-note-attachments").hide();
        $("#log-note-attachments .modal-write-attach").remove();

        // BUTTON ACTIONS
        $("#log-note-save").off("click");
        $("#log-note-save").click(function() {
            clean_pfAction();
            if(viewHTML) {
                $("#modal-log-note #toolbar-html").trigger("click");
            }
            pfAction.ActionStatus = $("#log-note-title input").val();
            pfAction.ActionData = $("#log-note-editor").html();
            saveNoteAttachments();

            if(pfAction.ActionData) {
                $("#modal-log-note .ui.form").removeClass("error");
                $("#log-note-content").removeClass("error");
            } else {
                $("#modal-log-note .ui.form").addClass("error");
                $("#log-note-content").addClass("error");
                return false;
            }

            var sugarStartDT = Sugar.Date.create(new Date(), { fromUTC: true });
            pfAction.ActionStartDT = Sugar.Date.format(sugarStartDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
            pfAction.ActionType = "Note";
            pfAction.ActionFrom = mainCustomer.CustomerName;

            insertActionAJAX(); // NULL values: ActionPrice
        });
    });
    $("#btn-log-task").click(function() {
        $("#modal-log-task .ui.form").removeClass("error");
        $("#modal-log-task #log-task-to").removeClass("error");
        $("#modal-log-task #log-task-transcript").removeClass("error");
        $("#modal-log-task").modal({ closable: false }).modal("show");

        // SET UI
        $("#log-task-delete").hide();
        $("#modal-log-task .radio").checkbox();
        $("#log-task-date").calendar({ type: 'date', today: true });
        $('#log-task-time').calendar({ type: 'time', today: true });

        // SET INPUT FIELDS
        $("#modal-log-task input[name='log-task-to']").val("");
        $("#modal-log-task input[name='log-task-date']").val("");
        $("#modal-log-task input[name='log-task-time']").val("");
        $("#modal-log-task textarea").val("");

        // BUTTON ACTIONS
        $("#log-task-save").off("click");
        $("#log-task-save").click(function() {
            clean_pfAction();

            pfAction.ActionTo = $("#modal-log-task input[name='log-task-to']").val();
            pfAction.ActionData = $("#modal-log-task textarea").val();

            // Validation
            if(pfAction.ActionTo && pfAction.ActionData) {
                $("#modal-log-task .ui.form").removeClass("error");
                $("#modal-log-task #log-task-to").removeClass("error");
                $("#modal-log-task #log-task-transcript").removeClass("error");
            } else {
                $("#modal-log-task .ui.form").addClass("error");
                if(pfAction.ActionTo == "") {
                    $("#modal-log-task #log-task-to").addClass("error");
                } else {
                    $("#modal-log-task #log-task-to").removeClass("error");
                }
                if(pfAction.ActionData == "") {
                    $("#modal-log-task #log-task-transcript").addClass("error");
                } else {
                    $("#modal-log-task #log-task-transcript").removeClass("error");
                }
                return false;
            }

            var lcDate = $("#modal-log-task input[name='log-task-date']").val();
            var lcTime = $("#modal-log-task input[name='log-task-time']").val();
            if(lcDate && lcTime) {
                var sugarEndDT = Sugar.Date.create(lcDate + " " + lcTime, { fromUTC: true });
                pfAction.ActionEndDT = Sugar.Date.format(sugarEndDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
            } else {

            }

            pfAction.ActionStartDT = getUTCStamp();
            pfAction.ActionStatus = $("#modal-log-task input[name='log-task-status']:checked").val();
            pfAction.ActionType = "Task";
            pfAction.ActionFrom = mainCustomer.CustomerName;

            // NULL values: ActionLink, ActionPrice
            insertActionAJAX();
        });
    });
    $("#btn-log-sale").click(function() {
        $("#modal-log-sale .ui.form").removeClass("error");
        $("#modal-log-sale #log-sale-item").removeClass("error");
        $("#modal-log-sale #log-sale-price").removeClass("error");
        $("#modal-log-sale").modal({ closable: false }).modal("show");

        // SET UI
        $("#modal-log-sale .radio").checkbox();

        // SET INPUT FIELDS
        $("#modal-log-sale input[name='log-sale-item']").val("");
        $("#modal-log-sale input[name='log-sale-price']").val("");

        // BUTTON ACTIONS
        $("#log-sale-save").off("click");
        $("#log-sale-save").click(function() {
            clean_pfAction();

            pfAction.ActionPrice = $("#modal-log-sale input[name='log-sale-price']").val();
            pfAction.ActionData = $("#modal-log-sale input[name='log-sale-item']").val();
            // Validation
            if(pfAction.ActionPrice && pfAction.ActionData) {
                $("#modal-log-sale .ui.form").removeClass("error");
                $("#modal-log-sale #log-sale-price").removeClass("error");
                $("#modal-log-sale #log-sale-item").removeClass("error");
            } else {
                $("#modal-log-sale .ui.form").addClass("error");
                if(pfAction.ActionPrice == "") {
                    $("#modal-log-sale #log-sale-price").addClass("error");
                } else {
                    $("#modal-log-sale #log-sale-price").removeClass("error");
                }
                if(pfAction.ActionData == "") {
                    $("#modal-log-sale #log-sale-item").addClass("error");
                } else {
                    $("#modal-log-sale #log-sale-item").removeClass("error");
                }
                return false;
            }
            pfAction.ActionStartDT = getUTCStamp();
            pfAction.ActionEndDT = getUTCStamp();
            pfAction.ActionStatus = $("#modal-log-sale input[name='log-sale-type']:checked").val();
            pfAction.ActionType = $("#modal-log-sale input[name='log-sale-status']:checked").val();
            pfAction.ActionFrom = mainCustomer.CustomerName;

            // NULL values: ActionLink, ActionPrice
            insertActionAJAX();
        });
    });
    $(".icon-col").popup();
    // $(".lead-actionlog table").tablesorter({
    //     headers: {
    //         //0: { sorter: false }, //using the tablesorter disables the SUI popup
    //         1: { sorter: false },
    //         2: { sorter: "shortDate" },
    //         4: { sorter: false },
    //         5: { sorter: false }
    //     },
    //     textExtraction : {
    //         0 : function(node, table, cellIndex) {
    //             return $(node).parent().attr('data-type');
    //         }
    //     }
    // });
}
//#endregion
// #region TRANSLATE
function translateLead() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            $("#cfc-add-field span").text("Agregar Campo");
            w_lead_contactemail_exists = "Correo electrónico del contacto ya existe en el CRM";
            // DATE COLUMN SORT PREFERENCE
            $("#actionlog-th-time").removeClass("sorter-mmddyy");
            $("#actionlog-th-time").addClass("sorter-ddmmyy");
            // UI - BAR
            $("#ui-bar .lead-status .ui.dropdown .default.text").text("Estado");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Prospect']").text("Prospecto");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Interested']").text("Interesado");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Ready to Buy']").text("Listo para Comprar");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Customer']").text("Cliente");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Not Interested']").text("Sin Interes");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Blacklisted']").text("Descalificado");
            let statusText = $(".lead-status .ui.dropdown .text");
            switch(pfData.LeadStatus) {
                case "Prospect":
                    statusText.text("Prospecto");
                    break;
                case "Interested":
                    statusText.text("Interesado");
                    break;
                case "Ready to Buy":
                    statusText.text("Listo para Comprar");
                    break;
                case "Customer":
                    statusText.text("Cliente");
                    break;
                case "Not Interested":
                    statusText.text("Sin Interes");
                    break;
                case "Blacklisted":
                    statusText.text("Descalificado");
                    break;
            }
            // LEAD UI
            $(".lead-contacts h3 span").text("Contactos");
            $("#lead-add-contact span").text("Agregar Contacto");
            $(".no-contacts p").text("Sin contactos");
            $(".lead-noteboard h3 span").text("Pizarra");
            $("#lead-noteboard-save span").text("Grabar");
            $(".lead-actionlog h3 span").text("Registro de Acción");
            $("#btn-log-note span").text("Agregar Nota");
            $("#btn-log-email span").text("Agregar Correo");
            $("#btn-log-call span").text("Agregar Llamada");
            $("#btn-log-task span").text("Agregar Tarea");
            $("#btn-log-sale span").text("Agregar Venta");
            $("#actionlog-th-type").text("Tipo");
            $("#actionlog-th-description").text("Descripción");
            $("#actionlog-th-time").text("Fecha");
            $("#actionlog-th-user").text("Usuario");
            $(".no-actions p").text("Sin acciones");
            translatePills();
            translateActionLog();
            // MODAL - ADD CONTACT
            $("#modal-add-contact > .header span").text("Detalles del Contacto");
            $("#modal-add-contact-name > label").text("Nombre");
            $("#modal-add-contact-email > label").text("Correo");
            $("#modal-add-contact-phone > label").text("Teléfono");
            $("#modal-add-contact-title > label").text("Título");
            $("#modal-add-contact-avatar > label").text("Avatar");
            $("#modal-add-contact-location > label").text("Ubicación");
            $("#modal-add-contact > .content .ui.error.message .header").text("Datos invalidos");
            $("#modal-add-contact > .content .ui.error.message p").text("Por favor, llene todos los datos requeridos");
            $("#modal-add-contact > .content .ui.warning.message .header").text("Autollenar ha fallado");
            $("#modal-add-contact > .content .ui.warning.message p").text("No se pudo encontrar datos para este correo");
            $("#modal-add-contact > .content .ui.info.message .header").text("Autollenar en espera");
            $("#modal-add-contact > .content .ui.info.message p").text("Por favor, haz click en 'Autollenar' de nuevo en unos segundos");
            $("#modal-add-contact-exit > span").text("Salir");
            $("#modal-add-contact-delete > span").text("Borrar");
            $("#modal-add-contact-auto > span").text("Autollenar");
            $("#modal-add-contact-auto").attr("data-tooltip","Escanea el correo para llenar los datos del contacto");
            $("#modal-add-contact-edit > span").text("Editar Campos");
            $("#modal-add-contact-save > span").text("Grabar");
            // MODAL - LOG CALL
            $("#modal-log-call > .header span").text("Detalles de la Llamada");
            $("#log-call-from > label").text("De");
            $("#log-call-from .ui.input input").attr("placeholder","Llamador");
            $("#log-call-to > label").text("Para");
            $("#log-call-to .ui.input input").attr("placeholder","Llamado");
            $("#log-call-date > label").text("Fecha");
            $("#log-call-time > label").text("Tiempo");
            $("#log-call-duration > label").text("Duración (minutos)");
            $("#log-call-status > label").text("Resultado");
            $("#log-call-status .ui.checkbox label").text("Contesta");
            $("#log-call-type > label").text("Tipo de llamada");
            $("#log-call-type-outgoing .ui.checkbox span").text("Saliente");
            $("#log-call-type-incoming .ui.checkbox span").text("Entrante");
            $("#log-call-transcript > label").text("Transcripción");
            $("#modal-log-call > .content .ui.error.message .header").text("Datos vacíos");
            $("#modal-log-call > .content .ui.error.message p").text("Por favor, llene todos los datos requeridos");
            $("#log-call-exit > span").text("Salir");
            $("#log-call-delete > span").text("Borrar");
            $("#log-call-save > span").text("Grabar");
            // MODAL - LOG EMAIL
            $("#modal-log-email > .header span").text("Detalles del Correo");
            $("#log-email-from > label").text("De");
            $("#log-email-from .ui.input input").attr("placeholder","Remitente");
            $("#log-email-to > label").text("Para");
            $("#log-email-to .ui.input input").attr("placeholder","Destinatario");
            $("#log-email-date > label").text("Fecha");
            $("#log-email-time > label").text("Tiempo");
            $("#log-email-type > label").text("Tipo de Correo");
            $("#log-email-type-outgoing .ui.checkbox span").text("Saliente");
            $("#log-email-type-incoming .ui.checkbox span").text("Entrante");
            $("#log-email-transcript > label").text("Mensaje");
            $("#modal-log-email > .content .ui.error.message .header").text("Datos vacíos");
            $("#modal-log-email > .content .ui.error.message p").text("Por favor, llene todos los datos requeridos");
            $("#log-email-exit > span").text("Salir");
            $("#log-email-delete > span").text("Borrar");
            $("#log-email-save > span").text("Grabar");
            // MODAL - LOG NOTE
            $("#modal-log-note > .header span").text("Detalles de la Nota");
            $("#log-note-title input").attr("placeholder","Título de nota");
            $("#toolbar-html span").text("Simple / HTML");
            $("#log-note-content > label").text("Mensaje");
            $("#log-note-editor").attr("placeholder","Descripción");
            $("#log-note-attachments > label").text("Adjuntos");
            $("#modal-log-note > .content .ui.error.message .header").text("Nota vacía");
            $("#log-note-exit > span").text("Salir");
            $("#log-note-delete > span").text("Borrar");
            $("#log-note-save > span").text("Grabar");
            // MODAL - LOG TASK
            $("#modal-log-task > .header span").text("Detalles de la Tarea");
            $("#log-task-to > label").text("Asignar a");
            $("#log-task-date > label").text("Fecha de Entrega");
            $("#log-task-time > label").text("Tiempo de Entrega");
            $("#log-task-status > label").text("Estado de la Tarea");
            $("#log-task-status-open .ui.checkbox span").text("Abierto");
            $("#log-task-status-finished .ui.checkbox span").text("Finalizado");
            $("#log-task-transcript > label").text("Descripción de la Tarea");
            $("#log-task-exit > span").text("Salir");
            $("#log-task-delete > span").text("Borrar");
            $("#log-task-save > span").text("Grabar");
            // MODAL - LOG SALE
            $("#modal-log-sale > .header span").text("Detalles de la Venta");
            $("#log-sale-item > label").text("Artículo de Venta");
            $("#log-sale-item input").attr("placeholder","Descripción del producto o servicio");
            $("#log-sale-price > label").text("Precio de Venta");
            $("#log-sale-type > label").text("Tipo de Venta");
            $("#log-sale-type-one label").text("Unica");
            $("#log-sale-type-monthly label").text("Mensual");
            $("#log-sale-type-annually label").text("Anual");
            $("#log-sale-status > label").text("Estado de Venta");
            $("#log-sale-status-sold .ui.checkbox span").text("Venta Exitosa");
            $("#log-sale-status-active .ui.checkbox span").text("Oportunidad Vigente");
            $("#log-sale-status-lost .ui.checkbox span").text("Oportunidad Perdida");
            $("#modal-log-sale > .content .ui.error.message .header").text("Datos vacíos");
            $("#modal-log-sale > .content .ui.error.message p").text("Por favor, llene todos los datos requeridos");
            $("#log-sale-exit > span").text("Salir");
            $("#log-sale-save > span").text("Grabar");
            // MODAL - MESSAGE
            $("#modal-message > .header span").text("Detalles del Mensaje");
            $("#modal-message-content-field > label").text("Mensaje:");   
            $("#modal-message-exit span").text("Salir");
            // MODAL - SMS
            $("#modal-sms > .header > span").text("Detalles de SMS");
            $("#sms-message label").text("Mensaje");
            $("#modal-sms .ui.error.message .header").text("Mensaje vacío");
            $("#sms-exit span").text("Salir");
            $("#sms-send span").text("Envíar SMS");
            // MODAL - LEAD
            $("#modal-detail > .header > span").text("Detalles del Cliente");
            $("#detail-name > label").text("Nombre");
            $("#detail-name input").attr("placeholder","Empresa/Organización");
            $("#detail-location > label").text("Ubicación");
            $("#detail-source > label").text("Fuente");
            $("#cf-add span").text("Agregar campo");
            $("#modal-detail > .content .ui.error.message .header").text("Datos vacíos");
            $("#modal-detail > .content .ui.error.message p").text("Por favor, llene todos los datos del formulario");
            $("#modal-detail-exit span").text("Salir");
            $("#modal-detail-delete span").text("Borrar");
            $("#modal-detail-edit span").text("Editar campos");
            $("#modal-detail-save span").text("Grabar");
            $(".field-edit-btn.edit[data-tooltip='Edit Field']").attr("data-tooltip","Editar Campo");
            // MODAL - FIELD DETAILS
            $("#modal-field > .header > span").text("Detalles de campo");
            $("#field-name > label").text("Nombre");
            $("#field-icon > label").text("Icono");
            $("#field-icon .ui.icon.search.input input").attr("placeholder","Buscar...");
            $("#field-isrequired > label").text("Validación");
            $("#field-isrequired .ui.checkbox label").text("Requerir");
            $("#modal-field-header-type").text("Tipo");
            $("#card-input > .content > .header").text("Texto Unilinear");
            $("#card-textarea > .content > .header").text("Texto Multilinear");
            $("#card-email > .content > .header").text("Correo");
            $("#card-phone > .content > .header").text("Teléfono");
            $("#card-link > .content > .header").text("Enlace");
            $("#card-location > .content > .header").text("Ubicación");
            $("#card-integer > .content > .header").text("Numero");
            $("#card-decimal > .content > .header").text("Precio");
            $("#card-date > .content > .header").text("Fecha");
            $("#card-time > .content > .header").text("Tiempo");
            $("#card-datetime > .content > .header").text("Fecha y Tiempo");
            $("#card-dropdown > .content > .header").text("Desplegable");
            $("#card-singlechoice > .content > .header").text("Lista Simple");
            $("#card-singlecheckbox > .content > .header").text("Caja");
            $("#card-multicheckbox > .content > .header").text("Cajas");
            $("#card-progress > .content > .header").text("Progreso");
            $("#card-rating > .content > .header").text("Valuación");
            $("#field-default > label").text("Valor inicial");
            $("#field-placeholder > label").text("Texto de Sombra");
            $("#val-min > label").text("Valor Mínimo");
            $("#val-max > label").text("Valor Máximo");
            $("#val-color > label").text("Color de Barra");
            $("#val-color .ui.dropdown.button > .text").text("Escoge color");
            $("#val-color .ui.dropdown.button .ui.search.input input").attr("placeholder","Buscar colores...");
            // $("#val-color .ui.dropdown.button .header").text("Paleta de color");
            $("#val-icon > label").text("Icono de valuación");
            $("#val-icon .ui.dropdown.button .ui.search.input input").attr("placeholder","Buscar iconos...");
            $("#val-show > label").text("Acceso Rápido");
            $("#val-show .ui.checkbox label").text("Mostrar boton en la pastilla");
            $("#dt-default > label").text("Tipo de valor inicial");
            $("#dt-default-basedoff label").html("En base a la <span>fecha y tiempo</span> actual");
            $("#dt-default-static label").html("<span>Fecha y Tiempo</span> fijado");
            $("#dt-offset > label").text("Contrapeso");
            $("#dt-datetime > label").text("Fecha y Tiempo");
            $("#dd-placeholder > label").text("Texto de Sombra");
            $("#dd-searchable > label").text("Configuración de Campo");
            $("#dd-searchable .ui.checkbox label").text("Buscable");
            $("#chk-type > label").text("Estilo de Caja");
            $("#chk-type-checkbox label").text("Caja");
            $("#chk-type-slider label").text("Deslizador");
            $("#chk-type-toggle label").text("Palanca");
            $("#chk-state > label").text("Estado Inicial");
            $("#chk-state .ui.checkbox label").text("Marcado");
            $("#mc-type > label").text("Estilo de Caja");
            $("#mc-type-checkbox label").text("Caja");
            $("#mc-type-slider label").text("Deslizador");
            $("#mc-type-toggle label").text("Palanca");
            $("#mc-settings > label").text("Opciones de Campo");
            $("#mc-dropdown label").text("Desplegable");
            $("#mc-searchable label").text("Buscable");
            $("#dd-add span").text("Agregar Opción");
            $("#modal-field .content .ui.error.message .header").text("Datos invalidos");
            $("#modal-field .content .ui.error.message p").text("Por favor, llene el formulario con datos validos");
            $("#modal-field-exit span").text("Salir");
            $("#modal-field-save span").text("Grabar Campo");
            // MODAL - DELETE FIELD
            $("#modal-field-delete-confirmation > .header > span").text("Borrar Campo");
            $("#modal-field-delete-confirmation > .content p").text("Eliminar este campo eliminará todos los datos asociados con él. Estás seguro de que quieres continuar?");
            $("#modal-field-delete-confirmation-yes span").text("Si");
            $("#modal-field-delete-confirmation-no span").text("No");
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
            // UI-TOOLBAR-SLIM
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
            
            break;
        case "en":
            $(".modal-write-message").addClass("en");
            break;
        default:
            break;
    }
}
function translatePills() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            $(".lead-contacts li").each(function() {
                let phoneLink = $(this).find('.w_call');
                if(phoneLink.length) {
                    let phoneNumber = phoneLink.attr("data-phone");
                    phoneLink.attr("data-content", "Llamar: " + phoneNumber);
                }
                let emailLink = $(this).find('.w_email');
                if(emailLink.length) {
                    let email = emailLink.attr("data-email");
                    emailLink.attr("data-content", "Envíar correo a: " + email);
                }
            });
            break;
    }
}
function translateActionLog() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            $(".lead-actionlog tbody tr.action-row.action-oc").each(function() {
                let status = $(this).find("td.icon-col").attr("data-content");
                switch(status) {
                    case "Outgoing Call - Answered":
                        $(this).find("td.icon-col").attr("title","Llamada Saliente - Contestado");
                        $(this).find("td.icon-col").attr("data-content","Llamada Saliente - Contestado");
                        break;
                    case "Outgoing Call - Not Answered":
                        $(this).find("td.icon-col").attr("title","Llamada Saliente - Sin Contestar");
                        $(this).find("td.icon-col").attr("data-content","Llamada Saliente - Sin Contestar");
                        break;
                }
                $(this).find(".w_to").text("Para: ");
                $(this).find(".w_duration").text("Duración: ");
                $(this).find(".w_recording").text("Grabación: ");
                $(this).find(".w_transcription").text("Transcripción: ");
            });
            $(".lead-actionlog tbody tr.action-row.action-ic").each(function() {
                let status = $(this).find("td.icon-col").attr("data-content");
                switch(status) {
                    case "Incoming Call - Answered":
                        $(this).find("td.icon-col").attr("title","Llamada Entrante - Contestado");
                        $(this).find("td.icon-col").attr("data-content","Llamada Entrante - Contestado");
                        break;
                    case "Incoming Call - Not Answered":
                        $(this).find("td.icon-col").attr("title","Llamada Entrante - Sin Contestar");
                        $(this).find("td.icon-col").attr("data-content","Llamada Entrante - Sin Contestar");
                        break;
                }
                $(this).find(".w_from").text("De: ");
                $(this).find(".w_duration").text("Duración: ");
                $(this).find(".w_recording").text("Grabación: ");
                $(this).find(".w_transcription").text("Transcripción: ");
            });
            $(".lead-actionlog tbody tr.action-row.action-oe").each(function() {
                let status = $(this).find("td.icon-col").attr("data-content");
                switch(status) {
                    case "Outgoing Email":
                        $(this).find("td.icon-col").attr("title","Correo Saliente");
                        $(this).find("td.icon-col").attr("data-content","Correo Saliente");
                        break;
                    case "Outgoing Email - Opened":
                        $(this).find("td.icon-col").attr("title","Correo Saliente - Abierto");
                        $(this).find("td.icon-col").attr("data-content","Correo Saliente - Abierto");
                        break;
                }
                $(this).find(".w_to").text("Para: ");
                $(this).find(".w_message").text("Mensaje: ");
            });
            $(".lead-actionlog tbody tr.action-row.action-ie").each(function() {
                let status = $(this).find("td.icon-col").attr("data-content");
                switch(status) {
                    case "Incoming Email":
                        $(this).find("td.icon-col").attr("title","Correo Entrante");
                        $(this).find("td.icon-col").attr("data-content","Correo Entrante");
                        break;
                    case "Incoming Email - Opened":
                        $(this).find("td.icon-col").attr("title","Correo Entrante - Abierto");
                        $(this).find("td.icon-col").attr("data-content","Correo Entrante - Abierto");
                        break;
                }
                $(this).find(".w_from").text("De: ");
                $(this).find(".w_message").text("Mensaje: ");
            });
            $(".lead-actionlog tbody tr.action-row.action-task").each(function() {
                let status = $(this).find("td.icon-col").attr("data-content");
                switch(status) {
                    case "Open Task":
                        $(this).find("td.icon-col").attr("title","Tarea Abierta");
                        $(this).find("td.icon-col").attr("data-content","Tarea Abierta");
                        break;
                    case "Finished Task":
                        $(this).find("td.icon-col").attr("title","Tarea Terminada");
                        $(this).find("td.icon-col").attr("data-content","Tarea Terminada");
                        break;
                }
                $(this).find(".w_duedate").text("Fecha de Entrega: ");
            });
            $(".lead-actionlog tbody tr.action-row.action-sale").each(function() {
                let status = $(this).find("td.icon-col").attr("data-content");
                switch(status) {
                    case "Successful Sale":
                        $(this).find("td.icon-col").attr("title","Venta Exitosa");
                        $(this).find("td.icon-col").attr("data-content","Venta Exitosa");
                        $(this).find(".action-status").text("Venta Exitosa");
                        break;
                    case "Active Opportunity":
                        $(this).find("td.icon-col").attr("title","Oportunidad Vigente");
                        $(this).find("td.icon-col").attr("data-content","Oportunidad Vigente");
                        $(this).find(".action-status").text("Oportunidad Vigente");
                        break;
                    case "Lost Opportunity":
                        $(this).find("td.icon-col").attr("title","Oportunidad Perdida");
                        $(this).find("td.icon-col").attr("data-content","Oportunidad Perdida");
                        $(this).find(".action-status").text("Oportunidad Perdida");
                        break;
                }
                $(this).find(".w_duedate").text("Fecha de Entrega: ");
            });
            $(".lead-actionlog tbody tr.action-row.action-note").each(function() {
                $(this).find("td.icon-col").attr("title","Nota");
                $(this).find("td.icon-col").attr("data-content","Nota");
            });
            break;
    }
}
//#endregion
// #region LAUNCH
function launchLead() {
    uuid = getParameterByName("uuid");
    leadAPI = leadAPI + "/" + uuid;
    runcalluuid = getParameterByName("runcall");
    $(".lead-contacts .ui.data.dimmer").addClass("active");
    $(".lead-actionlog .ui.data.dimmer").addClass("active");
    var leadRequest = $.ajax({
        method: "GET",
        url: leadAPI,
        dataType: "json"
    });
    leadRequest.done(function(result, textStatus, jqXHR) {
        if(parseInt(result.success)) {
            pfData = result.data;
            setLeadDetails();
            setContactDetails();
            setActionLog();
            setRunCall();
            translateLead();
            $("#log-note-editor").css("height","240px");
            
            $(".lead-actionlog table").tablesorter({
                headers: {
                    //0: { sorter: false }, //using the tablesorter disables the SUI popup, but its still visible on hover, as title
                    1: { sorter: false },
                    4: { sorter: false },
                    5: { sorter: false }
                },
                textExtraction : {
                    0 : function(node, table, cellIndex) {
                        return $(node).parent().attr('data-type');
                    }
                }
            });
        } else {
            toastr.error(w_server_error_h);
        }
    });
    leadRequest.fail(handleAPIError);
    leadRequest.always(function() {
        $(".lead-contacts > .loader").hide();
        $(".lead-actionlog > .loader").hide();
        $(".lead-contacts .ui.data.dimmer").removeClass("active");
        $(".lead-actionlog .ui.data.dimmer").removeClass("active");
    });
}
function getLeadSearchesAJAX() {
    var getLeadSearchesRequest = $.ajax({
        method: "GET",
        url: leadsearchAPI,
        dataType: "json"
    });
    getLeadSearchesRequest.done(function(res) {
        $.each(res.data, function(k,v) {
            // Add to Menu
            var newListRow = "<li class='sub-link'>";
            // newListRow += "<div class='linkRemove'><a href='#' class='deleteLeadSearch' data-id='" + v.ID + "'><i class='icon trash'></i></a></div>";
            newListRow += "<a href='/leads?q=" + v.SearchQuery;
            if(v.ListUUID) {
                newListRow += "&list=" + v.ListUUID;
            }
            newListRow += "'>";
            newListRow += "<i class='icon search'></i><span>" + escapeHtml(v.SearchName) + "</span></a>";
            newListRow += "</li>";
            $("#nav-lead-list").append(newListRow);
        });
        $("#nav-lead-list").slideDown(200);
    });
    getLeadSearchesRequest.fail(handleAPIError);
    getLeadSearchesRequest.always(function() {
    });
}
function getLeadListAJAX() {
    var getLeadListRequest = $.ajax({
        method: "GET",
        url: leadlistAPI,
        dataType: "json"
    });
    getLeadListRequest.done(function(res) {
        pfLeadList = res.data;
        $.each(pfLeadList, function(k,v) {
            // Add to Menu
            var newListRow = "<li class='sub-link'>";
            // newListRow += `<div class='linkRemove'><a href='#' class='deleteLeadList' data-uuid='${v.UUID}'><i class='icon trash'></i></a></div>`;
            let listIcon = "<i class='icon list layout'></i>";
            let listName = `<span>${escapeHtml(v.ListName)}</span>`;
            newListRow += `<a href='/leads?list=${v.UUID}'>${listIcon}${listName}</a></li>`;
            $("#nav-lead-list").append(newListRow);
        });
        getLeadSearchesAJAX();
    });
    getLeadListRequest.fail(handleAPIError);
    getLeadListRequest.always(function() {
    });
}

$(function() {
    launchInterval = setInterval(function() {
        if(mainCustomer && mainCustomer.CustomerName) {
            getLeadListAJAX();
            launchLead();
            clearInterval(launchInterval);
        }
    }, 100);
});
//#endregion
