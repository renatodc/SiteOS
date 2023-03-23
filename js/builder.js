// #region VARIABLES
let _s;
class State {
    constructor() {
        this.files = [];
        this.folders = [];
        this.codeEditor;
        this.mode = Mode.None;
        this.pageUrl;
        this.pageFile;
        this.appPrimaryColor;
        this.isInitialCodeRetrieved;
        this.initialCode;
        this.diffEditor;
        this.sortable;
        this.templateDirectory = [];
    }
}
const Mode = {
    "None": 0,
    "Code": 1,
    "Page": 2,
    "Diff": 3
}
const sandboxParams = "allow-forms allow-pointer-lock allow-popups allow-same-origin allow-top-navigation";

const textTags = "h1,h2,h3,h4,h5,p,span,label,b,i,u,pre,blockquote,abbr,address,caption,cite,code,em,legend,q,small,strong,sub,sup";
const imgTag = "img";
const videoTags = "video,iframe";
const linkTag = "a";
const listItemTag = "li";
const sliderTag = "slider";
const sectionTags = "section,banner,header,footer,.ui-section,.web-section";
const inputTags = "input,textarea";
const iconTag = "i";
let textTarget;
let imgTarget;
let img2Target;
let videoTarget;
let linkTarget;
let listItemTarget;
let sliderTarget;
let inputTarget;
let iconTarget;
let baseEditStyle;
let baseEditStyleClear;
let imgEditStyle;
let imgEditStyleClear;
let palette = [
    // add theme color scheme
    ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
    ["#263238","#455A64","#607D8B","#90A4AE","#A1887F","#795548","#5d4037","#3e2723"],
    ["#9575CD","#673AB7","#512DA8","#311B92","#7986cb","#3f51b5","#303F9F","#1A237E"],
    ["#eb144c","#ff6900","#fcb900","#00d084","#abb8c3","#8ed1fc","#0693e3","#9900ef"],
    ["#b80000","#db3e00","#fccb00","#008b02","#006b76","#1273de","#004dcf","#5300eb"],
    ["#c00000","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
    ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
    ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
]
// #endregion
// #region DICTIONARY
let toastSaveSuccess = "Save successful";
let toastSaveError = "Error saving page";
let toastRemoveSuccess = "Page removed";
let toastRemoveError = "Unable to remove page";
let toastFolderRemoveSuccess = "Folder removed";
let toastFolderRemoveError = "Unable to remove folder";
let toastHeaderTagValidationError = "Multiple &lt;header&gt; tags detected. Only a single &lt;header&gt; tag is allowed per web page.";
let toastFooterTagValidationError = "Multiple &lt;footer&gt; tags detected. Only a single &lt;footer&gt; tag is allowed per web page.";
let toastWebSettingsSaveSuccess = "Settings saved";
let toastWebSettingsSaveError = "Error saving settings";

let enclosingTagsInfoTitle = "Enclosing tags not needed";
let enclosingTagsInfoContent = "SiteOS will automatically add enclosing doctype and html tags to your source code, so there is no need to add the following tags:<br />&lt;!DOCTYPE ...&gt;<br />&lt;html&gt;<br />...<br />&lt;/html&gt;";
// #endregion
// #region HELPER METHODS
function iFrameReady(iFrame, fn) {
    var timer;
    var fired = false;

    function ready() {
        if (!fired) {
            fired = true;
            clearTimeout(timer);
            fn.call(this);
        }
    }

    function readyState() {
        if (this.readyState === "complete") {
            ready.call(this);
        }
    }

    function addEvent(elem, event, fn) {
        if (elem.addEventListener) {
            return elem.addEventListener(event, fn);
        } else {
            return elem.attachEvent("on" + event, function () {
                return fn.call(elem, window.event);
            });
        }
    }

    addEvent(iFrame, "load", function () {
        ready.call(iFrame.contentDocument || iFrame.contentWindow.document);
    });

    function checkLoaded() {
        var doc = iFrame.contentDocument || (iFrame.contentWindow && iFrame.contentWindow.document);
        if (doc.URL.indexOf("about:") !== 0) {
            if (doc.readyState === "complete") {
                ready.call(doc);
            } else {
                addEvent(doc, "load", ready);
                addEvent(doc, "readystatechange", readyState);
            }
        } else {
            timer = setTimeout(checkLoaded, 50);
        }
    }
    checkLoaded();
}
function getPageCode() {
    let pageInnerCode = document.getElementById("page-editor").contentDocument.documentElement.innerHTML;
    let pageFullCode = `<!DOCTYPE html>\n<html>\n${pageInnerCode}\n</html>`;
    return pageInnerCode;
}
function copyTextToClipboard(text) {
    let textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position="fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}
function updateFontSize() {
    let newFontSize = $("#tm-text-size").val();
    let fontSizeUnit = $("#tm-text-length").dropdown("get value");
    let sel = document.getElementById("page-editor").contentDocument.getSelection();
    switch(sel.type) {
        case "Range":
            let textElement = getLastInsertedNode("span");
            if(textElement.get(0).isSameNode(textTarget.get(0))) {
                textTarget.css("fontSize",`${newFontSize}${fontSizeUnit}`);
            } else {
                let nodeID = parseInt(Math.random()*1000);
                let newText = `<span style='font-size: ${newFontSize}${fontSizeUnit}' data-node-id='${nodeID}'>${sel.toString()}</span>`;
                document.getElementById("page-editor").contentDocument.execCommand("insertHTML", false, newText);
                textElement = $("#page-editor").contents().find(`[data-node-id='${nodeID}']`);
                if(textElement.length) {
                    textElement.removeAttr("data-node-id");
                    textElement.attr("contenteditable","true");
                    textElement.keydown(contentEditableEnter);
                    textElement.mouseenter(textMouseEnter);
                    textElement.focusin(textFocusIn);
                    textElement.focusout(textFocusOut);
                    textElement.mouseleave(textMouseLeave);
                    textElement.click(textMouseClick);
                    textMouseClick.call(textElement.get(0));
                }
            }
            break;
        case "Caret":
            textTarget.css("fontSize",`${newFontSize}${fontSizeUnit}`);
            break;
    }
}
function updateIconSize() {
    let newFontSize = $("#tm-icon-size").val();
    let fontSizeUnit = $("#tm-icon-length").dropdown("get value");
    iconTarget.css("fontSize",`${newFontSize}${fontSizeUnit}`);
}
function previousNode(node) {
    let previous = node.previousSibling;
    if (previous) {
        node = previous;
        while (node.hasChildNodes()) {
            node = node.lastChild;
        }
        return node;
    }
    let parent = node.parentNode;
    if (parent && parent.hasChildNodes()) {
        return parent;
    }
    return null;
}
function getLastInsertedNode(tag) {
    let sel = document.getElementById("page-editor").contentDocument.getSelection();
    if (sel.rangeCount > 0) {
        let range = sel.getRangeAt(0);
        let node = range.startContainer;
        if (node.hasChildNodes() && range.startOffset > 0) {
            node = node.childNodes[range.startOffset - 1];
        }
        while (node) {
            if (node.nodeType == Node.ELEMENT_NODE && node.tagName.toLowerCase() == tag) {
                return $(node);
            }
            node = previousNode(node);
        }
    }
}
function imageResizer(preserveAspectRatio) {
    $("#tb-img").hide();
    imgTarget.off("mouseenter mouseleave click");
    let imgTargetNode = imgTarget.get(0);
    if(interact.isSet(imgTargetNode)) {
        interact(imgTargetNode).unset();
    }

    interact(imgTargetNode).resizable({
        preserveAspectRatio: preserveAspectRatio,
        invert: "none",
        edges: { left: true, right: true, bottom: true, top: true },
        onstart: function(e) {
            imgTarget = $(e.target);
        },
        onmove: function(event) {
            let { x, y } = event.target.dataset;
            x = parseFloat(x) || 0;
            y = parseFloat(y) || 0;
            Object.assign(event.target.style, {
                width: `${event.rect.width}px`,
                height: `${event.rect.height}px`,
                transform: `translate(${event.deltaRect.left}px, ${event.deltaRect.top}px)`
            });
            Object.assign(event.target.dataset, { x, y });
        },
        onend: function(e) {
            interact(imgTarget.get(0)).unset();
            setTimeout(function() {
                imgMouseEnter.call(imgTarget.get(0));
                imgTarget.mouseenter(imgMouseEnter);
                imgTarget.mouseleave(imgMouseLeave);
                imgTarget.click(imgMouseClick);
            }, 80);
        }
    });
}
function videoResizer(preserveAspectRatio) {
    $("#tb-video").hide();
    videoTarget.off("mouseenter mouseleave");
    let videoTargetNode = videoTarget.get(0);
    if(interact.isSet(videoTargetNode)) {
        interact(videoTargetNode).unset();
    }
    if(videoTarget.css("border")) {
        videoTarget.attr("data-border", videoTarget.css("border"));
    }
    videoTarget.css("border",`2px solid ${_s.appPrimaryColor}`);
    interact(videoTargetNode).resizable({
        preserveAspectRatio: preserveAspectRatio,
        invert: "none",
        edges: { left: true, right: true, bottom: true, top: true },
        onstart: function(e) {
            videoTarget = $(e.target);
        },
        onmove: function(event) {
            Object.assign(event.target.style, {
                width: `${event.rect.width}px`,
                height: `${event.rect.height}px`
            });
        },
        onend: function(e) {
            interact(videoTarget.get(0)).unset();
            videoTarget.css("border", "");
            if(videoTarget.attr("data-border")) {
                videoTarget.css("border", videoTarget.attr("data-border"));
                videoTarget.removeAttr("data-border");
            }
            setTimeout(function() {
                videoMouseEnter.call(videoTarget.get(0));
                videoTarget.mouseenter(videoMouseEnter);
                videoTarget.mouseleave(videoMouseLeave);
            }, 80);
        }
    });
}
function getVideoThumb() {

}
function getPageName(name,page) {
    let menuPageName = name;
    if(page) {
        menuPageName = page;
    } else {
        menuPageName = menuPageName.replace(".html", "");
        menuPageName = menuPageName.replace(/[_\-]/g, " ");
        menuPageName = menuPageName[0].toUpperCase() + menuPageName.slice(1).toLowerCase();
    }
    return menuPageName;
}
// #endregion
// #region TOOLBAR
function displayToolbar(elTarget, tbTarget) {
    // if(elTarget) {} 
    let documentScrollTop = $(window).scrollTop();
    let editorScrollTop = $("#page-editor").contents().scrollTop();
    let editorScrollLeft = $("#page-editor").contents().scrollLeft();
    let editorTop = $("#page-editor").offset().top;
    let editorLeft = $("#page-editor").offset().left;
    let elementTop = elTarget.offset().top - 9;
    let elementLeft = elTarget.offset().left - 1;
    let editorOffset = editorTop - documentScrollTop - editorScrollTop;
    let toolbarTop = elementTop - tbTarget.height() + editorOffset + 1;
    tbTarget.css("top", toolbarTop);
    if(elementLeft + tbTarget.width() + 10 >= $(document).width()) {
        tbTarget.css("left", elementLeft + editorLeft - editorScrollLeft + elTarget.width() - tbTarget.width());
    } else {
        tbTarget.css("left", elementLeft + editorLeft - editorScrollLeft);
    }
    if(tbTarget.is(":hidden")) {
        tbTarget.show();
    }
}
function wireToolbar() {
    //#region TOOLBAR - IMG
    $("#tb-img").mouseenter(function() {
        displayToolbar(imgTarget, $("#tb-img"));
    });
    $("#tb-img").mouseleave(function() {
        $("#tb-img").hide();
    });
    $("#tb-img-change").mousedown(function() {
        galleryTarget = GalleryTarget.PageEditor;
        shouldLoadStockPictures();
        $("#modal-gallery").modal("show");
    });
    $("#tb-img-move").mousedown(function() {
        $("#tb-img").hide();
        imgTarget.off("mouseenter mouseleave click");
        if(imgTarget.css("position") != "relative") {
            imgTarget.css("position","relative");
        }
        let imgTargetNode = imgTarget.get(0);
        if(interact.isSet(imgTargetNode)) {
            interact(imgTargetNode).unset();
        }
        interact(imgTargetNode).draggable({
            onstart: function(e) {
                imgTarget = $(e.target);
            },
            onmove: function(e) {
                let elementAdjustCarryT = imgTarget.css("top").replace(/[^-\d\.]/g, '');
                let elementAdjustCarryL = imgTarget.css("left").replace(/[^-\d\.]/g, '');
                let x = parseInt(elementAdjustCarryL) + parseInt(e.dx);
                let y = parseInt(elementAdjustCarryT) + parseInt(e.dy);
                imgTarget.css('top', y);
                imgTarget.css('left', x);
            },
            onend: function(e) {
                interact(imgTarget.get(0)).unset();
                setTimeout(function() {
                    imgMouseEnter.call(imgTarget.get(0));
                    imgTarget.mouseenter(imgMouseEnter);
                    imgTarget.mouseleave(imgMouseLeave);
                    imgTarget.click(imgMouseClick);
                }, 80);
            }
        });
    });
    $("#tb-img-resize").mousedown(function() {
        imageResizer(true);
    });
    $("#tb-img-transform").mousedown(function() {
        imageResizer(false);
    });
    $("#tb-img-reset").mousedown(function() {
        imgTarget.removeAttr("style");
    });
    $("#tb-img-remove").mousedown(function() {
        imgTarget.remove();
        $("#tb-img").hide();
    });
    // #endregion
    //#region TOOLBAR - VIDEO
    $("#tb-video").mouseenter(function() {
        displayToolbar(videoTarget, $("#tb-video"));
    });
    $("#tb-video").mouseleave(function() {
        $("#tb-video").hide();
    });
    $("#tb-video-change").mousedown(function() {
        $("#modal-videos").modal("show");
        switch(videoTarget.prop("tagName")) {
            case "IFRAME":
                $("#videos-embed-code textarea").val(videoTarget.get(0).outerHTML);
                updateEmbedThumb();
                $("#videos-tab-embed").trigger("click");
                break;
            case "VIDEO":
                $("#videos-tab-myvideos").trigger("click");
                break;
        }
    });
    $("#tb-video-to-img").mousedown(function() {
        galleryTarget = GalleryTarget.PageEditorVideoToImg;
        shouldLoadStockPictures();
        $("#modal-gallery").modal("show");
    });
    $("#tb-video-move").mousedown(function() {
        $("#tb-video").hide();
        videoTarget.off("mouseenter mouseleave");
        if(videoTarget.css("position") != "relative") {
            videoTarget.css("position","relative");
        }
        let videoTargetNode = videoTarget.get(0);
        if(interact.isSet(videoTargetNode)) {
            interact(videoTargetNode).unset();
        }
        if(videoTarget.css("border")) {
            videoTarget.attr("data-border", videoTarget.css("border"));
        }
        videoTarget.css("border",`2px solid ${_s.appPrimaryColor}`);
        interact(videoTargetNode).draggable({
            onstart: function(e) {
                videoTarget = $(e.target);
            },
            onmove: function(e) {
                let elementAdjustCarryT = videoTarget.css("top").replace(/[^-\d\.]/g, '');
                let elementAdjustCarryL = videoTarget.css("left").replace(/[^-\d\.]/g, '');
                let x = parseInt(elementAdjustCarryL) + parseInt(e.dx);
                let y = parseInt(elementAdjustCarryT) + parseInt(e.dy);
                videoTarget.css('top', y);
                videoTarget.css('left', x);
            },
            onend: function(e) {
                interact(videoTarget.get(0)).unset();
                videoTarget.css("border", "");
                if(videoTarget.attr("data-border")) {
                    videoTarget.css("border", videoTarget.attr("data-border"));
                    videoTarget.removeAttr("data-border");
                }
                setTimeout(function() {
                    videoMouseEnter.call(videoTarget.get(0));
                    videoTarget.mouseenter(videoMouseEnter);
                    videoTarget.mouseleave(videoMouseLeave);
                }, 80);
            }
        });
    });
    $("#tb-video-resize").mousedown(function() {
        videoResizer(true);
    });
    $("#tb-video-transform").mousedown(function() {
        videoResizer(false);
    });
    $("#tb-video-reset").mousedown(function() {
        videoTarget.removeAttr("style");
    });
    $("#tb-video-remove").mousedown(function() {
        videoTarget.remove();
        $("#tb-video").hide();
    });
    //#endregion
    //#region TOOLBAR - SLIDER
    $("#tb-slider").mouseenter(function() {
        displayToolbar(sliderTarget, $("#tb-slider"));
    });
    $("#tb-slider").mouseleave(function() {
        $("#tb-slider").hide();
    });
    $("#tb-slider-modify").mousedown(function() {
        let sliderClass = sliderTarget.attr("class");
        let slides;
        switch(sliderClass) {
            case "thumbs-gallery":
                slides = sliderTarget.find(".gallery-top .swiper-slide").map(function() {
                    return {
                        img: $(this).css("backgroundImage").slice(4, -1).replace(/"/g, ""),
                        content: $(this).html()
                    }
                });
                break;
        }
        $("#slider-images li.img").remove();
        slides.each(function(i,slide) {
            var newImg = `<li class="img">`;
            newImg += "<div>";
            newImg += `<img src="${slide.img}" />`;
            newImg += `<div class="del">`;
            newImg += "<div>";
            newImg += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 652 1024">`;
            newImg += `<path d="M0 180.25l-0.002-17.249v-18c0-6 0.333-12 1-18 8.334-4.667 20.167-8.583 35.501-11.75s31.667-5.75 49.001-7.75 34.417-3.5 51.251-4.5 29.917-1.833 39.25-2.5c-2.667-27.333-0.75-48.667 5.75-64s16.416-26.75 29.75-34.25 29.75-12.333 49.25-14.5 41.416-3.25 65.75-3.25c18.334 0 36.584 0.5 54.75 1.5s34.416 4.417 48.75 10.25 25.75 14.917 34.25 27.25 12.75 29.833 12.75 52.5v12c0 4-0.333 8.167-1 12.5 9.666 0.667 22.833 1.5 39.499 2.5s33.75 2.5 51.25 4.5 34.083 4.583 49.75 7.75 27.667 7.083 36 11.75v70.5c-12.333 6.667-32.833 12.083-61.5 16.25s-59.583 7.333-92.75 9.5-65.416 3.417-96.75 3.75-56.334 0.5-75 0.5c-18.334 0-43.334-0.167-75-0.5s-64.083-1.583-97.25-3.75-63.916-5.25-92.25-9.25-48.667-9.5-61.001-16.5c-0.667-5.333-1-11.083-1-17.25zM66.498 691.001v-418.5c41 5.334 81.666 8.834 122 10.5s81 2.5 122 2.5h16c43-0.667 86-1.667 129-3s86-4.667 129-10v418.5c0 21-7.333 39.083-22 54.25s-32.5 22.75-53.5 22.75h-365.5c-21 0-39.084-7.5-54.25-22.5s-22.75-33.167-22.75-54.5zM151.498 668.501c0 5.334 1.75 9.75 5.25 13.25s7.917 5.25 13.25 5.25h19.5c5.333 0 9.917-1.667 13.75-5s5.75-7.833 5.75-13.5v-307c0-5.334-1.917-9.917-5.75-13.75s-8.417-5.75-13.75-5.75h-19.5c-5.333 0-9.75 1.917-13.25 5.75s-5.25 8.417-5.25 13.75v307zM251.998 76c0 3.333 0.167 7 0.5 11s0.833 7.833 1.5 11.5c48-0.667 96.5-0.667 145.5 0 0-4 0.333-7.917 1-11.75s0.667-7.417 0-10.75v-7.5c-11.666-3.333-24-5.167-37-5.5s-25.334-0.5-37-0.5c-12.334 0-24.917 0.167-37.75 0.5s-25.084 2.167-36.75 5.5v7.5zM297.998 668.502c0 5.334 1.667 9.75 5 13.25s7.834 5.25 13.5 5.25h19.5c5.334 0 9.917-1.667 13.75-5s5.75-7.833 5.75-13.5v-307c0-5.334-1.917-9.917-5.75-13.75s-8.417-5.75-13.75-5.75h-19.5c-5.334 0-9.75 1.917-13.25 5.75s-5.25 8.417-5.25 13.75v307zM443.498 668.502c0 5.334 1.834 9.75 5.501 13.25s8.333 5.25 14 5.25h19.5c5.334 0 9.917-1.667 13.75-5s5.75-7.833 5.75-13.5v-307c0-5.334-1.917-9.917-5.75-13.75s-8.417-5.75-13.75-5.75h-19.5c-5.334 0-9.917 1.917-13.75 5.75s-5.75 8.417-5.75 13.75v307z"></path>`;
            newImg += "</svg>";
            newImg += "</div>";
            newImg += "</div>";
            newImg += `<div class="content">`;
            newImg += slide.content;
            newImg += "</div>";
            newImg += "</div>";
            newImg += "</li>";
            $("#slider-images").append(newImg);
        });
        $("#slider-images li.img").off("mouseenter mouseleave");
        $("#slider-images li.img .del > div").off("click");
        $("#slider-images li.img").mouseenter(function() {
            $(this).find("img").css("opacity","0.5");
            $(this).find(".del").css("display","flex");
        });
        $("#slider-images li.img").mouseleave(function() {
            $(this).find("img").css("opacity","");
            $(this).find(".del").css("display","none");
        });
        $("#slider-images li.img .del > div").click(function() {
            $(this).parents("li.img").remove();
        });
        let sliderElement = document.getElementById('slider-images');
        if(_s.sortable) {
            _s.sortable.destroy();
        }
        _s.sortable = new Sortable.create(sliderElement, {
            animation: 150,
            draggable: ".img",
            onStart: function (evt) {
                $("#slider-images li.img .del > div").hide();
            },
            onEnd: function (evt) {
                $("#slider-images li.img .del").hide();
                $("#slider-images li.img .del > div").show();
            }
        });
        $("#modal-slider-settings").modal("show");
    });
    $("#slider-image-upload-container").fileupload({
        url: imgAPI,
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|webp|bmp)$/i,
        maxFileSize: 50000000, // 50 MB
        dropZone: $("#slider-images"),
        start: function() {
            $("#slider-image-upload-container > div:first-child").hide();
            $("#slider-image-upload-container .ui.progress").show();
        },
        done: function (e, res) {
            let result = res.result;
            if(parseInt(result.code) == 1) {                
                var file = result.data;
                var newImg = `<li class="img">`;
                newImg += "<div>";
                newImg += `<img src="${file.url}" />`;
                newImg += `<div class="del">`;
                newImg += "<div>";
                newImg += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 652 1024">`;
                newImg += `<path d="M0 180.25l-0.002-17.249v-18c0-6 0.333-12 1-18 8.334-4.667 20.167-8.583 35.501-11.75s31.667-5.75 49.001-7.75 34.417-3.5 51.251-4.5 29.917-1.833 39.25-2.5c-2.667-27.333-0.75-48.667 5.75-64s16.416-26.75 29.75-34.25 29.75-12.333 49.25-14.5 41.416-3.25 65.75-3.25c18.334 0 36.584 0.5 54.75 1.5s34.416 4.417 48.75 10.25 25.75 14.917 34.25 27.25 12.75 29.833 12.75 52.5v12c0 4-0.333 8.167-1 12.5 9.666 0.667 22.833 1.5 39.499 2.5s33.75 2.5 51.25 4.5 34.083 4.583 49.75 7.75 27.667 7.083 36 11.75v70.5c-12.333 6.667-32.833 12.083-61.5 16.25s-59.583 7.333-92.75 9.5-65.416 3.417-96.75 3.75-56.334 0.5-75 0.5c-18.334 0-43.334-0.167-75-0.5s-64.083-1.583-97.25-3.75-63.916-5.25-92.25-9.25-48.667-9.5-61.001-16.5c-0.667-5.333-1-11.083-1-17.25zM66.498 691.001v-418.5c41 5.334 81.666 8.834 122 10.5s81 2.5 122 2.5h16c43-0.667 86-1.667 129-3s86-4.667 129-10v418.5c0 21-7.333 39.083-22 54.25s-32.5 22.75-53.5 22.75h-365.5c-21 0-39.084-7.5-54.25-22.5s-22.75-33.167-22.75-54.5zM151.498 668.501c0 5.334 1.75 9.75 5.25 13.25s7.917 5.25 13.25 5.25h19.5c5.333 0 9.917-1.667 13.75-5s5.75-7.833 5.75-13.5v-307c0-5.334-1.917-9.917-5.75-13.75s-8.417-5.75-13.75-5.75h-19.5c-5.333 0-9.75 1.917-13.25 5.75s-5.25 8.417-5.25 13.75v307zM251.998 76c0 3.333 0.167 7 0.5 11s0.833 7.833 1.5 11.5c48-0.667 96.5-0.667 145.5 0 0-4 0.333-7.917 1-11.75s0.667-7.417 0-10.75v-7.5c-11.666-3.333-24-5.167-37-5.5s-25.334-0.5-37-0.5c-12.334 0-24.917 0.167-37.75 0.5s-25.084 2.167-36.75 5.5v7.5zM297.998 668.502c0 5.334 1.667 9.75 5 13.25s7.834 5.25 13.5 5.25h19.5c5.334 0 9.917-1.667 13.75-5s5.75-7.833 5.75-13.5v-307c0-5.334-1.917-9.917-5.75-13.75s-8.417-5.75-13.75-5.75h-19.5c-5.334 0-9.75 1.917-13.25 5.75s-5.25 8.417-5.25 13.75v307zM443.498 668.502c0 5.334 1.834 9.75 5.501 13.25s8.333 5.25 14 5.25h19.5c5.334 0 9.917-1.667 13.75-5s5.75-7.833 5.75-13.5v-307c0-5.334-1.917-9.917-5.75-13.75s-8.417-5.75-13.75-5.75h-19.5c-5.334 0-9.917 1.917-13.75 5.75s-5.75 8.417-5.75 13.75v307z"></path>`;
                newImg += "</svg>";
                newImg += "</div>";
                newImg += "</div>";
                newImg += `<div class="content">`;
                newImg += "</div>";
                newImg += "</div>";
                newImg += "</li>";
                $("#slider-images").append(newImg);
                $("#slider-images li.img:last-child").mouseenter(function() {
                    $(this).find("img").css("opacity","0.5");
                    $(this).find(".del").css("display","flex");
                });
                $("#slider-images li.img:last-child").mouseleave(function() {
                    $(this).find("img").css("opacity","");
                    $(this).find(".del").css("display","none");
                });
                $("#slider-images li.img:last-child .del > div").click(function() {
                    $(this).parents("li.img").remove();
                });
                // if not sortable, add sortable section
                setTimeout(function() {
                    $("#slider-image-upload-container .ui.progress").fadeOut(400, function() {
                        $("#slider-image-upload-container > div:first-child").fadeIn();
                    });
                }, 700);
            } else {
                handleImgAPIError(result.code, result.msg);
            }
        },
        process: function(e, data) {
            $("#slider-image-upload-container .ui.progress").progress("set total", data.total);
        },
        progressall: function (e, data) {
            $("#slider-image-upload-container .ui.progress").progress("set progress", data.loaded);
        },
        fail: function(e,data) {
            toastr.error(w_img_api_upload_failed);
            console.log(data.errorThrown);
        }
    });

    //#endregion
}
// #endregion
// #region TOOLMENU
function wireToolMenu() {
    let colorParams;
    $(".ui-right>.ui.accordion").accordion({ "exclusive": false });
    //#region PAGE
    $("#tm-page-name input").keyup(function() {
        let pageNameTag = $("#page-editor").contents().find("meta[name='page']");
        if(pageNameTag.length) {
            pageNameTag.attr("content", $(this).val());
        } else {
            let genPageNameTag = `\n    <meta name="page" content="${$(this).val()}">`;
            $("#page-editor").contents().find("head").prepend(genPageNameTag);
        }
    });
    $("#tm-page-title input").keyup(function() {
        let pageTitleTag = $("#page-editor").contents().find("title");
        if(pageTitleTag.length) {
            pageTitleTag.html($(this).val());
        } else {
            let genPageTitleTag = `\n    <title>${$(this).val()}</title>`;
            $("#page-editor").contents().find("head").prepend(genPageTitleTag);
        }
    });
    $("#tm-page-description input").keyup(function() {
        let pageDescriptionTag = $("#page-editor").contents().find("meta[name='description']");
        if(pageDescriptionTag) {
            pageDescriptionTag.attr("content", $(this).val());
        } else {
            let genPageDescriptionTag = `\n    <meta name="description" content="${$(this).val()}">`;
            $("#page-editor").contents().find("head").prepend(genPageDescriptionTag);
        }
    });
    $("#tm-page-url .button").click(function() {
        $("#tm-page-url input").focus();
        $("#tm-page-url input").select();
        document.execCommand('copy');
    });
    //#endregion
    //#region SECTION
    $("#tm-section-bg-img-change").click(function() {
        galleryTarget = GalleryTarget.PageEditorSectionBg;
        shouldLoadStockPictures();
        $("#modal-gallery").modal("show");
    });
    $("#tm-section-bg-img-remove").click(function() {
        sectionTarget.css("backgroundImage", "none");
        $("#tm-section-bg-img").hide();
        $("#tm-section-bg-img-remove").hide();
        $("#tm-section-bg-img-effect").hide();
        $("#tm-section-bg-img-fullwidth").hide();
    });
    $("#tm-section-bg-img-effect .ui.checkbox").checkbox({
        onChecked: function() {
            sectionTarget.css("backgroundAttachment", "fixed");
        },
        onUnchecked: function() {
            sectionTarget.css("backgroundAttachment", "");
        }
    });
    $("#tm-section-bg-img-fullwidth .ui.checkbox").checkbox({
        onChecked: function() {
            sectionTarget.css("backgroundSize", "cover");
        },
        onUnchecked: function() {
            sectionTarget.css("backgroundSize", "");
        }
    });
    colorParams = {
        color: "#000",
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
        showAlpha: true,
        allowEmpty: true,
        palette,
        move: function(color) {
            if(color) {
                sectionTarget.css("backgroundColor",color.toHexString());
            } else {
                sectionTarget.css("backgroundColor","");
            }
        }
    };
    $("#tm-section-bg-img-color input").spectrum(colorParams);
    $("#tm-section-remove").click(function() {
        sectionTarget.remove();
    });
    //#endregion
    //#region LINK
    $("#tm-link-url input").keyup(function() {
        linkTarget.attr("data-href", $(this).val());
    });
    $("#tm-link-newtab .ui.checkbox").checkbox({
        onChecked: function() {
            linkTarget.attr("target", "_blank");
        },
        onUnchecked: function() {
            linkTarget.removeAttr("target");
        }
    });
    //#endregion
    //#region LIST ITEM
    $("#tm-listitem-dup").click(function() {
        let dupItem = listItemTarget.clone(true);
        dupItem.removeAttr("style");
        // dupItem.insertAfter(listItemTarget);
        // Would be nice to: preserve tab formatting with relative list elements.
        listItemTarget.after("\n",dupItem);
        // listItemTarget.get(0).insertAdjacentElement("afterend",dupItem.get(0));
    });
    $("#tm-listitem-del").click(function() {
        listItemTarget.remove();
    });
    //#endregion
    //#region ICON
    $("#tm-icon-filter input").keyup(function() {
        if($("#tm-icon-filter input").val()) {
            $.each($("#tm-icon-lib > li"),function() {
                if($(this).find("i").attr("class").indexOf($("#tm-icon-filter input").val()) == -1) {
                    $(this).hide();
                }
            });  
        } else {
            $("#tm-icon-lib > li").show();
        }
    });
    $("#tm-icon-lib > li").click(function() {
        $("#tm-icon-preview").attr("class",$(this).find("i").attr("class"));
        iconTarget.attr("class",$(this).find("i").attr("class"));
    });
    $("#tm-icon-to-img").click(function() {
        galleryTarget = GalleryTarget.PageEditorIconToImg;
        shouldLoadStockPictures();
        $("#modal-gallery").modal("show");
    });    
    $("#tm-icon-size").on("keyup", updateIconSize);
    $("#tm-icon-length").dropdown({ onChange: updateIconSize });
    $("#tm-icon-increasesize").mousedown(function() {
        $("#tm-icon-size").val(parseFloat($("#tm-icon-size").val())+1);
        updateIconSize();
    });
    $("#tm-icon-decreasesize").mousedown(function() {
        $("#tm-icon-size").val(parseFloat($("#tm-icon-size").val())-1);
        updateIconSize();
    });
    colorParams = {
        color: "#000",
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
        showAlpha: true,
        allowEmpty: true,
        palette,
        move: function(color) {
            if(color) {
                iconTarget.css("color",color.toHexString());
            } else {
                iconTarget.css("color","");
            }
        }
    };
    $("#tm-icon-color").spectrum(colorParams);
    $("#tm-icon-removeformat").mousedown(function() {
        iconTarget.removeAttr("style");
    });
    //#endregion
    //#region IMG
    $("#tm-img-preview img").on("error",function() {
        $("#tm-img-preview img").attr("src", "img/icons/pixel.png");
    });
    $("#tm-section-bg-img img").on("error",function() {
        $("#tm-section-bg-img img").attr("src", "img/icons/pixel.png");
    });
    $("#tm-img-change").click(function() {
        galleryTarget = GalleryTarget.PageEditorImg;
        shouldLoadStockPictures();
        $("#modal-gallery").modal("show");
    });
    $("#tm-img-remove").click(function() {
        img2Target.remove();
        $("#tm-img").hide();
        $("#tm-img+.content").hide();
    });
    $("#tm-img-alt input").keyup(function() {
        img2Target.attr("alt", $(this).val());
    });
    $("#tm-img-linkify").click(function() {
        img2Target.wrap("<a href='#' data-href=''></a>");
        let linkElement = img2Target.parent();
        linkElement.keydown(contentEditableEnter);
        linkElement.mouseenter(linkMouseEnter);
        linkElement.mouseleave(linkMouseLeave);
        linkElement.focusin(linkFocusIn);
        linkElement.focusout(linkFocusOut);
        linkElement.click(linkMouseClick);
        linkMouseClick.call(linkElement.get(0));
        $("#tm-img-linkify").hide();
    });
    $("#tm-img-to-video").click(function() {
        videoTarget = img2Target;
        $("#modal-videos").modal("show");
        $("#videos-tab-myvideos").trigger("click");
    });
    //#endregion
    //#region TEXT
    //#region FORMATTING
    $("#tm-text-bold").mousedown(function() {
        let sel = document.getElementById("page-editor").contentDocument.getSelection();
        switch(sel.type) {
            case "Range":
                document.getElementById("page-editor").contentDocument.execCommand("bold",false,null);
                break;
            case "Caret":
                let eProp = textTarget.css("font-weight");
                if(eProp == "bold" || eProp == "700") {
                    textTarget.css("font-weight", "normal");
                } else {
                    textTarget.css("font-weight", "bold");
                }
                break;
        }
    });
    $("#tm-text-italic").mousedown(function() {
        let sel = document.getElementById("page-editor").contentDocument.getSelection();
        switch(sel.type) {
            case "Range":
                document.getElementById("page-editor").contentDocument.execCommand("italic",false,null);
                break;
            case "Caret":
                let eProp = textTarget.css("font-style");
                if(eProp == "italic") {
                    textTarget.css("font-style", "normal");
                } else {
                    textTarget.css("font-style", "italic");
                }
                break;
        }
    });
    $("#tm-text-underline").mousedown(function() {
        let sel = document.getElementById("page-editor").contentDocument.getSelection();
        switch(sel.type) {
            case "Range":
                document.getElementById("page-editor").contentDocument.execCommand("underline",false,null);
                break;
            case "Caret":
                let eProp = textTarget.css("text-decoration");
                if(eProp == "underline") {
                    textTarget.css("text-decoration", "none");
                } else {
                    textTarget.css("text-decoration", "underline");
                }
                break;
        }
    });
    $("#tm-text-strikethrough").mousedown(function() {
        let sel = document.getElementById("page-editor").contentDocument.getSelection();
        switch(sel.type) {
            case "Range":
                document.getElementById("page-editor").contentDocument.execCommand("strikeThrough",false,null);
                break;
            case "Caret":
                let eProp = textTarget.css("text-decoration");
                if(eProp == "line-through") {
                    textTarget.css("text-decoration", "none");
                } else {
                    textTarget.css("text-decoration", "line-through");
                }
                break;
        }
    });
    colorParams = {
        color: "#000",
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
        allowEmpty: false,
        palette,
        move: function(color) {
            let sel = document.getElementById("page-editor").contentDocument.getSelection();
            switch(sel.type) {
                case "Range":
                    document.getElementById("page-editor").contentDocument.execCommand("foreColor",false, color.toHexString());
                    break;
                case "Caret":
                    textTarget.css("color", color.toHexString());
                    break;
            }
        }
    };
    $("#tm-text-color").spectrum(colorParams);
    $("#tm-text-subscript").mousedown(function() {
        let sel = document.getElementById("page-editor").contentDocument.getSelection();
        switch(sel.type) {
            case "Range":
                document.getElementById("page-editor").contentDocument.execCommand("subscript",false,null);
                break;
            case "Caret":
                let eProp = textTarget.css("vertical-align");
                if(eProp == "sub") {
                    textTarget.css("vertical-align", "none");
                } else {
                    textTarget.css("vertical-align", "sub");
                }
                break;
        }
    });
    $("#tm-text-superscript").mousedown(function() {
        let sel = document.getElementById("page-editor").contentDocument.getSelection();
        switch(sel.type) {
            case "Range":
                document.getElementById("page-editor").contentDocument.execCommand("superscript",false,null);
                break;
            case "Caret":
                let eProp = textTarget.css("vertical-align");
                if(eProp == "super") {
                    textTarget.css("vertical-align", "none");
                } else {
                    textTarget.css("vertical-align", "super");
                }
                break;
        }
    });
    $("#tm-text-removeformat").mousedown(function() {
        let sel = document.getElementById("page-editor").contentDocument.getSelection();
        switch(sel.type) {
            case "Range":
                document.getElementById("page-editor").contentDocument.execCommand("removeFormat",false,null);
                break;
            case "Caret":
                textTarget.removeAttr("style");
                textTarget.html(textTarget.text());
                break;
        }
    });
    //#endregion
    //#region SIZE
    $("#tm-text-size").on("keyup", updateFontSize);
    $("#tm-text-length").dropdown({ onChange: updateFontSize });
    $("#tm-text-increasesize").mousedown(function() {
        $("#tm-text-size").val(parseFloat($("#tm-text-size").val())+1);
        updateFontSize();
    });
    $("#tm-text-decreasesize").mousedown(function() {
        $("#tm-text-size").val(parseFloat($("#tm-text-size").val())-1);
        updateFontSize();
    });
    //#endregion
    //#region ALIGNMENT
    $("#tm-text-alignleft").mousedown(function() {
        let sel = document.getElementById("page-editor").contentDocument.getSelection();
        switch(sel.type) {
            case "Range":
                document.getElementById("page-editor").contentDocument.execCommand("justifyLeft",false,null);
                break;
            case "Caret":
                textTarget.css("text-align", "left");
                break;
        }
    });
    $("#tm-text-aligncenter").mousedown(function() {
        let sel = document.getElementById("page-editor").contentDocument.getSelection();
        switch(sel.type) {
            case "Range":
                document.getElementById("page-editor").contentDocument.execCommand("justifyCenter",false,null);
                break;
            case "Caret":
                textTarget.css("text-align", "center");
                break;
        }
    });
    $("#tm-text-alignright").mousedown(function() {
        let sel = document.getElementById("page-editor").contentDocument.getSelection();
        switch(sel.type) {
            case "Range":
                document.getElementById("page-editor").contentDocument.execCommand("justifyRight",false,null);
                break;
            case "Caret":
                textTarget.css("text-align", "right");
                break;
        }
    });
    $("#tm-text-alignjustify").mousedown(function() {
        let sel = document.getElementById("page-editor").contentDocument.getSelection();
        switch(sel.type) {
            case "Range":
                document.getElementById("page-editor").contentDocument.execCommand("justifyFull",false,null);
                break;
            case "Caret":
                textTarget.css("text-align", "justify");
                break;
        }
    });
    //#endregion
    $("#tm-text-add-img").mousedown(function() {
        galleryTarget = GalleryTarget.PageEditorImgOnText;
        elementSelection = window.getSelection();
        if(elementSelection && elementSelection.rangeCount > 0) {
            elementRange = elementSelection.getRangeAt(0).cloneRange();
        }
        shouldLoadStockPictures();
        $("#modal-gallery").modal("show");
    });
    //#endregion
    //#region INPUT
    $("#tm-input-name input").keyup(function() {
        inputTarget.attr("name", $(this).val());
    });
    $("#tm-input-placeholder input").keyup(function() {
        inputTarget.attr("placeholder", $(this).val());
    });
    //#endregion
}
function tmHidePageTab() {
    if($("#tm-page").hasClass("active")) {
        $("#tm-page").trigger("click");
    }
    if($("#tm-design").hasClass("active")) {
        $("#tm-design").trigger("click");
    }
}
function tmShowPageTab() {
    if(!$("#tm-page").hasClass("active")) {
        $("#tm-page").trigger("click");
    }
    if(!$("#tm-design").hasClass("active")) {
        $("#tm-design").trigger("click");
    }
}
function tmHideTabs() {
    if($("#tm-section").hasClass("active")) {
        $("#tm-section").removeClass("active");
    }
    if($("#tm-section+.content").hasClass("active")) {
        $("#tm-section+.content").removeClass("active");
    }
    $("#tm-section").hide();
    $("#tm-section+.content").hide();

    if($("#tm-input").hasClass("active")) {
        $("#tm-input").removeClass("active");
    }
    if($("#tm-input+.content").hasClass("active")) {
        $("#tm-input+.content").removeClass("active");
    }
    $("#tm-input").hide();
    $("#tm-input+.content").hide();

    if($("#tm-img").hasClass("active")) {
        $("#tm-img").removeClass("active");
    }
    if($("#tm-img+.content").hasClass("active")) {
        $("#tm-img+.content").removeClass("active");
    }
    $("#tm-img").hide();
    $("#tm-img+.content").hide();
    
    if($("#tm-icon").hasClass("active")) {
        $("#tm-icon").removeClass("active");
    }
    if($("#tm-icon+.content").hasClass("active")) {
        $("#tm-icon+.content").removeClass("active");
    }
    $("#tm-icon").hide();
    $("#tm-icon+.content").hide();

    if($("#tm-text").hasClass("active")) {
        $("#tm-text").removeClass("active");
    }
    if($("#tm-text+.content").hasClass("active")) {
        $("#tm-text+.content").removeClass("active");
    }
    $("#tm-text").hide();
    $("#tm-text+.content").hide();

    if($("#tm-link").hasClass("active")) {
        $("#tm-link").removeClass("active");
    }
    if($("#tm-link+.content").hasClass("active")) {
        $("#tm-link+.content").removeClass("active");
    }
    $("#tm-link").hide();
    $("#tm-link+.content").hide();

    if($("#tm-listitem").hasClass("active")) {
        $("#tm-listitem").removeClass("active");
    }
    if($("#tm-listitem+.content").hasClass("active")) {
        $("#tm-listitem+.content").removeClass("active");
    }
    $("#tm-listitem").hide();
    $("#tm-listitem+.content").hide();
}
// #endregion
// #region EDITOR HOOKS
function imgMouseEnter(e) {
    $(this).css(imgEditStyle);
    elementTarget = $(this);
    imgTarget = $(this);
    toolbarTarget = $("#tb-img");
    displayToolbar(imgTarget, toolbarTarget);
}
function imgMouseLeave(e) {
    $(this).css(imgEditStyleClear);
    $("#tb-img").hide();
}
function imgMouseClick() {
    elementTarget = $(this);
    imgTarget = $(this);
    img2Target = $(this);
    tmHidePageTab();
    if(img2Target.attr("src")) {
        $("#tm-img-preview img").attr("src",img2Target.attr("src"));
    }
    $("#tm-img-linkify").hide();
    if(!img2Target.parents("a").length) {
        $("#tm-img-linkify").show();
    }
    $("#tm-img-alt input").val(imgTarget.attr("alt"));
    $("#tm-img").show();
    $("#tm-img+.content").show();
    if(!$("#tm-img").hasClass("active")) {
        $("#tm-img").trigger("click");
    }
}
function videoMouseEnter(e) {
    $(this).css(baseEditStyle);
    elementTarget = $(this);
    videoTarget = $(this);
    toolbarTarget = $("#tb-video");
    displayToolbar(videoTarget, toolbarTarget);
    $("#tb-video-move").show();
    $("#tb-video-resize").show();
    $("#tb-video-transform").show();
}
function videoMouseLeave(e) {
    $(this).css(baseEditStyleClear);
    $("#tb-video").hide();
}
function iframeMouseEnter(e) {
    $(this).css(baseEditStyle);
    elementTarget = $(this);
    videoTarget = $(this);
    toolbarTarget = $("#tb-video");
    displayToolbar(videoTarget, toolbarTarget);
    $("#tb-video-move").hide();
    $("#tb-video-resize").hide();
    $("#tb-video-transform").hide();
}
function sliderMouseEnter(e) {
    $(this).css(baseEditStyle);
    elementTarget = $(this);
    sliderTarget = $(this);
    toolbarTarget = $("#tb-slider");
    displayToolbar(sliderTarget, toolbarTarget);
}
function sliderMouseLeave(e) {
    $(this).css(baseEditStyleClear);
    $("#tb-slider").hide();
}
function sectionMouseEnter() {
    $(this).css(baseEditStyle);
}
function sectionMouseLeave() {
    $(this).css(baseEditStyleClear);
}
function sectionMouseClick() {
    if(sectionTarget) return false;
    sectionTarget = $(this);
    tmHidePageTab();
    $("#tm-section").show();
    $("#tm-section+.content").show();
    if(!$("#tm-section").hasClass("active")) {
        $("#tm-section").trigger("click");
    }

    let sectionBgColor = sectionTarget.css("backgroundColor");
    if(sectionBgColor && sectionBgColor != "none") {
        $("#tm-section-bg-img-color input").spectrum("set", sectionBgColor);
    } else {
        $("#tm-section-bg-img-color input").spectrum("set", "");
    }

    let sectionBgImg = sectionTarget.css("backgroundImage");
    if(sectionBgImg && sectionBgImg.includes("url(")) {
        let sectionBgImgUrl = sectionBgImg.match(/\((.*?)\)/)[1].replace(/('|")/g,'');
        if(sectionBgImgUrl) {
            $("#tm-section-bg-img img").attr("src",sectionBgImgUrl);
            $("#tm-section-bg-img").show();
            $("#tm-section-bg-img-remove").show();
            $("#tm-section-bg-img-effect").show();
            $("#tm-section-bg-img-fullwidth").show();
            let isParallaxEffectSet = sectionTarget.css("backgroundAttachment") == "fixed";
            let isFullWidthSet = sectionTarget.css("backgroundSize") == "cover";
            $("#tm-section-bg-img-effect .ui.checkbox").checkbox(isParallaxEffectSet ? "set checked" : "set unchecked");
            $("#tm-section-bg-img-fullwidth .ui.checkbox").checkbox(isFullWidthSet ? "set checked" : "set unchecked");
        }
    } else {
        $("#tm-section-bg-img").hide();
        $("#tm-section-bg-img-remove").hide();
        $("#tm-section-bg-img-effect").hide();
        $("#tm-section-bg-img-fullwidth").hide();
    }
}
function textMouseEnter() {
    $(this).css(baseEditStyle);
}
function textMouseLeave() {
    if(!$(this).is(":focus")) {
        $(this).css(baseEditStyleClear);
    }
}
function textFocusIn() {
    $(this).css(baseEditStyle);
}
function textFocusOut() {
    $(this).css(baseEditStyleClear);
}
function textMouseClick() {
    if(textTarget) {
        switch(textTarget.prop("tagName")) {
            case "SPAN":
            case "B":
            case "I":
            case "U":
            case "PRE":
            case "BLOCKQUOTE":
            case "ABBR":
            case "ADDRESS":
            case "CAPTION":
            case "CITE":
            case "CODE":
            case "EM":
            case "LEGEND":
            case "Q":
            case "SMALL":
            case "STRONG":
            case "SUB":
            case "SUP":
                return false;
        }
    }
    textTarget = $(this);
    elementTarget = $(this);
    tmHidePageTab();
    $("#tm-text-linkify").hide();
    let sel = document.getElementById("page-editor").contentDocument.getSelection();
    if(sel.type == "Range" && !linkTarget) {
        $("#tm-text-linkify").show();
        $("#tm-text-linkify").off("mousedown");
        $("#tm-text-linkify").mousedown(function() {
            let sel = document.getElementById("page-editor").contentDocument.getSelection();
            if(sel.type == "Range" && !linkTarget) {
                let nodeID = parseInt(Math.random()*1000);
                let linkTag = `<a href='#' data-href='' data-node-id='${nodeID}'>${sel.toString()}</a>`;
                document.getElementById("page-editor").contentDocument.execCommand("insertHTML",false, linkTag);
                let linkElement = $("#page-editor").contents().find(`[data-node-id='${nodeID}']`);
                if(linkElement.length) {
                    linkElement.removeAttr("data-node-id");
                    linkElement.keydown(contentEditableEnter);
                    linkElement.mouseenter(linkMouseEnter);
                    linkElement.mouseleave(linkMouseLeave);
                    linkElement.focusin(linkFocusIn);
                    linkElement.focusout(linkFocusOut);
                    linkElement.click(linkMouseClick);
                    linkMouseClick.call(linkElement.get(0));
                }
            }
        });
    }
    $("#tm-text").show();
    $("#tm-text+.content").show();
    if(!$("#tm-text").hasClass("active")) {
        $("#tm-text").trigger("click");
    }
    $("#tm-text-color").spectrum("set", textTarget.css("color"));

    let fontSize = textTarget.get(0).style.fontSize || textTarget.css("fontSize");
    let fontSizeRegex = /(\d*\.?\d+)(px|pt|pc|cm|mm|in|em|ex|ch|rem|vh|vw|vmin|vmax|%)/i;
    if(fontSize) {
        let fontSizeMatch = fontSize.match(fontSizeRegex);
        if(fontSizeMatch.length == 3) {
            let fontSizeNumber = fontSizeMatch[1];
            let fontSizeLength = fontSizeMatch[2];
            $("#tm-text-size").val(fontSizeNumber);
            $("#tm-text-length").dropdown({ onChange: function() {} });
            $("#tm-text-length").dropdown("set selected", fontSizeLength);
            $("#tm-text-length").dropdown({ onChange: updateFontSize });
        }
    }
}
function iconMouseEnter() {
    $(this).css(baseEditStyle);
}
function iconMouseLeave() {
    if(!$(this).is(":focus")) {
        $(this).css(baseEditStyleClear);
    }
}
function iconFocusIn() {
    $(this).css(baseEditStyle);
}
function iconFocusOut() {
    $(this).css(baseEditStyleClear);
}
function iconMouseClick() {
    iconTarget = $(this);
    if(iconTarget.hasClass("fas") || 
        iconTarget.hasClass("far") || 
        iconTarget.hasClass("fal") || 
        iconTarget.hasClass("fad") || 
        iconTarget.hasClass("fab")) {
        elementTarget = $(this);
        tmHidePageTab();
        $("#tm-icon").show();
        $("#tm-icon+.content").show();
        if(!$("#tm-icon").hasClass("active")) {
            $("#tm-icon").trigger("click");
        }        
        $("#tm-icon-color").spectrum("set", iconTarget.css("color"));
        $("#tm-icon-preview").attr("class",iconTarget.attr("class"));
        
        let fontSize = iconTarget.get(0).style.fontSize || iconTarget.css("fontSize");
        let fontSizeRegex = /(\d*\.?\d+)(px|pt|pc|cm|mm|in|em|ex|ch|rem|vh|vw|vmin|vmax|%)/i;
        if(fontSize) {
            let fontSizeMatch = fontSize.match(fontSizeRegex);
            if(fontSizeMatch.length == 3) {
                let fontSizeNumber = fontSizeMatch[1];
                let fontSizeLength = fontSizeMatch[2];
                $("#tm-icon-size").val(fontSizeNumber);
                $("#tm-icon-length").dropdown({ onChange: function() {} });
                $("#tm-icon-length").dropdown("set selected", fontSizeLength);
                $("#tm-icon-length").dropdown({ onChange: updateIconSize });
            }
        }
    }
}
function linkMouseEnter() {
    $(this).css(baseEditStyle);
}
function linkMouseLeave() {
    if(!$(this).is(":focus")) {
        $(this).css(baseEditStyleClear);
    }
}
function linkFocusIn() {
    $(this).css(baseEditStyle);
}
function linkFocusOut() {
    $(this).css(baseEditStyleClear);
}
function linkMouseClick(e) {
    if(e) {
        e.preventDefault();
    }
    linkTarget = $(this);
    elementTarget = $(this);
    tmHidePageTab();

    $("#tm-link-url input").val(linkTarget.attr("data-href"));
    $("#tm-link-newtab .ui.checkbox").checkbox((linkTarget.attr("target") == "_blank") ? "set checked" : "set unchecked");
    $("#tm-text-linkify").hide();


    $("#tm-link").show();
    $("#tm-link+.content").show();
    if(!$("#tm-link").hasClass("active")) {
        $("#tm-link").trigger("click");
    }
    if(linkTarget.text()) {
        textMouseClick.call(this);
    }
}
function listItemMouseEnter() {
    $(this).css(baseEditStyle);
}
function listItemMouseLeave() {
    if(!$(this).is(":focus")) {
        $(this).css(baseEditStyleClear);
    }
}
function listItemMouseClick() {
    if(listItemTarget) return false;
    listItemTarget = $(this);
    elementTarget = $(this);
    tmHidePageTab();
    $("#tm-listitem").show();
    $("#tm-listitem+.content").show();
    if(!$("#tm-listitem").hasClass("active")) {
        $("#tm-listitem").trigger("click");
    }
    if(listItemTarget.text()) {
        textMouseClick.call(this);
    }
}
function listItemFocusIn() {
    $(this).css(baseEditStyle);
}
function listItemFocusOut() {
    $(this).css(baseEditStyleClear);
}
function inputMouseClick() {
    inputTarget = $(this);
    elementTarget = $(this);
    tmHidePageTab();

    $("#tm-input-name input").val(inputTarget.attr("name"));
    $("#tm-input-placeholder input").val(inputTarget.attr("placeholder"));

    $("#tm-input").show();
    $("#tm-input+.content").show();
    if(!$("#tm-input").hasClass("active")) {
        $("#tm-input").trigger("click");
    }
}
function contentEditableEnter(e) {
    if (e && e.keyCode === 13) {
        let iframeDocument = document.getElementById("page-editor").contentDocument;
        let fragment = iframeDocument.createDocumentFragment();
        let brElement = iframeDocument.createElement('br');
        fragment.appendChild(brElement);
        let range = iframeDocument.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(fragment);
        range = iframeDocument.createRange();
        range.setStartAfter(brElement);
        range.collapse(true);
        let sel = iframeDocument.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return false;
    }
}
// #endregion
// #region EDITOR ENGINES
function loadPageEditor() {
    iFrameReady(document.getElementById("page-editor"), wirePageEditor);
}
function wirePageEditor() {
    if(!_s.isInitialCodeRetrieved) {
        _s.initialCode = getPageCode();
        _s.isInitialCodeRetrieved = true;
    }
    // #region TOOLBAR SCROLL FIX
    let iframe = $("#page-editor").contents();
    $(iframe).off("scroll");
    $(iframe).scroll(function() {
        if($("#tb-img").css("display") != "none") {
            displayToolbar(imgTarget, $("#tb-img"));
        }
        if($("#tb-video").css("display") != "none") {
            displayToolbar(videoTarget, $("#tb-video"));
        }
        if($("#tb-slider").css("display") != "none") {
            displayToolbar(sliderTarget, $("#tb-slider"));
        }
    });
    // #endregion
    // #region TOOLMENU SETUP
    if(!$("#tm-page").hasClass("active")) {
        $("#tm-page").trigger("click");
    }
    if(!$("#tm-design").hasClass("active")) {
        $("#tm-design").trigger("click");
    }
    tmHideTabs();
    // #region PAGE TAB SETUP
    let pageName = $("#page-editor").contents().find("meta[name='page']").attr("content");
    $("#tm-page-name input").val(pageName);
    let pageTitle = $("#page-editor").contents().find("title").html();
    $("#tm-page-title input").val(pageTitle);
    let pageDescription = $("#page-editor").contents().find("meta[name='description']").attr("content");
    $("#tm-page-description input").val(pageDescription);
    let pageIcon = $("#page-editor").contents().find("link[rel='icon']").attr("href");
    if(pageIcon) {
        $("#web-settings-icon img").css("display", "block");
        $("#web-settings-icon img").attr("src", pageIcon);
    }
    // #endregion
    // #region DESIGN TAB SETUP
    for(let i=1;i<10;i++) {
        let propName = `--color${i}`;
        let propVal = getComputedStyle(document.getElementById("page-editor").contentDocument.documentElement).getPropertyValue(propName);
        if(propVal && !$(`#tm-design-color${i}`).length) {
            // #region ADD CUSTOM FIELD
            let propField = `<div class="field" id="tm-design-color${i}">`;
            propField += `<label>Color ${i}</label>`;
            propField += `<input type="text" /></div>`;
            $("#tm-design+.content .ui.form").append(propField);
            // #endregion
            propVal = propVal.trim();
            colorParams = {
                color: propVal,
                preferredFormat: "hex",
                showInput: true,
                showPalette: true,
                showAlpha: true,
                allowEmpty: true,
                palette,
                move: function(color) {
                    if(color) {
                        document.getElementById("page-editor").contentDocument.documentElement.style.setProperty(propName,color.toHexString());
                    } else {
                        document.getElementById("page-editor").contentDocument.documentElement.style.setProperty(propName,"");
                    }
                }
            };
            $(`#tm-design-color${i} input`).spectrum(colorParams);
        } else {
            break;
        }
    }
    // #endregion    
    // #endregion
    // #region ELEMENT EDITING
    let _p = $("#page-editor").contents().find("body");
    _p.off("mousedown");
    _p.mousedown(function() {
        elementTarget = null;
        imgTarget = null;
        img2Target = null;
        videoTarget = null;
        textTarget = null;
        linkTarget = null;
        sectionTarget = null;
        sliderTarget = null;
        listItemTarget = null;
        inputTarget = null;
        iconTarget = null;
        tmHideTabs();
    });
    // #region Text
    _p.find("*").each(function() {
        let isTextNode = $(this).text() && !$(this).children().length;
        let isTextTag = textTags.split(",").includes(this.tagName.toLowerCase());
        if((isTextNode || isTextTag) && !$(this).attr("contenteditable")) {
            $(this).attr("contenteditable","true");
            $(this).off("keydown");
            $(this).keydown(contentEditableEnter);

            $(this).off("mouseenter mouseleave focusin focusout click");
            $(this).mouseenter(textMouseEnter);
            $(this).focusin(textFocusIn);
            $(this).focusout(textFocusOut);
            $(this).mouseleave(textMouseLeave);
            $(this).click(textMouseClick);
        }
    });

    // #endregion
    // #region Image
    _p.find(imgTag).off("mouseenter mouseleave click");
    _p.find(imgTag).mouseenter(imgMouseEnter);
    _p.find(imgTag).mouseleave(imgMouseLeave);
    _p.find(imgTag).click(imgMouseClick);
    // #endregion
    // #region Icon
    _p.find(iconTag).off("mouseenter mouseleave click");
    _p.find(iconTag).mouseenter(iconMouseEnter);
    _p.find(iconTag).mouseleave(iconMouseLeave);
    _p.find(iconTag).click(iconMouseClick);
    // #endregion
    // #region Video
    _p.find(videoTags).off("mouseenter mouseleave");
    _p.find(videoTags).mouseenter(videoMouseEnter);
    _p.find(videoTags).mouseleave(videoMouseLeave);
    // #endregion
    // #region Link
    _p.find(linkTag).off("mouseenter mouseleave focusin focusout click");
    _p.find(linkTag).each(function() {
        let href = $(this).attr("href");
        $(this).attr("data-href", href);
        $(this).attr("href", "#");
    });
    _p.find(linkTag).mouseenter(linkMouseEnter);
    _p.find(linkTag).mouseleave(linkMouseLeave);
    _p.find(linkTag).focusin(linkFocusIn);
    _p.find(linkTag).focusout(linkFocusOut);
    _p.find(linkTag).click(linkMouseClick);

    // #endregion
    // #region List Item
    _p.find(listItemTag).off("mouseenter mouseleave focusin focusout click");
    _p.find(listItemTag).mouseenter(listItemMouseEnter);
    _p.find(listItemTag).mouseleave(listItemMouseLeave);
    _p.find(listItemTag).focusin(listItemFocusIn);
    _p.find(listItemTag).focusout(listItemFocusOut);
    _p.find(listItemTag).click(listItemMouseClick);
    // #endregion
    // #region Slider
    _p.find(sliderTag).off("mouseenter mouseleave");
    _p.find(sliderTag).mouseenter(sliderMouseEnter);
    _p.find(sliderTag).mouseleave(sliderMouseLeave);
    // #endregion
    // #region Section
    _p.find(sectionTags).off("mouseenter mouseleave click");
    _p.find(sectionTags).mouseenter(sectionMouseEnter);
    _p.find(sectionTags).mouseleave(sectionMouseLeave);
    _p.find(sectionTags).click(sectionMouseClick);
    // #endregion
    // #region Input
    _p.find(inputTags).off("click");
    _p.find(inputTags).click(inputMouseClick);
    // #endregion
    // #endregion
    $(".ui.main.page.dimmer").removeClass("active");
}
function cleanPageEditor() {
    let _p = $("#page-editor").contents().find("body");
    _p.find("*").each(function() {
        if(!$(this).attr("style")) {
            $(this).removeAttr("style");
        }
        if($(this).attr("contenteditable")) {
            $(this).removeAttr("contenteditable");
        }
    });
    _p.find(linkTag).each(function() {
        let href = $(this).attr("data-href");
        $(this).attr("href", href);
        $(this).removeAttr("data-href");
    });
}
function wireCodeEditor() {
    let monacoTheme;
    switch(mainCustomer.CustomerTheme) {
        case "neonblue":
        case "neonred":
        case "neongreen":
            monacoTheme = "vs-dark";
            break;
        case "standard":
        case "light":
        default:
            monacoTheme = "vs-light";
            break;
    }
    _s.codeEditor = monaco.editor.create(document.getElementById('code-editor'), {
        value: getPageCode(),
        language: 'html',
        theme: monacoTheme
    });
}
// #endregion
// #region MAIN METHODS
function renderDirectory(folder) {
    let row = `<li class='sub-link folder-link'>`;

    row += `<div class='linkAddQk'><a href='#' class='addWebPageQk' data-id='${folder.root}'><i class='icon plus'></i></a></div>`;
    row += `<a data-id='${folder.root}' href='#' title='${folder.name}'>`;

    let tabs = folder.root.split("/").length - 2;
    for(let tabI=0;tabI<tabs;tabI++) {
        row += "&nbsp;";
    }

    row += `<i class='icon folder'></i><span>${escapeHtml(folder.name)}</span>`;
    row += `</a></li>`;

    row += `<div class='submenu' data-id='${folder.root}'>`;
    folder.folders.forEach(function(innerFolder) {
        row += renderDirectory(innerFolder);
    });
    folder.files.forEach(function(v,i) {
        row += `<li class='sub-link page-link'>`;
        let menuPageName = getPageName(v.name,v.page);
        row += `<a href='#' data-url='${v.path}/${v.name}' data-file='${v.name}' data-modified='${v.modified}' title='${v.name}'>`;

        let tabs = v.path.split("/").length - 1;
        for(let tabI=0;tabI<tabs;tabI++) {
            row += "&nbsp;";
        }
        row += `<i class='icon file'></i><span>${escapeHtml(menuPageName)}</span>`;
        row += `</a></li>`;
    });
    row += `</div>`;
    return row;
}
function renderMenu() {
    let row = '';
    _s.folders.forEach(function(folder) {
        row += renderDirectory(folder);
    });
    _s.files.forEach(function(v,i) {
        row += `<li class='sub-link page-link'>`;
        let indexId = "";
        if(v.name == "index.html") {
            indexId = "id='page-link-index' ";
        }
        let menuPageName = getPageName(v.name,v.page);
        row += `<a href='#' ${indexId}data-url='${v.path}/${v.name}' data-file='${v.name}' data-modified='${v.modified}' title='${v.name}'>`;
        row += `<i class='icon file'></i><span>${escapeHtml(menuPageName)}</span>`;
        row += `</a></li>`;
    });
    row += "<li class='sub-link'><a href='#' id='web-add-page'><i class='icon add'></i><span>Add Web Page</span></a></li>";
    row += "<li class='sub-link'><a href='#' id='web-add-folder'><i class='icon add'></i><span>Add Web Folder</span></a></li>";
    $("#nav-website-list").append(row);

    $("#nav-website-list li").hover(function() {
        $(this).find(".linkAddQk").show();
    }, function() {
        $(this).find(".linkAddQk").hide();
    });
    $("#nav-website-list li .addWebPageQk").click(function() {
        let folderSelection = $(this).attr("data-id");
        $("#page-add-folder .ui.dropdown").dropdown("set selected", folderSelection);
        if(mainCustomer.DomainName) {
            $("#page-add-url label.ui.label").text(`${mainCustomer.DomainName}${folderSelection}/`);
        }
        // $("#modal-page-add").modal({ autofocus: false });
        $("#modal-page-add").modal("show");
        $("#modal-page-add").off("keyup");
        $("#modal-page-add").keyup(function(event) {
            if(event.which == 13) {
                $("#modal-page-add-save").trigger("click");
            }
        });
    });
    $("#nav-website-list").slideDown(200);
}
function renderPage() {
    switch(_s.mode) {
        case Mode.None:
            $(".ui.main.page.dimmer").addClass("active");
            $("#page-editor").remove();
            $(".ui.segment.page").append(`<iframe id='page-editor' src='' sandbox='${sandboxParams}'></iframe>`);
            // $(".ui.segment.page").append(`<iframe id='page-editor' src=''></iframe>`);
            $(".ui.segment.page").show();
            $(".ui.segment.code").hide();
            $(".ui.segment.diff").hide();
            $("#page-editor").attr("src", _s.pageUrl + '?ts=' + Math.round(Math.random() * 10000000));
            loadPageEditor();
            _s.mode = Mode.Page;
            break;
        case Mode.Page:
            $(".ui.main.page.dimmer").addClass("active");
            $(".ui.segment.diff").hide();
            $(".ui.segment.code").hide();
            $(".ui.segment.page").show();
            let vdom = document.createElement('html');
            vdom.innerHTML = _s.codeEditor.getValue();
            // REPLACE HEAD IF CHANGED
            let newHead = vdom.getElementsByTagName("head")[0].innerHTML;
            let oldHead = document.getElementById("page-editor").contentDocument.head.innerHTML;
            if(newHead != oldHead) {
                document.getElementById("page-editor").contentDocument.documentElement.getElementsByTagName("head")[0].innerHTML = newHead;
                console.log("Replaced <head>");
            }
            // REPLACE BODY IF CHANGED
            let newBody = vdom.getElementsByTagName("body")[0].innerHTML;
            let oldBody = document.getElementById("page-editor").contentDocument.body.innerHTML;
            if(newBody != oldBody) {
                document.getElementById("page-editor").contentDocument.documentElement.getElementsByTagName("body")[0].innerHTML = newBody;
                console.log("Replaced <body>");
            }
            // document.getElementById("page-editor").contentDocument.documentElement.innerHTML = _s.codeEditor.getValue();
            loadPageEditor();
            // wirePageEditor(); // not loadPageEditor(); ?
            break;
        case Mode.Code:
            $(".ui.segment.page").hide();
            $(".ui.segment.code").show();
            $(".ui.segment.diff").hide();
            if(!_s.codeEditor) {
                wireCodeEditor();
            } else {
                _s.codeEditor.setValue(getPageCode());
            }
            break;
    }
}
function setupCodeUI() {
    $("#web-diff").show();
    $("#web-code").hide();
    $("#web-page").show();
    document.documentElement.style.setProperty('--width-center', "calc(100% - 180px)");
    $(".ui-body>.ui-right").hide();
}
function setupDiffUI() {
    $("#web-diff").hide();
    $("#web-code").show();
    $("#web-page").show();
    $(".ui-body>.ui-right").hide();
}
function setupPageUI() {
    $("#web-diff").hide();
    $("#web-code").show();
    $("#web-page").hide();
    document.documentElement.style.setProperty('--width-center', "calc(100% - 410px)");
    $(".ui-body>.ui-right").show();
}
function wireUI() {
    // #region LEFT MENU
    $(".folder-link > a").each(function() {
        $(this).click(function() {
            let folderPath = $(this).attr("data-id");
            $(`.submenu[data-id='${folderPath}']`).toggle("fast");
        });
    });
    $(".page-link > a").click(async function() {
        _s.mode = Mode.None;
        _s.isInitialCodeRetrieved = false;
        _s.pageFile = $(this).attr("data-url");
        _s.pageUrl = `web/${mainCustomer.SubDomain}${_s.pageFile}`;
        let pageName = $(this).find("span").text();
        if(mainCustomer.DomainName) {
            $("#tm-page-url input").val(`${mainCustomer.DomainName}${_s.pageFile == "/index.html" ? "" : _s.pageFile}`);
        }
        $("#title").text(pageName);
        setupPageUI();
        renderPage();
    });
    $("#web-add-page").click(function() {
        $("#page-add-folder .ui.dropdown").dropdown("set selected", "/");
        if(mainCustomer.DomainName) {
            $("#page-add-url label.ui.label").text(`${mainCustomer.DomainName}/`);
        }
        $("#modal-page-add").modal("show");
        $("#modal-page-add").off("keyup");
        $("#modal-page-add").keyup(function(event) {
            if(event.which == 13) {
                $("#modal-page-add-save").trigger("click");
            }
        });
    });
    $("#web-add-folder").click(function() {
        $("#modal-folder-add").modal("show");
        $("#modal-folder-add").off("keyup");
        $("#modal-folder-add").keyup(function(event) {
            if(event.which == 13) {
                $("#modal-folder-add-save").trigger("click");
            }
        });
    });
    // #region CONTEXTMENU
    $("#blocker").mousedown(function() {
        $("#contextmenu-file").hide();
        $("#contextmenu-folder").hide();
        $("#blocker").hide();
    });
    $(".page-link > a").contextmenu(function(e) {
        e.preventDefault();
        if(e.target) {
            let menuLink;
            switch(e.target.tagName) {
                case "A":
                    menuLink = $(e.target);
                    break;
                case "SPAN":
                case "I":
                    menuLink = $(e.target).parents(".page-link").find("a");
                    break;
                default:
                    return false;
            }
            $("#blocker").css("display","block");
            let pageName = menuLink.find("span").text();
            $("#contextmenu-file > .title span").text(pageName);
            let pageUrl = menuLink.attr("data-url");
            $("#contextmenu-file").attr("data-url", pageUrl);
            let pageModified = menuLink.attr("data-modified");
            $("#contextmenu-file > .data .modified").text(pageModified);

            $("#contextmenu-file").css("top", e.pageY);
            $("#contextmenu-file").css("left", e.pageX);
            $("#contextmenu-file").hide();
            $("#contextmenu-file").slideDown("fast");
        }
    });
    $("#contextmenu-file > .links > li > .copy").click(function() {
        let pageUrl = $("#contextmenu-file").attr("data-url");
        if(mainCustomer.DomainName) {
            copyTextToClipboard(`${mainCustomer.DomainName}${pageUrl}`);
        }
        $("#blocker").trigger("mousedown");
    });
    $("#contextmenu-file > .links > li > .remove").click(async function() {
        $("#blocker").trigger("mousedown");
        let pageUrl = $("#contextmenu-file").attr("data-url");
        let payload = {
            file: pageUrl,
            st: $("#st").val()
        }
        $(".ui.main.page.dimmer").addClass("active");
        let resultRaw = await fetch(builderAPI, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });
        let result = await resultRaw.json();
        $(".ui.main.page.dimmer").removeClass("active");
        if(parseInt(result.success)) {
            $(`a[data-url='${pageUrl}']`).parents(".page-link").remove();
            toastr.success(toastRemoveSuccess);
            location.href = "/builder";
        } else {
            toastr.error(toastRemoveError);
        }
    });
    $(".folder-link > a").contextmenu(function(e) {
        e.preventDefault();
        if(e.target) {
            let menuLink;
            switch(e.target.tagName) {
                case "A":
                    menuLink = $(e.target);
                    break;
                case "SPAN":
                case "I":
                    menuLink = $(e.target).parents(".page-link").find("a");
                    break;
                default:
                    return false;
            }
            $("#blocker").css("display","block");
            let folderName = menuLink.find("span").text();
            $("#contextmenu-folder > .title span").text(folderName);
            let folderRoot = menuLink.attr("data-id");
            $("#contextmenu-folder").attr("data-id", folderRoot);

            $("#contextmenu-folder").css("top", e.pageY);
            $("#contextmenu-folder").css("left", e.pageX);
            $("#contextmenu-folder").hide();
            $("#contextmenu-folder").slideDown("fast");
        }
    });
    $("#contextmenu-folder > .links > li > .add").click(function() {
        let folderRoot = $("#contextmenu-folder").attr("data-id");
        $("#page-add-folder .ui.dropdown").dropdown("set selected", folderRoot);
        if(mainCustomer.DomainName) {
            $("#page-add-url label.ui.label").text(`${mainCustomer.DomainName}${folderRoot}/`);
        }
        $("#blocker").trigger("mousedown");
        $("#modal-page-add").modal("show");
        $("#modal-page-add").off("keyup");
        $("#modal-page-add").keyup(function(event) {
            if(event.which == 13) {
                $("#modal-page-add-save").trigger("click");
            }
        });
    });
    $("#contextmenu-folder > .links > li > .remove").click(async function() {
        $("#blocker").trigger("mousedown");
        let folderRoot = $("#contextmenu-folder").attr("data-id");
        let payload = {
            path: `/${folderRoot}`
        }
        $(".ui.main.page.dimmer").addClass("active");
        let resultRaw = await fetch(folderCabAPI, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });
        let result = await resultRaw.json();
        $(".ui.main.page.dimmer").removeClass("active");
        if(parseInt(result.success)) {
            let folderItem = $(`a[data-id='${folderRoot}']`).parents(".folder-link");
            folderItem.next(".submenu").remove();
            folderItem.remove();
            toastr.success(toastFolderRemoveSuccess);
            location.href = "/builder";
        } else {
            toastr.error(toastFolderRemoveError);
        }
    });
    // #endregion
    // #endregion
    // #region TOP BAR
    $("#web-goto").click(function(e) {
        e.preventDefault();
        if(mainCustomer.DomainName) {
            window.open(`https://${mainCustomer.DomainName}${_s.pageFile == "/index.html" ? "" : _s.pageFile.replace(".html","")}`);
        }
    });
    $("#web-settings").click(function() {
        $("#modal-web-settings").modal("show");
    });
    $("#web-diff").click(function() {
        _s.mode = Mode.Diff;
        $(".ui.segment.code").hide();
        $(".ui.segment.diff").show();
        setupDiffUI();
        let originalModel = monaco.editor.createModel(_s.initialCode, "text/html");
        let modifiedModel = monaco.editor.createModel(_s.codeEditor.getValue(), "text/html");
        if(!_s.diffEditor) {
            _s.diffEditor = monaco.editor.createDiffEditor(document.getElementById("diff-editor"));
        }
        _s.diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel
        });
    });
    $("#web-code").click(function() {
        switch(_s.mode) {
            case Mode.Page:
                cleanPageEditor();
                _s.mode = Mode.Code;
                setupCodeUI();
                renderPage();
                break;
            case Mode.Diff:
                _s.mode = Mode.Code;
                _s.codeEditor.setValue(_s.diffEditor.getModifiedEditor().getValue());
                setupCodeUI();
                $(".ui.segment.code").show();
                $(".ui.segment.diff").hide();
                break;
        }
    });
    $("#web-page").click(function() {
        switch(_s.mode) {
            case Mode.Diff:
                _s.codeEditor.setValue(_s.diffEditor.getModifiedEditor().getValue());
                break;
        }
        _s.mode = Mode.Page;
        setupPageUI();
        renderPage();
    });
    $("#web-save").click(async function() {
        // #region GET CONTENT CODE
        let pageCode;
        switch(_s.mode) {
            case Mode.Page:
                cleanPageEditor();
                pageCode = getPageCode();
                wirePageEditor();
                break;
            case Mode.Code:
            case Mode.Diff:
                pageCode = _s.codeEditor.getValue();
                let lcPageCode = pageCode.toLowerCase();
                if(lcPageCode.indexOf("<html>") > -1 || 
                lcPageCode.indexOf("</html>") > -1 || 
                lcPageCode.indexOf("<!doctype") > -1) {
                    toastr.options.timeOut = 13000;
                    toastr.info(enclosingTagsInfoContent, enclosingTagsInfoTitle);
                    toastr.options.timeOut = 5000;
                }
                break;
        }
        _s.initialCode = pageCode;
        let content = `<!DOCTYPE html>\n<html>${pageCode}\n</html>`;
        // #endregion
        // #region ADD HEAD TAGS IF MISSING (META.PAGE, META.DESC, TITLE)
        if(_s.mode == Mode.Page) {
            let pageTitleTag = content.indexOf("<title>");
            let pageNameTag1 = content.indexOf("<meta name='page'");
            let pageNameTag2 = content.indexOf(`<meta name="page"`);
            let pageDescriptionTag1 = content.indexOf("<meta name='description'");
            let pageDescriptionTag2 = content.indexOf(`<meta name="description"`);
            let headStartTagString = "<head>";
            let headStartTagStartPos = content.indexOf(headStartTagString);
            let headStartTagEndPos = 0;
            if(headStartTagStartPos > -1) {
                headStartTagEndPos = headStartTagStartPos + headStartTagString.length;
            }
            
            if(pageDescriptionTag1 == -1 && pageDescriptionTag2 == -1 && headStartTagEndPos > 0) {
                let pageDescriptionVal = $("#tm-page-description input").val();
                let genPageDescriptionTag = `\n    <meta name="description" content="${pageDescriptionVal}">`;
                content = [content.slice(0, headStartTagEndPos), genPageDescriptionTag, content.slice(headStartTagEndPos)].join('');
            }
            if(pageNameTag1 == -1 && pageNameTag2 == -1 && headStartTagEndPos > 0) {
                let pageNameVal = $("#tm-page-name input").val();
                let genPageNameTag = `\n    <meta name="page" content="${pageNameVal}">`;
                content = [content.slice(0, headStartTagEndPos), genPageNameTag, content.slice(headStartTagEndPos)].join('');
            }
            if(pageTitleTag == -1 && headStartTagEndPos > 0) {
                let pageTitleVal = $("#tm-page-title input").val();
                let genPageTitleTag = `\n    <title>${pageTitleVal}</title>`;
                content = [content.slice(0, headStartTagEndPos), genPageTitleTag, content.slice(headStartTagEndPos)].join('');
            }
        }
        // #endregion
        // #region CODE VALIDATION
        // #region SINGLE HEADER TAG
        let headerStartTag = "<header";
        let headerStartTagPos = content.indexOf(headerStartTag);
        if(headerStartTagPos > -1) {
            let headerStartTagPos2 = content.indexOf(headerStartTag, headerStartTagPos + headerStartTag.length);
            if(headerStartTagPos2 > -1) {
                toastr.error(toastHeaderTagValidationError);
                return false;
            }
        }
        // #endregion
        // #region SINGLE FOOTER TAG
        let footerStartTag = "<footer";
        let footerStartTagPos = content.indexOf(footerStartTag);
        if(footerStartTagPos > -1) {
            let footerStartTagPos2 = content.indexOf(footerStartTag, footerStartTagPos + footerStartTag.length);
            if(footerStartTagPos2 > -1) {
                toastr.error(toastFooterTagValidationError);
                return false;
            }
        }
        // #endregion
        // #endregion
        // #region PASS TO API
        let cssVars = [];
        for(let i=1;i<10;i++) {
            let propName = `--color${i}`;
            let propVal = getComputedStyle(document.getElementById("page-editor").contentDocument.documentElement).getPropertyValue(propName);
            if(propVal) {
                propVal = propVal.trim();
                cssVars.push({ name: propName, value: propVal });
            } else {
                break;
            }
        }
        let data = {
            file: _s.pageFile,
            content,
            st: $("#st").val(),
            cssVars
        }
        $(".ui.main.page.dimmer").addClass("active");
        let req = await fetch(builderAPI, {
            method: 'PUT',
            headers: jsonHeaders,
            body: JSON.stringify(data)
        });
        let res = await req.json();
        $(".ui.main.page.dimmer").removeClass("active");
        if(parseInt(res.success)) {
            toastr.success(toastSaveSuccess);
        } else {
            toastr.error(toastSaveError);
        }
        //#endregion
    });
    // #endregion
    // #region TOOLS
    wireToolMenu();
    wireToolbar();
    wireGallery();
    wireVideos();
    // #endregion
    // #region ELEMENT HOVER STYLES
    _s.appPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
    baseEditStyle = {
        outline: `1px solid ${_s.appPrimaryColor}`
    };
    baseEditStyleClear = {
        outline: ""
    }
    imgEditStyle = {
        ...baseEditStyle,
        cursor: "pointer"
    };
    imgEditStyleClear = {
        ...baseEditStyleClear,
        cursor: ""
    }
    // #endregion
    // #region ADD WEB PAGE
    if(mainCustomer.DomainName) {
        $("#page-add-url label.ui.label").text(`${mainCustomer.DomainName}/`);
    }
    let hasIndexPage = false;
    _s.files.forEach(function(v) {
        let pageName = getPageName(v.name,v.page);
        let option = `<div class="item" data-value="${v.name}">${escapeHtml(pageName)}</div>`;
        // $("#page-add-template .ui.dropdown .menu").append(option);
        $("#page-add-template .ui.dropdown .menu .header.website").after(option);
        if(v.name == "index.html") {
            hasIndexPage = true;
        }
    });
    _s.templateDirectory.forEach(function(v) {
        let pageName = getPageName(v.name,v.page);
        let option = `<div class="item" data-value="//${v.name}">${escapeHtml(pageName)}</div>`;
        $("#page-add-template .ui.dropdown .menu .header.template").after(option);
    });
    _s.folders.forEach(function(v) {
        let option = `<div class="item" data-value="/${v.name}">${escapeHtml(v.name)}</div>`;
        $("#page-add-folder .ui.dropdown .menu").append(option);
    });
    if(_s.folders.length) {
        $("#page-add-folder .ui.dropdown").dropdown({
            onChange: function(value, text) {
                if(value !== "/") {
                    value += "/";
                }
                if(mainCustomer.DomainName) {
                    $("#page-add-url label.ui.label").text(`${mainCustomer.DomainName}${value}`);
                }
            }
        });
    } else {
        $("#page-add-folder").hide();
    }
    $("#page-add-template .ui.dropdown").dropdown();
    if(hasIndexPage) {
        $("#page-add-template .ui.dropdown").dropdown("set selected", "index.html");
    }
    $("#modal-page-add-save").click(async function() {
        $("#modal-page-add .ui.form").removeClass("error");
        $("#modal-page-add .ui.form").removeClass("warning");
        let url = $("#page-add-url input").val();
        let folder = $("#page-add-folder .ui.dropdown").dropdown("get value");
        let pageTemplate = $("#page-add-template .ui.dropdown").dropdown("get value");
        let tmplTemplate = "";
        if(url.includes(".html")) {
            url = url.replace(".html","");
        }
        if(!isValidString(url,true,true)) {
            $("#modal-page-add .ui.form").addClass("error");
            return false;
        }
        if(folder == "/") {
            folder = "";
        }
        if(pageTemplate.startsWith("//")) {
            tmplTemplate = pageTemplate.substring(1);
        }
        let payload = {
            url,
            folder,
            pageTemplate,
            tmplTemplate,
            st: $("#st").val()
        }
        $(".ui.main.page.dimmer").addClass("active");
        let resultRaw = await fetch(builderAPI, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify(payload)
        });
        let result = await resultRaw.json();
        $(".ui.main.page.dimmer").removeClass("active");
        switch(parseInt(result.success)) {
            case 1:
                location.href = `/builder?page=${folder}/${url}`;
                break;
            case 2:
                $("#modal-page-add .ui.form").addClass("warning");
                break;
            case 0:
                toastr.error(w_server_error_h);
                console.log(res.errorMsg);
                break;
        }
    });
    // #endregion
    // #region ADD WEB FOLDER
    $("#modal-folder-add-save").click(async function() {
        $("#modal-folder-add .ui.form").removeClass("error");
        $("#modal-folder-add .ui.form").removeClass("warning");
        let folder = $("#folder-add-name input").val();
        if(!folder) {
            $("#modal-folder-add .ui.form").addClass("error");
            return false;
        }
        let payload = {
            path: "",
            folder,
            webfolder: 1
        }
        $(".ui.main.page.dimmer").addClass("active");
        let resultRaw = await fetch(folderCabAPI, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify(payload)
        });
        let result = await resultRaw.json();
        $(".ui.main.page.dimmer").removeClass("active");
        if(parseInt(result.success)) {
            location.href = "/builder";
        } else {
            $("#modal-folder-add .ui.form").addClass("warning");
        }
    });
    // #endregion
    // #region WEB SETTINGS
    $("#modal-web-settings .ui.accordion").accordion();
    $("#web-settings-icon-btn").click(function() {
        galleryTarget = GalleryTarget.Favicon;
        shouldLoadStockPictures();
        $("#modal-gallery").modal("show");
    });
    $("#modal-web-settings-save").click(async function() {
        let title = $("#web-settings-title input").val();
        let snippet = $("#web-settings-snippet textarea").val();
        let data = {
            title,
            favicon,
            snippet,
            st: $("#st").val()
        }
        $(".ui.main.page.dimmer").addClass("active");
        let req = await fetch(builderAPI, {
            method: 'PATCH',
            headers: jsonHeaders,
            body: JSON.stringify(data)
        });
        let res = await req.json();
        $(".ui.main.page.dimmer").removeClass("active");
        if(parseInt(res.success)) {
            toastr.success(toastWebSettingsSaveSuccess);
            location.href = "/builder";            
        } else {
            toastr.error(toastWebSettingsSaveError);
        }
    });
    // #endregion
    // #region SLIDER SETTINGS
    $("#modal-slider-settings-save").click(function() {
        let slides = $("#slider-images li.img").map(function() {
            return {
                img: $(this).find("img").attr("src"),
                content: $(this).find(".content").html()
            }
        });
        let sliderClass = sliderTarget.attr("class");
        switch(sliderClass) {
            case "thumbs-gallery":
                let sliderGalleryTop = "";
                let sliderGalleryThumbs = "";
                slides.each(function(i,slide) {
                    sliderGalleryTop += `<div class="swiper-slide" style="background-image:url(${slide.img})">\n${slide.content}\n</div>\n`;
                    sliderGalleryThumbs += `<div class="swiper-slide" style="background-image:url(${slide.img})"></div>\n`;
                });
                sliderTarget.find(".gallery-top .swiper-wrapper").html(sliderGalleryTop);
                sliderTarget.find(".gallery-thumbs .swiper-wrapper").html(sliderGalleryThumbs);
                break;
        }
    });
    // #endregion

    // AUTOMATICALLY OPEN PAGE
    if(query && $(`#nav-website-list .page-link a[data-url='${query}.html']`).length == 1) {
        $(`#nav-website-list .page-link a[data-url='${query}.html']`).trigger("click");
    } else {
        $("#page-link-index").trigger("click");
    }
}
function translateBuilder() {
    switch(mainCustomer.CustomerLanguage) {
        case "es":
            $(".ui-center .ui.segment.page .ui.text.loader").text("Cargando");
            $(".ui-center .ui.segment.code .ui.text.loader").text("Cargando");
            toastSaveSuccess = "Grabación exitosa";
            toastSaveError = "Error al grabar página";
            toastRemoveSuccess = "Página Eliminada";
            toastRemoveError = "Error al eliminar página";
            toastFolderRemoveSuccess = "Carpeta Eliminada";
            toastFolderRemoveError = "Error al eliminar carpeta";
            toastHeaderTagValidationError = "Se detecto varias etiquetas &lt;header&gt; en su código. Solo puede haber una etiqueta &lt;header&gt; en cada página.";
            toastFooterTagValidationError = "Se detecto varias etiquetas &lt;footer&gt; en su código. Solo puede haber una etiqueta &lt;footer&gt; en cada página.";
            toastWebSettingsSaveSuccess = "Configuración grabada";
            toastWebSettingsSaveError = "Error al grabar configuración";
            enclosingTagsInfoTitle = "No se necesitan etiquetas encajantes";
            enclosingTagsInfoContent = "SiteOS agregara las etiquetas encajantes doctype y html a su código fuente, asi que no es necesario agregar las siguientes etiquetas:<br />&lt;!DOCTYPE ...&gt;<br />&lt;html&gt;<br />...<br />&lt;/html&gt;";
            // BUILDER - UI BAR
            $("#web-save span").text("Guardar Cambios");
            $("#web-page span").text("Ver Página");
            $("#web-code span").text("Ver Código");
            $("#web-diff span").text("Ver Cambios");
            $("#web-settings span").text("Configuración Web");
            $("#web-goto span").text("Ir a la Página Web");
            // BUILDER - LEFT MENU
            $("#web-add-page span").text("Agregar Página Web");
            $("#web-add-folder span").text("Agregar Carpeta Web");
            // BUILDER - RIGHT MENU
            $("#tm-page span").text("Página");
            $("#tm-page-name label").text("Nombre");
            $("#tm-page-title label").text("Título");
            $("#tm-page-description label").text("Descripción");
            $("#tm-page-url label").text("Enlace");
            $("#tm-link span").text("Enlace");
            $("#tm-link-url label").text("Enlace");
            $("#tm-link-newtab label").text("Abrir en nueva pestaña");
            $("#tm-listitem span").text("Entrada de Lista");
            $("#tm-listitem-dup span").text("Duplicar");
            $("#tm-listitem-del span").text("Eliminar");
            $("#tm-img span").text("Imagen");
            $("#tm-img-change span").text("Cambiar Imagen");
            $("#tm-img-remove span").text("Borrar Imagen");
            $("#tm-img-linkify span").text("Convertir en Enlace");
            $("#tm-img-alt label").text("Texto Alternativo");
            $("#tm-img-to-video span").text("Cambiar a Video");
            $("#tm-icon span").text("Icono");
            $("#tm-icon-header-change").text("Cambiar Icono");
            $("#tm-icon-to-img span").text("Cambiar a Imagen");
            $("#tm-icon-header-formatting").text("Formato");
            $("#tm-icon-removeformat").attr("title", "Quitar Formato");
            $("#tm-icon-header-size").text("Tamaño");
            $("#tm-icon-increasesize").attr("title", "Subir tamaño de icono");
            $("#tm-icon-decreasesize").attr("title", "Bajar tamaño de icono");
            $("#tm-text span").text("Texto");
            $("#tm-text-header-formatting").text("Formato");
            $("#tm-text-bold").attr("title", "Negrita");
            $("#tm-text-italic").attr("title", "Itálica");
            $("#tm-text-underline").attr("title", "Subrayado");
            $("#tm-text-strikethrough").attr("title", "Rayado");
            $("#tm-text-subscript").attr("title", "Subíndice");
            $("#tm-text-superscript").attr("title", "Sobrescrita");
            $("#tm-text-removeformat").attr("title", "Quitar Formato");
            $("#tm-text-linkify span").text("Convertir a Enlace");
            $("#tm-text-header-size").text("Tamaño");
            $("#tm-text-increasesize").attr("title", "Subir tamaño de texto");
            $("#tm-text-decreasesize").attr("title", "Bajar tamaño de texto");
            $("#tm-text-header-alignment").text("Alínear");
            $("#tm-text-alignleft").attr("title", "Alínear a la Izquierda");
            $("#tm-text-aligncenter").attr("title", "Alínear al Centro");
            $("#tm-text-alignright").attr("title", "Alínear a la Derecha");
            $("#tm-text-alignjustify").attr("title", "Alínear Justificado");
            $("#tm-input span").text("Entrada");
            $("#tm-input-name label").text("Nombre");
            $("#tm-input-placeholder label").text("Placeholder");
            $("#tm-section span").text("Sección");
            $("#tm-section-header-bgimg").text("Imagen de Fondo");
            $("#tm-section-bg-img-change span").text("Cambiar Imagen");
            $("#tm-section-bg-img-remove span").text("Borrar Imagen");
            $("#tm-section-bg-img-effect label").text("Efecto Paralaje");
            $("#tm-section-bg-img-fullwidth label").text("Ancho Completo");
            $("#tm-section-header-bgcolor").text("Color de Fondo");
            $("#tm-section-header-modify").text("Modificar");
            $("#tm-section-remove span").text("Borrar Sección");
            // BUILDER - TOOLBAR - IMAGE
            $("#tb-img-change span").text("Cambiar");
            $("#tb-img-move span").text("Mover");
            $("#tb-img-resize span").text("Cambiar Tamaño");
            $("#tb-img-transform span").text("Transformar");
            $("#tb-img-reset span").text("Restaurar");
            $("#tb-img-remove span").text("Borrar");
            // BUILDER - TOOLBAR - VIDEO
            $("#tb-video-change span").text("Cambiar Video");
            $("#tb-video-to-img span").text("Cambiar a Imagen");
            $("#tb-video-move span").text("Mover");
            $("#tb-video-resize span").text("Cambiar Tamaño");
            $("#tb-video-transform span").text("Transformar");
            $("#tb-video-reset span").text("Restaurar");
            $("#tb-video-remove span").text("Borrar");
            // BUILDER - TOOLBAR - SLIDER
            $("#tb-slider-modify span").text("Modificar Deslizador");
            // BUILDER - CONTEXTMENU - FILE
            $("#contextmenu-file .title span").text("Título");
            $("#contextmenu-file .links a.copy span").text("Copiar Enlace");
            $("#contextmenu-file .links a.remove span").text("Eliminar");
            $("#contextmenu-file .data span:first-of-type").text("Última Modificación: ");
            // BUILDER - CONTEXTMENU - FOLDER
            $("#contextmenu-folder .title span").text("Título");
            $("#contextmenu-folder .links a.add span").text("Agregar Página");
            $("#contextmenu-folder .links a.remove span").text("Eliminar");
            // BUILDER - MODAL - WEBSITE CHANGES
            $("#modal-web-settings > .header > span").text("Cambios del Sitio Web");
            $("#web-settings-theme label").text("Plantilla");
            $("#web-settings-theme-btn span").text("Cambiar Plantilla");
            $("#web-settings-icon label").text("Ícono");
            $("#web-settings-icon-btn span").text("Cambiar Ícono");
            $("#web-settings-integration span").text("Ver Integraciones");
            $("#web-settings-snippet label").text("Agregar Retazo");
            $("#web-settings-advanced > .title span").text("Cambios Avanzados");
            $("#web-settings-title > label").text("Configuración de Título");
            $("#modal-web-settings-exit span").text("Salir");
            $("#modal-web-settings-save span").text("Grabar");
            // BUILDER - MODAL - SLIDER CHANGES
            $("#modal-slider-settings > .header > span").text("Imagenes del Deslizador");
            $("#slider-image-upload-container > div:first-of-type > div").text("Agregar Imagen");
            $("#slider-image-upload-container > div.ui.progress > div.label").text("Subiendo Imagen");
            $("#modal-slider-settings-exit span").text("Salir");
            $("#modal-slider-settings-save span").text("Grabar");
            // BUILDER - MODAL - ADD PAGE
            $("#modal-page-add > .header > span").text("Agregar Página Web");
            $("#page-add-url > label").text("Nombre de Página");
            $("#page-add-template > label").text("Plantilla de Página");
            $("#page-add-template .ui.selection.dropdown .menu .item[data-value='']").text("Página en Blanco");
            $("#page-add-template .ui.selection.dropdown .menu .header.template span").text("Plantilla");
            $("#page-add-template .ui.selection.dropdown .menu .header.website span").text("Página Web");
            $("#page-add-folder > label").text("Carpeta");
            $("#modal-page-add .ui.error.message .header").text("Hay campos vacíos");
            $("#modal-page-add .ui.error.message p").text("Por favor, llene todos los campos requeridos");
            $("#modal-page-add .ui.warning.message .header").text("Nombre de página ya existe");
            $("#modal-page-add .ui.warning.message p").text("Ingrese otro nombre de página");
            $("#modal-page-add-exit span").text("Salir");
            $("#modal-page-add-save span").text("Agregar Página Web");

            // BUILDER - MODAL - ADD FOLDER
            $("#modal-folder-add > .header > span").text("Agregar Carpeta Web");
            $("#folder-add-name > label").text("Nombre");
            $("#folder-add-name input").attr("placeholder", "Nombre de Carpeta");
            $("#modal-folder-add .ui.error.message .header").text("El nombre de la carpeta esta vacía");
            $("#modal-folder-add .ui.error.message p").text("Por favor, escriba un nombre para su nueva carpeta");
            $("#modal-folder-add .ui.warning.message .header").text("Error de servidor");
            $("#modal-folder-add .ui.warning.message p").text("La carpeta no se pudo crear");
            $("#modal-folder-add-exit span").text("Salir");
            $("#modal-folder-add-save span").text("Agregar Carpeta Web");
            // MODAL - GALLERY IMAGES
            $("#modal-gallery > .header span").text("Galería");
            $("#gallery-tab-stockphotos span").text("Fotos de Stock");
            $("#gallery-tab-gallery span").text("Mis Imágenes");
            $("#gallery-stockphotos-search input").attr("placeholder","Buscar Categorías");
            $("#gallery-stockphotos-load .loader").text("Cargando");
            $("#gallery-upload > span").html("<i class='icon add'></i>Agregar Imagen");
            $("#gallery-upload .ui.progress .label").text("Subiendo Imagen");
            // MODAL - VIDEOS
            $("#modal-videos > .header span").text("Galería de Vídeos");
            $("#videos-tab-myvideos span").text("Mis Vídeos");
            $("#videos-tab-embed span").text("Incorporar");
            $("#videos-upload > span").html("<i class='icon add'></i>Agregar Vídeo");
            $("#videos-upload .ui.progress > div.label").text("Subiendo Vídeo");
            $("#videos-embed-code > textarea").attr("placeholder", "Agrega código de incorporación aquí");
            $("#videos-embed .ui.error.message .header").text("Código de incorporación Inválido");
            $("#videos-embed .ui.button span").text("Poner vídeo");
            break;
        case "en":
            break;
        default:
            break;
    }
}
// #endregion
// #region LAUNCH
async function launchBuilder() {
    try {
        query = getParameterByName("page");
        $("#title").text("Website");
        $(".ui.main.page.dimmer").addClass("active");
        let req = await fetch(builderAPI);
        let res = await req.json();
        _s.files = res.data.WebDirectory.files;
        _s.folders = res.data.WebDirectory.folders;
        _s.templateDirectory = res.data.TemplateDirectory;
        renderMenu();
        wireUI();
        translateBuilder();
    }
    catch(err) {
        toastr.error(w_server_error_h);
        console.log(err);
    }
    finally {
        $(".ui.main.page.dimmer").removeClass("active");
    }
}
$(function() {
    _s = new State();
    launchInterval = setInterval(function() {
        if(mainCustomer && mainCustomer.CustomerName) {
            launchBuilder();
            clearInterval(launchInterval);
        }
    }, 100);
});
// #endregion