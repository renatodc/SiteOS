// #region VARIABLES
let db;
let appPrimaryColor;
let chartOptions = {
    scales: {
      xAxes: [{
        type: 'time',
        time: {
            tooltipFormat: 'MMM DD, YYYY',
            unit: 'day'
        },
        ticks: {
            autoSkip: true,
            source: 'data'
        }
      }],
      yAxes: [{
        ticks: {
            beginAtZero: true,
            precision: 0
        }
      }]
    },
    maintainAspectRatio: false,
    legend: {
      display: false
    }
}
let dsOptions;
let uvchart;
let uvds;
let viewschart;
let viewsds;
let startDT;
let endDT;
let dayDiff;
// #endregion
// #region DICTIONARY
let maxRangeExceededValidation = "Maximum date range reached. Please keep date range to a minimum of 2 years.";
let minRangeExceededValidation = "Please add a valid date range. Minimum date range is 2 days.";
let uvlabel = "Users";
let viewslabel = "Page Views";
// #endregion
// #region HELPER METHODS
function convertSeconds(sec) {
    return new Date(parseInt(sec) * 1000).toISOString().substr(14, 5);
}
async function clearData() {
    let data = { startDT, endDT, st: $("#st").val() }
    let req = await fetch(analyticsAPI, {
        method: "DELETE",
        body: JSON.stringify(data)
    });
    let res = await req.json();
    baseProcess(res, function() {
        $("#range-refresh").trigger("click");
    });
}
// #endregion
// #region MAIN METHODS
function wireCharts() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            moment.locale('es-us');
            uvlabel = "Usuarios";
            viewslabel = "Vistas de Páginas";
            break;
    }
    uvds = Object.keys(db.uvdata).map(k => ({
        t: moment(k),
        y: db.uvdata[k]
    }));
    uvchart = new Chart(document.getElementById('data-uvchart').getContext('2d'), {
      type: 'line',
      data: {
        datasets: [{
            data: uvds,
            label: uvlabel,
            ...dsOptions
        }]
      },
      options: chartOptions
    });


    viewsds = Object.keys(db.viewsdata).map(k => ({
        t: moment(k),
        y: db.viewsdata[k]
    }));
    viewschart = new Chart(document.getElementById('data-viewschart').getContext('2d'), {
      type: 'line',
      data: {
        datasets: [{
            data: viewsds,
            label: viewslabel,
            ...dsOptions
        }]
      },
      options: chartOptions
    });
}
function wireDataTables() {
    // #region CLEAR DATA
    $(".grid-stats tbody").html("");
    $(".grid-stats .no-data").hide();
    $("#data-views tbody").html("");
    $("#data-sources tbody").html("");
    $("#box-views .no-data").hide();
    $("#box-sources .no-data").hide();
    // #endregion
    $("#header-uv-data").text(db.uniquevisitors);
    $("#header-views-data").text(db.views);

    // #region SET DATA TABLES
    db.pageviews.forEach(function(page) {
      let row = `<tr>`;
      row += `<td class="col-pagename col-link"><a target="_blank" href="${page.PageView}">${page.PageView}</a></td>`;
      row += `<td class="col-views">${page.Views}</td>`;
      row += `<td class="col-avgtime">${convertSeconds(page.AvgView)}</td>`;
      row += `<td class="col-maxtime">${convertSeconds(page.MaxView)}</td>`;
      row += `<td class="col-mintime">${convertSeconds(page.MinView)}</td>`;
      row += `</tr>`;
      $("#data-views tbody").append(row);
    });
    db.sources.forEach(function(source) {
      let row = `<tr>`;
      row += `<td class="col-source col-link"><a target="_blank" href="${source.PageSource}">${source.PageSource}</a></td>`;
      row += `<td class="col-users">${source.Instances}</td>`;
      row += `</tr>`;
      $("#data-sources tbody").append(row);
    });
    db.countries.forEach(function(country) {
      let row = `<tr>`;
      row += `<td class="col-country"><i class="flag ${country.UserCountry.toLowerCase()}"></i>${country.UserCountry}</td>`;
      row += `<td class="col-uv">${country.UniqueVisitors ? country.UniqueVisitors : 1}</td>`;
      row += `<td class="col-views">${country.PageViews}</td>`;
      row += `</tr>`;
      $("#data-countries tbody").append(row);
    });
    db.cities.forEach(function(city) {
        let row = `<tr>`;
        row += `<td class="col-city"><i class="flag ${city.UserCountry.toLowerCase()}"></i>${city.UserCity}</td>`;
        row += `<td class="col-uv">${city.UniqueVisitors ? city.UniqueVisitors : 1}</td>`;
        row += `<td class="col-views">${city.PageViews}</td>`;
        row += `</tr>`;
        $("#data-cities tbody").append(row);
      });
    db.languages.forEach(function(language) {
      let row = `<tr>`;
      row += `<td class="col-language">${language.UserLanguage}</td>`;
      row += `<td class="col-uv">${language.UniqueVisitors ? language.UniqueVisitors : 1}</td>`;
      row += `<td class="col-views">${language.PageViews}</td>`;
      row += `</tr>`;
      $("#data-languages tbody").append(row);
    });
    db.browsers.forEach(function(browser) {
      let row = `<tr>`;
      row += `<td class="col-browser">${browser.UserBrowser}</td>`;
      row += `<td class="col-uv">${browser.UniqueVisitors ? browser.UniqueVisitors : 1}</td>`;
      row += `<td class="col-views">${browser.PageViews}</td>`;
      row += `</tr>`;
      $("#data-browsers tbody").append(row);
    });
    db.screensizes.forEach(function(screensize) {
      let row = `<tr>`;
      row += `<td class="col-screensize">${screensize.UserScreenSize}</td>`;
      row += `<td class="col-uv">${screensize.UniqueVisitors ? screensize.UniqueVisitors : 1}</td>`;
      row += `<td class="col-views">${screensize.PageViews}</td>`;
      row += `</tr>`;
      $("#data-screensizes tbody").append(row);
    });
    db.platforms.forEach(function(platform) {
      let row = `<tr>`;
      row += `<td class="col-platform">${platform.UserPlatform}</td>`;
      row += `<td class="col-uv">${platform.UniqueVisitors ? platform.UniqueVisitors : 1}</td>`;
      row += `<td class="col-views">${platform.PageViews}</td>`;
      row += `</tr>`;
      $("#data-platforms tbody").append(row);
    });
    // #endregion
    // #region NO DATA DISPLAYS
    if(!db.pageviews.length) {
      $("#box-views .no-data").show();
    }
    if(!db.sources.length) {
      $("#box-sources .no-data").show();
    }
    if(!db.countries.length) {
      $("#box-countries .no-data").show();
    }
    if(!db.cities.length) {
      $("#box-cities .no-data").show();
    }
    if(!db.languages.length) {
      $("#box-languages .no-data").show();
    }
    if(!db.browsers.length) {
      $("#box-browsers .no-data").show();
    }
    if(!db.screensizes.length) {
      $("#box-screensizes .no-data").show();
    }
    if(!db.platforms.length) {
      $("#box-platforms .no-data").show();
    }
    // #endregion
    $(".ui-table").tablesorter();
    $(".ui-table").trigger("update");
}
function setAnalytics() {
    appPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
    dsOptions = {
        borderColor: `${appPrimaryColor}`,
        backgroundColor: `${appPrimaryColor}33`,
        lineTension: 0,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#FFF",
        pointBorderColor: `${appPrimaryColor}`,
        pointBackgroundColor: `${appPrimaryColor}`
    }
    wireCharts();
    wireDataTables();
    // #region SHOW SUBMENU
    var newListRow = "<li class='sub-link'>";
    let listIcon = "<i class='icon user'></i>";
    let listName = `<span class='nav-list-name'>Sessions</span>`;
    newListRow += `<a href='/sessions'>${listIcon}${listName}</a></li>`;
    $("#nav-analytics-list").append(newListRow);
    $("#nav-analytics-list").slideDown(200);
    // #endregion
    // #region ACTIVATE CONTROLS
    $(".ui.accordion").accordion({ "exclusive": false });
    let calendarText = {}
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            calendarText = {
                days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
                months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
                today: 'Hoy día',
                now: 'Ahora',
                am: 'AM',
                pm: 'PM'
            }
            break;
    }
    $('#range-start').calendar({
        type: 'date',
        endCalendar: $('#range-end'),
        text: calendarText
    });
    $('#range-end').calendar({
        type: 'date',
        startCalendar: $('#range-start'),
        text: calendarText
    });
    $('#range-start').calendar("set date", db.startDT);
    $('#range-end').calendar("set date", db.endDT);
    $("#range-refresh").click(async function() {
        startDT = moment($('#range-start').calendar("get date")).format("YYYY-MM-DD");
        endDT = moment($('#range-end').calendar("get date")).format("YYYY-MM-DD 23:59:59");
        dayDiff = moment(endDT).diff(moment(startDT), 'days');
        if(dayDiff > 730) {
            alert(maxRangeExceededValidation);
            return false;
        } else if(dayDiff == 0) {
            alert(minRangeExceededValidation);
            return false;
        }
        let data = { startDT, endDT, st: $("#st").val() }
        let req = await fetch(analyticsAPI, {
            method: "POST",
            body: JSON.stringify(data)
        });
        let res = await req.json();
        baseProcess(res, function() {
            db = res.data;
            wireDataTables();
            dayDiff = moment(endDT).diff(moment(startDT), 'days');
            if(dayDiff > 70) {
                uvchart.options.scales.xAxes[0].ticks.source = 'auto';
                viewschart.options.scales.xAxes[0].ticks.source = 'auto';
            } else {
                uvchart.options.scales.xAxes[0].ticks.source = 'data';
                viewschart.options.scales.xAxes[0].ticks.source = 'data';
            }
            uvds = Object.keys(db.uvdata).map(k => ({
                t: moment(k),
                y: db.uvdata[k]
            }));
            uvchart.data.labels.pop();
            uvchart.data.datasets[0].data = uvds;
            uvchart.update();
            
            viewsds = Object.keys(db.viewsdata).map(k => ({
                t: moment(k),
                y: db.viewsdata[k]
            }));
            viewschart.data.labels.pop();
            viewschart.data.datasets[0].data = viewsds;
            viewschart.update();
        });
    });
    
    $("#range-clear").click(function() {
        $("#modal-clear-data-confirm").modal("show");
    });
    $("#modal-clear-data-confirm-yes").click(clearData);
    // #endregion
}

