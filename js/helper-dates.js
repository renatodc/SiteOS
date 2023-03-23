// #region DATE VALIDATION
function isValidDate(sqlDate) {
    if(!sqlDate || sqlDate == "0000-00-00 00:00:00") {
        return false;
    } else {
        return true;
    }
}
// #endregion
// #region DATE FORMATTING
function getJSDate(sqlDate) {
    var t = sqlDate.split(/[- :]/);
    var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
    return d;
}
function getUTCStamp() {
    var sugarDT = Sugar.Date.create(new Date(), { setUTC: true });
    return Sugar.Date.format(sugarDT, '{year}-{MM}-{dd} {HH}:{mm}:{ss}');
}
function getshortd(sqlDate) {
    return Sugar.Date.format(getJSDate(sqlDate), '{MM}/{dd}/{yy}');
}
function getshortdt(sqlDate) {
    let jsDate = getJSDate(sqlDate);
    let date;
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            date = Sugar.Date.format(jsDate, '{dd}/{MM}/{yy} {h}:{mm} {TT}');
            break;
        case "en":
        default:
            date = Sugar.Date.format(jsDate, '{MM}/{dd}/{yy} {h}:{mm} {TT}');
            break;
    }
    return date;
}
function getsmalldt(sqlDate) {
    return Sugar.Date.format(getJSDate(sqlDate), '{Dow}, {Mon} {d} {h}:{mm}{TT}');
}
function getabbrdt(sqlDate) {
    return Sugar.Date.format(getJSDate(sqlDate), '{Mon}. {d}, {year} {h}:{mm} {TT}');
}
function getlongdt(sqlDate) {
    return Sugar.Date.long(getJSDate(sqlDate));
}
function getfullddt(sqlDate) {
    let jsDate = getJSDate(sqlDate);
    let date;
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            Sugar.Date.setLocale("es");
            date = Sugar.Date.full(jsDate);
            // #region Manual Replacement
            // switch(jsDate.getDay()) {
            //     case 0:
            //         date = date.replace("Sunday", "Domingo");
            //         break;
            //     case 1:
            //         date = date.replace("Monday", "Lunes");
            //         break;
            //     case 2:
            //         date = date.replace("Tuesday", "Martes");
            //         break;
            //     case 3:
            //         date = date.replace("Wednesday", "Miercoles");
            //         break;
            //     case 4:
            //         date = date.replace("Thursday", "Jueves");
            //         break;
            //     case 5:
            //         date = date.replace("Friday", "Viernes");
            //         break;
            //     case 6:
            //         date = date.replace("Saturday", "Sabado");
            //         break;
            // }
            // switch(jsDate.getMonth()) {
            //     case 0:
            //         date = date.replace("January", "Enero");
            //         break;
            //     case 1:
            //         date = date.replace("February", "Febrero");
            //         break;
            //     case 2:
            //         date = date.replace("March", "Marzo");
            //         break;
            //     case 3:
            //         date = date.replace("April", "Abril");
            //         break;
            //     case 4:
            //         date = date.replace("May", "Mayo");
            //         break;
            //     case 5:
            //         date = date.replace("June", "Junio");
            //         break;
            //     case 6:
            //         date = date.replace("July", "Julio");
            //         break;
            //     case 7:
            //         date = date.replace("August", "Agosto");
            //         break;
            //     case 8:
            //         date = date.replace("September", "Setiembre");
            //         break;
            //     case 9:
            //         date = date.replace("October", "Octubre");
            //         break;
            //     case 10:
            //         date = date.replace("November", "Noviembre");
            //         break;
            //     case 11:
            //         date = date.replace("December", "Diciembre");
            //         break;
            // }
            // #endregion
            break;
        case "en":
        default:
            date = Sugar.Date.full(jsDate);
            break;
    }
    return date;
}
function getrelativet(sqlDate) {
    return Sugar.Date.relative(new Date(getJSDate(sqlDate)));
}
function getFullDate(sqlDate) {
    return Sugar.Date.full(new Date(getJSDate(sqlDate)));
}
// #endregion
// #region DATE ACCESS
function getCustomerFormatDate(sqlDate) {
    return getshortdt(sqlDate);
}
// #endregion