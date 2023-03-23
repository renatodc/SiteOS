// CUSTOM FIELDS
// #region VARIABLES
var cfPayload;
var cfTypeChoice;
var dtDefaultChoice;
var ddOptionCount;
var chkType;
var mcType;
// #endregion
// #region HELPER METHODS
function insertCustomFieldAJAX(isContact) {
    $(".dimmer").addClass("active");
    let req = $.ajax({
        method: "POST",
        dataType: "json",
        url: (isContact ? leadcontactcfAPI : leadcfAPI),
        data: cfPayload
    });
    req.done(function(res) {
        if(parseInt(res.code) == 1) {
            location.reload();
        } else {
            $("#modal-field .ui.form").addClass("error");
            $("#modal-field .ui.form .ui.error.message .header").html("Save Error");
            $("#modal-field .ui.form .ui.error.message p").html(res.msg);
        }
    });
    req.fail(handleAPIError);
    req.always(function() {
        $(".dimmer").removeClass("active");
    });
}
function updateCustomFieldAJAX(cfID, isContact) {
    $(".dimmer").addClass("active");
    let req = $.ajax({
        method: "PUT",
        dataType: "json",
        url: (isContact ? leadcontactcfAPI : leadcfAPI) + "/" + cfID,
        data: cfPayload
    });
    req.done(function(res) {
        if(parseInt(res.code) == 1) {
            location.reload();
        } else {
            $("#modal-field .ui.form").addClass("error");
            $("#modal-field .ui.form .ui.error.message .header").html("Save Error");
            $("#modal-field .ui.form .ui.error.message p").html(res.msg);
        }
    });
    req.fail(handleAPIError);
    req.always(function() {
        $(".dimmer").removeClass("active");
    });
}
function deleteCustomFieldAJAX(cfID, isContact) {
    $(".dimmer").addClass("active");
    let req = $.ajax({
        method: "DELETE",
        dataType: "json",
        url: (isContact ? leadcontactcfAPI : leadcfAPI) + "/" + cfID
    });
    req.done(function() {
        location.reload();
    });
    req.fail(handleAPIError);
    req.always(function() {
        $(".dimmer").removeClass("active");
    });
}
// #endregion
// #region MAIN METHODS
function parseName(name) {
    var parsedName = name.replace(/\W+/g, "");
    return parsedName;
}
function paintCF(fieldObj, isContact) {
    var cf = "";    
    var fvalue = "";
    if(!isContact) { // Set Lead Value
        fvalue = pfData["CF" + fieldObj.ValuePos];
        if(fvalue == null) {
            fvalue = "";
        }
    }
    switch(fieldObj.FieldType) {
        case "Input":
        case "Location":
        case "Email":
        case "Phone":
        case "Link":
            cf += "<div class='ui input left icon'>";
            cf += "<i class='icon " + fieldObj.FieldIcon + "'></i>";
            cf += "<input type='text' name='detail-" + parseName(fieldObj.FieldName) + "'";
            if(fieldObj.FieldPlaceholder) {
                cf += " placeholder='" + fieldObj.FieldPlaceholder + "'";
            }
            cf += " value='" + (fvalue ? fvalue : fieldObj.FieldDefault ? fieldObj.FieldDefault : "") + "' />";
            cf += "</div>";
            break;
        case "Textarea":
            cf += "<textarea name='detail-" + parseName(fieldObj.FieldName) + "'";
            if(fieldObj.FieldPlaceholder) {
                cf += " placeholder='" + fieldObj.FieldPlaceholder + "'";
            }
            cf += ">" + (fvalue ? fvalue : fieldObj.FieldDefault ? fieldObj.FieldDefault : "") + "</textarea>";
            break;
        case "Integer":
            cf += "<div class='ui input left icon'>";
            cf += "<i class='icon " + fieldObj.FieldIcon + "'></i>";
            cf += "<input type='number' name='detail-" + parseName(fieldObj.FieldName) + "'";
            if(fieldObj.FieldPlaceholder) {
                cf += " placeholder='" + fieldObj.FieldPlaceholder + "'";
            }
            if(fieldObj.FieldMin) {
                cf += " min='" + fieldObj.FieldMin + "'";
            }
            if(fieldObj.FieldMax) {
                cf += " max='" + fieldObj.FieldMax + "'";
            }
            cf += " value='" + (fvalue ? fvalue : fieldObj.FieldDefault ? fieldObj.FieldDefault : "") + "' />";
            cf += "</div>";
            break;
        case "Decimal":
            cf += "<div class='ui input left icon'>";
            cf += "<i class='icon " + fieldObj.FieldIcon + "'></i>";
            cf += "<input type='number' step='0.01' name='detail-" + parseName(fieldObj.FieldName) + "'";
            if(fieldObj.FieldPlaceholder) {
                cf += " placeholder='" + fieldObj.FieldPlaceholder + "'";
            }
            if(fieldObj.FieldMin) {
                cf += " min='" + fieldObj.FieldMin + "'";
            }
            if(fieldObj.FieldMax) {
                cf += " max='" + fieldObj.FieldMax + "'";
            }
            cf += " value='" + (fvalue ? fvalue : fieldObj.FieldDefault ? fieldObj.FieldDefault : "") + "' />";
            cf += "</div>";
            break;
        case "Date":
            cf += "<div class='ui input left icon'>";
            cf += "<i class='" + fieldObj.FieldIcon + " icon'></i>";
            cf += "<input type='text' name='detail-" + parseName(fieldObj.FieldName) + "' placeholder=''>";
            cf += "</div>";
            break;
        case "DateTime":
            cf += "<div class='ui input left icon'>";
            cf += "<i class='" + fieldObj.FieldIcon + " icon'></i>";
            cf += "<input type='text' name='detail-" + parseName(fieldObj.FieldName) + "' placeholder=''>";
            cf += "</div>";
            break;
        case "Time":
            cf += "<div class='ui input left icon'>";
            cf += "<i class='" + fieldObj.FieldIcon + " icon'></i>";
            cf += "<input type='text' name='detail-" + parseName(fieldObj.FieldName) + "' placeholder=''>";
            cf += "</div>";
            break;
        case "Dropdown":
            cf += "<div class='ui ";
            if(fieldObj.HasSearch == "1") {
                cf += "search ";
            }
            cf += "selection dropdown'>";
            cf += "<input type='hidden' name='" + parseName(fieldObj.FieldName) + "'>";
            cf += "<i class='dropdown icon'></i>";
            cf += "<div class='default text'>" + fieldObj.FieldPlaceholder + "</div>";
            cf += "<div class='menu'>";
            var optArray = fieldObj.FieldSelections.split(",");
            for(var i=0;i<optArray.length;i++) {
                cf += "<div class='item' data-value='" + parseName(optArray[i]) + "'>" + optArray[i] + "</div>";
            }
            cf += "</div>";
            cf += "</div>";
            break;
        case "Singlechoice":
            var optArray = fieldObj.FieldSelections.split(",");
            for(var i=0;i<optArray.length;i++) {
                cf += "<div class='ui radio checkbox' id='sc-" + parseName(fieldObj.FieldName) + "-" + parseName(optArray[i]) + "'>";
                cf += "<input type='radio' name='detail-" + parseName(fieldObj.FieldName) + "' ";
                if(optArray[i] == fvalue) {
                    cf += "checked='checked' ";
                } else if(!fvalue && optArray[i] == fieldObj.FieldDefault) {
                    cf += "checked='checked' ";
                }
                cf += ">";
                cf += "<label>" + optArray[i] + "</label>";
                cf += "</div>";
            }
            break;
        case "Checkbox": 
            cf += "<div class='ui ";
            switch(fieldObj.FieldPlaceholder.toLowerCase()) {
                case "slider":
                case "toggle":
                    cf += fieldObj.FieldPlaceholder.toLowerCase() + " ";
                    break;
            }
            cf += "checkbox'>";
            cf += "<input type='checkbox' name='detail-" + parseName(fieldObj.FieldName) + "' ";
            if(fvalue == "true") {
                cf += "checked='checked' ";
            } else if(!fvalue != "true" && fieldObj.FieldDefault == "true") {
                cf += "checked='checked' ";
            }
            cf += "class='hidden'>";
            cf += "<label>" + fieldObj.FieldName + "</label>";
            cf += "</div>";
            break;
        case "Multichoice":
            if(fieldObj.HasDropdown == "1") {
                cf += "<div class='ui ";
                if(fieldObj.HasSearch == "1") {
                    cf += "search ";
                }
                cf += "multiple selection dropdown'>";
                cf += "<input type='hidden' name='" + parseName(fieldObj.FieldName) + "'>";
                cf += "<i class='dropdown icon'></i>";
                cf += "<div class='default text'>" + fieldObj.FieldPlaceholder + "</div>";
                cf += "<div class='menu'>";
                var optArray = fieldObj.FieldSelections.split(",");
                for(var i=0;i<optArray.length;i++) {
                    cf += "<div class='item' data-value='" + parseName(optArray[i]) + "'>" + optArray[i] + "</div>";
                }
                cf += "</div>";
                cf += "</div>";
            } else {
                var optArray = fieldObj.FieldSelections.split(",");
                var optSelected = fvalue.split(",");
                var optDefault = fieldObj.FieldDefault.split(",");
                for(var i=0;i<optArray.length;i++) {                
                    cf += "<div class='ui ";
                    switch(fieldObj.FieldPlaceholder.toLowerCase()) {
                        case "slider":
                        case "toggle":
                            cf += fieldObj.FieldPlaceholder.toLowerCase() + " ";
                            break;
                    }
                    cf += "checkbox' id='mc-" + parseName(fieldObj.FieldName) + "-" + parseName(optArray[i]) + "'>";
                    cf += "<input type='checkbox' name='detail-" + parseName(fieldObj.FieldName) + "-" + parseName(optArray[i]) + "' ";
                    for(var s=0;s<optSelected.length;s++) {
                        if(optArray[i] == optSelected[s]) {
                            cf += "checked='checked' ";
                        }
                    }
                    for(var d=0;d<optDefault.length && !fvalue;d++) {
                        if(optArray[i] == optDefault[d]) {
                            cf += "checked='checked' ";
                        }
                    }
                    cf += ">";
                    cf += "<label>" + optArray[i] + "</label>";
                    cf += "</div>";
                }
            }
            break;
        case "Progress":
            cf += "<div class='ui ";
            switch(fieldObj.FieldSelections.toLowerCase()) {
                case "red":
                case "orange":
                case "yellow":
                case "olive":
                case "green":
                case "teal":
                case "blue":
                case "violet":
                case "purple":
                case "pink":
                case "brown":
                case "grey":
                case "black":
                    cf += fieldObj.FieldSelections.toLowerCase() + " ";
                    break;
            }
            cf += "progress' style='margin-bottom: 8px'>";
            cf += "<div class='bar'>";
            cf += "<div class='progress'></div>";
            cf += "</div>";
            cf += "</div>";

            cf += "<div class='ui icon buttons'>";
            cf += "<div class='decrement ui button icon'><i class='minus icon'></i></div>";
            cf += "<div class='increment ui button icon'><i class='plus icon' style='padding-top: 1px'></i></div>";
            cf += "</div>";
            break;
        case "Rating":
            cf += "<div class='ui ";
            switch(fieldObj.FieldPlaceholder.toLowerCase()) {
                case "star":
                case "heart":
                case "thumbs up":
                case "checkmark":
                    cf += fieldObj.FieldPlaceholder.toLowerCase() + " ";
                    break;
            }
            cf += "rating' ";
            cf += "data-rating='" + (fvalue ? fvalue : fieldObj.FieldDefault ? fieldObj.FieldDefault : "") + "' ";
            cf += "data-max-rating='" + (fieldObj.FieldMax ? fieldObj.FieldMax : 4) + "'></div>";
            break;
        default:
            cf += "<div class='ui input left icon'>";
            cf += "<i class='icon " + fieldObj.FieldIcon + "'></i>";
            cf += "<input type='text' name='detail-" + parseName(fieldObj.FieldName) + "'";
            if(fieldObj.FieldPlaceholder) {
                cf += " placeholder='" + fieldObj.FieldPlaceholder + "'";
            }
            cf += " value='" + (fvalue ? fvalue : fieldObj.FieldDefault ? fieldObj.FieldDefault : "") + "' />";
            cf += "</div>";
            break;
    }
    return cf;
}
function addFieldOption(fieldValue, isDefaultOption, isMulti) {
    ddOptionCount++;
    var newOption = "<div class='field opt'>";
    newOption += "<a href='#' class='dd-opt-delete'>";
    newOption += "<i class='icon cancel'></i>";
    newOption += "</a>";
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            newOption += "<div class='ui checkbox dd-opt-default' data-tooltip='Elegir como Opción Inicial' data-inverted=''>";
            newOption += "<input type='checkbox' name='dd-opt-default'>";
            newOption += "</div>";
            newOption += "<label>Opción " + ddOptionCount.toString() + "</label>";
            break;
        default:
            newOption += "<div class='ui checkbox dd-opt-default' data-tooltip='Set as Default Option' data-inverted=''>";
            newOption += "<input type='checkbox' name='dd-opt-default'>";
            newOption += "</div>";
            newOption += "<label>Option " + ddOptionCount.toString() + "</label>";
            break;
    }
    newOption += "<div class='ui input dd-opt-value'>";
    newOption += "<input type='text' value='" + (fieldValue ? fieldValue : '') + "' />";
    newOption += "</div>";
    newOption += "</div>";
    $("#dd-add").before(newOption);
    $(".field.opt").last().find(".dd-opt-delete").click(function() {
        $(this).parents(".field.opt").remove();
        ddOptionCount = 0;
        $(".field.opt").each(function(index, element) { 
            ddOptionCount++;
            switch(mainCustomer.CustomerLanguage) {
                case "es":
                    $(element).children("label").html("Opción " + ddOptionCount.toString());
                    break;
                default:
                    $(element).children("label").html("Option " + ddOptionCount.toString());
                    break;
            }
        });
    });
    if(isMulti) {
        $(".field.opt").last().find(".dd-opt-default").checkbox();
    } else {
        $(".field.opt").last().find(".dd-opt-default").checkbox({
            onChecked: function() {
                $(".dd-opt-default").checkbox("set unchecked");
                $(this).parents(".ui.checkbox").checkbox("set checked");
            }
        });
    }
    if(isDefaultOption) {
        $(".field.opt").last().find(".dd-opt-default").checkbox("set checked");
    }
}
function saveFieldModal(cfuuid, isContact) {
    $("#modal-field .ui.form").removeClass("error");
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            $("#modal-field .ui.form .ui.error.message .header").html("Datos invalidos");
            $("#modal-field .ui.form .ui.error.message p").html("Por favor, llene el formulario con datos validos");
            break;
        default:
            $("#modal-field .ui.form .ui.error.message .header").html("Invalid Fields");
            $("#modal-field .ui.form .ui.error.message p").html("Please type in valid field values.");
            break;
    }
    $("#modal-field .ui.form #field-name").removeClass("error");
    $("#modal-field .ui.form #field-default").removeClass("error");
    $("#modal-field .ui.form #val-min").removeClass("error");
    $("#modal-field .ui.form #val-max").removeClass("error");
    var passedValidation = true;
    cfPayload = {}
    cfPayload.FieldName = $("#modal-field #field-name input").val();
    cfPayload.FieldType = cfTypeChoice;
    $("#modal-field #field-icon > .ui.dropdown > i").removeClass("icon");
    cfPayload.FieldIcon =  $("#modal-field #field-icon > .ui.dropdown > i").attr("class").trim();
    $("#modal-field #field-icon > .ui.dropdown > i").addClass("icon");
    cfPayload.IsRequired = ($("#modal-field #field-isrequired .ui.checkbox").checkbox("is checked") ? 1 : 0);                     
    switch(cfTypeChoice) {
        case "Input":
        case "Textarea":
        case "Location":
            cfPayload.FieldDefault = $("#modal-field input[name='field-default']").val();
            cfPayload.FieldPlaceholder = $("#modal-field input[name='field-placeholder']").val();
            break;
        case "Phone":
        case "Email":
        case "Link":
            cfPayload.FieldDefault = $("#modal-field input[name='field-default']").val();
            cfPayload.FieldPlaceholder = $("#modal-field input[name='field-placeholder']").val();
            cfPayload.IsPillAction = ($("#val-show .ui.checkbox").checkbox("is checked") ? 1 : 0);
            break;
        case "Integer":
        case "Decimal":
            cfPayload.FieldDefault = $("#modal-field input[name='field-default']").val();
            cfPayload.FieldPlaceholder = $("#modal-field input[name='field-placeholder']").val();
            cfPayload.FieldMin = $("#modal-field input[name='val-min']").val();
            cfPayload.FieldMax = $("#modal-field input[name='val-max']").val();
            if(cfPayload.FieldMin && (parseInt(cfPayload.FieldMin) < -2147483648 || parseInt(cfPayload.FieldMin) > 2147483647)) {
                $("#modal-field .ui.form #val-min").addClass("error");
                passedValidation = false;
            }
            if(cfPayload.FieldMax && (parseInt(cfPayload.FieldMax) < -2147483648 || parseInt(cfPayload.FieldMax) > 2147483647)) {
                $("#modal-field .ui.form #val-max").addClass("error");
                passedValidation = false;
            }
            cfPayload.FieldMin = (cfPayload.FieldMin ? cfPayload.FieldMin : -2147483648);
            cfPayload.FieldMax = (cfPayload.FieldMax ? cfPayload.FieldMax : 2147483647);
            break;
        case "Date":
        case "Time":
        case "DateTime":
            cfPayload.FieldDefault = dtDefaultChoice;
            switch(dtDefaultChoice) {
                case "Based Off":
                    cfPayload.FieldPlaceholder = $("#modal-field input[name='dt-offset-value']").val();
                    break;
                case "Static":
                    var fvalue = $("#modal-field input[name='dt-datetime-value']").val();
                    var sugarDT = Sugar.Date.create(fvalue, { fromUTC: false });
                    var dtvalue = Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
                    cfPayload.FieldPlaceholder = dtvalue;
                    break;
            }
            break;
        case "Dropdown":
            cfPayload.FieldPlaceholder = $("#modal-field input[name='dd-placeholder']").val();
            cfPayload.HasSearch = ($("#dd-searchable .ui.checkbox").checkbox("is checked") ? 1 : 0);                            
            break;
        case "Checkbox":
            cfPayload.FieldDefault = $("#chk-state .ui.checkbox").checkbox("is checked");
            if(chkType != "Checkbox" && chkType != "Slider" && chkType != "Toggle" ) {
                chkType = "Checkbox";               
            }
            cfPayload.FieldPlaceholder = chkType;
            break;
        case "Multichoice":  
            cfPayload.HasDropdown = ($("#mc-dropdown").checkbox("is checked") ? 1 : 0);
            cfPayload.HasSearch = ($("#mc-searchable").checkbox("is checked") ? 1 : 0);
            if(mcType != "Checkbox" && mcType != "Slider" && mcType != "Toggle") {
                mcType = "Checkbox";               
            }
            cfPayload.FieldPlaceholder = mcType;
            break;
        case "Progress":
            cfPayload.FieldDefault = $("#modal-field input[name='field-default']").val();
            cfPayload.FieldPlaceholder = $("#modal-field input[name='field-placeholder']").val();
            cfPayload.FieldMin = $("#modal-field input[name='val-min']").val();
            cfPayload.FieldSelections = $("#val-color .ui.dropdown").dropdown("get value");
            if(cfPayload.FieldMin && (parseInt(cfPayload.FieldMin) < 0 || parseInt(cfPayload.FieldMin) > 100)) {
                $("#modal-field .ui.form #val-min").addClass("error");
                passedValidation = false;
            }
            if(cfPayload.FieldDefault && (parseInt(cfPayload.FieldDefault) < 0 || parseInt(cfPayload.FieldDefault) > 100)) {
                $("#modal-field .ui.form #field-default").addClass("error");
                passedValidation = false;
            }
            if(!cfPayload.FieldMin) {
                cfPayload.FieldMin = 0;
            }
            if(!cfPayload.FieldDefault) {
                cfPayload.FieldDefault = 1;
            }
            break;
        case "Rating":
            cfPayload.FieldDefault = $("#modal-field input[name='field-default']").val();
            cfPayload.FieldPlaceholder = $("#val-icon .ui.dropdown").dropdown("get value");
            if(cfPayload.FieldPlaceholder == undefined || cfPayload.FieldPlaceholder == "") {
                cfPayload.FieldPlaceholder = "star";
            }
            cfPayload.FieldMax = $("#modal-field input[name='val-max']").val(); 
            var cfa = parseInt(cfPayload.FieldMax); 
            if(cfa) {      
                if(cfa < 2 || cfa > 5) {
                    $("#modal-field .ui.form #val-max").addClass("error");
                    passedValidation = false;
                }
            } else {
                cfPayload.FieldMax = 5;
            }
            var cfp = parseInt(cfPayload.FieldDefault);
            if(cfp) {
                if(cfp < 0 || cfp > 5) {
                    $("#modal-field .ui.form #field-default").addClass("error");
                    passedValidation = false;
                }
            }
            if(cfa && cfp) {
                if(cfa < cfp) {
                    $("#modal-field .ui.form #field-default").addClass("error");
                    passedValidation = false;
                }
            }
            
            break;
    } 
    switch(cfTypeChoice) {
        case "Dropdown":
        case "Singlechoice":
            cfPayload.FieldDefault = "";
            var optArray = [];
            $(".field.opt").each(function(index,element) {
                var optValue = $(element).find(".dd-opt-value input").val();
                if(optValue.trim()) {
                    optArray.push(optValue);
                }
                if($(element).children(".dd-opt-default").checkbox("is checked")) {
                    cfPayload.FieldDefault = optValue;
                }
            });
            cfPayload.FieldSelections = optArray.toString();
            break;
        case "Multichoice":
            cfPayload.FieldDefault = "";
            var optArray = [];
            var optDefault = [];
            $(".field.opt").each(function(index,element) {
                var optValue = $(element).find(".dd-opt-value input").val();
                if(optValue.trim()) {
                    optArray.push(optValue);
                }
                if($(element).children(".dd-opt-default").checkbox("is checked")) {
                    optDefault.push(optValue);
                }
            });
            cfPayload.FieldDefault = optDefault.toString();
            cfPayload.FieldSelections = optArray.toString();
            break;
    }
    if(cfPayload.FieldName && cfPayload.FieldName.trim().match(/^[A-Za-z][A-Za-z0-9 ]+$/)) { 
    } else {
        $("#modal-field .ui.form #field-name").addClass("error");
        passedValidation = false;
    }       
    if(!passedValidation) {
        $("#modal-field .ui.form").addClass("error");
        return false;
    }
    cfPayload.FieldName = cfPayload.FieldName.replace(" ","_");

    if(cfuuid) {
        updateCustomFieldAJAX(cfuuid, isContact);
    } else {
        insertCustomFieldAJAX(isContact);
    }
}
function editFieldModal(v, isContact) {
    $("#modal-field #field-name input").val(v.FieldName.replace("_"," "));
    $("#modal-field #field-icon > .ui.dropdown > i").removeClass();
    $("#modal-field #field-icon > .ui.dropdown > i").addClass("icon " + v.FieldIcon);
    $("#modal-field #field-name > .ui.input > i").removeClass();
    $("#modal-field #field-name > .ui.input > i").addClass("icon " + v.FieldIcon);
    $("#modal-field #field-isrequired .ui.checkbox").checkbox((v.IsRequired == "1" ? "set checked" : "set unchecked"));
    $("#fieldtype-" + v.FieldType.toLowerCase()).checkbox("check");
    if(isContact) {
        $("#fieldtype-phone").parents(".card").show();
        $("#fieldtype-email").parents(".card").show();
    } else {
        $("#fieldtype-phone").parents(".card").hide();
        $("#fieldtype-email").parents(".card").hide();
    }
    $("#val-show").hide();

    switch(v.FieldType) {
        case "Input":
        case "Textarea":
        case "Location":
            $("#modal-field #field-default input").val(v.FieldDefault);
            $("#modal-field #field-placeholder input").val(v.FieldPlaceholder);
            break;
        case "Email":
        case "Phone":
        case "Link":
            $("#modal-field #field-default input").val(v.FieldDefault);
            $("#modal-field #field-placeholder input").val(v.FieldPlaceholder);
            if(isContact) {
                $("#val-show").show();
            }
            break;
        case "Integer":
        case "Decimal":
            $("#modal-field #field-default input").val(v.FieldDefault);
            $("#modal-field #field-placeholder input").val(v.FieldPlaceholder);
            $("#modal-field #val-min input").val(v.FieldMin);
            $("#modal-field #val-max input").val(v.FieldMax);
            break;
        case "Date":
        case "DateTime":
        case "Time":
            switch(v.FieldDefault) {
                case "Based Off":
                    $("#dt-default-basedoff").checkbox("check");
                    $("#modal-field input[name='dt-offset-value']").val(v.FieldPlaceholder);
                    break;
                case "Static":
                    $("#dt-default-static").checkbox("check");
                    $("#modal-field input[name='dt-datetime-value']").val(v.FieldPlaceholder);
                    break;
            }
            break;
        case "Dropdown":
            $("#modal-field input[name='dd-placeholder']").val(v.FieldPlaceholder);
            if(v.HasSearch == "1") {
                $("#dd-searchable .ui.checkbox").checkbox("check");
            }
            // Fill Options
            var optArray = v.FieldSelections.split(",");
            $(".field.opt").remove();
            ddOptionCount = 0;
            for(var i=0;i<optArray.length;i++) {  
                if(v.FieldDefault == optArray[i]) {
                    addFieldOption(optArray[i],true,false);
                } else {
                    addFieldOption(optArray[i],false,false);
                }
            }
            break;
        case "Singlechoice":
            // Fill Options
            var optArray = v.FieldSelections.split(",");
            $(".field.opt").remove();
            ddOptionCount = 0;
            for(var i=0;i<optArray.length;i++) {  
                if(v.FieldDefault == optArray[i]) {
                    addFieldOption(optArray[i],true,false);
                } else {
                    addFieldOption(optArray[i],false,false);
                }
            }
            break;
        case "Checkbox":
            if(v.FieldDefault == "true") {
                $("#chk-state .ui.checkbox").checkbox("check");
            }
            switch(v.FieldPlaceholder.toLowerCase()) {
                case "checkbox":
                case "slider":
                case "toggle":
                    $("#chk-type-" + v.FieldPlaceholder.toLowerCase()).checkbox("check");
                    break;
            }
            break;
        case "Multichoice":
            if(v.HasSearch == "1") {
                $("#mc-searchable").checkbox("check");
            }
            if(v.HasDropdown == "1") {
                $("#mc-dropdown").checkbox("check");
            } else {
                if(!$("#mc-searchable").hasClass("disabled")) {
                    $("#mc-searchable").addClass("disabled");
                }     
                if($("#mc-type").hasClass("disabled")) {
                    $("#mc-type").removeClass("disabled");
                } 
            }
            switch(v.FieldPlaceholder.toLowerCase()) {
                case "checkbox":
                case "slider":
                case "toggle":
                    $("#mc-type-" + v.FieldPlaceholder.toLowerCase()).checkbox("check");
                    break;
            }
            // Fill Options
            var optArray = v.FieldSelections.split(",");
            var optDefault = v.FieldDefault.split(",");
            $(".field.opt").remove();
            ddOptionCount = 0;
            var optFound;
            for(var i=0;i<optArray.length;i++) {  
                optFound = false;
                for(var d=0;d<optDefault.length && !optFound;d++) {  
                    if(optArray[i] == optDefault[d]) {
                        addFieldOption(optArray[i],true,true);
                        optFound = true;
                    }
                }
                if(!optFound) {
                    addFieldOption(optArray[i],false,true);
                }
            }
            break;
        case "Progress":
            $("#modal-field #field-default input").val(v.FieldDefault);
            $("#modal-field #field-placeholder input").val(v.FieldPlaceholder);
            $("#modal-field #val-min input").val(v.FieldMin);
            break;
        case "Rating":
            $("#modal-field input[name='field-default']").val(v.FieldDefault);
            $("#modal-field input[name='val-max']").val(v.FieldMax);
            break;
        default:
            $("#modal-field #field-default input").val(v.FieldDefault);
            $("#modal-field #field-placeholder input").val(v.FieldPlaceholder);
            break;
    }
    $("#modal-field-save").off("click");
    $("#modal-field-save").click(function() {
        saveFieldModal(v.UUID, isContact);
    });
    // HELPER CALLS AND LAUNCH MODAL
    $(".field-edit-btn").hide();
    $("#cf-add-field").hide();
    $("#cfc-add-field").hide();
    $("#modal-field").css("zIndex","1002");
    $("#modal-field").modal('show');
    
    switch(v.FieldType) {
        case "Date":
        case "DateTime":
        case "Time":
            if(v.FieldDefault == "Static") {
                $("#dt-datetime").calendar({ type: (v.FieldType ? v.FieldType.toLowerCase() : 'datetime'), today: true });
            }
            break;
        case "Progress":
            $("#modal-field #val-color .ui.dropdown").dropdown("set selected", v.FieldSelections);
            break;
        case "Rating":
            $("#modal-field #val-icon .ui.dropdown").dropdown("set selected", v.FieldPlaceholder);
            break;
    }
}
function setCustomFieldModal() {
    // TOP FIELDS
    $("#modal-field #field-icon .ui.dropdown").dropdown({
        onChange: function(value) {
            $("#modal-field #field-icon > .ui.dropdown > i").removeClass();
            $("#modal-field #field-icon > .ui.dropdown > i").addClass("icon " + value);
            $("#modal-field #field-name > .ui.input > i").removeClass();
            $("#modal-field #field-name > .ui.input > i").addClass("icon " + value);
        }
    });
    $("#modal-field #field-isrequired .ui.checkbox").checkbox(); 

    // CARD CHECKBOXES
    $(".fieldtype .ui.checkbox").checkbox({
        onChecked: function() {
            $("#modal-field .ui.form").removeClass("error");
            $("#modal-field .ui.form #field-name").removeClass("error");
            $("#modal-field .ui.form #field-default").removeClass("error");
            $("#modal-field .ui.form #val-min").removeClass("error");
            $("#modal-field .ui.form #val-max").removeClass("error");     
            $("#modal-field .ui.form #field-default input").val("");
            $("#modal-field .ui.form #field-placeholder input").val("");
            $("#modal-field .ui.form #val-min input").val("");
            $("#modal-field .ui.form #val-max input").val("");
            $(".fieldextra .group-text").removeClass("two");
            $(".fieldextra .group-text").removeClass("three");
            $(".fieldextra .group-text").removeClass("four");
            if(mainCustomer && mainCustomer.CustomerLanguage) {
                switch(mainCustomer.CustomerLanguage) {
                    case "es":
                        $("#field-default > label").html("Valor Inicial");
                        $("#field-placeholder > label").html("Texto de Sombra");
                        $("#val-min > label").html("Valor Mínimo");
                        $("#val-max > label").html("Valor Máximo");
                        break;
                    default:
                        $("#field-default > label").html("Default Value");
                        $("#field-placeholder > label").html("Placeholder Text");
                        $("#val-min > label").html("Minimum Value");
                        $("#val-max > label").html("Maximum Value");
                        break;
                }
            }
            $(".fieldextra > div").hide();
            cfTypeChoice = $(this).val();
            // DISPLAY CUSTOM FIELDS FOR CUSTOM FIELDS
            switch(cfTypeChoice) {
                case "Input":
                case "Textarea":
                case "Location":
                    if(!$(".fieldextra .group-text").hasClass("two")) {
                        $(".fieldextra .group-text").addClass("two");
                    }
                    $("#field-default input").attr("type","text");
                    $("#field-placeholder").show();
                    $("#val-min").hide();
                    $("#val-max").hide();
                    $("#val-color").hide();
                    $("#val-icon").hide();
                    $("#val-show").hide();
                    $(".fieldextra .group-text").css("display","flex");
                    break;
                case "Phone":
                case "Email":
                case "Link":
                    if(!$(".fieldextra .group-text").hasClass("three")) {
                        $(".fieldextra .group-text").addClass("three");
                    }
                    $("#field-default input").attr("type","text");
                    $("#field-placeholder").show();
                    $("#val-min").hide();
                    $("#val-max").hide();
                    $("#val-color").hide();
                    $("#val-icon").hide();
                    $("#val-show").show();
                    $(".fieldextra .group-text").css("display","flex");
                    break;
                case "Integer":
                    if(!$(".fieldextra .group-text").hasClass("four")) {
                        $(".fieldextra .group-text").addClass("four");
                    }
                    $("#field-default input").attr("type","number");
                    $("#field-default input").attr("step","1");
                    $("#val-min input").attr("step","1");
                    $("#val-max input").attr("step","1");
                    $("#field-placeholder").show();
                    $("#val-min").show();
                    $("#val-max").show();
                    $("#val-color").hide();
                    $("#val-icon").hide();
                    $("#val-show").hide();
                    $(".fieldextra .group-text").css("display","flex");
                    break;
                case "Decimal":
                    if(!$(".fieldextra .group-text").hasClass("four")) {
                        $(".fieldextra .group-text").addClass("four");
                    }
                    $("#field-default input").attr("type","number");
                    $("#field-default input").attr("step","0.01");
                    $("#val-min input").attr("step","0.01");
                    $("#val-max input").attr("step","0.01");
                    $("#field-placeholder").show();
                    $("#val-min").show();
                    $("#val-max").show();
                    $("#val-color").hide();
                    $("#val-icon").hide();
                    $("#val-show").hide();
                    $(".fieldextra .group-text").css("display","flex");
                    break;
                case "Date":
                case "Time":
                case "DateTime":
                    $(".fieldextra .group-datetime").css("display","flex");
                    $("#dt-default-basedoff").checkbox("check");                    
                    switch(mainCustomer.CustomerLanguage) {
                        case "es":
                            $("#field-default > label").html("Valor Inicial");
                            $("#field-placeholder > label").html("Texto de Sombra");
                            $("#val-min > label").html("Valor Mínimo");
                            $("#val-max > label").html("Valor Máximo");
                            break;
                        default:
                            $("#field-default > label").html("Default Value");
                            $("#field-placeholder > label").html("Placeholder Text");
                            $("#val-min > label").html("Minimum Value");
                            $("#val-max > label").html("Maximum Value");
                            break;
                    }
                    switch(mainCustomer.CustomerLanguage) {
                        case "es":
                            let cfTypeChoiceText;
                            switch(cfTypeChoice) {
                                case "Date":
                                    cfTypeChoiceText = "Fecha";
                                    break;
                                case "Time":
                                    cfTypeChoiceText = "Tiempo";
                                    break;
                                case "DateTime":
                                    cfTypeChoiceText = "Fecha y Tiempo";
                                    break;
                            }
                            $("#dt-default-basedoff label span").html(cfTypeChoiceText);
                            $("#dt-default-static label span").html(cfTypeChoiceText);
                            $("#dt-datetime > label").html(cfTypeChoiceText);
                            break;
                        default:
                            $("#dt-default-basedoff label span").html(cfTypeChoice);
                            $("#dt-default-static label span").html(cfTypeChoice);
                            $("#dt-datetime > label").html(cfTypeChoice);
                            break;
                    }
                    break;
                case "Dropdown":
                    $(".fieldextra .group-dropdown").css("display","flex");
                    $(".fieldextra .group-options").css("display","block");
                    $(".field.opt").remove();
                    ddOptionCount = 0;
                    $("#dd-add > .btn").off("click");
                    $("#dd-add > .btn").click(function() {
                        addFieldOption(false,false,false);
                        $("#modal-field").modal("refresh");
                    });
                    break;
                case "Singlechoice":
                    $(".fieldextra .group-options").css("display","block");
                    $(".field.opt").remove();
                    ddOptionCount = 0;
                    $("#dd-add > .btn").off("click");
                    $("#dd-add > .btn").click(function() {
                        addFieldOption(false,false,false);
                        $("#modal-field").modal("refresh");
                    });
                    break;
                case "Checkbox":
                    $(".fieldextra .group-checkbox").css("display","flex");
                    break;
                case "Multichoice":
                    $(".fieldextra .group-multichoice").css("display","flex");
                    $(".fieldextra .group-options").css("display","block");
                    $(".field.opt").remove();
                    ddOptionCount = 0;
                    $("#dd-add > .btn").off("click");
                    $("#dd-add > .btn").click(function() {
                        addFieldOption(false,false,true);
                        $("#modal-field").modal("refresh");
                    });
                    break; 
                case "Progress":
                    if(!$(".fieldextra .group-text").hasClass("three")) {
                        $(".fieldextra .group-text").addClass("three");
                    }
                    $("#field-default input").attr("type","number");
                    $("#field-default input").attr("step","1");
                    $("#field-default input").attr("min","1");
                    $("#field-default input").attr("max","100");
                    $("#val-min input").attr("step","1");
                    $("#val-min input").attr("min","1");
                    $("#val-min input").attr("max","100");
                    switch(mainCustomer.CustomerLanguage) {
                        case "es":
                            $("#field-default > label").html("Porcentaje Inicial");
                            $("#val-min > label").html("Porcentaje de Paso");
                            break;
                        default:
                            $("#field-default > label").html("Default Percentage");
                            $("#val-min > label").html("Step Percentage");
                            break;
                    }
                    $("#field-placeholder").hide();
                    $("#val-min").show();
                    $("#val-max").hide();
                    $("#val-color").show();
                    $("#val-icon").hide();
                    $("#val-show").hide();
                    $(".fieldextra .group-text").css("display","flex");
                    break;
                case "Rating":
                    if(!$(".fieldextra .group-text").hasClass("three")) {
                        $(".fieldextra .group-text").addClass("three");
                    }
                    $("#field-default input").attr("type","number");
                    $("#field-default input").attr("step","1");
                    $("#field-default input").attr("min","0");
                    $("#field-default input").attr("max","5");
                    $("#val-max input").attr("step","1");
                    $("#val-max input").attr("min","0");
                    $("#val-max input").attr("max","5");
                    switch(mainCustomer.CustomerLanguage) {
                        case "es":
                            $("#field-default > label").html("Valuación Inicial");
                            $("#val-max > label").html("Valuación Total");
                            break;
                        default:
                            $("#field-default > label").html("Default Rating");
                            $("#val-max > label").html("Total Rating");
                            break;
                    }
                    $("#field-placeholder").hide();
                    $("#val-min").hide();
                    $("#val-max").show();
                    $("#val-color").hide();
                    $("#val-icon").show();
                    $("#val-show").hide();
                    $(".fieldextra .group-text").css("display","flex");
                    break;
            } 
            // CHANGE PREFERRED ICON            
            switch(cfTypeChoice) {
                case "Input":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "browser");
                    break;
                case "Textarea":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "browser");
                    break;
                case "Location":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "marker");
                    break;
                case "Phone":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "call");
                    break;
                case "Email":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "mail");
                    break;
                case "Link":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "linkify");
                    break;
                case "Integer":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "hashtag");
                    break;
                case "Decimal":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "dollar");
                    break;
                case "Date":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "calendar");
                    break;
                case "Time":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "wait");
                    break;
                case "DateTime":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "calendar");
                    break;
                case "Dropdown":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "toggle down");
                    break;
                case "Singlechoice":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "selected radio");
                    break;
                case "Checkbox":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "checkmark box");
                    break;
                case "Multichoice":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "check square");
                    break;
                case "Progress":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "bar chart");
                    break;
                case "Rating":
                    $("#modal-field #field-icon .ui.dropdown").dropdown("set selected", "star");
                    break;
            }
            $("#modal-field").modal("refresh");
        }
    });  
    $("#modal-field .card").mouseup(function(e) {
        var innerCheckBox = $(this).find(".ui.checkbox input");
        if(!innerCheckBox.is(e.target) && innerCheckBox.has(e.target).length === 0) {
            $(this).find(".ui.checkbox").checkbox("check");
        }
    });
    $("#fieldtype-input").checkbox("check");
    
    // DATETIME SPECIAL FIELDS
    $("#modal-field #dt-default .ui.checkbox").checkbox({
        onChecked: function() {
            dtDefaultChoice = $(this).val();
            switch(dtDefaultChoice) {
                case "Based Off":
                    $("#dt-offset").show();
                    $("#dt-datetime").hide();
                    $("#dt-offset-value input").val("");
                    break;
                case "Static":
                    $("#dt-offset").hide();
                    $("#dt-datetime").show();
                    $("#dt-datetime").calendar({ type: (cfTypeChoice ? cfTypeChoice.toLowerCase() : 'datetime'), today: true });
                    break;
            }
        }
    });  
    $("#dt-datetime").calendar({ type: 'datetime', today: true });
    $("#dt-default-basedoff").checkbox("check");

    // DROPDOWN SPECIAL FIELDS
    ddOptionCount = 0;
    $("#dd-searchable .ui.checkbox").checkbox();
    $("#dd-add > .btn").off("click");
    $("#dd-add > .btn").click(function() {
        addFieldOption(false,false,false);
        $("#modal-field").modal("refresh");
    });
    $("#dd-add > .btn").trigger("click");

    // CHECKBOX SPECIAL FIELDS
    $("#chk-state .ui.checkbox").checkbox({
        onChange: function() {            
            switch(mainCustomer.CustomerLanguage) {
                case "es":
                    if($(this).parents(".ui.checkbox").checkbox("is checked")) {
                        $("#chk-state .ui.checkbox label").html("Marcado");
                    } else {
                        $("#chk-state .ui.checkbox label").html("Sin Marcar");                
                    }
                    break;
                default:
                    if($(this).parents(".ui.checkbox").checkbox("is checked")) {
                        $("#chk-state .ui.checkbox label").html("Checked");
                    } else {
                        $("#chk-state .ui.checkbox label").html("Unchecked");                
                    }
                    break;
            }
        }
    });
    $("#chk-type .ui.checkbox").checkbox({
        onChecked: function() {
            chkType = $(this).val();
        }
    });
    $("#chk-type-checkbox").checkbox("check");

    // MULTICHOICE SPECIAL FIELDS
    $("#mc-type .ui.checkbox").checkbox({
        onChecked: function() {
            mcType = $(this).val();
        }
    });
    $("#mc-dropdown").checkbox({
        onChange: function() {
            if($(this).parents(".ui.checkbox").checkbox("is checked")) {
                if($("#mc-searchable").hasClass("disabled")) {
                    $("#mc-searchable").removeClass("disabled");
                }
                if(!$("#mc-type").hasClass("disabled")) {
                    $("#mc-type").addClass("disabled");
                }
            } else {
                if(!$("#mc-searchable").hasClass("disabled")) {
                    $("#mc-searchable").addClass("disabled");
                }     
                if($("#mc-type").hasClass("disabled")) {
                    $("#mc-type").removeClass("disabled");
                }        
            }
        }
    });
    $("#mc-searchable").checkbox();

    // PROGRESS BAR SPECIAL FIELDS
    $("#val-color .ui.dropdown").dropdown({
        direction: 'upward'
    });
    $("#val-icon .ui.dropdown").dropdown({
        direction: 'upward',
        onChange: function(value) {
            $("#modal-field #val-icon > .ui.dropdown > i").removeClass();
            $("#modal-field #val-icon > .ui.dropdown > i").addClass("icon " + value);
        }
    });
    
    $("#val-show .ui.checkbox").checkbox();
}
// #endregion