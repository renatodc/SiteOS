// #region VARIABLES
var unsplashID = "2bb5bb574f04ac778b8295392b2e132706ff3e78b9c836e42f039c62419f3c37";
var unsplashPage = 1;
var unsplashSearchTotalPages;
var unsplashSearchMode = false;
var unsplashSearchQuery;
var isStockPicturesLoaded = false;
let galleryTarget;
const GalleryTarget = {
    "Message": 1,
    "Logo": 2,
    "Avatar": 3,
    "PageEditor": 4,
    "Favicon": 5,
    "PageEditorVideoToImg": 6,
    "PageEditorSectionBg": 7,
    "PageEditorImg": 8,
    "PageEditorImgOnText": 9,
    "PageEditorIconToImg": 10
}
// #endregion
// #region HELPER METHODS
function setGalleryTab() {
    var galleryHasPictures = ($("#gallery-gallery .gallery > div").length > 1);
    if(galleryHasPictures) {
        $("#gallery-tab-gallery").trigger("click");
    } else {
        $("#gallery-tab-stockphotos").trigger("click");
    }
}
function hoverInGalleryPicture() {
    $(this).find(".thumb-overlay").fadeIn(120);
    var img = $(this).find("a.gallery-thumb");
    img.css("outline","2px solid var(--color-primary)");

    var w = img.find("img").get(0).naturalWidth;
    var h = img.find("img").get(0).naturalHeight;
    $(this).find(".thumb-dimensions").html("<i class='icon image'></i>" + w + " x " + h);
}
function hoverOutGalleryPicture() {
    $(this).find(".thumb-overlay").fadeOut(120);
    var img = $(this).find("a.gallery-thumb");
    img.css("outline","");
}
function shouldLoadStockPictures() {
    var stockPicturesNotLoaded = ($("#gallery-stockphotos .gallery > div").length == 0);
    if(stockPicturesNotLoaded) {
        loadStockPictures();
    }
}
// #endregion
// #region MAIN METHODS
function loadStockPictures() {
    isStockPicturesLoaded = false;
    if(unsplashPage == 1) {
        $("#gallery-stockphotos .gallery").html("");
        $("#gallery-stockphotos-load").show();
    }
    var loadStockRequest = $.ajax({
        method: "GET",
        url: "https://api.unsplash.com/photos/?client_id=" + unsplashID + "&order_by=popular&per_page=28&page=" + unsplashPage,
        dataType: "json"
    });
    loadStockRequest.done(function(response) {
        $("#gallery-stockphotos-load").hide();
        $.each(response, function(k,file) {
            var unsplashUTM = "utm_source=SiteOS&utm_medium=referral&utm_campaign=api-credit";
            file.urls.small = file.urls.small + "&" + unsplashUTM;
            file.urls.regular = file.urls.regular + "&" + unsplashUTM;
            file.urls.full = file.urls.full + "&" + unsplashUTM;
            file.user.links.html = file.user.links.html + "?" + unsplashUTM;

            var safeName = file.id.replace(/\./g, "");
            var newImg = "<div>";
            newImg += "<div class='thumb-wrapper'>";
            newImg += "<a href='#' class='gallery-thumb' id='gallery-thumb-" + safeName + "'>";
            newImg += "<img src='" + file.urls.small + "'";
            newImg += " data-src='" + file.urls.regular + "' data-name='" + safeName + "' data-date='" + file.created_at + "' />";
            newImg += "</a>";

            newImg += "<div class='thumb-overlay top'>";
            newImg += `<a href='${file.urls.full}' target='_blank' class='thumb-source' title='${w_gallery_view_source}'><i class='icon world'></i></a>`;
            newImg += `<a href='${file.user.links.html}' target='_blank' class='thumb-name' title='${w_gallery_img_name}' style='font-size: 11px; line-height: 18px;'>${w_gallery_img_by} ${file.user.name}</a>`;
            newImg += "</div>";

            newImg += "<div class='thumb-overlay bottom'>";
            newImg += `<span class='thumb-studio' title='${w_gallery_img_studio}'>Unsplash</span>`;
            newImg += `<span class='thumb-d' title='${w_gallery_img_dimensions}'><i class='icon image'></i>${file.width} x ${file.height}</span>`;
            newImg += "</div>";

            newImg += "</div>";
            newImg += "</div>";
            $("#gallery-stockphotos .gallery").append(newImg);

            $("#gallery-stockphotos #gallery-thumb-" + safeName).click(setGalleryPicture);
            $("#gallery-stockphotos #gallery-thumb-" + safeName).parent().hover(hoverInGalleryPicture, hoverOutGalleryPicture);
        });
        $("#modal-gallery").modal("refresh");
        isStockPicturesLoaded = true;
    });
    loadStockRequest.fail(function(response) {
        console.log(response);
    });
    loadStockRequest.always(function() {
    });
}
function searchStockPictures(query) {
    isStockPicturesLoaded = false;
    if(unsplashPage == 1) {
        $("#gallery-stockphotos .gallery").html("");
        $("#gallery-stockphotos-load").show();
    }
    var searchStockRequest = $.ajax({
        method: "GET",
        url: "https://api.unsplash.com/search/photos/?client_id=" + unsplashID + "&query=" + query + "&per_page=28&page=" + unsplashPage,
        dataType: "json"
    });
    searchStockRequest.done(function(response) {
        if(unsplashPage == 1) {
            unsplashSearchTotalPages = response.total_pages;
        }
        $("#gallery-stockphotos-load").hide();
        if(unsplashSearchTotalPages > 0) {
            $.each(response.results, function(k,file) {
                var safeName = file.id.replace(/\./g, "");
                var newImg = "<div>";
                newImg += "<div class='thumb-wrapper'>";
                newImg += "<a href='#' class='gallery-thumb' id='gallery-thumb-" + safeName + "'>";
                newImg += "<img src='" + file.urls.small + "'";
                newImg += " data-src='" + file.urls.regular + "' data-name='" + safeName + "' data-date='" + file.created_at + "' />";
                newImg += "</a>";

                newImg += "<div class='thumb-overlay top'>";
                newImg += `<a href='${file.urls.full}' target='_blank' class='thumb-source' title='${w_gallery_view_source}'><i class='icon world'></i></a>`;
                newImg += `<a href='${file.user.links.html}' target='_blank' class='thumb-name' title='${w_gallery_img_name}' style='font-size: 11px; line-height: 18px;'>${w_gallery_img_by} ${file.user.name}</a>`;
                newImg += "</div>";

                newImg += "<div class='thumb-overlay bottom'>";
                newImg += `<span class='thumb-studio' title='${w_gallery_img_studio}'>Unsplash</span>`;
                newImg += `<span class='thumb-d' title='${w_gallery_img_dimensions}'><i class='icon image'></i>"${file.width} x ${file.height}</span>`;
                newImg += "</div>";

                newImg += "</div>";
                newImg += "</div>";
                $("#gallery-stockphotos .gallery").append(newImg);

                $("#gallery-stockphotos #gallery-thumb-" + safeName).click(setGalleryPicture);
                $("#gallery-stockphotos #gallery-thumb-" + safeName).parent().hover(hoverInGalleryPicture, hoverOutGalleryPicture);
            });
            $("#modal-gallery").modal("refresh");
            isStockPicturesLoaded = true;
        } else {
            $("#gallery-stockphotos .gallery").html(`<span>${w_gallery_no_results}</span>`);
        }
    });
    searchStockRequest.fail(function(response) {
        console.log(response);
    });
    searchStockRequest.always(function() {
    });
}
function setGalleryPicture() {
    $("#modal-gallery").modal("hide");
    if($("#modal-adduser").length) {
        $("#modal-adduser").modal("show");
    }
    var src = $(this).find("img").attr("data-src");
    if(src.startsWith("/")) {
        src = src.substring(1);
    }
    var dataName = src.substr(src.lastIndexOf("/")+1);
    switch(galleryTarget) {
        case GalleryTarget.Avatar:
            $(".imagecol > img").attr("src", src);
            $(".imagecol > img").attr("data-src", src);
            break;
        case GalleryTarget.Message:
            if(elementSelection != null && elementRange != null) {
                elementSelection.removeAllRanges();
                elementSelection.addRange(elementRange);
                if($(elementRange.commonAncestorContainer).is($(".ui-message")) ||
                    $(elementRange.commonAncestorContainer).parents(".ui-message").length) {
                    switch(elementSelection.type) {
                        case "Range":
                            var newImg = "<img data-name='" + dataName + "' class='inline' src='" + src + "' />";
                            document.execCommand("insertHTML",false, newImg);
                            break;
                        case "Caret":
                            var newImg = document.createElement("img");
                            newImg.className = "inline";
                            newImg.setAttribute("src", src);
                            newImg.setAttribute("data-name", dataName);
                            let frag = document.createDocumentFragment();
                            frag.appendChild(newImg);
                            elementRange.insertNode(frag);
                            break;
                    }
                }
            }
            break;
        case GalleryTarget.Logo:
            $("#logo > img").attr("src", src);
            dbLogo = src;
            $("#user-logo-reset").show();
            break;
        case GalleryTarget.PageEditor:
            src = $(this).find("img").attr("data-src");
            if(elementTarget.find("img").length) {
                elementTarget.find("img").attr("src",src);
            } 
            else if(elementTarget.prop("tagName") == "IMG") {
                elementTarget.attr("src",src);
            } 
            else {
                elementTarget.replaceWith("<img src='" + src + "' />");
            }
            break;
        case GalleryTarget.PageEditorVideoToImg:
            videoTarget.off("mouseenter mouseleave click");
            var nodeID = parseInt(Math.random()*1000);
            videoTarget.replaceWith(`<img src="${src}" data-node-id="${nodeID}" />`);
            videoTarget = $("#page-editor").contents().find(`[data-node-id='${nodeID}']`);
            videoTarget.removeAttr("data-node-id");
            imgTarget = videoTarget;
            img2Target = videoTarget;
            imgTarget.mouseenter(imgMouseEnter);
            imgTarget.mouseleave(imgMouseLeave);
            imgTarget.click(imgMouseClick);
            imgMouseEnter.call(imgTarget.get(0));
            break;
        case GalleryTarget.PageEditorIconToImg:
            iconTarget.off("mouseenter mouseleave click");
            var nodeID = parseInt(Math.random()*1000);
            iconTarget.replaceWith(`<img src="${src}" data-node-id="${nodeID}" />`);
            iconTarget = $("#page-editor").contents().find(`[data-node-id='${nodeID}']`);
            iconTarget.removeAttr("data-node-id");
            imgTarget = iconTarget;
            img2Target = iconTarget;
            imgTarget.mouseenter(imgMouseEnter);
            imgTarget.mouseleave(imgMouseLeave);
            imgTarget.click(imgMouseClick);
            imgMouseEnter.call(imgTarget.get(0));
            break;
        case GalleryTarget.PageEditorSectionBg:
            src = $(this).find("img").attr("data-src");
            sectionTarget.css("backgroundImage", `url(${src})`);
            $("#tm-section-bg-img img").attr("src",src);
            $("#tm-section-bg-img").show();
            $("#tm-section-bg-img-remove").show();
            $("#tm-section-bg-img-fullwidth").show();
            $("#tm-section-bg-img-effect").show();
            break;
        case GalleryTarget.Favicon:            
            let fileExtension = src.substr(src.lastIndexOf(".")+1);
            if(fileExtension == "png" || fileExtension == "ico") {                
                $("#web-settings-icon img").css("display", "block");
                $("#web-settings-icon img").attr("src", src);
                favicon = src;
                if($("#modal-web-settings").length) {
                    $("#modal-web-settings").modal("show");
                }
            } else {
                alert("Favicon can only be in PNG or ICO format");
                $("#modal-gallery").modal("show");
            }
            break;
        case GalleryTarget.PageEditorImg:
            src = $(this).find("img").attr("data-src");
            if(img2Target.find("img").length) {
                img2Target.find("img").attr("src",src);
            } 
            else if(img2Target.prop("tagName") == "IMG") {
                img2Target.attr("src",src);
            } 
            else {
                img2Target.replaceWith("<img src='" + src + "' />");
            }
            $("#tm-img-preview img").attr("src",src);
            break;
        case GalleryTarget.PageEditorImgOnText:
            src = $(this).find("img").attr("data-src");
            if(elementSelection) {
                elementSelection.removeAllRanges();
            }
            if(elementRange) {
                elementSelection.addRange(elementRange);
            }
            var nodeID = parseInt(Math.random()*1000);
            document.getElementById("page-editor").contentDocument.execCommand("insertHTML",false,`<img src='${src}' data-node-id='${nodeID}' />`);
            elementTarget = $("#page-editor").contents().find(`[data-node-id='${nodeID}']`);
            elementTarget.removeAttr("data-node-id");
            imgTarget = elementTarget;
            img2Target = elementTarget;
            imgTarget.mouseenter(imgMouseEnter);
            imgTarget.mouseleave(imgMouseLeave);
            imgTarget.click(imgMouseClick);
            imgMouseEnter.call(imgTarget.get(0));
            break;
    }
}
function deleteGalleryPicture() {
    let name = $(this).attr("data-name");
    let element = $(this).parents(".thumb-wrapper").parent();
    var deletePictureRequest = $.ajax({
        method: "DELETE",
        url: imgAPI + "/" + name,
        dataType: "json"
    });
    deletePictureRequest.done(function(res) {
        if(parseInt(res.code)) {
            element.remove();
            if($("#modal-gallery").length) {
                $("#modal-gallery").modal("refresh");
            }
            if($("#modal-adduser").length) {
                $("#modal-adduser").modal("refresh");
            }
        } else {
            toastr.error(w_img_api_delete_error);
            console.log(res.msg);
        }
    });
    deletePictureRequest.fail(function(res) {
        toastr.error(w_img_api_delete_error);
        console.log(res.msg);
    });
    deletePictureRequest.always(function() {
    });
}
// #endregion
// #region LAUNCH
function wireGallery() {
    // GALLERY - TABS
    $("#modal-gallery .ui.menu .item[data-tab='stockphotos']").tab({
        onVisible: function() {
            $("#modal-gallery").modal("refresh");
            $("#modal-gallery").off("keyup");
            $("#modal-gallery").keyup(function(event) {
                if(event.which == 13) {
                    $("#gallery-stockphotos-search .ui.button").trigger("click");
                }
            });
        }
    });
    $("#modal-gallery .ui.menu .item[data-tab='gallery']").tab({
        onVisible: function() {
            $("#modal-gallery").modal("refresh");
            $("#modal-gallery").off("keyup");

        }
    });
    $("#modal-gallery .ui.menu .item[data-tab='gallery']").trigger("click");
    // GALLERY - STOCK PHOTOS
    $("#gallery-stockphotos .gallery").scroll(function() {
        var scTop = $(this).scrollTop();
        var scHeight = $(this).get(0).scrollHeight;
        if(scHeight - scTop < 480 && isStockPicturesLoaded) {
            unsplashPage++;
            isStockPicturesLoaded = false;
            if(unsplashSearchMode) {
                if(unsplashPage <= unsplashSearchTotalPages) {
                    searchStockPictures(unsplashSearchQuery);
                }
            } else {
                loadStockPictures();
            }
        }
    });
    $("#gallery-stockphotos-search .ui.button").click(function() {
        unsplashPage = 1;
        unsplashSearchQuery = $("#gallery-stockphotos-search input").val();
        if(unsplashSearchQuery != "") {
            unsplashSearchMode = true;
            searchStockPictures(unsplashSearchQuery);
        } else {
            unsplashSearchMode = false;
            loadStockPictures();
        }
    });
    // GALLERY - MY IMAGES: UPLOAD/SAVE
    $("#gallery-upload").fileupload({
        url: imgAPI,
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|webp|bmp|ico)$/i,
        maxFileSize: 50000000, // 50 MB
        dropZone: $(".gallery"),
        start: function() {
            $("#gallery-upload span").hide();
            $("#gallery-upload .label").html("Uploading Image");
            $("#gallery-upload .ui.progress").show();
        },
        done: function (e, response) {
            let result = response.result;
            if(parseInt(result.code) == 1) { 
                var file = result.data;
                var safeName = file.name.replace(/\./g, "");
                var newImg = "<div>";
                newImg += "<div class='thumb-wrapper'>";
                newImg += "<a href='#' class='gallery-thumb' id='gallery-thumb-" + safeName + "'>";
                newImg += "<img src='" + file.url + "'";
                newImg += " data-src='" + file.url + "' data-size='" + file.size + "' data-name='" + file.name + "' data-date='" + file.date + "' />";
                newImg += "</a>";

                newImg += "<div class='thumb-overlay top'>";
                newImg += `<a href='#' class='thumb-delete' title='${w_gallery_img_delete}' data-name='${file.name}'><i class='icon trash'></i></a>`;
                newImg += `<a href='${file.url}' target='_blank' class='thumb-source' title='${w_gallery_view_source}'><i class='icon world'></i></a>`;
                newImg += `<span class='thumb-name' title='${w_gallery_img_name}'>${file.name}</span>`;
                newImg += "</div>";

                newImg += "<div class='thumb-overlay bottom'>";
                newImg += `<span class='thumb-size' title='${w_gallery_img_size}'>${file.size}</span>`;
                newImg += `<span class='thumb-dimensions' title='${w_gallery_img_dimensions}'><i class='icon image'></i>150 x 648</span>`;
                newImg += "</div>";

                newImg += "</div>";
                newImg += "</div>";
                $("#gallery-gallery .gallery > div:first-child").after(newImg);

                $("#gallery-gallery #gallery-thumb-" + safeName).parent().find(".thumb-delete").click(deleteGalleryPicture);
                $("#gallery-gallery #gallery-thumb-" + safeName).click(setGalleryPicture);
                $("#gallery-gallery #gallery-thumb-" + safeName).parent().hover(hoverInGalleryPicture, hoverOutGalleryPicture);
                $("#modal-gallery").modal("refresh");
                if($("#modal-adduser").length) {
                    $("#modal-adduser").modal("refresh");
                }

                $("#gallery-upload .label").html("Upload Complete!");
                setTimeout(function() {
                    $("#gallery-upload .ui.progress").fadeOut(400, function() {
                        $("#gallery-upload span").fadeIn();
                    });
                }, 700);
            } else {
                handleImgAPIError(result.code, result.msg);
            }
        },
        process: function(e, data) {
            $("#gallery-upload .ui.progress").progress("set total", data.total);
        },
        progressall: function (e, data) {
            $("#gallery-upload .ui.progress").progress("set progress", data.loaded);
        },
        fail: function(e,data) {
            toastr.error(w_img_api_upload_failed);
            console.log(data.errorThrown);
        }
    });
    // GALLERY - MY IMAGES: LOAD
    var loadGalleryRequest = $.ajax({
        method: "GET",
        url: imgAPI,
        dataType: "json"
    });
    loadGalleryRequest.done(function(response) {
        $.each(response.data, function(k,file) {
            var safeName = file.name.replace(/\./g, "");
            var newImg = "<div>";
            newImg += "<div class='thumb-wrapper'>";
            newImg += "<a href='#' class='gallery-thumb' id='gallery-thumb-" + safeName + "'>";
            newImg += "<img src='" + file.url + "'";
            newImg += " data-src='" + file.url + "' data-size='" + file.size + "' data-name='" + file.name + "' data-date='" + file.date + "' />";
            newImg += "</a>";

            newImg += "<div class='thumb-overlay top'>";
            newImg += `<a href='#' class='thumb-delete' title='${w_gallery_img_delete}' data-name='${file.name}'><i class='icon trash'></i></a>`;
            newImg += `<a href='${file.url}' target='_blank' class='thumb-source' title='${w_gallery_view_source}'><i class='icon world'></i></a>`;
            newImg += `<span class='thumb-name' title='${w_gallery_img_name}'>${file.name}</span>`;
            newImg += "</div>";

            newImg += "<div class='thumb-overlay bottom'>";
            newImg += `<span class='thumb-size' title='${w_gallery_img_size}'>${file.size}</span>`;
            newImg += `<span class='thumb-dimensions' title='${w_gallery_img_dimensions}'><i class='icon image'></i>150 x 648</span>`;
            newImg += "</div>";

            newImg += "</div>";
            newImg += "</div>";
            $("#gallery-gallery .gallery > div:first-child").after(newImg);

            $("#gallery-gallery #gallery-thumb-" + safeName).parent().find(".thumb-delete").click(deleteGalleryPicture);
            $("#gallery-gallery #gallery-thumb-" + safeName).click(setGalleryPicture);
            $("#gallery-gallery #gallery-thumb-" + safeName).parent().hover(hoverInGalleryPicture, hoverOutGalleryPicture);
        });
    });
    loadGalleryRequest.fail(handleAPIError);
    loadGalleryRequest.always(function() {
    });
}
// #endregion