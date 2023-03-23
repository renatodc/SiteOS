// #region DICTIONARY
let w_mass_mailing = "Broadcast";
let w_mass_mailing_plural = "Broadcasts";
// #endregion
// #region HELPER METHODS
function toggleButtons(display) {
    if(display) {
        $("#campaign-delete").show();
    } else {
        $("#campaign-delete").hide();
    }
}
async function deleteCampaignAJAX(uuid) {
    let req = await fetch(broadcastAPI + "/" + uuid, {
        method: "DELETE"
    });
    let res = await req.json();
    baseProcess(res, function() {
        itemsDeleted++;
        if(itemsChecked == itemsDeleted) {
            $(".ui.main.page.dimmer").removeClass("active");
        }
    });
}
async function updateViewSettings(viewSettings) {
    $(".dimmer").addClass("active");
    let req = await fetch(broadcastsViewSettingsAPI, {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify(viewSettings)
    });
    let res = await req.json();
    $(".dimmer").removeClass("active");
}
// #endregion
// #region MAIN METHODS
function setCampaignTable() {
   $(".ui-center .ui-table tbody").html("");
    $.each(pfData, function(k,v) {
        // #region SET TABLE ROWS
        var newRow = "<tr id='pfCampaignRow" + v.UUID + "' data-uuid='" + v.UUID + "'>";
        newRow += "<td class='col-check'>" + "<div class='ui fitted checkbox'><input type='checkbox' class='hidden'/></div>" + "</td>";
        newRow += `<td class='col-link col-name'><a href='#'>${v.CampaignName ? escapeHtml(v.CampaignName) : "No Subject"}</a></td>`;
        newRow += "<td class='col-data col-recipients'><span>" + (v.TotalRecipients ? v.TotalRecipients : '') + "</span></td>";

        newRow += "<td class='col-data col-delivered'><span data-rate='" + (v.TotalDelivered ? ((v.TotalDelivered / v.TotalRecipients)*100).toFixed(2) + "%" : '') + "'>" + (v.TotalDelivered ? v.TotalDelivered : '') + "</span></td>";
        newRow += "<td class='col-data col-bounced'><span data-rate='" + (v.TotalBounced ? ((v.TotalBounced / v.TotalRecipients)*100).toFixed(2) + "%" : '') + "'>" + (v.TotalBounced ? v.TotalBounced : '') + "</span></td>";
        newRow += "<td class='col-data col-failed'><span data-rate='" + (v.TotalFailed ? ((v.TotalFailed / v.TotalRecipients)*100).toFixed(2) + "%" : '') + "'>" + (v.TotalFailed ? v.TotalFailed : '') + "</span></td>";
        newRow += "<td class='col-data col-opened'><span data-rate='" + (v.TotalOpened ? ((v.TotalOpened / v.TotalRecipients)*100).toFixed(2) + "%" : '') + "'>" + (v.TotalOpened ? v.TotalOpened : '') + "</span></td>";
        newRow += "<td class='col-data col-clicked'><span data-rate='" + (v.TotalClicked ? ((v.TotalClicked / v.TotalRecipients)*100).toFixed(2) + "%" : '') + "'>" + (v.TotalClicked ? v.TotalClicked : '') + "</span></td>";
        newRow += "<td class='col-data col-unsubscribed'><span data-rate='" + (v.TotalUnsubscribed ? ((v.TotalUnsubscribed / v.TotalRecipients)*100).toFixed(2) + "%" : '') + "'>" + (v.TotalUnsubscribed ? v.TotalUnsubscribed : '') + "</span></td>";
        newRow += "<td class='col-data col-complained'><span data-rate='" + (v.TotalComplained ? ((v.TotalComplained / v.TotalRecipients)*100).toFixed(2) + "%" : '') + "'>" + (v.TotalComplained ? v.TotalComplained : '') + "</span></td>";

        newRow += "<td class='col-data col-datecreated'><span>" + (v.DateCreated ? getshortdt(v.DateCreated) : '') + "</span></td>";
        newRow += "<td class='col-data col-datemodified'><span>" + (v.DateModified ? getshortdt(v.DateModified) : '') + "</span></td>";
        newRow += "<td class='col-data col-createdby'><span>" + (v.CreatedBy ? escapeHtml(v.CreatedBy) : '') + "</span></td>";
        newRow += "</tr>";

        $(".ui-center .ui-table tbody").append(newRow);
        // #endregion
        // #region ROW CLICK HANDLER
        $("#pfCampaignRow" + v.UUID).off("click");
        $("#pfCampaignRow" + v.UUID).click(function(e) {
            var checkContainer = $("#pfCampaignRow" + v.UUID + " .col-check .checkbox");
            var linkContainer = $("#pfCampaignRow" + v.UUID + " .col-link");
            if(checkContainer.has(e.target).length === 0
                && linkContainer.has(e.target).length === 0) {
                $("#pfCampaignRow" + v.UUID + " .col-check .checkbox").checkbox("toggle");
            }
            if(e.shiftKey) {
                var firstCheck = $("td.col-check input[type='checkbox']:checked:first");
                var firstIndex = $(firstCheck).parents("tr").index();
                var lastCheck = $("td.col-check input[type='checkbox']:checked:last");
                var lastIndex = $(lastCheck).parents("tr").index();
                var checkIndex = $("#pfCampaignRow" + v.UUID).index();
                if(firstIndex == checkIndex) {
                    checkIndex = lastIndex;
                }
                $(".ui-center .ui-table tbody tr").slice(firstIndex,checkIndex+1).find(".col-check > div").checkbox("check");
                document.getSelection().removeAllRanges();
            }
            if(pfData.length == $("td.col-check input[type='checkbox']:checked").length) {
                $(".col-head-check .ui.checkbox").checkbox("set checked");
            }
        });
        // #endregion
        $("#pfCampaignRow" + v.UUID + " .col-link a").on("touchend click", function(e) {
            let recipients = [];
            if(v.MailTo) {
                recipients.push(...v.MailTo.split(",").filter(x => x.trim()));
            }
            if(v.MailCC) {
                recipients.push(...v.MailCC.split(",").filter(x => x.trim()));
            }
            if(v.MailBCC) {
                recipients.push(...v.MailBCC.split(",").filter(x => x.trim()));
            }            
            $("#modal-recipients table tbody").html("");
            let row = "";
            recipients.forEach(function(recipient) {
                row = "<tr>";
                row += `<td>${recipient}</td>`;
                row += `<td>${v.RecipientsDelivered && v.RecipientsDelivered.split(",").filter(x => x.trim()).includes(recipient) ? "<i class='icon checkmark'></i>" : ''}</td>`;
                row += `<td>${v.RecipientsOpened && v.RecipientsOpened.split(",").filter(x => x.trim()).includes(recipient) ? "<i class='icon checkmark'></i>" : ''}</td>`;
                row += `<td>${v.RecipientsClicked && v.RecipientsClicked.split(",").filter(x => x.trim()).includes(recipient) ? "<i class='icon checkmark'></i>" : ''}</td>`;
                row += `<td>${v.RecipientsBounced && v.RecipientsBounced.split(",").filter(x => x.trim()).includes(recipient) ? "<i class='icon checkmark'></i>" : ''}</td>`;
                row += `<td>${v.RecipientsFailed && v.RecipientsFailed.split(",").filter(x => x.trim()).includes(recipient) ? "<i class='icon checkmark'></i>" : ''}</td>`;
                row += `<td>${v.RecipientsUnsubscribed && v.RecipientsUnsubscribed.split(",").filter(x => x.trim()).includes(recipient) ? "<i class='icon checkmark'></i>" : ''}</td>`;
                row += `<td>${v.RecipientsComplained && v.RecipientsComplained.split(",").filter(x => x.trim()).includes(recipient) ? "<i class='icon checkmark'></i>" : ''}</td>`;
                row += "</tr>";
                $("#modal-recipients table tbody").append(row);
            });
            $("#modal-recipients").modal("show");
            $("#modal-recipients-exit").off("click");
            $("#modal-recipients-exit").click(function() {
                $("#modal-recipients").modal("hide");
            });

            $("#modal-recipients-view-msg").off("click");
            $("#modal-recipients-view-msg").click(function() {
                $("#modal-msg > .header > span").text(v.MailSubject);
                if(v.MailBodyFiltered) {
                    $("#modal-msg > .content").html(v.MailBodyFiltered);
                } else if(v.MailBodyPlain) {
                    $("#modal-msg > .content").text(v.MailBodyPlain);
                }
                $("#modal-msg").modal("show");
            });
        });
    });
}
function setCheckBehavior() {
    $("td.col-check > div").checkbox({
        onChecked : function() {
            toggleButtons(true);
            $(this).parents("tr").find("td").css("background", "var(--color-table-row-hover-bg)");
        },
        onUnchecked : function() {
            $(this).parents("tr").find("td").css("background", "");
            $(".col-head-check .ui.checkbox").checkbox("set unchecked");
            var checkedBoxes = $("td.col-check input[type='checkbox']:checked").length;
            if(checkedBoxes == 0) {
                toggleButtons(false);
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
    $("body").off("mouseup");
    $("body").mouseup(function(e) {
        var leadsTable = $(".ui-center .ui-table");
        var leadsButtons = $(".campaign-bar .btn");
        var toprightButton = $(".userButton");
        var toprightMenu = $(".userMenu");
        var listLeadModal = $("#modal-list");
        var uiExec = $(".ui-bar");
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
            && uiExec.has(e.target).length === 0 ) // nor the button itself
        {
            $("td.col-check > div").checkbox("uncheck");
        }
    });
}
function updateDisplay() {
    if(pfData === undefined) {
        $(".col-head-check .ui.checkbox").checkbox("set unchecked");
        $(".no-data").show();
        $("#campaign-rates").hide();
        $("#ui-counter-total").html("");
    } else {
        switch(pfData.length) {
            case 0:
                $(".col-head-check .ui.checkbox").checkbox("set unchecked");
                $(".no-data").show();
                $("#campaign-rates").hide();
                $("#ui-counter-total").html("");
                break;
            case 1:
                $("#ui-counter-total").html(`1 ${w_mass_mailing}`);
                $("#campaign-rates").show();
                break;
            default:
                $("#ui-counter-total").html(`${pfData.length} ${w_mass_mailing_plural}`);
                $("#campaign-rates").show();
                break;
        }
    }
}
function setActions() {
    // #region DELETE CAMPAIGNS
    $("#campaign-delete").off("mousedown");
    $("#campaign-delete").mousedown(function() {
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
            var cIndex = 0;
            $.each(pfData, function(k,v) { if(v.UUID == uuid) { cIndex = k; } });
            pfData.splice(cIndex,1);
            deleteCampaignAJAX(uuid);
        });
        $(".ui-center .ui-table").trigger("update");
        toggleButtons(false);
        updateDisplay();
    });
    // #endregion
    $("body").off("keyup");
    $("body").keyup(function(event) {
        if(event.which == 46) {
            $("#campaign-delete").trigger("click");
        }
    });
    $("#campaign-rates").off("click");
    $("#campaign-rates").click(function() {
        $(".ui-center .ui-table tbody tr").each(function(index) {
            var deliveredRate = $(this).find("td.col-delivered span").attr("data-rate");
            var failedRate = $(this).find("td.col-failed span").attr("data-rate");
            var openedRate = $(this).find("td.col-opened span").attr("data-rate");
            var clickedRate = $(this).find("td.col-clicked span").attr("data-rate");
            var unsubscribedRate = $(this).find("td.col-unsubscribed span").attr("data-rate");
            var complainedRate = $(this).find("td.col-complained span").attr("data-rate");

            $(this).find("td.col-delivered span").attr("data-rate", $(this).find("td.col-delivered span").text());
            $(this).find("td.col-failed span").attr("data-rate", $(this).find("td.col-failed span").text());
            $(this).find("td.col-opened span").attr("data-rate", $(this).find("td.col-opened span").text());
            $(this).find("td.col-clicked span").attr("data-rate", $(this).find("td.col-clicked span").text());
            $(this).find("td.col-unsubscribed span").attr("data-rate", $(this).find("td.col-unsubscribed span").text());
            $(this).find("td.col-complained span").attr("data-rate", $(this).find("td.col-complained span").text());

            $(this).find("td.col-delivered span").html(deliveredRate);
            $(this).find("td.col-failed span").html(failedRate);
            $(this).find("td.col-opened span").html(openedRate);
            $(this).find("td.col-clicked span").html(clickedRate);
            $(this).find("td.col-unsubscribed span").html(unsubscribedRate);
            $(this).find("td.col-complained span").html(complainedRate);
        });
    });
    // #region COLUMNS
    $("#campaign-columns").off("click");
    $("#campaign-columns").click(function() {
        $("#modal-columns").modal("show");
    });
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
    $("#modal-col-recipients").checkbox((mainCustomer.ColBroadcastRecipients == "1") ? "check" : "uncheck");
    $("#modal-col-delivered").checkbox((mainCustomer.ColBroadcastDelivered == "1") ? "check" : "uncheck");
    $("#modal-col-bounced").checkbox((mainCustomer.ColBroadcastBounced == "1") ? "check" : "uncheck");
    $("#modal-col-failed").checkbox((mainCustomer.ColBroadcastFailed == "1") ? "check" : "uncheck");
    $("#modal-col-opened").checkbox((mainCustomer.ColBroadcastOpened == "1") ? "check" : "uncheck");
    $("#modal-col-clicked").checkbox((mainCustomer.ColBroadcastClicked == "1") ? "check" : "uncheck");
    $("#modal-col-unsubscribed").checkbox((mainCustomer.ColBroadcastUnsubscribed == "1") ? "check" : "uncheck");
    $("#modal-col-complained").checkbox((mainCustomer.ColBroadcastComplained == "1") ? "check" : "uncheck");
    $("#modal-col-datecreated").checkbox((mainCustomer.ColBroadcastDateCreated == "1") ? "check" : "uncheck");
    $("#modal-col-datemodified").checkbox((mainCustomer.ColBroadcastDateModified == "1") ? "check" : "uncheck");
    $("#modal-col-createdby").checkbox((mainCustomer.ColBroadcastCreatedBy == "1") ? "check" : "uncheck");
    $("#modal-columns-save").off("click");
    $("#modal-columns-save").click(function() {
        let viewSettings = {};
        if($("#modal-col-recipients").checkbox("is checked")) {
            $(".col-recipients").show();
            viewSettings.ColBroadcastRecipients = 1;
        } else {
            $(".col-recipients").hide();
            viewSettings.ColBroadcastRecipients = 0;
        }
        if($("#modal-col-delivered").checkbox("is checked")) {
            $(".col-delivered").show();
            viewSettings.ColBroadcastDelivered = 1;
        } else {
            $(".col-delivered").hide();
            viewSettings.ColBroadcastDelivered = 0;
        }
        if($("#modal-col-bounced").checkbox("is checked")) {
            $(".col-bounced").show();
            viewSettings.ColBroadcastBounced = 1;
        } else {
            $(".col-bounced").hide();
            viewSettings.ColBroadcastBounced = 0;
        }
        if($("#modal-col-failed").checkbox("is checked")) {
            $(".col-failed").show();
            viewSettings.ColBroadcastFailed = 1;
        } else {
            $(".col-failed").hide();
            viewSettings.ColBroadcastFailed = 0;
        }
        if($("#modal-col-opened").checkbox("is checked")) {
            $(".col-opened").show();
            viewSettings.ColBroadcastOpened = 1;
        } else {
            $(".col-opened").hide();
            viewSettings.ColBroadcastOpened = 0;
        }
        if($("#modal-col-clicked").checkbox("is checked")) {
            $(".col-clicked").show();
            viewSettings.ColBroadcastClicked = 1;
        } else {
            $(".col-clicked").hide();
            viewSettings.ColBroadcastClicked = 0;
        }
        if($("#modal-col-unsubscribed").checkbox("is checked")) {
            $(".col-unsubscribed").show();
            viewSettings.ColBroadcastUnsubscribed = 1;
        } else {
            $(".col-unsubscribed").hide();
            viewSettings.ColBroadcastUnsubscribed = 0;
        }
        if($("#modal-col-complained").checkbox("is checked")) {
            $(".col-complained").show();
            viewSettings.ColBroadcastComplained = 1;
        } else {
            $(".col-complained").hide();
            viewSettings.ColBroadcastComplained = 0;
        }
        if($("#modal-col-datecreated").checkbox("is checked")) {
            $(".col-datecreated").show();
            viewSettings.ColBroadcastDateCreated = 1;
        } else {
            $(".col-datecreated").hide();
            viewSettings.ColBroadcastDateCreated = 0;
        }
        if($("#modal-col-datemodified").checkbox("is checked")) {
            $(".col-datemodified").show();
            viewSettings.ColBroadcastDateModified = 1;
        } else {
            $(".col-datemodified").hide();
            viewSettings.ColBroadcastDateModified = 0;
        }
        if($("#modal-col-createdby").checkbox("is checked")) {
            $(".col-createdby").show();
            viewSettings.ColBroadcastCreatedBy = 1;
        } else {
            $(".col-createdby").hide();
            viewSettings.ColBroadcastCreatedBy = 0;
        }
        updateViewSettings(viewSettings);
    });
    // #endregion
}

function translateCampaign() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            $("#title").text("Masivos");
            w_mass_mailing = "Correo Masivo";
            w_mass_mailing_plural = "Correos Masivos";
            $(".ui-center .ui-table tbody tr").each(function(i) {
                let subject = $(this).find("td.col-name a");
                switch(subject.text()) {
                    case "No Subject":
                        $(this).find("td.col-name a").text("Sin Asunto");
                        break;
                }
            });
            // DATE COLUMN SORT PREFERENCE
            $("th.col-datecreated").removeClass("sorter-mmddyy");
            $("th.col-datecreated").addClass("sorter-ddmmyy");
            $("th.col-datemodified").removeClass("sorter-mmddyy");
            $("th.col-datemodified").addClass("sorter-ddmmyy");
            // UI - BAR
            $("#campaign-columns span").text("Cambiar Columnas");
            $("#campaign-rates span").text("Cambiar Medidas");
            $("#campaign-delete span").text("Borrar");
            // CAMPAIGNS - TABLE
            $("th.col-name span").text("Asunto");
            $("th.col-recipients span").text("Para");
            $("th.col-delivered span").text("Envíados");
            $("th.col-bounced span").text("Rebotados");
            $("th.col-failed span").text("Fallados");
            $("th.col-opened span").text("Abiertos");
            $("th.col-clicked span").text("Clickeados");
            $("th.col-unsubscribed span").text("Desuscritos");
            $("th.col-complained span").text("Quejados");
            $("th.col-datecreated span").text("Fecha Envíada");
            $("th.col-datemodified span").text("Última Actualización");
            $("th.col-createdby span").text("Envíado Por");
            $(".no-data p").text("No hay correos masivos disponibles");
            // MODAL - COLUMNS
            $("#modal-col-recipients label").text("Para");
            $("#modal-col-delivered label").text("Envíados");
            $("#modal-col-bounced label").text("Rebotados");
            $("#modal-col-failed label").text("Fallados");
            $("#modal-col-opened label").text("Abiertos");
            $("#modal-col-clicked label").text("Clickeados");
            $("#modal-col-unsubscribed label").text("Desuscritos");
            $("#modal-col-complained label").text("Quejados");
            $("#modal-col-datecreated label").text("Fecha Envíada");
            $("#modal-col-datemodified label").text("Última Actualización");
            $("#modal-col-createdby label").text("Envíado Por");
            $("#modal-columns-save span").text("Grabar");
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
            // MODAL - MSG
            $("#modal-msg > .header > span").text("Detalles del Mensaje");
            $("#modal-msg-exit > span").text("Regresar");
            // MODAL - RECIPIENTS
            $("#modal-recipients > .header > span").text("Recipientes del Mensaje");
            $("#r-delivered").text("Envíado");
            $("#r-opened").text("Abierto");
            $("#r-clicked").text("Clickeado");
            $("#r-bounced").text("Rebotado");
            $("#r-failed").text("Fallado");
            $("#r-unsubscribed").text("Desuscrito");
            $("#r-complained").text("Quejado");
            $("#modal-recipients-exit > span").text("Regresar");
            break;
        case "en":
            $(".modal-write-message").addClass("en");
            break;
        default:
            break;
    }
}
// #endregion
// #region LAUNCH
let toparam;
function launchBroadcasts(showComposer) {
    var campaignsRequest = $.ajax({
        method: "GET",
        url: broadcastAPI,
        dataType: "json"
    });
    campaignsRequest.done(function(result, textStatus, jqXHR) {
        if(parseInt(result.code)) {
            pfData = result.data;
            setCampaignTable();
            setActions();
            translateCampaign();
            updateDisplay();            
            // #region TABLE SORTING
            $(".ui-center .ui-table").tablesorter({
                headers: {
                    0: { sorter: false }
                }
            });
            $(".ui-center .ui-table").trigger("update");
            setCheckBehavior();
            // #endregion
            isBroadcast = true;

            toparam = getParameterByName("to");
            if(toparam && showComposer) {
                $("#modal-write").modal({ allowMultiple: true, autofocus: false, closable: false });
                $('.recipient.ui.dropdown').dropdown({
                    allowAdditions: true,
                    showOnFocus: false
                });
                $("#modal-write").modal("show");
                $("#modal-write").modal("refresh");

                toparam = toparam.replace(/(^,)|(,$)/g, "");
                var toparamArray = toparam.split(",");
                $(".ui.dropdown.recipient.rto").dropdown("set selected", toparamArray);
            }
            if(!showComposer) {
                window.history.pushState('', '', '/campaigns');
            }
        }
    });
    campaignsRequest.fail(handleAPIError);
    campaignsRequest.always(function() {
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
    $("#title").text("Broadcasts");
    launchInterval = setInterval(function() {
        if(mainCustomer && mainCustomer.CustomerName) {
            getLeadListAJAX();
            launchBroadcasts(true);
            clearInterval(launchInterval);
        }
    }, 100);
});
// #endregion