function translateAnalytics() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            $("#title").text("Analítica");
            $("#range-refresh span").text("Refrescar");
            $("#range-clear span").text("Limpiar");
            $("#range-start .ui.input input").attr("placeholder", "Fecha de Comienzo");
            $("#range-end .ui.input input").attr("placeholder", "Fecha Final");
            maxRangeExceededValidation = "Sobrepasaste el intervalo máximo de fechas. Por favor, manten el intervalo de fechas a un máximo de 2 años.";
            minRangeExceededValidation = "Por favor ingrese un intervalo de fechas validas. Intervalo minimo es de 2 días.";            

            $("#header-uv-label").text("Usuarios");
            $("#header-views-label").text("Vistas de Páginas");
            $("#data-views thead th.col-pagename span").text("Nombre de Página");
            $("#data-views thead th.col-views span").text("Vistas");
            $("#data-views thead th.col-avgtime span").text("Prom");
            $("#data-views thead th.col-maxtime span").text("Max");
            $("#data-views thead th.col-mintime span").text("Min");
            $("#data-views thead th.col-avgtime").attr("data-tooltip","Duración de Vista en Promedio (mm:ss)");
            $("#data-views thead th.col-maxtime").attr("data-tooltip","Duración de Vista Máxima (mm:ss)");
            $("#data-views thead th.col-mintime").attr("data-tooltip","Duración de Vista Mínima (mm:ss)");
            $("#data-views thead th.col-avgtime").attr("title","Duración de Vista en Promedio (mm:ss)");
            $("#data-views thead th.col-maxtime").attr("title","Duración de Vista Máxima (mm:ss)");
            $("#data-views thead th.col-mintime").attr("title","Duración de Vista Mínima (mm:ss)");
            
            $(".no-data p").text("No hay datos disponibles");

            $("#header-sources-label").text("Fuentes de Tráfico");
            $("#data-sources thead th.col-source span").text("Fuente de Tráfico");
            $("#data-sources thead th.col-users span").text("Usuarios");

            $("#header-statistics-label").text("Estadísticas de Visitantes");
            
            $("#box-countries > h1 > span").text("Países");
            $("#data-countries thead th.col-country span").text("País");
            $("#data-countries thead th.col-views span").text("Vistas");
            $("#data-countries thead th.col-uv span").text("Usuarios");

            $("#box-cities > h1 > span").text("Ciudades");
            $("#data-cities thead th.col-city span").text("Ciudad");
            $("#data-cities thead th.col-views span").text("Vistas");
            $("#data-cities thead th.col-uv span").text("Usuarios");

            $("#box-languages > h1 > span").text("Lenguajes");
            $("#data-languages thead th.col-language span").text("Lenguaje");
            $("#data-languages thead th.col-views span").text("Vistas");
            $("#data-languages thead th.col-uv span").text("Usuarios");
            
            $("#box-browsers > h1 > span").text("Navegadores");
            $("#data-browsers thead th.col-browser span").text("Navegador");
            $("#data-browsers thead th.col-views span").text("Vistas");
            $("#data-browsers thead th.col-uv span").text("Usuarios");

            $("#box-screensizes > h1 > span").text("Resoluciones de Pantalla");
            $("#data-screensizes thead th.col-screensize span").text("Resolución de Pantalla");
            $("#data-screensizes thead th.col-views span").text("Vistas");
            $("#data-screensizes thead th.col-uv span").text("Usuarios");

            $("#box-platforms > h1 > span").text("Plataformas");
            $("#data-platforms thead th.col-platform span").text("Plataforma");
            $("#data-platforms thead th.col-views span").text("Vistas");
            $("#data-platforms thead th.col-uv span").text("Usuarios");

            // MODAL - CLEAR DATA
            $("#modal-clear-data-confirm > .header span").text("Limpiar Datos");
            $("#modal-clear-data-confirm > .content p").text("¿Estas seguro que deseas limpiar los datos analíticos para el rango de tiempo establecido?");
            $("#modal-clear-data-confirm-no span").text("No");
            $("#modal-clear-data-confirm-yes span").text("Si");

            break;
    }
}
// #endregion
// #region LAUNCH
async function launchAnalytics() {
    try {
        let req = await fetch(analyticsAPI, {
            method: "POST",
            body: JSON.stringify({ st: $("#st").val() })
        });
        let res = await req.json();
        baseProcess(res, function() {
            db = res.data;
            setAnalytics();
            translateAnalytics();
        });
    }
    catch(err) {
        toastr.error(w_server_error_h);
        console.log(err);
    }
}
$(function() {
    $("#title").text("Analytics");
    launchInterval = setInterval(function() {
        if(mainCustomer && mainCustomer.CustomerName) {
            launchAnalytics();
            clearInterval(launchInterval);
        }
    }, 100);
});
// #endregion