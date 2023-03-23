// #region HELPER METHODS
function handleVideoAPIError(code,msg = "") {
    switch(parseInt(code)) {
        case 2:
            toastr.error(w_video_api_upload_not_found);
            break;
        case 3:
            toastr.error(w_video_api_upload_corrupt);
            break;
        case 4:
            toastr.error(w_video_api_upload_empty);
            break;
        case 5:
            toastr.error(`${w_video_api_upload_too_big}${msg}`);
            break;
        case 6:
            toastr.error(`${w_video_api_upload_wrong_format}${msg}`);
            break;
        case 0:
        default:
            toastr.error(w_video_api_upload_failed);
            console.log(msg);
            break;
    }
}
function hoverInVideo() {
    $(this).find(".thumb-overlay").fadeIn(120);
    let img = $(this).find("a.video-thumb");
    img.css("outline","2px solid var(--color-primary)");
}
function hoverOutVideo() {
    $(this).find(".thumb-overlay").fadeOut(120);
    let img = $(this).find("a.video-thumb");
    img.css("outline","");
}
// #endregion
// #region MAIN METHODS
function setVideo() {
    $("#modal-videos").modal("hide");
    let src = $(this).find("img").attr("data-src");
    if(src.startsWith("/")) {
        src = src.substring(1);
    }
    switch(videoTarget.prop("tagName")) {
        case "VIDEO":
            videoTarget.attr("src",src);
            break;
        case "IFRAME":
        case "IMG":
            videoTarget.off("mouseenter mouseleave"); 
            let nodeID = parseInt(Math.random()*1000);
            videoTarget.replaceWith(`<video src="${src}" data-node-id="${nodeID}" controls></video>`);
            videoTarget = $("#page-editor").contents().find(`[data-node-id='${nodeID}']`);
            videoTarget.removeAttr("data-node-id");
            videoTarget.mouseenter(videoMouseEnter);
            videoTarget.mouseleave(videoMouseLeave);
            videoMouseEnter.call(videoTarget.get(0));
            tmHideTabs();
            break;
    }
}
function deleteVideo() {
    let name = $(this).attr("data-name");
    let element = $(this).parents(".thumb-wrapper").parent();
    let deletePictureRequest = $.ajax({
        method: "DELETE",
        url: videoAPI + "/" + name,
        dataType: "json"
    });
    deletePictureRequest.done(function(res) {
        if(parseInt(res.code)) {
            element.remove();
            if($("#modal-videos").length) {
                $("#modal-videos").modal("refresh");
            }
        } else {
            toastr.error(w_video_api_delete_error);
            console.log(res.msg);
        }
    });
    deletePictureRequest.fail(function(res) {
        toastr.error(w_video_api_delete_error);
        console.log(res.msg);
    });
    deletePictureRequest.always(function() {
    });
}
function updateEmbedThumb() {
    let val = $("#videos-embed-code textarea").val();
    if(val) {
        //#region YOUTUBE
        if(val.toLowerCase().includes("youtube.com") || val.toLowerCase().includes("youtu.be")) {
            if(val.toLowerCase().includes("<iframe")
                && val.toLowerCase().includes("src=\"")
                && val.toLowerCase().includes("youtube.com")
                && val.toLowerCase().includes("<\/iframe>")) {

                let srcStart = "src=\"";
                let srcStartPos = val.indexOf(srcStart) + srcStart.length;
                let srcEndPos = val.indexOf("\"",srcStartPos);
                let src = val.substring(srcStartPos,srcEndPos);

                let id = src.split("\/").pop();
                let paramPos = id.indexOf("?");
                if(paramPos != -1) {
                    id = id.substring(0,paramPos);
                }
                let thumb = `https://img.youtube.com/vi/${id}/0.jpg`;
                $("#videos-embed-thumb").attr("src",thumb);
                $("#videos-embed-thumb").css("display", "block");
            } 
            else if(!val.includes("\"") && val.toLowerCase().includes("youtu.be")) {
                let id = val.split("\/").pop();
                let paramPos = id.indexOf("?");
                if(paramPos != -1) {
                    id = id.substring(0,paramPos);
                }
                let thumb = `https://img.youtube.com/vi/${id}/0.jpg`;
                $("#videos-embed-thumb").attr("src",thumb);
                $("#videos-embed-thumb").css("display", "block");
            }
            else if(!val.includes("\"") && val.toLowerCase().includes("youtube.com\/watch?v=")) {
                let videoParam = "?v=";
                let videoParamPos = val.indexOf(videoParam) + videoParam.length;
                let id = val.substring(videoParamPos);
                let otherParam = "&";
                let otherParamPos = val.indexOf(otherParam);
                if(otherParamPos !== -1) {
                    id = id.substring(0,otherParamPos);
                }
                let thumb = `https://img.youtube.com/vi/${id}/0.jpg`;
                $("#videos-embed-thumb").attr("src",thumb);
                $("#videos-embed-thumb").css("display", "block");
            }
            else {
                $("#videos-embed-thumb").hide();
            }
        }
        else {
            $("#videos-embed-thumb").hide();
        }
        //#endregion
    }
    else {
        $("#videos-embed-thumb").hide();
    }
}
// #endregion
// #region LAUNCH
function wireVideos() {
    // GALLERY - TABS
    $("#modal-videos .ui.menu .item[data-tab='myvideos']").tab({
        onVisible: function() {
            $("#modal-videos").modal("refresh");
        }
    });
    $("#modal-videos .ui.menu .item[data-tab='embed']").tab({
        onVisible: function() {
            $("#modal-videos").modal("refresh");
        }
    });
    // EMBED
    $("#videos-embed-code textarea").keyup(function(event) {
        updateEmbedThumb();
        if(event.which == 13) {
            $("#videos-embed .ui.button").trigger("click");
        }
    });
    $("#videos-embed .ui.button").click(function(e) {
        if($("#videos-embed .ui.form").hasClass("error")) {
            $("#videos-embed .ui.form").removeClass("error");
        }
        if($("#videos-embed-code").hasClass("error")) {
            $("#videos-embed-code").removeClass("error");
        }
        let videoTargetNode = videoTarget.get(0);
        let val = $("#videos-embed-code textarea").val();
        if(val) {
            //#region GENERIC IFRAME PLUG
            if(val.toLowerCase().includes("<iframe")
            && val.toLowerCase().includes("src=\"")
            && val.toLowerCase().includes("<\/iframe>")
            ) {
                let newIframe = $.parseHTML(val.trim()).find(function(e) {
                    return e.tagName == "IFRAME";
                });
                switch(videoTargetNode.tagName) {
                    case "IFRAME":
                        videoTargetNode.src = newIframe.src;
                        $("#modal-videos").modal("hide");
                        break;
                    case "VIDEO":
                    case "IMG":
                        videoTarget.off("mouseenter mouseleave"); 
                        let nodeID = parseInt(Math.random()*1000);
                        newIframe.setAttribute("data-node-id",nodeID);
                        videoTarget.replaceWith(newIframe);
                        videoTarget = $("#page-editor").contents().find(`[data-node-id='${nodeID}']`);
                        videoTarget.removeAttr("data-node-id");
                        videoTarget.mouseenter(iframeMouseEnter); //WoInteract
                        videoTarget.mouseleave(videoMouseLeave);
                        $("#modal-videos").modal("hide");
                        iframeMouseEnter.call(videoTarget.get(0)); //WoInteract
                        break;
                }
                tmHideTabs();
            }
            //#endregion
            //#region CONVERT URL TO IFRAME SOURCE
            else if(!val.includes("\"") && !val.toLowerCase().includes("\/embed\/")) {
                let newIframeSrc;
                let videoID;
                //#region YOUTUBE
                if(val.toLowerCase().includes("youtu.be") 
                || val.toLowerCase().includes("youtube.com\/watch?v=")) {
                    if(val.toLowerCase().includes("youtu.be\/")) {
                        let youtubeDomain = "youtu.be\/";
                        let youtubeDomainPos = val.toLowerCase().indexOf(youtubeDomain);
                        if(youtubeDomainPos !== -1) {
                            let videoIDPos = youtubeDomainPos + youtubeDomain.length;
                            videoID = val.substring(videoIDPos);
                        }
                    } else if(val.toLowerCase().includes("youtube.com\/watch?v=")) {
                        let videoParam = "?v=";
                        let videoParamPos = val.indexOf(videoParam) + videoParam.length;
                        videoID = val.substring(videoParamPos);
                        let otherParam = "&";
                        let otherParamPos = val.indexOf(otherParam);
                        if(otherParamPos !== -1) {
                            videoID = videoID.substring(0,otherParamPos);
                        }
                    } 
                    newIframeSrc = `https://www.youtube.com/embed/${videoID}`;
                }
                //#endregion
                if(newIframeSrc) {
                    switch(videoTargetNode.tagName) {
                        case "IFRAME":
                            videoTargetNode.src = newIframeSrc.trim();
                            $("#modal-videos").modal("hide");
                            break;
                        case "VIDEO":
                        case "IMG":
                            videoTarget.off("mouseenter mouseleave");
                            let nodeID = parseInt(Math.random()*1000);
                            let newIframe = `<iframe src="${newIframeSrc.trim()}" data-node-id="${nodeID}"></iframe>`;
                            videoTarget.replaceWith(newIframe);
                            videoTarget = $("#page-editor").contents().find(`[data-node-id='${nodeID}']`);
                            videoTarget.removeAttr("data-node-id");
                            videoTarget.mouseenter(iframeMouseEnter); //WoInteract
                            videoTarget.mouseleave(videoMouseLeave);
                            $("#modal-videos").modal("hide");
                            iframeMouseEnter.call(videoTarget.get(0)); //WoInteract
                            break;
                    }
                    tmHideTabs();
                } else {
                    $("#videos-embed .ui.form").addClass("error");
                    $("#videos-embed-code").addClass("error");
                }
            }
            //#endregion
            else {
                $("#videos-embed .ui.form").addClass("error");
                $("#videos-embed-code").addClass("error");
            }
        }
        else {
            $("#videos-embed .ui.form").addClass("error");
            $("#videos-embed-code").addClass("error");
        }
    });

    // GALLERY - MY VIDEOS: UPLOAD/SAVE
    $("#videos-upload").fileupload({
        url: videoAPI,
        dataType: 'json',
        // acceptFileTypes: /(\.|\/)(mp4|webm|ogg)$/i,
        maxFileSize: 300000000, // 300 MB
        dropZone: $("#modal-videos .gallery"),
        start: function() {
            $("#videos-upload span").hide();
            $("#videos-upload .label").html("Uploading Video");
            $("#videos-upload .ui.progress").show();
        },
        done: function (e, response) {
            let result = response.result;
            if(parseInt(result.code) == 1) { 
                let file = result.data;
                let safeName = file.name.replace(/\./g, "");
                let newImg = "<div>";
                newImg += "<div class='thumb-wrapper'>";
                newImg += "<a href='#' class='video-thumb' id='video-thumb-" + safeName + "'>";
                newImg += "<img src='" + file.thumb + "'";
                newImg += " data-src='" + file.url + "' data-size='" + file.size + "' data-name='" + file.name + "' data-date='" + file.date + "' />";
                newImg += "</a>";

                newImg += "<div class='thumb-overlay top'>";
                newImg += "<a href='" + "#" + "' class='thumb-delete' title='Delete' data-name='" + file.name + "'><i class='icon trash'></i></a>";
                newImg += "<a href='" + file.url + "' target='_blank' class='thumb-source' title='View Source'><i class='icon world'></i></a>";
                newImg += "<span class='thumb-name' title='Video Name'>" + file.name + "</span>";
                newImg += "</div>";

                newImg += "<div class='thumb-overlay bottom'>";
                newImg += "<span class='thumb-size' title='Video Size'>" + file.size + "</span>";
                newImg += "</div>";

                newImg += "</div>";
                newImg += "</div>";
                $("#videos-myvideos .gallery > div:first-child").after(newImg);

                $("#videos-myvideos #video-thumb-" + safeName).parent().find(".thumb-delete").click(deleteVideo);
                $("#videos-myvideos #video-thumb-" + safeName).click(setVideo);
                $("#videos-myvideos #video-thumb-" + safeName).parent().hover(hoverInVideo, hoverOutVideo);
                $("#modal-videos").modal("refresh");
                $("#videos-upload .label").html("Upload Complete!");
                setTimeout(function() {
                    $("#videos-upload .ui.progress").fadeOut(400, function() {
                        $("#videos-upload span").fadeIn();
                    });
                }, 700);
            } else {
                handleVideoAPIError(result.code, result.msg);
            }
        },
        process: function(e, data) {
            $("#video-upload .ui.progress").progress("set total", data.total);
        },
        progressall: function (e, data) {
            $("#video-upload .ui.progress").progress("set progress", data.loaded);
        },
        fail: function(e,data) {
            toastr.error(w_video_api_upload_failed);
            console.log(data.errorThrown);
        },
        always: function(e,data) {
        }
    });
    // GALLERY - MY VIDEOS: LOAD
    let loadVideosRequest = $.ajax({
        method: "GET",
        url: videoAPI,
        dataType: "json"
    });
    loadVideosRequest.done(function(response) {
        $.each(response.data, function(k,file) {
            let safeName = file.name.replace(/\./g, "");
            let newImg = "<div>";
            newImg += "<div class='thumb-wrapper'>";
            newImg += "<a href='#' class='video-thumb' id='video-thumb-" + safeName + "'>";
            newImg += "<img src='" + file.thumb + "'";
            newImg += " data-src='" + file.url + "' data-size='" + file.size + "' data-name='" + file.name + "' data-date='" + file.date + "' />";
            newImg += "</a>";

            newImg += "<div class='thumb-overlay top'>";
            newImg += "<a href='" + "#" + "' class='thumb-delete' title='Delete' data-name='" + file.name + "'><i class='icon trash'></i></a>";
            newImg += "<a href='" + file.url + "' target='_blank' class='thumb-source' title='View Source'><i class='icon world'></i></a>";
            newImg += "<span class='thumb-name' title='Video Name'>" + file.name + "</span>";
            newImg += "</div>";

            newImg += "<div class='thumb-overlay bottom'>";
            newImg += "<span class='thumb-size' title='Video Size'>" + file.size + "</span>";
            newImg += "</div>";

            newImg += "</div>";
            newImg += "</div>";
            $("#videos-myvideos .gallery > div:first-child").after(newImg);

            $("#videos-myvideos #video-thumb-" + safeName).parent().find(".thumb-delete").click(deleteVideo);
            $("#videos-myvideos #video-thumb-" + safeName).click(setVideo);
            $("#videos-myvideos #video-thumb-" + safeName).parent().hover(hoverInVideo, hoverOutVideo);
        });
    });
    loadVideosRequest.fail(handleAPIError);
}
// #endregion