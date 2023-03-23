// #region VARIABLES
let esCategoryLabels = ["Todos", "Diseñador/Desarrollador", "Fotógrafo", "Personal", "Negocio", "Apps"];
let tmplQuery;
// #endregion
// #region DICTIONARY
let s_desktoppreview = "Preview Template";
let s_templatename = "Template Name";
let s_by = "by";
let s_keywords = "Keywords";
let s_category = "Category";
let s_easy = "Easy";
let s_easyDesc = "No coding required to modify";
let s_intermediate = "Intermediate";
let s_intermediateDesc = "Some coding required to modify";
let s_advanced = "Advanced";
let s_advancedDesc = "Modifying requires web development skills";
// #endregion
// #region HELPER METHODS
function purifyString(s) {
    let r=s.toLowerCase();
    r = r.replace(new RegExp(/[àáâãäå]/g),"a");
    r = r.replace(new RegExp(/[èéêë]/g),"e");
    r = r.replace(new RegExp(/[ìíîï]/g),"i");
    r = r.replace(new RegExp(/ñ/g),"n");
    r = r.replace(new RegExp(/[òóôõö]/g),"o");
    r = r.replace(new RegExp(/[ùúûü]/g),"u");
    r = r.replace(new RegExp(/[ýÿ]/g),"y");
    return r;
}
function hoverInGalleryPicture() {
    $(this).find(".thumb-overlay").fadeIn(120);
    let img = $(this).find("a.gallery-thumb");
    img.css("outline","2px solid var(--color-primary)");
}
function hoverOutGalleryPicture() {
    $(this).find(".thumb-overlay").fadeOut(120);
    let img = $(this).find("a.gallery-thumb");
    img.css("outline","");
}
// #endregion
// #region MAIN METHODS
function translateTemplates() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            $("#title").text("Plantillas");
            // REPLACE TAGS
            let tags = "";
            esCategoryLabels.forEach(function(tag) {
                tags += `<a class='ui label'>${tag}</a>`;
            });
            $("#templates > .tags").html(tags);

            // TEXT REPLACE
            $("#templates-search > input").attr("placeholder", "Buscar categorías");
            $("#templates-load .ui.text.loader").text("Cargando Plantillas");
            $(".ui.main.page.dimmer .ui.text.loader").text("Colocando Plantilla");

            // UI BAR
            $("#cat-all span").text("Todos");
            $("#cat-designerdeveloper span").text("Diseñador/Desarrollador");
            $("#cat-photographer span").text("Fotógrafo");
            $("#cat-personal span").text("Personal");
            $("#cat-business span").text("Negocio");
            $("#cat-apps span").text("Apps");

            // VARS
            s_desktoppreview = "Ver Plantilla";
            s_templatename = "Nombre de Plantilla";
            s_by = "por";
            s_keywords = "Palabras Clave";
            s_category = "Categoría";
            s_easy = "Fácil";
            s_easyDesc = "Se puede modificar sin programación";
            s_intermediate = "Intermedio";
            s_intermediateDesc = "Se requiere poca programación para modificar";
            s_advanced = "Avanzado";
            s_advancedDesc = "Se requiere conocimiento de programación para modificar";
            break;
    }
}
function translateCategories(keywordString) {
    let keywords = keywordString.split(",");
    let translatedKeywords = keywords.map(function(keyword) {
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                switch(keyword) {
                    case "Designer/Developer":
                        return "Diseñador/Desarrollador";
                    case "Photographer":
                        return "Fotógrafo";
                    case "Personal":
                        return "Personal";
                    case "Business":
                        return "Negocio";
                    case "Apps":
                        return "Apps";
                    default:
                        return keyword;
                }
            default:
                return keyword;
        }
    });
    return translatedKeywords.join(", ");
}
function translateKeywords(keywordString) {
    let keywords = keywordString.split(",");
    let translatedKeywords = keywords.map(function(keyword) {
        switch(mainCustomer.CustomerLanguage) {
            case "es":
                switch(keyword) {
                    case "Single-page":
                        return "Única página";
                    case "Multi-page":
                        return "Multi página";
                    case "app":
                        return "app";
                    case "tech":
                        return "tecnología";
                    case "template":
                        return "plantilla";
                    case "consulting":
                        return "consultoría";
                    case "vintage":
                        return "clásico";
                    case "art":
                        return "arte";
                    case "photography":
                        return "fotografía";
                    case "education":
                        return "educación";
                    case "business":
                        return "empresa";
                    case "portfolio":
                        return "portafolio";
                    case "personal":
                        return "personal";
                    case "landing page":
                        return "página de aterrizaje";
                    case "mobile app":
                        return "app móvil";
                    case "health":
                        return "salud";
                    case "fitness":
                        return "fitness";
                    case "gym":
                        return "gimnasio";
                    case "trainer":
                        return "entrenador";
                    case "yoga club":
                        return "club de yoga";
                    case "book":
                        return "libro";
                    case "author":
                        return "autor";
                    case "writer":
                        return "escritor";
                    case "publisher":
                        return "editor";
                    case "web":
                        return "web";
                    case "design":
                        return "diseño";
                    case "development":
                        return "desarrollo";
                    case "creative":
                        return "creativo";
                    case "construction":
                        return "construcción";
                    case "architecture":
                        return "arquitectura";
                    case "agency":
                        return "agencia";
                    case "medical":
                        return "medico";
                    case "doctor":
                        return "doctor";
                    case "education":
                        return "educación";
                    case "courses":
                        return "cursos";
                    case "catering":
                        return "catering";
                    case "food":
                        return "comida";
                    case "interior design":
                        return "diseño interior";
                    case "legal":
                        return "legal";
                    case "lawyer":
                        return "abogado";
                    case "animal care":
                        return "atención a animales";
                    case "veterinary":
                        return "veterinario";
                    case "transportation":
                        return "transportación";
                    case "hotel":
                        return "hotel";
                    case "musician":
                        return "músico";
                    case "artist":
                        return "artista";
                    case "non-profit":
                        return "sin fines de lucro";
                    case "charity":
                        return "caridad";
                    case "community":
                        return "comunidad";
                    case "mobile":
                        return "móvil";
                    case "real estate":
                        return "inmuebles";
                    case "application":
                        return "aplicación";
                    case "beauty":
                        return "belleza";
                    case "spa":
                        return "spa";
                    case "parlor":
                        return "salón";
                    case "conference":
                        return "conferencía";
                    case "event":
                        return "evento";
                    default:
                        return keyword;
                }
            default:
                return keyword;
        }
    });
    return translatedKeywords.join(", ");
}
async function setTemplate() {
    $(".ui.main.page.dimmer").addClass("active");
    let tmplUUID = $(this).attr("data-uuid");
    let payload = { tmplUUID, st: $("#st").val() }
    let req = await fetch(templateAPI, {
        method: "POST",
        body: JSON.stringify(payload)
    });
    let res = await req.json();
    $(".ui.main.page.dimmer").removeClass("active");
    location.href = "/builder";
}
function showTemplates() {
    $("#templates .gallery .template-item").each(function() {
        $(this).show();
    });
}
function hideTemplates() {
    $("#templates .gallery .template-item").each(function() {
        $(this).hide();
    });
}
function filterTemplates(templateQuery) {
    if(templateQuery) {
        hideTemplates();
        $("#templates .gallery .thumb-keywords span").each(function() {
            if(purifyString($(this).text()).includes(purifyString(templateQuery))) {
                $(this).parents(".template-item").show();
            }
        });
        $("#templates .gallery .thumb-categories span").each(function() {
            if(purifyString($(this).text()).includes(purifyString(templateQuery))) {
                $(this).parents(".template-item").show();
            }
        });
    } else {
        showTemplates();
    }
}
function wireGallery() {
    if(tmplQuery) {
        filterTemplates(tmplQuery);
    }
    $("#ui-search input").keyup(function(event) {
        let templateQuery = $("#ui-search input").val();
        filterTemplates(templateQuery);
    });
    $("#templates > .tags > .ui.label").click(function() {
        showTemplates();
        let templateQuery = $(this).text();
        if(templateQuery) {
            if(templateQuery == "All") return;
            if(templateQuery == "Todos") return;
            $("#templates .gallery .thumb-categories span").each(function() {
                if(!purifyString($(this).text()).includes(purifyString(templateQuery))) {
                    $(this).parents(".template-item").hide();
                }
            });
        }
    });
    
    $("#ui-bar > .ui.button:not(.userButton)").click(function() {
        showTemplates();
        let templateQuery = $(this).find("span").text();
        if(templateQuery) {
            if(templateQuery == "All") return;
            if(templateQuery == "Todos") return;
            $("#templates .gallery .thumb-categories span").each(function() {
                if(!purifyString($(this).text()).includes(purifyString(templateQuery))) {
                    $(this).parents(".template-item").hide();
                }
            });
        }
    });
}
// #endregion
// #region LAUNCH
async function launchTemplates() {
    try {
        $("#templates .gallery").html("");
        $("#templates-load").show();

        let req = await fetch(templateAPI);
        let res = await req.json();        
               
        $("#templates-load").hide();

        $.each(res.data, function(k,tmpl) {
            var safeName = tmpl.UUID;
            let templateThumb = "";
            let templatePreview = tmpl.TemplatePreview;
            if(tmpl.LangSupport.includes(mainCustomer.CustomerLanguage)) {
                templatePreview = `https://fishpulse-templates.s3-us-west-1.amazonaws.com/i18n/${mainCustomer.CustomerLanguage}/${tmpl.TemplateLocation}/index.html`;
            }

            templateThumb += "<div class='template-item'>";
            templateThumb += "<div class='thumb-wrapper'>";

            templateThumb += `<a href='#' class='gallery-thumb' id='gallery-thumb-${safeName}' data-uuid='${tmpl.UUID}'>`;
            templateThumb += `<img src='templates/${tmpl.TemplateThumb}' data-name='${safeName}' />`;
            templateThumb += "</a>";

            templateThumb += "<div class='thumb-overlay bottom'>";
            templateThumb += `<span class='thumb-keywords' title='${s_keywords}'><span>${translateKeywords(tmpl.TemplateKeywords)}</span></span>`;
            templateThumb += `<span class='thumb-categories' title='${translateKeywords(tmpl.TemplateKeywords)}'><i class='icon tag'></i><span>${translateCategories(tmpl.TemplateCategory)}</span></span>`;
            templateThumb += `<a href='${templatePreview}' class='thumb-name' target='_blank' title='${s_desktoppreview}'><i class='icon eye'></i><span>${tmpl.TemplateName} ${s_by} ${tmpl.TemplateFamily}</span></a>`;
            templateThumb += "</div>";

            templateThumb += "</div>";
            templateThumb += "</div>";
            $("#templates .gallery").append(templateThumb);
            $("#templates #gallery-thumb-" + safeName).click(setTemplate);
            $("#templates #gallery-thumb-" + safeName).parent().hover(hoverInGalleryPicture, hoverOutGalleryPicture);
        });
        wireGallery();
    }
    catch(err) {
        toastr.error(w_server_error_h);
        console.log(err);
    }
    finally {
    }
}
$(function() {
    $("#title").text("Templates");
    tmplQuery = getParameterByName("q");
    launchInterval = setInterval(function() {
        if(mainCustomer && mainCustomer.CustomerName) {
            translateTemplates();
            launchTemplates();
            clearInterval(launchInterval);
        }
    }, 100);
});
// #endregion