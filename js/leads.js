//#region DICTIONARY
let w_lead_records_exceeded = "Lead Record Limit Reached";
//#endregion
//#region CORE METHODS
var isDragging;
function setLeadTable() {
    if(pfCustomField) { 
        $.each(pfCustomField, function(k,v) {
            var newRow = "<th class='col-" + parseName(v.FieldName) + "' style='min-width: 200px'><span>" + escapeHtml(v.FieldName.replace("_"," ")) + "</span></th>";
            $(".ui-table th.col-datecreated").before(newRow);
        });
    }

    $.each(pfData, function(k,v) {
        // ROW PAINT
        var newRow = "<tr id='pfLeadRow" + v.UUID + "' data-uuid='" + v.UUID + "' data-tail='" + v.EmailTail + "' data-phone='" + v.PhoneTail + "'>";
        newRow += "<td class='col-check' style='width: 37.6px;'>" + "<div class='ui fitted checkbox'><input type='checkbox' class='hidden'/></div>" + "</td>";
        newRow += "<td class='col-link col-company'>" + "<a href='lead?uuid=" + v.UUID +"'>" + (v.LeadName ? escapeHtml(v.LeadName) : '') + "</a></td>";
        newRow += "<td class='col-data col-contactname'><span>" + (v.PrimaryContact.ContactName ? escapeHtml(v.PrimaryContact.ContactName) : '') + "</span></td>";
        newRow += "<td class='col-data col-contactemail'><span>" + (v.PrimaryContact.ContactEmail ? escapeHtml(v.PrimaryContact.ContactEmail) : '') + "</span></td>";
        newRow += "<td class='col-data col-status'><span>" + (v.LeadStatus ? escapeHtml(v.LeadStatus) : '') + "</span></td>";
        newRow += "<td class='col-data col-location'><span>" + (v.LeadLocation ? escapeHtml(v.LeadLocation) : '') + "</span></td>";
        newRow += "<td class='col-data col-source'><span>" + (v.LeadSource ? escapeHtml(v.LeadSource) : '') + "</span></td>";
        if(pfCustomField) {
            $.each(pfCustomField, function(cfk,cfv) {
                var fieldValue = v["CF" + cfv.ValuePos];
                newRow += "<td class='col-data col-" + parseName(cfv.FieldName) + "'><span>" + (fieldValue ? escapeHtml(fieldValue) : '') + "</span></td>";
            });
        }
        newRow += "<td class='col-data col-datecreated'><span>" + (v.DateCreated ? getshortdt(v.DateCreated) : '') + "</span></td>";
        newRow += "<td class='col-data col-datemodified'><span>" + (v.DateModified ? getshortdt(v.DateModified) : '') + "</span></td>";
        newRow += "<td class='col-data col-lastaction'><span>" + (v.LastAction ? v.LastAction : '') + "</span></td>";
        newRow += "</tr>";
        $(".ui-table tbody").append(newRow);
        // ROW CLICK - CHECK BEHAVIOR 1
        $("#pfLeadRow" + v.UUID).click(function(e) {
            var checkContainer = $("#pfLeadRow" + v.UUID + " .col-check .checkbox");
            var linkContainer = $("#pfLeadRow" + v.UUID + " .col-link");
            if(checkContainer.has(e.target).length === 0
                && linkContainer.has(e.target).length === 0) {
                $("#pfLeadRow" + v.UUID + " .col-check .checkbox").checkbox("toggle");
            }
            if(e.shiftKey) {
                var firstCheck = $("td.col-check input[type='checkbox']:checked:first");
                var firstIndex = $(firstCheck).parents("tr").index();
                var lastCheck = $("td.col-check input[type='checkbox']:checked:last");
                var lastIndex = $(lastCheck).parents("tr").index();
                var checkIndex = $("#pfLeadRow" + v.UUID).index();
                if(firstIndex == checkIndex) {
                    checkIndex = lastIndex;
                }
                $(".ui-table tbody tr").slice(firstIndex,checkIndex+1).find(".col-check > div:visible").checkbox("check");
                document.getSelection().removeAllRanges();
            }
            if(pfData.length == $("td.col-check input[type='checkbox']:checked").length) {
                $(".col-head-check .ui.checkbox").checkbox("set checked");
            }
        });
        // ROW DRAG SELECTION
        $("#pfLeadRow" + v.UUID).mouseout(function() {
            var isChecked = $("#pfLeadRow" + v.UUID + " .col-check .checkbox").checkbox("is checked");
            if(isDragging && !isChecked) {
                $("#pfLeadRow" + v.UUID).trigger("click");
            }
        });
        $("#pfLeadRow" + v.UUID).mouseover(function() {
            var isChecked = $("#pfLeadRow" + v.UUID + " .col-check .checkbox").checkbox("is checked");
            if(isDragging && !isChecked) {
                $("#pfLeadRow" + v.UUID).trigger("click");
            }
        });
    });

    wireDragSelection(); // ENABLE DRAGGING
}
function setCheckBehavior() {
    // CHECK BEHAVIOR 2
    $("td.col-check > div").checkbox({
        onChecked : function() {
            toggleButtons(true);
            $(this).parents("tr").find("td").css("background", "var(--color-table-row-hover-bg)");
            var checkedBoxes = $("td.col-check input[type='checkbox']:checked").length;                    
            switch(mainCustomer.CustomerLanguage) {
                case "es":
                    var pluralPlaceholder = (checkedBoxes > 1) ? "s" : "";
                    $("#leads-selected-counter").text("(" + checkedBoxes + " Marcado" + pluralPlaceholder + ")");
                    break;
                default:
                    $("#leads-selected-counter").text("(" + checkedBoxes + " Selected)");
                    break;
            }
            $("#leads-selected-counter").css("display","inline-block");            
            if(checkedBoxes > 1) {
                $("#leads-merge").css("display","inline-block");
            }
        },
        onUnchecked : function() {
            $(this).parents("tr").find("td").css("background", "");
            $(".col-head-check .ui.checkbox").checkbox("set unchecked");
            var checkedBoxes = $("td.col-check input[type='checkbox']:checked").length;                    
            switch(mainCustomer.CustomerLanguage) {
                case "es":
                    var pluralPlaceholder = (checkedBoxes > 1) ? "s" : "";
                    $("#leads-selected-counter").text("(" + checkedBoxes + " Marcado" + pluralPlaceholder + ")");
                    break;
                default:
                    $("#leads-selected-counter").text("(" + checkedBoxes + " Selected)");
                    break;
            }
            if(checkedBoxes == 0) {
                toggleButtons(false);
                $("#leads-selected-counter").hide();
            }
        }
    });
    $(".col-head-check .ui.checkbox").checkbox({
        onChecked : function() {
            $(".ui-center tr:visible td.col-check > div").checkbox("check");
        },
        onUnchecked : function() {
            $(".ui-center tr:visible td.col-check > div").checkbox("uncheck");
        }
    });
    $("body").mouseup(function(e) {
        var leadsTable = $(".docker");
        var leadsButtons = $(".leads-bar .btn");
        var toprightButton = $(".userButton");
        var toprightMenu = $(".userMenu");
        var listLeadModal = $("#modal-list");
        var uiExec = $("#ui-bar");
        if (!leadsTable.is(e.target) // if the target of the click isn't the container...
            && leadsTable.has(e.target).length === 0  // ... nor a descendant of the container
            && !leadsButtons.is(e.target) // nor the button itself
            && leadsButtons.has(e.target).length === 0
            && !toprightButton.is(e.target) // nor the button itself
            && toprightButton.has(e.target).length === 0
            && !toprightMenu.is(e.target) // nor the button itself
            && toprightMenu.has(e.target).length === 0
            && !listLeadModal.is(e.target) // nor the button itself
            && listLeadModal.has(e.target).length === 0
            && !uiExec.is(e.target) // nor the button itself
            && uiExec.has(e.target).length === 0)
        {
            $("td.col-check > div").checkbox("uncheck");
        }
    });
}
function updateLeadDisplay() {
    if(pfData === undefined) {
        $(".col-head-check .ui.checkbox").checkbox("set unchecked");
        $(".no-data").show();
        $("#leads-total-counter").text("");
    } else {
        if(pfData.length) {
            updateLeadResults();
        } else {
            $(".col-head-check .ui.checkbox").checkbox("set unchecked");
            $(".no-data").show();
            $("#leads-total-counter").text("");
        }
    }
}
function updateLeadResults() {
    var leadsFiltered = 0;
    $(".ui-table tbody tr").each(function(i) {
        if(query) {
            if($(this).text().toLowerCase().indexOf(query) > -1) {
                $(this).css("display","table-row");
                leadsFiltered++;
            } else {
                $(this).hide();
            }
        } else {
            leadsFiltered++;
            $(this).css("display","table-row");
        }
    });
    if(leadsFiltered) {
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                $("#leads-total-counter").text((leadsFiltered == 1) ? "1 Cliente" : leadsFiltered + " Clientes");
                break;
            default:
                $("#leads-total-counter").text((leadsFiltered == 1) ? "1 Lead" : leadsFiltered + " Leads");
                break;
        }
        $(".no-data").hide();
    } else {
        $(".col-head-check .ui.checkbox").checkbox("set unchecked");
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                $(".no-data p").text("NO HAY CLIENTES");
                break;
            default:
                $(".no-data p").text("NO LEADS FOUND");
                break;
        }                  
        $(".no-data").show();
        $("#leads-total-counter").text("");
    }
}
function updateLeadStatusAJAX(value, text) {
    let leadStatus = value;

    var checkedBoxes = $("td.col-check input[type='checkbox']:checked");
    let leads = [];
    $.each(checkedBoxes, function(k,v) {
        leads.push($(v).parents("tr").attr("data-uuid"));
    });
    
    let req = $.ajax({
        method: "PATCH",
        dataType: "json",
        url: leadAPI,
        data: { leads, leadStatus, statusUpdates: 1 }
    });
    req.done(function() {
        $(".lead-status .ui.dropdown").dropdown({ onChange: function() {} });
        $(".lead-status .ui.dropdown").dropdown("restore defaults");
        $(".lead-status .ui.dropdown").dropdown({ onChange: updateLeadStatusAJAX });
        // location.reload();
        $.each(checkedBoxes, function(k,v) {
            let leaduuid = $(v).parents("tr").attr("data-uuid");
            $(v).parents("tr").find("td.col-status span").text(leadStatus);
            $.each(pfData, function(k,v) { if(v.UUID == leaduuid) { v.LeadStatus = leadStatus; } });
        });
    });
    req.fail(handleAPIError);
    req.always(function() {
    });
}
function setActions() {
    // LEAD ACTIONS
    $("#leads-call").click(function() {
        var checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        itemsChecked = checkedBoxes.length;
        if(itemsChecked == 0) {
            return false;
        }
        addRunCallAJAX();
    });
    $("#leads-email").click(function() {
        var checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        itemsChecked = checkedBoxes.length;
        if(itemsChecked == 0) {
            return false;
        }
        if(!mainCustomer.CompanyEmail) {
            $("#modal-info .content p").html("You need a company email address to launch email campaigns");
            $("#modal-info").modal("show");
            return false;
        }
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                $("#modal-emailer .header").html("<i class='icon envelope' style='margin-right: 12px;'></i><span>Envíar correo a " + itemsChecked + " Cliente" + ((itemsChecked > 1) ? "s" : "") + "</span>");
                break;
            default:
                $("#modal-emailer .header").html("<i class='icon envelope' style='margin-right: 12px;'></i><span>Email " + itemsChecked + " Lead" + ((itemsChecked > 1) ? "s" : "") + "</span>");
                break;
        }
        $("#modal-emailer").modal("show");

        $("#modal-emailer-primary").off("click");
        $("#modal-emailer-primary").click(function() {
            var toString = "";
            var isPrimaryContactFound = true;
            $.each(checkedBoxes, function(k,v) {
                if(k>0) { toString += ","; }
                var tailString = $(v).parents("tr").attr("data-tail");
                // PLUCK Primary Contact
                if(tailString.indexOf(",") > -1) { // PLUCK first element
                    var pcString = tailString.substring(0,tailString.indexOf(","));
                    if(pcString.length) {
                        toString += pcString;
                    } else {
                        isPrimaryContactFound = false;
                    }
                } else { // PLUCK string
                    if(tailString.length) {
                        toString += tailString;
                    } else {
                        isPrimaryContactFound = false;
                    }
                }
            });
            var toArr = [];
            toString.split(",").forEach(function(element) {
                if(element) {
                    toArr.push(element);
                }
            });
            if(toArr.length) {
                window.location.replace("/campaigns?to=" + toArr.toString());
            } else {
                alert("Selected lead(s) are missing lead contacts with email addresses");
            }
        });
        $("#modal-emailer-all").off("click");
        $("#modal-emailer-all").click(function() {
            var toString = "";
            var isContactsFound = true;
            $.each(checkedBoxes, function(k,v) {
                if(k>0) { toString += ","; }
                var tailString = $(v).parents("tr").attr("data-tail");
                if(tailString.length) {
                    toString += tailString;
                } else {
                    isContactsFound = false;
                }
            });
            var toArr = [];
            toString.split(",").forEach(function(element) {
                if(element) {
                    toArr.push(element);
                }
            });
            if(toArr.length) {
                window.location.replace("/campaigns?to=" + toArr.toString());
            } else {
                alert("Selected lead(s) are missing lead contacts with email addresses");
            }
        });

    });
    $("#leads-sms").click(function() {
        $("#modal-sms .ui.form").removeClass("error");
        $("#modal-sms #sms-message").removeClass("error");
        $("#modal-sms textarea").val("");
        var checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        itemsChecked = checkedBoxes.length;
        if(itemsChecked == 0) {
            return false;
        }
        if(!mainCustomer.CompanyPhone) {
            switch(mainCustomer.CustomerLanguage) {
                case "es":
                    $("#modal-info .content p").html("Necesita un número de teléfono de la empresa para enviar SMS masivos");
                    break;
                default:
                    $("#modal-info .content p").html("You need a company phone number to send bulk sms");
                    break;
            }
            $("#modal-info").modal("show");
            return false;
        }
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                $("#modal-sms .header").html("<i class='icon comment' style='margin-right: 12px;'></i><span>Envíar SMS a " + itemsChecked + " Cliente" + ((itemsChecked > 1) ? "s" : "") + "</span>");
                break;
            default:
                $("#modal-sms .header").html("<i class='icon comment' style='margin-right: 12px;'></i><span>Send SMS to " + itemsChecked + " Lead" + ((itemsChecked > 1) ? "s" : "") + "</span>");
                break;
        }
        $("#modal-sms").modal("show");
        $("#modal-sms-primary").off("click");
        $("#modal-sms-primary").click(function() {
            var toString = "";
            var validated = true;
            $.each(checkedBoxes, function(k,v) {
                if(k>0) { toString += "<"; }
                var tailString = $(v).parents("tr").attr("data-phone");
                if(tailString.indexOf("<") > -1) {
                    var pcString = tailString.substring(0,tailString.indexOf("<"));
                    if(pcString.length > 0) {
                        toString += pcString;
                    } else {
                        validated = false; //fail validation, no primary contact detected
                    }
                } else {
                    if(tailString.length > 0) {
                        toString += tailString;
                    } else {
                        validated = false; //fail validation, no primary contact detected
                    }
                }
            });
            if(validated) {
                sendSMS(toString);
            } else {
                alert("One or more selected leads are missing lead contacts with phone numbers");
            }
        });
        $("#modal-sms-all").off("click");
        $("#modal-sms-all").click(function() {
            var toString = "";
            var validated = true;
            $.each(checkedBoxes, function(k,v) {
                if(k>0) { toString += "<"; }
                var tailString = $(v).parents("tr").attr("data-phone");
                if(tailString.length > 0) {
                    toString += tailString;
                } else {
                    validated = false;
                }
            });
            if(validated) {
                sendSMS(toString);
            } else {
                alert("One or more selected leads are missing lead contacts with phone numbers");
            }
        });
    });
    $("#leads-add").click(function() {
        $("#modal-detail .ui.form").removeClass("error");
        $("#detail-name").removeClass("error");
        $(".field-edit-btn").hide();
        $("#cf-add-field").hide();
        // AUTO TITLE
        if($("#modal-detail #detail-name input").val().trim() == "") {
            switch(mainCustomer.CustomerLanguage) {
                case "es":
                    $("#modal-detail > .header").html("<i class='icon user'></i><span>Detalles del Cliente</span>");
                    break;
                default:
                    $("#modal-detail > .header").html("<i class='icon user'></i><span>Lead Details</span>");
                    break;
            }
        }
        $("#modal-detail").modal({ autofocus: true, closable: false }).modal("show");
        if(pfCustomField) {
            $.each(pfCustomField, function(k,v) {
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
                        switch(v.FieldDefault) {
                            case "Based Off":
                                sugarDT = Sugar.Date.addSeconds(sugarDT, v.FieldPlaceholder);
                                break;
                            case "Static":
                                sugarDT = Sugar.Date.create(v.FieldPlaceholder, { fromUTC: false });
                                break;
                        }
                        var dtvalue = Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                        $("#modal-detail .field-" + parseName(v.FieldName) + " input").val(dtvalue); 
                        $("#modal-detail .field-" + parseName(v.FieldName)).calendar({ type: v.FieldType.toLowerCase(), today: true });    
                        break;
                    case "Dropdown":
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown();
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("set selected", (v.FieldDefault ? v.FieldDefault : ""));
                        break;
                    case "Singlechoice":
                    case "Checkbox":
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.checkbox").checkbox();
                        break;
                    case "Multichoice":
                        if(v.HasDropdown == "1") {
                            var optDefault = v.FieldDefault.split(",");
                            $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown();
                            $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.dropdown").dropdown("set selected", (v.FieldDefault ? optDefault : ""));
                        } else {
                            $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.checkbox").checkbox();
                        }
                        break;
                    case "Progress":
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.progress").progress();
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.progress").progress("set percent", (v.FieldDefault ? v.FieldDefault : ""));
                        break;
                    case "Rating":
                        $("#modal-detail .field-" + parseName(v.FieldName) + " .ui.rating").rating();
                        break;
                }
            });
        }
    });
    $("#leads-merge").click(function() {
        var checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        let leadsToMerge = [];
        $.each(checkedBoxes, function(k,v) {
            let data = {
                value: $(v).parents("tr").attr("data-uuid"),
                text: $(v).parents("tr").find("td.col-company > a").text(),
                name: $(v).parents("tr").find("td.col-company > a").text()
            }
            leadsToMerge.push(data);
        });
        $("#modal-merge-dd").dropdown('setup menu', { values: leadsToMerge } ).dropdown().dropdown("set selected", leadsToMerge[0].value);
        $("#modal-merge").modal({ closable: false, autofocus: false }).modal("show");
        $("#modal-merge-confirm").off("click");
        $("#modal-merge-confirm").click(function() {
            uuid = $("#modal-merge-dd").dropdown("get value");
            
            $.each(checkedBoxes, function(k,v) {
                let leaduuid = $(v).parents("tr").attr("data-uuid");
                if(leaduuid != uuid) {
                    $(v).parents("tr").remove();
                    $(".ui-center .ui-table").trigger("update");
                    var cIndex = 0;
                    $.each(pfData, function(k,v) { if(v.UUID == leaduuid) { cIndex = k; } });
                    pfData.splice(cIndex,1);
                }
            });
            $("td.col-check > div").checkbox("uncheck");
            $("#leads-selected-counter").text("");
            toggleButtons(false);
            updateLeadDisplay();

            mergeLeadAJAX(leadsToMerge.map(v => v.value));
        });
    });
    $(".lead-status .ui.dropdown").dropdown();
    $(".lead-status .ui.dropdown").dropdown({ onChange: updateLeadStatusAJAX });
    
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
    $("#modal-detail-delete").hide();
    $("#modal-detail-save").click(function() {
        var passedValidation = true;
        clean_pfLead();
        // SAVE NAME FIELD
        pfLead.LeadName = $("#modal-detail input[name='detail-name']").val(); 
        pfLead.LeadLocation = $("#modal-detail input[name='detail-location']").val();
        pfLead.LeadSource = $("#modal-detail input[name='detail-source']").val();     
        // LEAD NAME VALIDATION
        if(pfLead.LeadName == "") {
            $("#detail-name").addClass("error");
            passedValidation = false;
        } else {
            $("#detail-name").removeClass("error");
        }
        // SAVE CUSTOM FIELDS
        if(pfCustomField) {
            $.each(pfCustomField, function(k,v) {
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
                pfLead["CF" + v.ValuePos] = fieldValue;
            });
        }

        if(passedValidation) {
            $("#modal-detail .ui.form").removeClass("error");
        } else {
            $("#modal-detail .ui.form").addClass("error");
            return false;
        }
        $("#modal-detail").off("keyup");
        insertLeadAJAX();
    });

    // SEARCH LEADS
    $("#leads-search").keyup(function(e) {
        query = $("#leads-search input").val().toLowerCase();
        updateLeadDisplay();
    });
    $("#leads-savesearch").click(function() {
        insertSearchAJAX();
    });
    // DELETE LEADS
    $("#leads-delete").click(function() {
        var checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        itemsChecked = checkedBoxes.length;
        itemsDeleted = 0;
        if(itemsChecked == 0) {
            return false;
        }
        $(".ui.main.page.dimmer").addClass("active");
        $.each(checkedBoxes, function(k,v) {
            if(k && (k % 20 == 0)) {
                setTimeout(function() {
                    orderDeleteLead(v);
                }, 1000);
            } else {
                orderDeleteLead(v);
            }
        });
        $("td.col-check > div").checkbox("uncheck");
        $("#leads-selected-counter").text("");
        toggleButtons(false);
        updateLeadDisplay();
    });
    $("body").keyup(function(event) {
        if(event.which == 46) {
            $("#leads-delete").trigger("click");
        }
    });

    // IMPORT LEADS
    $("#leads-import").click(function() {
        $("#modal-import").modal('show');
        $("#modal-import .ui.form").removeClass("error");
        $("#modal-import .ui.form").removeClass("warning");
        $("#modal-import-file").removeClass("error");
        $("#modal-import .ui.progress").hide();
        $("#import-file").val("");
        $("#import-name").val("");

        $("#modal-import").off("keyup");
        $("#modal-import").keyup(function(event) {
            if(event.which == 13) {
                $("#modal-import #import-start").trigger("click");
            }
        });
    });
    $("#import-name").click(function() {
        $("#modal-import-file label").trigger("click");
    })
    $("#import-file").change(function() {
        if($("#import-file")[0].files.length) {
            $("#import-name").val($("#import-file")[0].files[0].name);
        }
    });
    $("#modal-import #import-tips").click(function() {
        var leadJSON = [];
        $.each(pfData, function(k,v) {
            var row = {};
            row['Lead Name'] = "";                
            $.each(pfCustomField, function(cfk,cfv) {
                row['Lead ' + parseName(cfv.FieldName)] = "";
            });
            row['Lead Status'] = "";
            row['Lead Noteboard'] = "";
            row['Contact Name'] = "";
            row['Contact Title'] = "";
            row['Contact Avatar'] = "";
            row['Contact Phone'] = "";
            row['Contact Email'] = "";
            leadJSON.push(row);
        });
        var csvString = Papa.unparse(leadJSON);
        var filename = "Leads-Schema.csv"; 
        if (!csvString.match(/^data:text\/csv/i)) {
            csvString = 'data:text/csv;charset=utf-8,' + csvString;
        }
        var data = encodeURI(csvString);
        var link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    $("#modal-import #import-start").click(function() {
        if(!$("#import-file")[0].files.length) {
            $("#modal-import .ui.form").addClass("error");
            $("#modal-import-file").addClass("error");
            return false;
        } else {
            $("#modal-import .ui.form").removeClass("error");
            $("#modal-import-file").removeClass("error");
        }
        $("#import-file").parse({
            config: {
                delimiter: "",	// auto-detect
                newline: "",	// auto-detect
                header: true,
                dynamicTyping: false,
                preview: 0,
                encoding: "",
                worker: false,
                comments: false,
                complete: parseCSV,
                error: function(err) {
                    $("#modal-import .ui.form").addClass("warning");
                    $("#modal-import .ui.form .warning p").text(err);
                    // console.log(err);
                },
                download: false,
                skipEmptyLines: false,
                chunk: undefined,
                fastMode: undefined,
                beforeFirstChunk: undefined,
                withCredentials: undefined
            }
        });
        return false;
    });


    // EXPORT LEADS
    $("#leads-export").click(function() {
        var checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        var leadJSON = [];
        if(checkedBoxes.length > 0) { // EXPORT CHECKED ROWS ONLY
            $.each(checkedBoxes,function(p,t) {
                uuid = $(t).parents("tr").attr("data-uuid");
                $.each(pfData, function(k,v) {
                    if(v.UUID == uuid) {
                        var row = {};
                        row['Lead Name'] = v.LeadName;
                        $.each(pfCustomField, function(cfk,cfv) {
                            row['Lead ' + parseName(cfv.FieldName).replace("_"," ")] = v["CF" + cfv.ValuePos];
                        });
                        row['Lead Status'] = v.LeadStatus;
                        row['Lead Noteboard'] = v.LeadNoteboard;
                        row['Contact Name'] = v.PrimaryContact.ContactName;
                        row['Contact Title'] = v.PrimaryContact.ContactTitle;
                        row['Contact Avatar'] = v.PrimaryContact.ContactAvatar;
                        row['Contact Phone'] = v.PrimaryContact.ContactPhone;
                        row['Contact Email'] = v.PrimaryContact.ContactEmail;
                        leadJSON.push(row);
                        return false;
                    }
                });
            });
        } else { // EXPORT ALL
            $.each(pfData, function(k,v) {
                var row = {};
                row['Lead Name'] = v.LeadName;                
                $.each(pfCustomField, function(cfk,cfv) {
                    row['Lead ' + parseName(cfv.FieldName).replace("_"," ")] = v["CF" + cfv.ValuePos];
                });
                row['Lead Status'] = v.LeadStatus;
                row['Lead Noteboard'] = v.LeadNoteboard;
                row['Contact Name'] = v.PrimaryContact.ContactName;
                row['Contact Title'] = v.PrimaryContact.ContactTitle;
                row['Contact Avatar'] = v.PrimaryContact.ContactAvatar;
                row['Contact Phone'] = v.PrimaryContact.ContactPhone;
                row['Contact Email'] = v.PrimaryContact.ContactEmail;
                leadJSON.push(row);
            });
        }
        var csvString = Papa.unparse(leadJSON);
        var filename = "Leads-" + Sugar.Date.format(new Date(), '%F-{X}') + ".csv"; 
        if (!csvString.match(/^data:text\/csv/i)) {
            csvString = 'data:text/csv;charset=utf-8,' + csvString;
        }
        var data = encodeURI(csvString);
        var link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // CHANGE COLUMNS
    $("#leads-columns").click(function() {
        $("#modal-columns").modal("show");
    });

    if(pfCustomField) {
        $.each(pfCustomField, function(k,v) {
            var newCheckbox = "<div class='field'>";
            newCheckbox += "<div class='ui toggle checkbox' id='modal-col-" + parseName(v.FieldName) + "'>";
            newCheckbox += "<input type='checkbox' name='modal-col-" + parseName(v.FieldName) + "' data-name='" + parseName(v.FieldName) + "'>";
            newCheckbox += "<label>" + escapeHtml(v.FieldName.replace("_", " ")) + "</label>";
            newCheckbox += "</div>";
            newCheckbox += "</div>";
            $("#modal-col-datecreated").before(newCheckbox);
        });
    }
    $("#modal-columns .ui.checkbox").checkbox({
        onChange: function() {
            if($(this).is(":checked")) {
                $(".col-" + $(this).attr("data-name")).show();
            } else {
                $(".col-" + $(this).attr("data-name")).hide();
            }
        },
        fireOnInit: true
    });
    $("#modal-col-company").checkbox((mainCustomer.ColLeadsCompany == "1") ? "check" : "uncheck");
    $("#modal-col-contactname").checkbox((mainCustomer.ColLeadsContactName == "1") ? "check" : "uncheck");
    $("#modal-col-contactemail").checkbox((mainCustomer.ColLeadsContactEmail == "1") ? "check" : "uncheck");
    $("#modal-col-status").checkbox((mainCustomer.ColLeadsStatus == "1") ? "check" : "uncheck");
    $("#modal-col-location").checkbox((mainCustomer.ColLeadsLocation == "1") ? "check" : "uncheck");
    $("#modal-col-source").checkbox((mainCustomer.ColLeadsSource == "1") ? "check" : "uncheck");
    if(pfCustomField) {
        $.each(pfCustomField, function(k,v) {
            $("#modal-col-" + parseName(v.FieldName)).checkbox((v.IsViewable == "1") ? "check" : "uncheck");
        });
    }
    $("#modal-col-datecreated").checkbox((mainCustomer.ColLeadsDateCreated == "1") ? "check" : "uncheck");
    $("#modal-col-datemodified").checkbox((mainCustomer.ColLeadsDateModified == "1") ? "check" : "uncheck");
    $("#modal-col-lastaction").checkbox((mainCustomer.ColLeadsLastAction == "1") ? "check" : "uncheck");
    $("#modal-columns-save").off("click");
    $("#modal-columns-save").click(function() {
        let viewSettings = {};
        if($("#modal-col-company").checkbox("is checked")) {
            $(".col-company").show();
            viewSettings.ColLeadsCompany = 1;
        } else {
            $(".col-company").hide();
            viewSettings.ColLeadsCompany = 0;
        }
        if($("#modal-col-contactname").checkbox("is checked")) {
            $(".col-contactname").show();
            viewSettings.ColLeadsContactName = 1;
        } else {
            $(".col-contactname").hide();
            viewSettings.ColLeadsContactName = 0;
        }
        if($("#modal-col-contactemail").checkbox("is checked")) {
            $(".col-contactemail").show();
            viewSettings.ColLeadsContactEmail = 1;
        } else {
            $(".col-contactemail").hide();
            viewSettings.ColLeadsContactEmail = 0;
        }
        if($("#modal-col-status").checkbox("is checked")) {
            $(".col-status").show();
            viewSettings.ColLeadsStatus = 1;
        } else {
            $(".col-status").hide();
            viewSettings.ColLeadsStatus = 0;
        }
        if($("#modal-col-location").checkbox("is checked")) {
            $(".col-location").show();
            viewSettings.ColLeadsLocation = 1;
        } else {
            $(".col-location").hide();
            viewSettings.ColLeadsLocation = 0;
        }
        if($("#modal-col-source").checkbox("is checked")) {
            $(".col-source").show();
            viewSettings.ColLeadsSource = 1;
        } else {
            $(".col-source").hide();
            viewSettings.ColLeadsSource = 0;
        }
        if(pfCustomField) {
            $.each(pfCustomField, function(k,v) {
                if($("#modal-col-" + parseName(v.FieldName)).checkbox("is checked")) {
                    $(".col-" + parseName(v.FieldName)).show();
                    v.IsViewable = 1;
                } else {
                    $(".col-" + parseName(v.FieldName)).hide();
                    v.IsViewable = 0;
                }
            });
        }
        if($("#modal-col-datecreated").checkbox("is checked")) {
            $(".col-datecreated").show();
            viewSettings.ColLeadsDateCreated = 1;
        } else {
            $(".col-datecreated").hide();
            viewSettings.ColLeadsDateCreated = 0;
        }
        if($("#modal-col-datemodified").checkbox("is checked")) {
            $(".col-datemodified").show();
            viewSettings.ColLeadsDateModified = 1;
        } else {
            $(".col-datemodified").hide();
            viewSettings.ColLeadsDateModified = 0;
        }
        if($("#modal-col-lastaction").checkbox("is checked")) {
            $(".col-lastaction").show();
            viewSettings.ColLeadsLastAction = 1;
        } else {
            $(".col-lastaction").hide();
            viewSettings.ColLeadsLastAction = 0;
        }
        updateViewSettings(viewSettings);
    });

    // ADD TO LIST
    $("#leads-list").click(function() {
        $("#modal-list .ui.form").removeClass("error");
        $("#modal-list .ui.form").removeClass("warning");
        $("#modal-list #list-type-new-field").removeClass("error");
        $("#modal-list").modal("show");

        $("#modal-list").off("keyup");
        $("#modal-list").keyup(function(event) {
            if(event.which == 13) {
                $("#modal-list #list-add").trigger("click");
            }
        });
    });
    $("#modal-list .ui.checkbox").checkbox({
        onChange: function() {
            var listType = $("#modal-list input[type='radio']:checked").val();
            if(listType == "New List") {
                $("#modal-list #list-name > input").prop("disabled", false);
                $("#modal-list #list-select .ui.dropdown").addClass("disabled");
            } else {
                $("#modal-list #list-name > input").prop("disabled", true);
                $("#modal-list #list-select .ui.dropdown").removeClass("disabled");
            }
        }
    });
    $("#modal-list #list-new > div").checkbox("check");
    $("#modal-list #list-add").click(function() {
        var listType = $("#modal-list input[type='radio']:checked").val();
        var listNameVal = $("#modal-list #list-name input").val();

        // #region Validation (List Name - Invalid)
        if(listType == "New List" && (listNameVal == "" || !isValidString(listNameVal,true,true))) {
            $("#modal-list .ui.form").removeClass("warning");
            $("#modal-list .ui.form").addClass("error");
            $("#modal-list #list-type-new-field").addClass("error");
            return false;
        } else {
            $("#modal-list #list-type-new-field").removeClass("error");
            $("#modal-list .ui.form").removeClass("error");
        }
        // #endregion
        // #region Validation (List Name - Exists)
        if(listType == "New List" && pfLeadList.length > 0) {
            var nameFound = false;
            $.each(pfLeadList, function(k,v) {
                if(v.ListName == listNameVal) {
                    nameFound = true;
                    return false;
                }
            });
            if(nameFound) {
                $("#modal-list #list-type-new-field").removeClass("error");
                $("#modal-list .ui.form").removeClass("error");
                $("#modal-list .ui.form").addClass("warning");
                return false;
            } else {
                $("#modal-list .ui.form").removeClass("warning");
            }
        }
        // #endregion

        //Action
        if(listType == "New List") {
            addLeadListAJAX(listNameVal);
        } else {
            refreshAfterOp = false;
            listuuid = $("#modal-list #list-select .ui.dropdown").dropdown("get value");
            var checkedBoxes = $("td.col-check input[type='checkbox']:checked");
            itemsChecked = checkedBoxes.length;
            leadcheckcounter = 0;
            $.each(checkedBoxes, function(k,v) {
                var leaduuid = $(v).parents("tr").attr("data-uuid");
                $(v).parents("tr").remove();
                $(".ui-center .ui-table").trigger("update");
                var cIndex = 0;
                $.each(pfData, function(k,v) { if(v.UUID == leaduuid) { cIndex = k; } });
                pfData.splice(cIndex,1);
                addLeadListJunctionAJAX(leaduuid);
            });
            $("td.col-check > div").checkbox("uncheck");
            $("#leads-selected-counter").text("");
            toggleButtons(false);
            updateLeadDisplay();
        }
    });

    // REMOVE FROM LIST
    $("#leads-remove").click(function() {
        var checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        itemsChecked = checkedBoxes.length;
        itemsDeleted = 0;
        if(itemsChecked == 0) {
            return false;
        }
        $(".ui.main.page.dimmer").addClass("active");
        $.each(checkedBoxes, function(k,v) {
            uuid = $(v).parents("tr").attr("data-uuid");
            $(v).parents("tr").remove();
            $(".ui-center .ui-table").trigger("update");
            var cIndex = 0;
            $.each(pfData, function(k,v) { if(v.UUID == uuid) { cIndex = k; } });
            pfData.splice(cIndex,1);
            removeLeadfromListAJAX();
        });
        $("td.col-check > div").checkbox("uncheck");
        $("#leads-selected-counter").text("");
        toggleButtons(false);
        updateLeadDisplay();
    });

    // ADD LIST MODAL
    $("#add-folder-save").off("click");
    $("#add-folder-save").click(function() {
        $("#modal-add-folder .ui.form").removeClass("warning");
        $("#modal-add-folder .ui.form").removeClass("error");
        var folderName = $("#add-folder-name input").val();
        if(folderName == "" || !isValidString(folderName,true,true)) {
            $("#modal-add-folder .ui.form").addClass("error");
            $("#modal-add-folder .add-folder-name-field").addClass("error");
            return false;
        } else {
            $("#modal-add-folder .ui.form").removeClass("error");
            $("#modal-add-folder .add-folder-name-field").removeClass("error");
        }
        // #region Validation (List Name - Exists)
        if(pfLeadList.length) {
            var nameFound = false;
            $.each(pfLeadList, function(k,v) {
                if(v.ListName == folderName) {
                    nameFound = true;
                    return false;
                }
            });
            if(nameFound) {
                $("#modal-add-folder .ui.form").addClass("warning");
                $("#modal-add-folder .add-folder-name-field").addClass("warning");
                return false;
            } else {
                $("#modal-add-folder .ui.form").removeClass("warning");
                $("#modal-add-folder .add-folder-name-field").removeClass("warning");
            }
        }
        // #endregion
        addLeadListAJAX(folderName);
    });

    $("#modal-add-folder").off("keyup");
    $("#modal-add-folder").keyup(function(event) {
        if(event.which == 13) {
            $("#add-folder-save").trigger("click");
        }
    });
}
function setCustomFields() {
    // PAINT CUSTOM FIELDS
    if(pfCustomField) {
        $.each(pfCustomField, function(k,v) {
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
                // $("#modal-field-delete-confirmation").modal('setting', { allowMultiple: false }).modal("show");
                $("#modal-field-delete-confirmation").modal("show");
                $("#modal-field-delete-confirmation-yes").off("click");
                $("#modal-field-delete-confirmation-yes").click(function() {
                    deleteCustomFieldAJAX(v.ID);
                });
                $("#modal-field-delete-confirmation-no").off("click");
                $("#modal-field-delete-confirmation-no").click(function() {
                    setTimeout(function() {
                        $("#modal-detail").modal({ allowMultiple: true }).modal('show');
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
    // $('#modal-field').modal('attach events', '#cf-add');
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
            saveFieldModal(false,false);
        });
        // HELPER CALLS AND LAUNCH MODAL
        $(".field-edit-btn").hide();
        $("#cf-add-field").hide();
        // $("#modal-field").css("zIndex","1002");

        $("#modal-field").modal('show');
    });
}
function translateLeads() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            if($("#title").text() == "Leads") {
                $("#title").text("Clientes");
            }
            $(".ui-table tbody tr").each(function(i) {
                let status = $(this).find("td.col-status span");
                switch(status.text()) {
                    case "Prospect":
                        status.text("Prospecto");
                        break;
                    case "Interested":
                        status.text("Interesado");
                        break;
                    case "Ready to Buy":
                        status.text("Listo para Comprar");
                        break;
                    case "Customer":
                        status.text("Cliente");
                        break;
                    case "Not Interested":
                        status.text("Sin Interes");
                        break;
                    case "Blacklisted":
                        status.text("Descalificado");
                        break;
                }
                let lastAction = $(this).find("td.col-lastaction span");
                switch(lastAction.text()) {
                    case "Outgoing Email":
                        lastAction.text("Correo envíado");
                        break;
                    case "Incoming Email":
                        lastAction.text("Correo recibido");
                        break;
                    case "Outgoing Call":
                        lastAction.text("Llamada hecha");
                        break;
                    case "Incoming Call":
                        lastAction.text("Llamada recibida");
                        break;
                }
            });

            // DICTIONARY
            w_lead_records_exceeded = "Alcanzo Límite de Registro de Clientes";
            // DATE COLUMN SORT PREFERENCE
            $("th.col-datecreated").removeClass("sorter-mmddyy");
            $("th.col-datecreated").addClass("sorter-ddmmyy");
            $("th.col-datemodified").removeClass("sorter-mmddyy");
            $("th.col-datemodified").addClass("sorter-ddmmyy");
            // MENU
            $("#leads-add-folder span").text("Agregar Lista");
            $("#leads-campaigns span").text("Correos");
            // UI - BAR
            $("#leads-delete span").text("Borrar");
            $("#leads-sms span").text("SMS");
            $("#leads-call span").text("Llamar");
            $("#leads-email span").text("Envíar Correo Masivo");
            $("#leads-add span").text("Agregar Cliente");
            $("#leads-merge span").text("Unir");
            // UI - BAR DROPDOWN
            $("#ui-bar .lead-status .ui.dropdown .default.text").text("Cambiar Estado");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Prospect']").text("Prospecto");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Interested']").text("Interesado");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Ready to Buy']").text("Listo para Comprar");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Customer']").text("Cliente");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Not Interested']").text("Sin Interes");
            $("#ui-bar .lead-status .ui.dropdown .item[data-value='Blacklisted']").text("Descalificado");
            // LEADS - BAR
            // $("#leads-export span").text("Exportar Clientes");
            // $("#leads-import span").text("Importar Clientes");
            $("#leads-export span").text("Exportar");
            $("#leads-import span").text("Importar");
            $("#leads-columns span").text("Cambiar Columnas");
            $("#leads-remove span").text("Borrar de la Lista");
            $("#leads-list span").text("Agregar a una Lista");
            $("#leads-search input").attr("placeholder","Buscar...");
            $("#leads-savesearch span").text("Guardar Busqueda");
            // LEADS - TABLE
            $("th.col-company span").text("Nombre");
            $("th.col-contactname span").text("Contacto");
            $("th.col-contactemail span").text("Correo de Contacto");
            $("th.col-status span").text("Estado");
            $("th.col-location span").text("Ubicación");
            $("th.col-source span").text("Fuente");
            $("th.col-datecreated span").text("Fecha Creada");
            // $("th.col-datemodified span").text("Fecha Modificada");
            $("th.col-datemodified span").text("Modificada");
            $("th.col-lastaction span").text("Última Acción");
            $(".no-data p").text("No hay datos disponibles");
            // MODAL - IMPORT LEADS
            $("#modal-import > .header > span").text("Importar Clientes");
            $("#modal-import-file > label").text("Archivo CSV");
            $("#modal-import-file .ui.blue.button span").text("Buscar");
            $("#modal-import > .content .ui.error.message h1").text("Falta archivo CSV");
            $("#modal-import > .content .ui.error.message p").text("Por favor, suba un archivo CSV antes de importar");
            $("#modal-import > .content .ui.warning.message h1").text("Error procesando CSV");
            $("#modal-import > .content .ui.warning.message p").text("Hubo un error procesando el archivo CSV");
            $("#modal-import > .content .ui.progress .label").html("Importando <span>CSV</span>");
            $("#import-tips span").text("Descargar Esquema");
            $("#import-start span").text("Comenzar importación");
            // MODAL - ADD TO LIST
            $("#modal-list > .header > span").text("Agregar a una lista");
            $("#list-existing label").text("Agregar a una lista vigente");
            $("#list-new label").text("Agregar a una lista nueva");
            $("#modal-list > .content .ui.error.message h1").text("Nombre de lista invalida");
            $("#modal-list > .content .ui.error.message p").text("Por favor, escriba un nombre valido para su nueva lista");
            $("#modal-list > .content .ui.warning.message h1").text("Nombre de lista ya existe");
            $("#modal-list > .content .ui.warning.message p").text("Por favor, escriba otro nombre para su nueva lista");
            $("#list-add span").text("Agregar clientes a la lista");
            // MODAL - LIST DETAILS
            $("#modal-list-detail > .header > span").text("Detalles de lista");
            $("#list-detail-name > label").text("Nombre");
            $("#modal-list-detail > .content .ui.error.message h1").text("Nombre de lista invalida");
            $("#modal-list-detail > .content .ui.error.message p").text("Por favor, escriba un nombre valido para su lista");
            $("#modal-list-detail > .content .ui.warning.message h1").text("Nombre de lista ya existe");
            $("#modal-list-detail > .content .ui.warning.message p").text("Por favor, escriba otro nombre para su lista");
            $("#list-detail-delete span").text("Borrar");
            $("#list-detail-save span").text("Grabar");
            // MODAL - ADD LIST
            $("#modal-add-folder > .header > span").text("Agregar Lista");
            $("#add-folder-name input").attr("placeholder","Nombre de Lista");
            $("#modal-add-folder > .content .ui.error.message h1").text("Nombre de lista vacía");
            $("#modal-add-folder > .content .ui.error.message p").text("Por favor, escriba un nombre para su nueva lista");
            $("#modal-add-folder > .content .ui.warning.message h1").text("Nombre de lista ya existe");
            $("#modal-add-folder > .content .ui.warning.message p").text("Por favor, escriba otro nombre para su nueva lista");
            $("#add-folder-save span").text("Agregar Lista");
            // MODAL - DELETE LIST CONFIRM
            $("#modal-list-delete-confirm > .header span").text("Borrar Lista");
            $("#modal-list-delete-confirm > .content p").text("¿Estas seguro que deseas borrar esta lista de clientes?");
            $("#modal-list-delete-confirm-no span").text("No");
            $("#modal-list-delete-confirm-yes span").text("Si");
            // MODAL - COLUMN VISIBILITY
            $("#modal-columns > .header > span").text("Mostrar/Esconder Columnas");
            $("#modal-col-company label").text("Nombre");
            $("#modal-col-contactname label").text("Contacto");
            $("#modal-col-contactemail label").text("Correo de Contacto");
            $("#modal-col-status label").text("Estado");
            $("#modal-col-location label").text("Ubicación");
            $("#modal-col-source label").text("Fuente");
            $("#modal-col-datecreated label").text("Fecha Creada");
            $("#modal-col-datemodified label").text("Fecha Modificada");
            $("#modal-col-lastaction label").text("Última Acción");
            $("#modal-columns-save span").text("Grabar");
            // MODAL - EMAIL LEADS
            $("#modal-emailer > .header > span").text("Envíar Correos a Clientes");
            $("#modal-emailer > .content p").text("Por cada cliente seleccionado, quisieras alcanzar al contacto primario o a todos los contactos?");
            $("#modal-emailer-primary span").text("Solo contactos primarios");
            $("#modal-emailer-all span").text("Todos los contactos");
            // MODAL - SMS
            $("#modal-sms > .header > span").text("Detalles de SMS");
            $("#sms-message label").text("Mensaje");
            $("#modal-sms .ui.error.message .header").text("Mensaje vacío");
            $("#modal-sms-primary span").text("Solo contactos primarios");
            $("#modal-sms-all span").text("Todos los contactos");
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
            $("#field-default > label").text("Valor Inicial");
            $("#field-placeholder > label").text("Texto de Sombra");
            $("#val-min > label").text("Valor Mínimo");
            $("#val-max > label").text("Valor Máximo");
            $("#val-color > label").text("Color de Barra");
            $("#val-color .ui.dropdown.button > .text").text("Escoge color");
            $("#val-color .ui.dropdown.button .ui.search.input input").attr("placeholder","Buscar colores...");
            // $("#val-color .ui.dropdown.button .header").text("Paleta de color");
            $("#val-icon > label").text("Icono de Valuación");
            $("#val-icon .ui.dropdown.button .ui.search.input input").attr("placeholder","Buscar iconos...");
            $("#val-show > label").text("Acceso Rápido");
            $("#val-show .ui.checkbox label").text("Mostrar boton en la pastilla");
            $("#dt-default > label").text("Tipo de valor inicial");
            $("#dt-default-basedoff label").html("En base a la <span>fecha y tiempo</span> actual");
            $("#dt-default-static label").html("<span>Fecha y tiempo</span> fijado");
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
            // MODAL - MERGE
            $("#modal-merge > .header span").text("Unir Clientes");
            $("#modal-merge-field > label").text("Unir a");
            $("#modal-merge-confirm > span").text("Unir");
            break;
        default:
            break;
    }
}
//#endregion
//#region DRAGGING
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
function wireDragSelection() {
    isDragging = false;
    c$ = $("#dragSelection");
    overText = false;
    $(".ui-table tbody td span").hover(function() {
        overText = true;
    }, function() {
        overText = false;
    });
    $(".ui-table").mousedown(function(e) {
        if(!overText) {
            isDragging = true;
            c$.show();
            ogX = e.clientX;
            ogY = e.clientY;
        }
    });
    $(".ui-table").mousemove(function(e) {
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
    $(".ui-table").mouseleave(function() {
        isDragging = false;
        c$.css("border", "none");
        c$.css("height", 0);
        c$.css("width", 0);
        c$.hide();
    });
    $(".ui-table").mouseup(function() {
        isDragging = false;
        c$.css("border", "none");
        c$.css("height", 0);
        c$.css("width", 0);
        c$.hide();
    });
}
function wireDragToList() {
   interact('.dragMsg').draggable({
       inertia: true,
       autoScroll: true,
       onstart: function(event) {
           $(".msg-hover").css("top", event.pageY);
           $(".msg-hover").css("left", event.pageX);
           $(".msg-hover").show();
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
}
//#endregion
//#region HELPER METHODS
var fieldsSaved;
function updateViewSettings(viewSettings) {
    $(".ui.main.page.dimmer").addClass("active");
    let req = $.ajax({
        method: "PUT",
        url: leadsViewSettingsAPI,
        data: viewSettings,
        dataType: "json"
    });
    req.done(function(res) {
        if(pfCustomField) {
            fieldsSaved = 0;
            $(".ui.main.page.dimmer").addClass("active");
            $.each(pfCustomField, function(k,v) {
                let payload = {
                    IsViewable: v.IsViewable
                }
                var updateLeadCFRequest = $.ajax({
                    method: "PUT",
                    url: leadcfAPI + "/" + v.UUID,
                    // data: v,
                    data: payload,
                    dataType: "json"
                });
                updateLeadCFRequest.done(function(res) {
                    fieldsSaved++;
                    if(fieldsSaved == pfCustomField.length) {
                        $(".ui.main.page.dimmer").removeClass("active");
                    }
                });
                updateLeadCFRequest.fail(function() {
                    $(".ui.main.page.dimmer").removeClass("active");
                });
                updateLeadCFRequest.always(function() {
                });
            });
        }
    });
    req.fail(handleAPIError);
    req.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
function toggleButtons(display) {
    if(display) {
        $("#leads-remove").css("display","inline-block");
        $("#leads-list").css("display","inline-block");
        $("#leads-delete").css("display","inline-block");
        $("#leads-call").css("display","inline-block");
        $("#leads-email").css("display","inline-block");
        $("#leads-sms").css("display","inline-block");
        if($(window).width() > 550) {
            $(".lead-status").css("display","inline-block");
        }
        if(mainCustomer.ConfigUseSMS) {
            $("#leads-sms").css("display","inline-block");
        }
    } else {
        $("#leads-remove").hide();
        $("#leads-list").hide();
        $("#leads-delete").hide();
        $("#leads-call").hide();
        $("#leads-email").hide();
        $("#leads-sms").hide();
        $("#leads-merge").hide();
        $(".lead-status").hide();
    }
}
//#endregion
//#region LEAD
var itemsChecked;
var itemsDeleted;
function deleteLeadAJAX() {
    var deleteLeadRequest = $.ajax({
        method: "DELETE",
        dataType: "json",
        url: leadAPI + "/" + uuid
    });
    deleteLeadRequest.done(function() {
        itemsDeleted++;
        if(itemsChecked == itemsDeleted) {
            $(".ui.main.page.dimmer").removeClass("active");
        }
    });
    deleteLeadRequest.fail(handleAPIError);
    deleteLeadRequest.always(function() {
    });
}
function orderDeleteLead(v) {
    uuid = $(v).parents("tr").attr("data-uuid");
    $(v).parents("tr").remove();
    $(".ui-center .ui-table").trigger("update");
    var cIndex = 0;
    $.each(pfData, function(k,v) { if(v.UUID == uuid) { cIndex = k; } });
    pfData.splice(cIndex,1);
    deleteLeadAJAX();
}
function insertLeadAJAX() {
    $(".ui.main.page.dimmer").addClass("active");
    var insertLeadRequest = $.ajax({
        method: "POST",
        url: leadAPI,
        dataType: "json",
        data: pfLead
    });
    insertLeadRequest.done(function(response) {
        switch(parseInt(response.success)) {
            case 1:
                var uuid = response.newUUID;
                if(listparam) {
                    var addLeadListJunctionRequest = $.ajax({
                        method: "POST",
                        url: leadlistAPI + "/" + listparam,
                        dataType: "json",
                        data: { LeadUUID: uuid }
                    });
                    addLeadListJunctionRequest.done(function() {
                        window.location.replace("/lead?uuid=" + uuid);
                    });
                    addLeadListJunctionRequest.fail(function() {
                    });
                    addLeadListJunctionRequest.always(function() {
                    });
                } else {
                    window.location.replace("/lead?uuid=" + uuid);
                }
                break;
            case 2:
                toastr.error(w_lead_records_exceeded);
                console.log(res.errorMsg);
                break;
            case 0:
                toastr.error(w_server_error_h);
                console.log(res.errorMsg);
                break;
        }
    });
    insertLeadRequest.fail(handleAPIError);
    insertLeadRequest.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
function mergeLeadAJAX(leads) {
    let req = $.ajax({
        method: "PATCH",
        dataType: "json",
        url: leadAPI + "/" + uuid,
        data: { leads, merge: 1 }
    });
    req.done(function(res) {
        if(parseInt(res.success) == 1) {
            // location.reload();
        }
    });
    req.fail(handleAPIError);
    req.always(function() {
    });
}
//#endregion
//#region LEAD LIST
var leadcheckcounter;
var listuuid;
let refreshAfterOp;
function addLeadListAJAX(listname) {
    refreshAfterOp = true;
    var addLeadListRequest = $.ajax({
        method: "POST",
        url: leadlistAPI,
        dataType: "json",
        data: {
            ListName: listname
        }
    });
    addLeadListRequest.done(function(response) {
        listuuid = response.newUUID;
        var checkedBoxes = $("td.col-check input[type='checkbox']:checked");
        itemsChecked = checkedBoxes.length;
        leadcheckcounter = 0;
        $.each(checkedBoxes, function(k,v) {
            var leaduuid = $(v).parents("tr").attr("data-uuid");
            $(v).parents("tr").remove();
            $(".ui-center .ui-table").trigger("update");
            var cIndex = 0;
            $.each(pfData, function(k,v) { if(v.UUID == leaduuid) { cIndex = k; } });
            pfData.splice(cIndex,1);
            addLeadListJunctionAJAX(leaduuid);
        });
        $("td.col-check > div").checkbox("uncheck");
        $("#leads-selected-counter").text("");
        toggleButtons(false);
        updateLeadDisplay();
        if(itemsChecked == 0) {
            window.location.replace("/leads?list=" + listuuid);
        }
    });
    addLeadListRequest.fail(handleAPIError);
    addLeadListRequest.always(function() {
    });
}
function addLeadListJunctionAJAX(leaduuid) {
    var addLeadListJunctionRequest = $.ajax({
        method: "POST",
        url: leadlistAPI + "/" + listuuid,
        dataType: "json",
        data: { LeadUUID: leaduuid }
    });
    addLeadListJunctionRequest.done(function(response) {
        leadcheckcounter++;
        if(refreshAfterOp && leadcheckcounter == itemsChecked) {
            window.location.replace("/leads?list=" + listuuid);
        }
    });
    addLeadListJunctionRequest.fail(handleAPIError);
    addLeadListJunctionRequest.always(function() {
    });
}
function getLeadListAJAX() {
    var getLeadListRequest = $.ajax({
        method: "GET",
        url: leadlistAPI,
        dataType: "json"
    });
    getLeadListRequest.done(function(response) {
        pfLeadList = response.data;
        $.each(pfLeadList, function(k,v) {
            // Add to Menu
            var newListRow = "<li class='sub-link'>";
            newListRow += `<div class='linkRemove'><a href='#' class='deleteLeadList' data-uuid='${v.UUID}'><i class='icon trash'></i></a></div>`;
            let listIcon = "<i class='icon list layout'></i>";
            let listName = `<span class='nav-list-name'>${escapeHtml(v.ListName)}</span>`;
            newListRow += `<a href='/leads?list=${v.UUID}'>${listIcon}${listName}</a></li>`;
            $("#nav-lead-list").append(newListRow);

            $("#nav-lead-list li:last").hover(function() {
                $(this).find(".linkRemove").show();
            }, function() {
                $(this).find(".linkRemove").hide();
            });
            $("#nav-lead-list li:last .deleteLeadList").click(function() {
                let leadlistuuid = $(this).attr("data-uuid");
                $("#modal-list-delete-confirm").modal("show");
                $("#modal-list-delete-confirm-yes").off("click");
                $("#modal-list-delete-confirm-yes").click(function() {
                    deleteLeadListAJAX(leadlistuuid);
                });
            });

            // Add to New List Dropdown
            var existingListOption = "<option value='" + v.UUID + "'>" + escapeHtml(v.ListName) + "</option>";
            $("#modal-list #list-select select").append(existingListOption);
            // Set List Details
            if(v.UUID == listparam) {
                $("#title").text(v.ListName);
                $("#logo").click(function() {
                    $("#modal-list-detail .ui.form").removeClass("warning");
                    $("#modal-list-detail .ui.form").removeClass("error");
                    $("#modal-list-detail .ui.form #list-detail-name").removeClass("error");
                    $("#modal-list-detail").modal("show");
                    $("#modal-list-detail #list-detail-name input").val(v.ListName);
                    $("#modal-list-detail").off("keyup");
                    $("#modal-list-detail").keyup(function(event) {
                        if(event.which == 13) {
                            $("#modal-list-detail #list-detail-save").trigger("click");
                        }
                    });
                    $("#modal-list-detail #list-detail-delete").off("click");
                    $("#modal-list-detail #list-detail-delete").click(function() {
                        deleteLeadListAJAX(listparam);
                    });
                    $("#modal-list-detail #list-detail-save").off("click");
                    $("#modal-list-detail #list-detail-save").click(function() {
                        var newName = $("#modal-list-detail #list-detail-name input").val();
                        if(newName == "" || !isValidString(newName,true,true)) {
                            $("#modal-list-detail .ui.form").addClass("error");
                            $("#modal-list-detail .ui.form #list-detail-name").addClass("error");
                            return false;
                        } else {
                            $("#modal-list-detail .ui.form").removeClass("error");
                            $("#modal-list-detail .ui.form #list-detail-name").removeClass("error");
                        }
                        // #region Validation (List Name - Exists)
                        if(pfLeadList.length) {
                            var nameFound = false;
                            $.each(pfLeadList, function(k,v) {
                                if(v.ListName == newName) {
                                    nameFound = true;
                                    return false;
                                }
                            });
                            if(nameFound) {
                                $("#modal-list-detail .ui.form").addClass("warning");
                                $("#modal-list-detail .ui.form #list-detail-name").addClass("warning");
                                return false;
                            } else {
                                $("#modal-list-detail .ui.form").removeClass("warning");
                                $("#modal-list-detail .ui.form #list-detail-name").removeClass("warning");
                            }
                        }
                        // #endregion
                        updateLeadListAJAX(newName);
                    });
                });

            }
        });
        getLeadSearchesAJAX();
        if(pfLeadList.length > 0) {
            $("#modal-list #list-select select").dropdown();
        } else {
            $("#modal-list #list-type-existing").hide();
        }
    });
    getLeadListRequest.fail(handleAPIError);
    getLeadListRequest.always(function() {
    });
}
function removeLeadfromListAJAX() {
    var removeLeadRequest = $.ajax({
        method: "PATCH",
        url: leadlistAPI + "/" + listparam,
        data: { LeadUUID: uuid },
        dataType: "json"
    });
    removeLeadRequest.done(function() {
        itemsDeleted++;
        if(itemsChecked == itemsDeleted) {
            $(".ui.main.page.dimmer").removeClass("active");
        }
    });
    removeLeadRequest.fail(handleAPIError);
    removeLeadRequest.always(function() {
    });
}
function deleteLeadListAJAX(leadlistuuid) {
    var deleteLeadListRequest = $.ajax({
        method: "DELETE",
        url: leadlistAPI + "/" + leadlistuuid,
        dataType: "json"
    });
    deleteLeadListRequest.done(function() {
        window.location.replace("/leads");
    });
    deleteLeadListRequest.fail(handleAPIError);
    deleteLeadListRequest.always(function() {
    });
}
function updateLeadListAJAX(newName) {
    var updateLeadListRequest = $.ajax({
        method: "PUT",
        url: leadlistAPI + "/" + listparam,
        dataType: "json",
        data: {
            ListName: newName
        }
    });
    updateLeadListRequest.done(function(res) {
        $(`#nav-lead-list .deleteLeadList[data-uuid='${listparam}']`).parents("li.sub-link").find(".nav-list-name").text(newName);
        $("#title").text(newName);
        // location.reload();
    });
    updateLeadListRequest.fail(handleAPIError);
    updateLeadListRequest.always(function() {
    });
}
//#endregion
//#region LEAD SEARCH
function insertSearchAJAX() {
    var dataPiece = {
        SearchQuery: query,
        SearchName: query
    };
    if(listparam) {
        dataPiece["ListUUID"] = listparam;
        dataPiece["SearchName"] = $("#title").text() + ": " + query;
    }
    var insertSearchRequest = $.ajax({
        method: "POST",
        url: leadsearchAPI,
        dataType: "json",
        data: dataPiece
    });
    insertSearchRequest.done(function(response) {
        if(response.success) {
            var queryParameters = "?q=" + encodeURIComponent(query);
            if(listparam) {
                queryParameters += "&list=" + encodeURIComponent(listparam);
            }
            window.location.replace("/leads" + queryParameters);
        }
    });
    insertSearchRequest.fail(handleAPIError);
    insertSearchRequest.always(function() {
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
            newListRow += "<div class='linkRemove'><a href='#' class='deleteLeadSearch' data-id='" + v.ID + "'><i class='icon trash'></i></a></div>";
            newListRow += "<a href='/leads?q=" + v.SearchQuery;
            if(v.ListUUID) {
                newListRow += "&list=" + v.ListUUID;
            }
            newListRow += "'>";
            newListRow += "<i class='icon search'></i><span class='nav-list-name'>" + escapeHtml(v.SearchName) + "</span></a>";
            newListRow += "</li>";
            $("#nav-lead-list").append(newListRow);
            $("#nav-lead-list li:last").hover(function() {
                $(this).find(".linkRemove").show();
            }, function() {
                $(this).find(".linkRemove").hide();
            });
            $("#nav-lead-list li:last .deleteLeadSearch").click(function() {
                deleteLeadSearchAJAX($(this).attr("data-id"));
            });
        });
        let labelAddList = "Add List";
        let labelMailings = "Broadcasts";
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                labelAddList = "Agregar Lista";
                labelMailings = "Correos Masivos";
                break;
        }
        newListRow = `<li class="sub-link"><a href="#" id="leads-add-folder"><i class="icon add"></i><span>${labelAddList}</span></a></li>`;
        newListRow += `<li class="sub-link"><a href="/broadcasts" id="leads-campaigns"><i class="icon envelope"></i><span>${labelMailings}</span></a></li>`;
        $("#nav-lead-list").append(newListRow);
        $("#nav-lead-list").slideDown(200);
        
        // ADD LIST FROM MENU
        $("#leads-add-folder").click(function() {
            $("#modal-add-folder .ui.form").removeClass("warning");
            $("#modal-add-folder .ui.form").removeClass("error");
            $("#modal-add-folder").modal("show");
        });
    });
    getLeadSearchesRequest.fail(handleAPIError);
    getLeadSearchesRequest.always(function() {
    });
}
function deleteLeadSearchAJAX(id) {
    var deleteLeadSearchRequest = $.ajax({
        method: "DELETE",
        url: leadsearchAPI + "/" + id,
        dataType: "json"
    });
    deleteLeadSearchRequest.done(function() {
        $("#nav-lead-list li").each(function() {
            if($(this).find(".deleteLeadSearch").attr("data-id") == id) {
                $(this).remove();
            }
        })
    });
    deleteLeadSearchRequest.fail(handleAPIError);
    deleteLeadSearchRequest.always(function() {
    });
}
//#endregion
//#region CSV
var pfLeads;
var pfContacts;
function parseCSV(results) {
    $("#modal-import .ui.form").removeClass("warning");
    console.log(results);
    console.log("#### Parsing Started ####");
    $("#modal-import .ui.progress").show();
    $("#modal-import .ui.progress").progress({ total: results.data.length , onSuccess: function() {
        $("#modal-import .ui.progress .label").html("Import Complete!");
        setTimeout(function() {
            location.reload();
        }, 1000);
    }});
    pfLeads = [];
    pfContacts = [];
    var importSourceString = "Imported from " + $("#import-name").val() + " at " + Sugar.Date.format(new Date(), '%F {hh}:{mm} {TT}');
    $.each(results.data, function(k,v) {
        var headerChoices = [];
        var mappedChoices = [];
        clean_pfLead();
        clean_pfContact();
        // PARSE NAME FIRST
        if(v["Lead Name"] !== undefined && v["Lead Name"] != "") {
            pfLead.LeadName = v["Lead Name"];
            console.log("Row " + k + " mapped to Lead Name");
            if(mappedChoices.indexOf("Lead Name") === -1) {
                mappedChoices.push("Lead Name");
            }
        }
        else if (v["LeadName"] !== undefined && v["LeadName"] != "") {
            pfLead.LeadName = v["LeadName"];
            console.log("Row " + k + " mapped to LeadName");
            if(mappedChoices.indexOf("LeadName") === -1) {
                mappedChoices.push("LeadName");
            }
        }
        else if(v["Company"] !== undefined && v["Company"] != "") {
            pfLead.LeadName = v["Company"];
            console.log("Row " + k + " mapped to Company");
            if(mappedChoices.indexOf("Company") === -1) {
                mappedChoices.push("Company");
            }
        }
        else if(v["Name"] !== undefined && v["Name"] != "") {
            pfLead.LeadName = v["Name"];
            console.log("Row " + k + " mapped to Name");
            if(mappedChoices.indexOf("Name") === -1) {
                mappedChoices.push("Name");
            }
        }
        else if(v["First Name"] !== undefined && v["First Name"] != "" && v["Last Name"] !== undefined && v["Last Name"] != "") {
            pfLead.LeadName = v["First Name"] + " " + v["Last Name"];
            console.log("Row " + k + " mapped to First Name and Last Name");
            if(mappedChoices.indexOf("First Name") === -1) {
                mappedChoices.push("First Name");
            }
            if(mappedChoices.indexOf("Last Name") === -1) {
                mappedChoices.push("Last Name");
            }
        }
        else {
            console.log("Row " + k + " skipped");
            $("#modal-import .ui.progress").progress("increment","1");
            return;
        }
        // PARSE LEAD CUSTOM FIELDS
        if(pfCustomField) {
            $.each(pfCustomField, function(cfk,cfv) {
                var colName = "Lead " + parseName(cfv.FieldName).replace("_"," ");
                if(v[colName] !== undefined && v[colName] != "") {
                    pfLead["CF" + cfv.ValuePos] = v[colName];
                    if(mappedChoices.indexOf(colName) === -1) {
                        mappedChoices.push(colName);
                    }
                }
            });
        }
        // PARSE STATIC FIELDS
        headerChoices = ["Lead Status", "LeadStatus", "Status"];
        for(var w=0;w<headerChoices.length;w++) {
            if(v[headerChoices[w]] !== undefined && v[headerChoices[w]] != "") {
                pfLead.LeadStatus = v[headerChoices[w]];
                if(mappedChoices.indexOf(headerChoices[w]) === -1) {
                    mappedChoices.push(headerChoices[w]);
                }
                w = headerChoices.length;
            }
        }
        headerChoices = ["Lead Noteboard", "LeadNoteboard", "Noteboard", "Notes", "Note"];
        for(var w=0;w<headerChoices.length;w++) {
            if(v[headerChoices[w]] !== undefined && v[headerChoices[w]] != "") {
                pfLead.LeadNoteboard = v[headerChoices[w]];
                if(mappedChoices.indexOf(headerChoices[w]) === -1) {
                    mappedChoices.push(headerChoices[w]);
                }
                w = headerChoices.length;
            }
        }
        headerChoices = ["Contact Name", "ContactName", "Contact", "First Name", "Name", "Email"];
        for(var w=0;w<headerChoices.length;w++) {
            if(v[headerChoices[w]] !== undefined && v[headerChoices[w]] != "") {
                pfContact.ContactName = v[headerChoices[w]];
                if(mappedChoices.indexOf(headerChoices[w]) === -1) {
                    mappedChoices.push(headerChoices[w]);
                }
                w = headerChoices.length;
            }
        }
        headerChoices = ["Contact Title", "ContactTitle", "Title", "Position"];
        for(var w=0;w<headerChoices.length;w++) {
            if(v[headerChoices[w]] !== undefined && v[headerChoices[w]] != "") {
                pfContact.ContactTitle = v[headerChoices[w]];
                if(mappedChoices.indexOf(headerChoices[w]) === -1) {
                    mappedChoices.push(headerChoices[w]);
                }
                w = headerChoices.length;
            }
        }
        headerChoices = ["Contact Avatar", "ContactAvatar", "Avatar", "Image URL", "Image", "Photo"];
        for(var w=0;w<headerChoices.length;w++) {
            if(v[headerChoices[w]] !== undefined && v[headerChoices[w]] != "") {
                pfContact.ContactAvatar = v[headerChoices[w]];
                if(mappedChoices.indexOf(headerChoices[w]) === -1) {
                    mappedChoices.push(headerChoices[w]);
                }
                w = headerChoices.length;
            }
        }
        headerChoices = ["Contact Phone", "ContactPhone", "Phone", "Phone Number", "Phone Numbers"];
        for(var w=0;w<headerChoices.length;w++) {
            if(v[headerChoices[w]] !== undefined && v[headerChoices[w]] != "") {
                pfContact.ContactPhone = v[headerChoices[w]];
                if(mappedChoices.indexOf(headerChoices[w]) === -1) {
                    mappedChoices.push(headerChoices[w]);
                }
                w = headerChoices.length;
            }
        }
        headerChoices = ["Contact Email", "ContactEmail", "Email", "Mail"];
        for(var w=0;w<headerChoices.length;w++) {
            if(v[headerChoices[w]] !== undefined && v[headerChoices[w]] != "") {
                pfContact.ContactEmail = v[headerChoices[w]];
                if(mappedChoices.indexOf(headerChoices[w]) === -1) {
                    mappedChoices.push(headerChoices[w]);
                }
                w = headerChoices.length;
            }
        }

        // PARSE UNMAPPED COLUMNS TO COMPILED NOTE   
        var compiledNote = ""; 
        var allKeys = Object.keys(v);
        for(var kx=0;kx<allKeys.length;kx++) {
            if(mappedChoices.indexOf(allKeys[kx]) === -1 && v[allKeys[kx]] !== undefined && v[allKeys[kx]] != "") {
                compiledNote += allKeys[kx] + ": " + v[allKeys[kx]];
                compiledNote += "\r\n";
            }
        }
        if(compiledNote) {
            pfLead.LeadNoteboard = (pfLead.LeadNoteboard ? pfLead.LeadNoteboard : "") + compiledNote;
        }

        pfLead.LeadSource = importSourceString;
        pfLeads.push(pfLead);
        pfContacts.push(pfContact);
        insertCSVLeadAJAX(k);
    });
    clean_pfLead();
    clean_pfContact();
}
function insertCSVLeadAJAX(k) {
    var insertCSVLeadRequest = $.ajax({
        method: "POST",
        url: leadAPI,
        dataType: "json",
        data: pfLeads[k]
    });
    insertCSVLeadRequest.done(function(res) {
        switch(parseInt(res.success)) {
            case 1:
                pfContacts[k].LeadID = res.newID;
                var Guuid = res.newUUID;
                var insertCSVContactRequest = $.ajax({
                    method: "POST",
                    url: leadcontactAPI,
                    dataType: "json",
                    data: pfContacts[k]
                });
                insertCSVContactRequest.done(function(res) {
                    switch(parseInt(res.code)) {
                        case 1:
                            pfLeads[k] = {};
                            pfLeads[k].PrimaryContactID = res.newID;
                            var updateCSVLeadRequest = $.ajax({
                                method: "PUT",
                                url: leadAPI + "/" + Guuid,
                                dataType: "json",
                                data: pfLeads[k]
                            });
                            updateCSVLeadRequest.done(function() {
                                if(listparam) {
                                    var addLeadListJunctionRequest = $.ajax({
                                        method: "POST",
                                        url: leadlistAPI + "/" + listparam,
                                        dataType: "json",
                                        data: { LeadUUID: Guuid }
                                    });
                                    addLeadListJunctionRequest.done(function(res) {
                                        $("#modal-import .ui.progress").progress("increment","1");
                                    });
                                    addLeadListJunctionRequest.fail(handleAPIError);
                                    addLeadListJunctionRequest.always(function() {
                                    });
                                } else {
                                    $("#modal-import .ui.progress").progress("increment","1");
                                }
                            });
                            updateCSVLeadRequest.fail(handleAPIError);
                            updateCSVLeadRequest.always(function() {
                            });
                            break;
                        case 2:
                        case 0:
                        default:
                            $("#modal-import .ui.progress").progress("increment","1");
                            break;
                    }                    
                });
                insertCSVContactRequest.fail(handleAPIError);
                insertCSVContactRequest.always(function() {
                });
                break;
            case 2:
                toastr.error(w_lead_records_exceeded);
                console.log(res.errorMsg);
                break;
            case 0:
                toastr.error(w_server_error_h);
                console.log(res.errorMsg);
                break;
        }
    });
    insertCSVLeadRequest.fail(handleAPIError);
    insertCSVLeadRequest.always(function() {
    });
}
//#endregion
//#region LAUNCH
var listparam;
var pfCustomField;
function launchLeads() {
    var calcAPI;
    $("#title").text("Leads");
    listparam = getParameterByName("list");
    query = getParameterByName("q");
    $("#leads-search input").val(query);
    if(listparam) {
        calcAPI = leadlistAPI + "/" + listparam;
    } else {
        calcAPI = leadAPI;
        $("#leads-remove").remove();
    }
    getLeadListAJAX(); //LIST, SEARCH RETRIEVAL

    // LEADS
    $(".ui.data.dimmer").addClass("active");
    var leadsRequest = $.ajax({
        method: "GET",
        url: calcAPI,
        dataType: "json"
    });
    leadsRequest.done(function(result, textStatus, jqXHR) {
        if(parseInt(result.success) == 1) {
            pfData = result.data;
            pfCustomField = result.LeadCF;
            setLeadTable();
            updateLeadDisplay();
            setActions();
            setCustomFields();
            setCustomFieldModal();
            translateLeads();
            $(".ui-center .ui-table").tablesorter({
                headers: {
                    0: { sorter: false }
                }
            });
            setCheckBehavior();
        } else {
            toastr.error(w_server_error_h);
        }
    });
    leadsRequest.fail(handleAPIError);
    leadsRequest.always(function() {
        $(".ui.data.dimmer").removeClass("active");
        $(".ui-center > .loader").hide();
    });
}
$(function() {
    launchInterval = setInterval(function() {
        if(mainCustomer && mainCustomer.CustomerName) {
            launchLeads();
            clearInterval(launchInterval);
        }
    }, 100);
});
//#endregion
