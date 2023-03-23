// #region VARIABLES
let companyUsers;
let companyPhones;
let customerUUID;
var hasCompanyEmailChanged = false;
var inviteEmail;
// #endregion
// #region DICTIONARY
let w_accounts_invalid_personal_email_h = "Personal email is already registered to an account";
let w_accounts_invalid_personal_email_p = "Please type in another personal email address";
// #endregion
// #region HELPER METHODS
async function createFolders() {
    $("#modal-adduser .dimmer.create-mail-folders").addClass("active");
    let data = {
        email: pfData.CompanyEmail,
        st: $("#st").val()
    }
    let req = await fetch(mailFolderGenAPI, {
        method: "POST",
        body: JSON.stringify(data)
    })
    let res = await req.json();
    $("#modal-adduser .dimmer.create-mail-folders").removeClass("active");
    baseProcess(res, function() {
        location.reload();
    });
}
function updateCustomerAJAX() {
    $("#modal-adduser .dimmer.save-account").addClass("active");
    pfData.st = $("#st").val();
    let req = $.ajax({
        method: "PUT",
        url: accountsAPI + "/" + uuid,
        data: pfData,
        dataType: "json"
    });
    req.done(function(res) {
        if(parseInt(res.code)) {
            if(hasCompanyEmailChanged) {
                createFolders();
            } else {
                location.reload();
            }
        } else {
            if(res.msg.includes("Integrity") && res.msg.includes(pfData.CustomerEmail)) {
                $("#modal-adduser .ui.form").addClass("error");
                $("#user-customeremail").addClass("error");
                $("#modal-adduser .ui.error.message .header").text(w_accounts_invalid_personal_email_h);
                $("#modal-adduser .ui.error.message p").text(w_accounts_invalid_personal_email_p);
            }
            if(res.msg.includes("Integrity") && res.msg.includes(pfData.CompanyEmail)) {
                $("#modal-adduser .ui.form").addClass("error");
                $("#user-companyemail").addClass("error");
                $("#modal-adduser .ui.error.message .header").text(w_email_already_registered_h);
                $("#modal-adduser .ui.error.message p").text(w_email_already_registered_p);
            }
        }
    });
    req.fail(handleAPIError);
    req.always(function() {
        $("#modal-adduser .dimmer.save-account").removeClass("active");
    });
}
function clearUserDetails() {
    pfData = {};
    $("#user-name").removeClass("error");
    $("#user-customeremail").removeClass("error");
    $("#user-customeremail").removeClass("info");
    $("#user-companyemail").removeClass("error");
    $("#user-password").removeClass("error");
    $("#modal-adduser .ui.form").removeClass("error");
    $("#modal-adduser .ui.form").removeClass("info");
    $("#modal-adduser .ui.form").removeClass("warning");

    $("#modal-adduser .ui.form .ui.error.message .header").text(w_invalid_fields_h);
    $("#modal-adduser .ui.form .ui.error.message p").text(w_invalid_fields_p);
}
function setUserDetails() {
    pfData.EmailSignature = $("#user-mail-signature").html();
    pfData.CustomerName = $("#user-name input").val();
    pfData.CustomerRole = $("#user-role input").val();    
    pfData.CustomerEmail = $("#user-customeremail input").val();  
    pfData.CustomerPhone = $("#user-customerphone input").val();
    if($("#user-emailonly .ui.checkbox").checkbox("is checked")) {
        pfData.IsAdmin = "0";
    } else {
        pfData.IsAdmin = "1";
    }
    
    pfData.CompanyEmail = $("#user-companyemail input").val() + "@" + mainCustomer.DomainName;
    if(companyPhones.length) {
        pfData.CompanyPhone = $("#user-companyphone .ui.dropdown").dropdown("get value");
    } else {
        pfData.CompanyPhone = "";
    }
    pfData.CustomerLanguage = $("#user-language .ui.dropdown").dropdown("get value");
    pfData.CustomerTheme = $("#user-theme .ui.dropdown").dropdown("get value");
    if($("#user-savetocrm-incomingmail .ui.checkbox").checkbox("is checked")) {
        pfData.CRMSaveIncomingEmail = "1";
    } else {
        pfData.CRMSaveIncomingEmail = "0";
    }
    if($("#user-savetocrm-outgoingmail .ui.checkbox").checkbox("is checked")) {
        pfData.CRMSaveOutgoingEmail = "1";
    } else {
        pfData.CRMSaveOutgoingEmail = "0";
    }
}
function validateUserDetails(isNewUser) {
    clearUserDetails();
    setUserDetails();
    // VALIDATE EMPTY STRINGS
    var emptyFields = false;
    if(!pfData.CustomerName) {
        $("#user-name").addClass("error");
        emptyFields = true;
    }
    if(!pfData.CompanyEmail) {
        $("#user-companyemail").addClass("error");
        emptyFields = true;
    }
    if(isNewUser) {
        var isPwdIncluded = !$("#user-register .ui.checkbox").checkbox("is checked");
        if(isPwdIncluded) {
            pfData.CustomerPassword = $("#user-password input").val();
            if(!pfData.CustomerPassword) {
                $("#user-password").addClass("error");
                emptyFields = true;
            }
        } else {
            inviteEmail = $("#user-customeremail input").val();
            if(!inviteEmail) {
                $("#user-customeremail").addClass("info");
                $("#modal-adduser .ui.form").addClass("info");
                return false;
            }
            if(!isValidEmail(inviteEmail)) {
                switch(mainCustomer.CustomerLanguage) {
                    case "es":
                        $("#modal-adduser .ui.form .ui.error.message .header").html("Correo de Invitación es Invalida");
                        $("#modal-adduser .ui.form .ui.error.message p").html("Por favor, escriba un correo de invitación valida");
                        break;
                    default:
                        $("#modal-adduser .ui.form .ui.error.message .header").html("Invalid Invitation Email");
                        $("#modal-adduser .ui.form .ui.error.message p").html("Please type in a valid invitation email address");
                        break;
                }
                $("#user-customeremail").addClass("error");
                $("#modal-adduser .ui.form").addClass("error");
                return false;
            }
        }
    } else {
        if($("#user-password input").val()) {
            pfData.CustomerPassword = $("#user-password input").val();
            if(pfData.CustomerPassword.length < 8) {
                $("#modal-adduser .ui.form").addClass("error");
                $("#user-password").addClass("error");
                $("#modal-adduser .ui.form .ui.error.message .header").text(w_invalid_password_h);
                $("#modal-adduser .ui.form .ui.error.message p").text(w_invalid_password_p);
                return false;
            }
        }
    }
    if(emptyFields) {
        $("#modal-adduser .ui.form").addClass("error");
        $("#modal-adduser .ui.form .ui.error.message .header").text(w_invalid_fields_h);
        $("#modal-adduser .ui.form .ui.error.message p").text(w_invalid_fields_p);
        return false;
    }
    // #region VALIDATE COMPANY EMAIL
    if(!isValidEmail(pfData.CompanyEmail)) {
        $("#modal-adduser .ui.form").addClass("error");
        $("#user-companyemail").addClass("error");
        $("#modal-adduser .ui.form .ui.error.message .header").text(w_invalid_email_h);
        $("#modal-adduser .ui.form .ui.error.message p").text(w_invalid_email_p);
        return false;
    }
    // #endregion
    // #region VALIDATE PASSWORD
    if(isNewUser && isPwdIncluded && pfData.CustomerPassword.length < 8) {
        $("#modal-adduser .ui.form").addClass("error");
        $("#user-password").addClass("error");
        $("#modal-adduser .ui.form .ui.error.message .header").text(w_invalid_password_h);
        $("#modal-adduser .ui.form .ui.error.message p").text(w_invalid_password_p);
        return false;
    }
    // #endregion
    return true;
}
async function updateViewSettings(viewSettings) {
    let req = await fetch(accountsViewSettingsAPI, {
        method: "PUT",
        body: JSON.stringify(viewSettings)
    })
    let res = await req.json();
    baseProcess(res, function() {});
}
function insertCustomerAJAX() {
    $("#modal-adduser .dimmer.create-account").addClass("active");
    pfData.st = $("#st").val();
    var insertCustomerRequest = $.ajax({
        method: "POST",
        url: accountsAPI,
        data: pfData,
        dataType: "json"
    });
    insertCustomerRequest.done(function(result) {
        if(parseInt(result.code) == 1) {
            pfData["UUID"] = result.newUUID;
            if($("#user-invitation-email .ui.checkbox").checkbox("is checked")) {
                pfData.InviteEmail = inviteEmail;
                $("#modal-adduser .dimmer.send-invite").addClass("active");
                var memberInviteRequest = $.ajax({
                    method: "POST",
                    url: inviteAPI,
                    data: pfData,
                    dataType: "json"
                });
                memberInviteRequest.done(function(re) {
                    createFolders();
                });
                memberInviteRequest.fail(handleAPIError);
                memberInviteRequest.always(function() {
                    $("#modal-adduser .dimmer.send-invite").removeClass("active");
                });
            } else {
                createFolders();
            }
        } else if(parseInt(result.code) == 2) {
            $("#modal-adduser .ui.form").addClass("error");
            switch(mainCustomer.CustomerLanguage) {
                case "es":
                    $("#modal-adduser .ui.error.message .header").html("No se pudo crear el usuario " + pfData.CustomerName);
                    $("#modal-adduser .ui.error.message p").html(pfData.CompanyEmail + " ya esta registrado.");
                    break;
                default:
                    $("#modal-adduser .ui.error.message .header").html("Could not create user " + pfData.CustomerName);
                    $("#modal-adduser .ui.error.message p").html(pfData.CompanyEmail + " is already registered.");
                    break;
            }
        } else {
            if(result.msg.includes("Integrity") && result.msg.includes(pfData.CustomerEmail)) {
                $("#modal-adduser .ui.form").addClass("error");
                $("#user-customeremail").addClass("error");
                $("#modal-adduser .ui.error.message .header").text(w_accounts_invalid_personal_email_h);
                $("#modal-adduser .ui.error.message p").text(w_accounts_invalid_personal_email_p);
            }
            if(result.msg.includes("Integrity") && result.msg.includes(pfData.CompanyEmail)) {
                $("#modal-adduser .ui.form").addClass("error");
                $("#user-companyemail").addClass("error");
                $("#modal-adduser .ui.error.message .header").text(w_email_already_registered_h);
                $("#modal-adduser .ui.error.message p").text(w_email_already_registered_p);
            }
            toastr.error(w_server_error_h);
            console.log(result);
        }
    });
    insertCustomerRequest.fail(handleAPIError);
    insertCustomerRequest.always(function() {
        $("#modal-adduser .dimmer.create-account").removeClass("active");
    });
}
function deleteCustomerAJAX() {
    $(".ui.main.page.dimmer").addClass("active");
    var deleteCustomerRequest = $.ajax({
        method: "DELETE",
        url: accountsAPI + "/" + uuid,
        data: { st: $("#st").val() },
        dataType: "json"
    });
    deleteCustomerRequest.done(function(pfResult) {
        location.reload();
    });
    deleteCustomerRequest.fail(handleAPIError);
    deleteCustomerRequest.always(function() {
        $(".ui.main.page.dimmer").removeClass("active");
    });
}
function updateModalTitle() {
    let name = $("#user-name input").val();
    $("#modal-adduser > .header").html("<i class='icon user'></i><span>" + name + "</span>");
}
// #endregion
// #region MAIN METHODS
function getFullName(userObj) {
    return (userObj.CustomerFirstName + " " + userObj.CustomerLastName);
}
let filteredUsers;
function updateDisplay() {
    // #region FILTER BY QUERY
    if(query) {
        filteredUsers = [];
        $.each(companyUsers, function(k,v) {
            if(getFullName(v).toLowerCase().indexOf(query) > -1 ||
                v.CompanyEmail.toLowerCase().indexOf(query) > -1) {
                filteredUsers.push(v);
            } 
        });
    } else {
        filteredUsers = companyUsers;
    }
    // #endregion
    updateCounter();
    // #region PAINT TABLE, SET ROW CLICK BEHAVIOR
    if(filteredUsers) {
        $(".no-data").hide();
        $(".ui-center .ui-table tbody").html("");
        $.each(filteredUsers, function(k,v) {
            // #region ADD ROW
            let user = `<tr id="pfUserRow${v.UUID}" data-uuid="${v.UUID}" `;
            if(v.UUID == customerUUID) {
                user += "class='myrow'";
            }
            user += ">";
            user += `<td class="col-link col-name"><a href="#">${escapeHtml(v.CustomerName)}</a></td>`;
            user += "<td class='col-data col-companyemail'>" + (v.CompanyEmail ? escapeHtml(v.CompanyEmail) : '') + "</td>";
            user += "<td class='col-data col-role'>" + (v.CustomerRole ? escapeHtml(v.CustomerRole) : '') + "</td>";
            user += "<td class='col-data col-type'>" + (parseInt(v.IsOwner) ? "Admin" : (parseInt(v.IsAdmin) ? "User" : "Email Only")) + "</td>";
            user += "<td class='col-data col-companyphone'>" + (v.CompanyPhone ? escapeHtml(v.CompanyPhone) : '') + "</td>";
            user += "<td class='col-icon delete-col'><a href='#'><i class='icon trash'></i></a></td>";
            user += "</tr>";
            $(".ui-center .ui-table tbody").append(user);
            // #endregion
            // #region ROW HANDLERS
            $(`#pfUserRow${v.UUID} .col-name`).click(function(e) {
                //#region SET UUID AND PFDATA
                uuid = $(this).parent().attr("data-uuid");
                // #region NULL CLICKS ON TRASH ICON
                let deleteCell = $("#pfUserRow" + uuid + " .delete-col");
                let deleteCellIcon = $("#pfUserRow" + uuid + " .delete-col a");
                if(deleteCell.is(e.target)
                    || deleteCell.has(e.target).length
                    || deleteCellIcon.is(e.target)) {
                    return false;
                }
                // #endregion
                // pfData = {};
                clearUserDetails();
                $.each(companyUsers, function(p,h) {
                    if(h.UUID == uuid) {
                        pfData = h;
                    }
                });
                //#endregion
                //#region SET ACCOUNT DATA
                $("#user-name input").val(pfData.CustomerName);
                $("#user-role input").val(pfData.CustomerRole);
                $("#user-customeremail input").val(pfData.CustomerEmail);
                $("#user-customerphone input").val(pfData.CustomerPhone);
                let companyEmail = pfData.CompanyEmail.substring(0, pfData.CompanyEmail.indexOf("@"));
                $("#user-companyemail input").val(companyEmail);
                if(companyPhones.length) {
                    $("#user-companyphone .ui.dropdown").dropdown("set selected", pfData.CompanyPhone);
                }
                if(parseInt(pfData.IsAdmin)) {
                    $("#user-emailonly .ui.checkbox").checkbox("set unchecked");
                } else {
                    $("#user-emailonly .ui.checkbox").checkbox("set checked");
                }
                $("#user-language .ui.dropdown").dropdown("set selected", pfData.CustomerLanguage);
                $("#user-theme .ui.dropdown").dropdown("set selected", pfData.CustomerTheme);  
                $("#user-savetocrm-incomingmail .ui.checkbox").checkbox();
                $("#user-savetocrm-outgoingmail .ui.checkbox").checkbox();
                if(parseInt(pfData.CRMSaveIncomingEmail)) {
                    $("#user-savetocrm-incomingmail .ui.checkbox").checkbox("set checked");
                } else {
                    $("#user-savetocrm-incomingmail .ui.checkbox").checkbox("set unchecked");
                }
                if(parseInt(pfData.CRMSaveOutgoingEmail)) {
                    $("#user-savetocrm-outgoingmail .ui.checkbox").checkbox("set checked");
                } else {
                    $("#user-savetocrm-outgoingmail .ui.checkbox").checkbox("set unchecked");
                }
                $("#user-mail-signature").html(pfData.EmailSignature);                
                $("#toolbar-tmplName input").val("");
                //#endregion
                //#region MODAL UI
                $("#user-password input").removeAttr("disabled");
                if(parseInt(pfData.IsOwner)) {
                    $("#user-emailonly").parent().hide();
                    $("#user-emailonly").hide();
                } else {
                    $("#user-emailonly").parent().show();
                    $("#user-emailonly").show();
                }
                $("#user-register .ui.checkbox").checkbox("set unchecked");
                $("#user-register").hide();
                switch(mainCustomer.CustomerLanguage) {
                    case "es":
                        $("#modal-adduser-save").html("<i class='icon save'></i><span>Grabar Cambios</span>");
                        break;
                    default:
                        $("#modal-adduser-save").html("<i class='icon save'></i><span>Save Changes</span>");
                        break;
                }
                //#endregion
                //#region MODAL BEHAVIOR
                updateModalTitle();
                $("#user-name input").off("keyup");
                $("#user-name input").keyup(updateModalTitle);
                $("#modal-adduser").modal({ autofocus: false });
                $("#modal-adduser").modal("show");
                $("#modal-adduser-save").off("click");
                $("#modal-adduser-save").click(function() {
                    if(mainCustomer.DomainName && (pfData.CompanyEmail != ($("#user-companyemail input").val() + "@" + mainCustomer.DomainName))) {
                        hasCompanyEmailChanged = true;
                    } else { hasCompanyEmailChanged = false; }
                    if(validateUserDetails(false)) {
                        updateCustomerAJAX();
                    } else return false;
                });
                //#endregion
            });
            $("#pfUserRow" + v.UUID + " .delete-col a").click(function(e) {
                uuid = $(this).parents("tr").attr("data-uuid");
                deleteCustomerAJAX();
            });
            // #endregion
        });        
        $(".ui-center .ui-table").trigger("update");
    } else {
        $(".no-data").show();
    }
    // #endregion
}
function updateCounter() {
    if(filteredUsers) {
        var isPlural = filteredUsers.length > 1;       
        let word; 
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                word = "Cuenta" + (isPlural ? "s" : "");
                break;
            default:
                word = "Account" + (isPlural ? "s" : "");
                break;
        }
        $("#ui-counter-total").text(filteredUsers.length + " " + word);
    } else {
        $("#ui-counter-total").text("");
    }
}
function wireUI() {
    $(".ui-center .ui-table").tablesorter({
        headers: {
            ".col-icon": { sorter: false }
        }
    });
    $("#accounts-add").click(function() {
        clearUserDetails();
        pfData = {};
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                $("#modal-adduser-save").html("<i class='icon add user'></i><span>Crear Cuenta</span>");
                $("#modal-adduser > .header").html("<i class='icon add user'></i><span>Nueva Cuenta</span>");
                break;
            default:
                $("#modal-adduser-save").html("<i class='icon add user'></i><span>Create Account</span>");
                $("#modal-adduser > .header").html("<i class='icon add user'></i><span>New User</span>");
                break;
        }
        $("#user-name input").off("keyup");
        $("#user-name input").val("");
        $("#user-role input").val("");
        $("#user-companyemail input").val("");
        $("#user-password input").val("");
        $("#user-emailonly").parent().show();
        $("#user-emailonly").show();
        $("#user-emailonly .ui.checkbox").checkbox("set unchecked");
        $("#user-register").show();
        $("#user-register .ui.checkbox").checkbox({
            onChecked: function() {
                $("#user-password input").attr("disabled","true");
            },
            onUnchecked: function() {
                $("#user-password input").removeAttr("disabled");
            }
        });
        $("#user-register .ui.checkbox").checkbox("set unchecked");
        $("#user-companyphone .ui.dropdown").dropdown("set selected", "");
        $("#user-customeremail input").val("");
        $("#user-customerphone input").val("");
        $("#user-savetocrm-incomingmail .ui.checkbox").checkbox("set checked");
        $("#user-savetocrm-outgoingmail .ui.checkbox").checkbox("set checked");
        $("#user-mail-signature").html("");
        $("#toolbar-tmplName input").val("");
        $("#user-language .ui.dropdown").dropdown("set selected", mainCustomer.CustomerLanguage);
        $("#user-theme .ui.dropdown").dropdown("set selected", mainCustomer.CustomerTheme);    

        $("#modal-adduser").modal({ autofocus: false });
        $("#modal-adduser").modal("show");

        $("#modal-adduser-save").off("click");
        $("#modal-adduser-save").click(function() {
            if(validateUserDetails(true)) {
                insertCustomerAJAX();
            }
            return false;
        });
    });
    $("#ui-search input").keyup(function(e) {
        query = $("#ui-search input").val().toLowerCase();
        updateDisplay();
    });
}
function wireUserModal() {
    $(".ui.accordion").accordion({ "exclusive": false });
    $("#user-emailonly .ui.checkbox").checkbox();
    $("#user-register .ui.checkbox").checkbox();
    $("#user-savetocrm-incomingmail .ui.checkbox").checkbox();
    $("#user-savetocrm-outgoingmail .ui.checkbox").checkbox();
    $("#user-language .ui.dropdown").dropdown({ direction: "upward" });
    $("#user-theme .ui.dropdown").dropdown({ direction: "upward" });

    $("#user-companyemail .ui.label").html("@" + mainCustomer.DomainName);
    if(companyPhones.length) {
        $("#user-companyphone").show();
        $("#user-companyphone .ui.dropdown .menu").html("");
        var phoneOption;
        $.each(companyPhones, function(p,h) {
            phoneOption = "<div class='item' data-value='" + h.PhoneNumber + "'><i class='icon phone'></i>" + h.PhoneNumber + "</div>";
            $("#user-companyphone .ui.dropdown .menu").append(phoneOption);
        });
        var noPhoneOption = "<div class='item' data-value=''>" + "None" + "</div>";
        $("#user-companyphone .ui.dropdown .menu").append(noPhoneOption);
        $("#user-companyphone .ui.dropdown").dropdown({ placeholder: false });
    } else {
        $("#user-companyphone").hide();
        $("#user-companyphone").parent().hide();
    }
}
function wireColumns() {
    // #region INITIALIZE COLUMNS
    if(parseInt(mainCustomer.ColAccountsName)) {
        $(".col-name").show();
        $("#modal-col-name").checkbox("check");
    } else {
        $(".col-name").hide();
        $("#modal-col-name").checkbox("uncheck");
    }
    if(parseInt(mainCustomer.ColAccountsCompanyEmail)) {
        $(".col-companyemail").show();
        $("#modal-col-companyemail").checkbox("check");
    } else {
        $(".col-companyemail").hide();
        $("#modal-col-companyemail").checkbox("uncheck");
    }
    if(parseInt(mainCustomer.ColAccountsRole)) {
        $(".col-role").show();
        $("#modal-col-role").checkbox("check");
    } else {
        $(".col-role").hide();
        $("#modal-col-role").checkbox("uncheck");
    }
    if(parseInt(mainCustomer.ColAccountsType)) {
        $(".col-type").show();
        $("#modal-col-type").checkbox("check");
    } else {
        $(".col-type").hide();
        $("#modal-col-type").checkbox("uncheck");
    }
    if(parseInt(mainCustomer.ColAccountsCompanyPhone)) {
        $(".col-companyphone").show();
        $("#modal-col-companyphone").checkbox("check");
    } else {
        $(".col-companyphone").hide();
        $("#modal-col-companyphone").checkbox("uncheck");
    }
    // #endregion
    // #region CHANGE COLUMNS BUTTON
    $("#accounts-columns").click(function() {
        $("#modal-columns").modal("show");
    });
    // #endregion
    // #region CHANGE COLUMNS CHECKBOXES
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
    // #endregion
    // #region SAVE COLUMNS
    $("#modal-columns-save").off("click");
    $("#modal-columns-save").click(function() {
        let viewSettings = {};
        if($("#modal-col-name").checkbox("is checked")) {
            $(".col-name").show();
            viewSettings.ColAccountsName = 1;
        } else {
            $(".col-name").hide();
            viewSettings.ColAccountsName = 0;
        }
        if($("#modal-col-companyemail").checkbox("is checked")) {
            $(".col-companyemail").show();
            viewSettings.ColAccountsCompanyEmail = 1;
        } else {
            $(".col-companyemail").hide();
            viewSettings.ColAccountsCompanyEmail = 0;
        }
        if($("#modal-col-role").checkbox("is checked")) {
            $(".col-role").show();
            viewSettings.ColAccountsRole = 1;
        } else {
            $(".col-role").hide();
            viewSettings.ColAccountsRole = 0;
        }
        if($("#modal-col-type").checkbox("is checked")) {
            $(".col-type").show();
            viewSettings.ColAccountsType = 1;
        } else {
            $(".col-type").hide();
            viewSettings.ColAccountsType = 0;
        }
        if($("#modal-col-companyphone").checkbox("is checked")) {
            $(".col-companyphone").show();
            viewSettings.ColAccountsCompanyPhone = 1;
        } else {
            $(".col-companyphone").hide();
            viewSettings.ColAccountsCompanyPhone = 0;
        }
        updateViewSettings(viewSettings);
    });
    // #endregion
}
function translateAccounts() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            // UI - BAR
            $("#title").text("Cuentas");
            $("#ui-search input").attr("placeholder","Buscar...");
            $("#accounts-add span").text("Agregar Cuenta de Correo");
            $("#accounts-columns span").text("Cambiar Columnas");
            $("#accounts-plan span").text("Cambiar de Plan");
            $("#accounts-setting span").text("Configuración de la Compañía");
            // DICTIONARY
            w_accounts_invalid_personal_email_h = "Correo personal ya esta registrado a una cuenta";
            w_accounts_invalid_personal_email_p = "Por favor, ingrese otro correo personal";
            // ACCOUNTS TABLE
            $(".ui-center th.col-name").text("Nombre");
            $(".ui-center th.col-companyemail").text("Correo");
            $(".ui-center th.col-role").text("Título");
            $(".ui-center th.col-type").text("Acceso");
            $(".ui-center th.col-companyphone").text("Teléfono");
            $(".ui-center .no-data p").text("No hay usuarios disponibles");
            $(".ui-center tbody tr").each(function() {
                let userType = $(this).find("td.col-type");
                switch(userType.text()) {
                    case "Admin":
                        userType.text("Administrador");
                        break;
                    case "User":
                        userType.text("Usuario");
                        break;
                    case "Email Only":
                        userType.text("Solo Correo");
                        break;
                }
            });
            // ACCOUNT UI
            $("#modal-adduser > .header span").text("Detalles de la Cuenta");
            $("#header-personal span").text("Información de Contacto");
            $("#header-emailfeatures span").text("Habilidades del Correo");
            $("#header-display span").text("Visualización");
            $("#user-name > label").text("Nombre");
            $("#user-role > label").text("Título");
            $("#user-emailonly label").text("Solo correo");
            $("#user-emailonly .ui.checkbox").attr("data-tooltip","Elimina acceso a los otros módulos");
            $("#user-customeremail > label").text("Correo Personal");
            $("#user-customerphone > label").text("Teléfono Personal");
            $("#user-companyemail > label").text("Correo");
            $("#user-companyphone > label").text("Teléfono");
            $("#user-register label").text("Dejar al usuario crear su contraseña");
            $("#user-register .ui.checkbox").attr("data-tooltip","Un enlace de registración sera envíado al correo electrónico personal del usuario");
            $("#user-password > label").text("Contraseña");
            $("#user-language > label").text("Lenguaje");
            $("#user-language .ui.dropdown .item[data-value='en'] span").text("Inglés");
            $("#user-language .ui.dropdown .item[data-value='es'] span").text("Español");
            $("#user-theme > label").text("Temática");
            $("#user-theme .ui.dropdown .item[data-value='light'] span").text("Claro");
            $("#user-theme .ui.dropdown .item[data-value='neonblue'] span").text("Azul Oscuro");
            $("#user-theme .ui.dropdown .item[data-value='neonred'] span").text("Rojo Oscuro");
            $("#user-theme .ui.dropdown .item[data-value='neongreen'] span").text("Verde Oscuro");
            let languageText = $("#user-language .ui.dropdown .text span");
            switch(pfData.CustomerLanguage) {
                case "en":
                    languageText.text("Inglés");
                    break;
                case "es":
                    languageText.text("Español");
                    break;
            }
            let themeText = $("#user-theme .ui.dropdown .text span");
            switch(pfData.CustomerTheme) {
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
            $("#user-savetocrm > label").text("Correo a CRM");
            $("#user-savetocrm-incomingmail label").text("Generar clientes de remitentes de correos");
            $("#user-savetocrm-outgoingmail label").text("Generar clientes de destinarios de correos");
            $("#toolbar-html span").text("Simple / HTML");
            $("#user-signature > label").text("Firma de Correo");

            $("#modal-adduser-exit span").text("Salir");
            $("#modal-adduser-save span").text("Agregar Cuenta");
            $("#modal-adduser .ui.dimmer.save-template span").text("Grabando Plantilla");
            $("#modal-adduser .ui.dimmer.save-template2 span").text("Grabando Plantilla");
            $("#modal-adduser .ui.dimmer.save-account span").text("Grabando Cuenta");
            $("#modal-adduser .ui.dimmer.create-account span").text("Creando Cuenta");
            $("#modal-adduser .ui.dimmer.create-mail-folders span").text("Creando Carpetas de Correo");
            $("#modal-adduser .ui.dimmer.send-invite span").text("Envíando Invitación");

            // MODAL - COLUMNS
            $("#modal-columns > .header span").text("Mostrar/Esconder Columnas");
            $("#modal-col-name label").text("Nombre");
            $("#modal-col-role label").text("Título");
            $("#modal-col-type label").text("Acceso");
            $("#modal-col-companyemail label").text("Correo");
            $("#modal-col-companyphone label").text("Teléfono");
            $("#modal-columns-save span").text("Grabar");

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

function wireAccounts() {
    $("#title").text("Accounts");
    $(".ui-center .ui-table tbody").html("");
    updateDisplay();
    wireUI();
    wireUserModal();
    wireGallery();
    wireToolbar();
    wireColumns();
    templateLoad();
    translateAccounts();
    clean_pfData();
}
// #endregion
// #region LAUNCH
async function launchAccounts() {
    query = getParameterByName("q");
    $("#ui-search input").val(query);
    try {
        let req = await fetch(accountsAPI);
        let res = await req.json();
        baseProcess(res, function() {
            companyUsers = res.data;
            customerUUID = res.CustomerUUID;
        });
        req = await fetch(phoneAPI);
        res = await req.json();
        baseProcess(res, function() {
            companyPhones = res.data;
        });
        wireAccounts();
    } catch(ex) {
        toastr.error(w_server_error_h);
        console.log(ex);
    }
}
$(function() {
    launchInterval = setInterval(function() {
        if(mainCustomer && mainCustomer.CustomerName) {
            launchAccounts();
            clearInterval(launchInterval);
        }
    }, 100);
});
// #endregion