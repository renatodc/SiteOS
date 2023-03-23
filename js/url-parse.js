function getFacebookURL(url) {
    var lcURL = url.toLowerCase();
    if(lcURL.indexOf("facebook.com/") == -1) {
        var newURL = "facebook.com/" + url;
        return newURL;
    }
    else {
        return url;
    }
}
function getLinkedInURL(url) {
    var lcURL = url.toLowerCase();
    var newURL;
    if(lcURL.indexOf("in/") === 0) {
        newURL = "linkedin.com/" + url;
        return newURL;
    }
    else if(lcURL.indexOf("linkedin.com/in/") == -1) {
        newURL = "linkedin.com/in/" + url;
        return newURL;
    }
    else {
        return url;
    }
}
function getTwitterURL(url) {
    var lcURL = url.toLowerCase();
    if(lcURL.indexOf("@") === 0) {
        lcURL = lcURL.substring(1);
    }
    if(lcURL.indexOf("twitter.com/") == -1) {
        var newURL = "twitter.com/" + url;
        return newURL;
    }
    else {
        return url;
    }
}
function getInstagramURL(url) {
    var lcURL = url.toLowerCase();
    if(lcURL.indexOf("instagram.com/") == -1) {
        var newURL = "instagram.com/" + url;
        return newURL;
    }
    else {
        return url;
    }
}
function getYouTubeURL(url) {
    var lcURL = url.toLowerCase();
    if(lcURL.indexOf("youtube.com/") == -1) {
        var newURL = "youtube.com/user/" + url;
        return newURL;
    }
    else {
        return url;
    }
}