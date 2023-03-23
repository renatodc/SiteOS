// #region VARIABLES
var totalRules;
// #endregion
// #region HELPER METHODS
function deleteFilterAJAX() {
    $(".page.dimmer").addClass("active");
    var deleteFilterRequest = $.ajax({
        method: "DELETE",
        url: filterAPI + "/" + uuid,
        dataType: "json"
    });
    deleteFilterRequest.done(function(result) {
        location.reload();
    });
    deleteFilterRequest.fail(handleAPIError);
    deleteFilterRequest.always(function() {
        $(".page.dimmer").removeClass("active");
    });
}
function addFilterAJAX() {
    var filterStatement = $("#filter-statement").val();
    if(filterStatement.replace(/[^@]/g, "").length > 1 
    || (filterStatement.indexOf(".") == -1)
    ) {
        $(".filterform").addClass("error");
        $(".filterform").removeClass("warning");
        return false;
    } else {
        $(".filterform").removeClass("error");
        $(".filterform").removeClass("warning");
    }
    if(filterStatement.trim() == "") {
        $(".filterform").addClass("warning");
        $(".filterform").removeClass("error");
        return false;
    } else {
        $(".filterform").removeClass("warning");
        $(".filterform").removeClass("error");
    }
    var filterType = $("#filter-scope input[type='radio']:checked").val();

    $(".page.dimmer").addClass("active");
    var addFilterRequest = $.ajax({
        method: "POST",
        url: filterAPI,
        data: {
            FilterType: filterType,
            FilterStatement: filterStatement
        },
        dataType: "json"
    });
    addFilterRequest.done(function(result) {
        location.reload();
    });
    addFilterRequest.fail(handleAPIError);
    addFilterRequest.always(function() {
        $(".page.dimmer").removeClass("active");
    });
}
// #endregion
// #region MAIN METHODS
function paintFilterTable() {
    $(".ui-table tbody").html("");
    $.each(pfData, function(k,v) {
        var userRow = "<tr id='pfFilterRow" + v.UUID + "' data-uuid='" + v.UUID + "'>";
        // userRow += "<td class='col-check' style='width: 37.6px;'>" + "<div class='ui fitted checkbox'><input type='checkbox' class='hidden'/></div>" + "</td>";
        userRow += "<td class=''>" + (v.FilterStatement ? escapeHtml(v.FilterStatement) : '') + "</td>";
        userRow += "<td class='filter-td-scope'>" + (v.FilterScope ? escapeHtml(v.FilterScope) : '') + "</td>";
        userRow += "<td class='filter-td-type'>" + (v.FilterType ? escapeHtml(v.FilterType) : '') + "</td>";
        userRow += "<td class='col-icon delete-col'><a href='#'><i class='icon trash'></i></a></td>";
        userRow += "</tr>";
        $(".ui-table tbody").append(userRow);
        $("#pfFilterRow" + v.UUID + " .delete-col a").click(function(e) {
            uuid = $(this).parents("tr").attr("data-uuid");
            deleteFilterAJAX();
            // $(".ui-table").trigger("update");
        });
    });
    $(".ui-table").tablesorter({
        headers: {
            ".col-icon": { sorter: false }
        }
    });
}
function wireUI() {
    $("#title").text("Spam Filter");    
    $("#ui-search input").keyup(function(e) {
        query = $("#ui-search input").val().toLowerCase();
        queryPass();
    });
    
    $("#filter-statement").val("");
    $("#filter-scope .ui.radio.checkbox").checkbox();
    $("#filter-scope-personal .ui.radio.checkbox").checkbox("set checked");

    $("#filter-add").click(function() {
        $("#modal-add-filter").modal("show");
        $("#modal-add-filter").off("keyup");
        $("#modal-add-filter").keyup(function(event) {
            if(event.which == 13) {
                $("#add-filter-save").trigger("click");
            }
        });
    });
    $("#add-filter-save").click(function() {
        addFilterAJAX();
    });
    paintRuleCount();
    paintFilterTable();
    translateFilter();
}
function paintRuleCount() {
    switch(pfData.length) {
        case 0:
            $(".ui-table").hide();
            $(".no-data").show();
            break;
        case 1:
            $(".ui-table").show();
            $(".no-data").hide();
            $("#ui-counter-total").html("1<span> Total</span>");
            break;
        default:
            $(".ui-table").show();
            $(".no-data").hide();
            $("#ui-counter-total").html(pfData.length + "<span> Total</span>");
            break;
    }
}
function queryPass() {
    var rulesFiltered = 0;
    $(".ui-table tbody tr").each(function(i) {
        if(query) {
            if($(this).text().toLowerCase().indexOf(query) > -1) {
                $(this).css("display","table-row");
                rulesFiltered++;
            } else {
                $(this).hide();
            }
        } else {
            $(this).css("display","table-row");
            rulesFiltered++;
        }
    });
    if(rulesFiltered) {
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                $("#ui-counter-total").html((rulesFiltered == 1) ? "1<span> Resultado</span>" : rulesFiltered + "<span> Resultados</span>");
                break;
            default:
                $("#ui-counter-total").html((rulesFiltered == 1) ? "1<span> Result</span>" : rulesFiltered + "<span> Results</span>");
                break;
        }
        $(".ui-table").show();
        $(".no-data").hide();
    } else {
        $(".ui-table").hide();
        $(".no-data").show();
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                $("#ui-counter-total").html("No hay Resultados");
                break;
            default:
                $("#ui-counter-total").html("No Results");
                break;
        }
    }
}
function translateFilter() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            // UI - BAR
            $("#title").text("Filtros");
            $("#ui-search input").attr("placeholder","Buscar...");
            $("#filter-add span").text("Agregar Filtro");
            // ACCOUNT UI
            $("#filter-th-filter").text("Filtro");
            $("#filter-th-type").text("Tipo");
            $("#filter-th-scope").text("Alcance");
            $(".no-data p").text("No hay correos bloqueados"); 
            // MODAL - ADD FILTER                   
            $("#modal-add-filter > .header span").text("Agregar Filtro");
            $("#filter-statement-field > label").text("Filtro");
            $("#filter-statement").attr("placeholder","Escribe correo o dominio para bloquear");
            $("#filter-scope-field > label").text("Alcance");
            $("#filter-scope-personal label").text("Filtro Personal");
            $("#filter-scope-company label").text("Filtro para la Empresa");
            $("#modal-add-filter > .content .ui.error.message h1").text("Filtro Invalido");
            $("#modal-add-filter > .content .ui.error.message p").text("Por favor, escriba un filtro valido");
            $("#modal-add-filter > .content .ui.warning.message h1").text("Filtro Vacío");
            $("#modal-add-filter > .content .ui.warning.message p").text("El campo de filtro esta vacío");
            $("#modal-add-filter > .content .ui.info.message .header").text("Guía de Filtro");
            $("#modal-add-filter > .content .ui.info.message p").html("Para filtrar una dirección de correo electrónico específica, escriba una dirección de correo electrónico completa, por ejemplo: <b> usuario@dominio.com </b><br />También puede filtrar un dominio completo, excluyendo el signo @. Por ejemplo, al agregar <b> dominio.com </b> se filtrarán todos los correos electrónicos entrantes de cualquier persona con una dirección de correo electrónico de <b> dominio.com </b>.<br />También puede usar comodines. Por ejemplo, al agregar <b> * domain.com </b>, se filtrarán todos los correos electrónicos entrantes de cualquier persona con una dirección de correo electrónico que termine en <b> domain.com </b>");
            $("#filter-exit span").text("Salir");
            $("#add-filter-save span").text("Agregar Filtro");
            $(".ui-center tbody tr").each(function() {
                let filterScope = $(this).find("td.filter-td-scope");
                switch(filterScope.text()) {
                    case "Email":
                        filterScope.text("Correo");
                        break;
                    case "Domain":
                        filterScope.text("Dominio");
                        break;
                }
                let filterType = $(this).find("td.filter-td-type");
                switch(filterType.text()) {
                    case "Personal":
                        filterType.text("Personal");
                        break;
                    case "Company":
                        filterType.text("Empresa");
                        break;
                }
            });
            break;
        default:
            break;
    }
}
// #endregion
// #region LAUNCH
function launchFilter() {
    var firewallRequest = $.ajax({
        method: "GET",
        url: filterAPI,
        dataType: "json"
    });
    firewallRequest.done(function(result, textStatus, jqXHR) {
        if(result.success == 1) {
            pfData = result.data;
            wireUI();
        } else {
            alert(result.errorMsg);
        }
    });
    firewallRequest.fail(handleAPIError);
    firewallRequest.always(function() {
    });

}
$(function() {
    launchInterval = setInterval(function() {
        if(mainCustomer && mainCustomer.CustomerName) {
            launchFilter();
            clearInterval(launchInterval);
        }
    }, 100);
});
// #endregion