<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload-json.php';
include 'helper.php';
requireCsrfToken();

#region Builder Methods
function getPageNameFromMeta($fileContents) {
    $metaPageTag = "<meta name=\"page\" content=\"";
    $metaPageTagPos = strpos($fileContents, $metaPageTag);
    if($metaPageTagPos !== false) {
        $metaPageValStartPos = $metaPageTagPos + strlen($metaPageTag);
        $metaPageValEndPos = strpos($fileContents, "\"", $metaPageValStartPos);
        $metaPageValLength = $metaPageValEndPos - $metaPageValStartPos;
        $metaPageVal = substr($fileContents, $metaPageValStartPos, $metaPageValLength);
        return $metaPageVal;
    } else {
        return "";
    }
}
function getTemplateDirectory($folder) {
    $directory = array();
    $items = scandir($folder); 
    foreach($items as $item) {
        if(in_array($item,array(".",".."))) continue;
        $obj = $folder . '/' . $item;
        if(is_file($obj) && (pathinfo($obj, PATHINFO_EXTENSION) == "html")) {
            $fileContents = file_get_contents($obj);
            $file = array();
            $file["name"] = $item;
            $file["page"] = getPageNameFromMeta($fileContents);
            array_push($directory, $file);
        } 
    }
    return $directory;
}
function getWebDirectory($folder, $item) {
    $path = $folder . '/' . $item;
    $directory = array(); 
    $directory["name"] = $item;
    $directory["root"] = str_replace($GLOBALS["CompanyPath"], '', $path);
    $directory["files"] = array();
    $directory["folders"] = array();
    $directory["isOpen"] = $folder == $GLOBALS["WebPath"] ? 1 : 0;
    $directoryItems = scandir($path); 
    foreach($directoryItems as $directoryItem) {
        if(in_array($directoryItem,array(".",".."))) continue;
        $obj = $path . '/' . $directoryItem;
        if(is_dir($obj) && in_array($folderPath,$GLOBALS["WebFolders"])) {
            array_push($directory["folders"], getWebDirectory($path, $directoryItem));
        } 
        if(is_file($obj) && (pathinfo($obj, PATHINFO_EXTENSION) == "html")) {
            $fileContents = file_get_contents($obj);
            $file = array();
            $file["name"] = $directoryItem;
            $file["path"] = str_replace($GLOBALS["CompanyPath"], '', $path);
            $file["modified"] = date("Y-m-d g:i a", filemtime($obj));
            $file["page"] = getPageNameFromMeta($fileContents);
            array_push($directory["files"], $file);
        }
    } 
    return $directory; 
}
function replaceHeaderFooter($folder, $item) {
    $path = $folder . '/' . $item;
    $directoryItems = scandir($path); 
    foreach ($directoryItems as $directoryItem) {
        if(in_array($directoryItem,array(".",".."))) continue;
        $obj = $path . '/' . $directoryItem;
        $folderPath = str_replace($GLOBALS["CompanyPath"].'/', '', $obj);
        if(is_dir($obj) && in_array($folderPath,$GLOBALS["WebFolders"])) {
            replaceHeaderFooter($path, $directoryItem);
        } 
        if(is_file($obj) && (pathinfo($obj, PATHINFO_EXTENSION) == "html")) {
            $fileContents = file_get_contents($obj);
            if(!empty($GLOBALS["headerTagContent"])) {
                $headerOpenTag = "<header";
                $headerCloseTag = "</header>";
                $headerOpenTagStartPos = strpos($fileContents, $headerOpenTag);
                $headerCloseTagStartPos = strpos($fileContents, $headerCloseTag);
                if($headerOpenTagStartPos !== false && $headerCloseTagStartPos !== false) {
                    $headerOpenTagEndPos = strpos($fileContents, ">", $headerOpenTagStartPos) + 1;
                    $headerContentLength = $headerCloseTagStartPos - $headerOpenTagEndPos;
                    $fileContents = substr_replace($fileContents, $GLOBALS["headerTagContent"], $headerOpenTagEndPos,$headerContentLength);
                    file_put_contents($obj, $fileContents);
                }
            }
            if(!empty($GLOBALS["footerTagContent"])) {
                $footerOpenTag = "<footer";
                $footerCloseTag = "</footer>";
                $footerOpenTagStartPos = strpos($fileContents, $footerOpenTag);
                $footerCloseTagStartPos = strpos($fileContents, $footerCloseTag);
                if($footerOpenTagStartPos !== false && $footerCloseTagStartPos !== false) {
                    $footerOpenTagEndPos = strpos($fileContents, ">", $footerOpenTagStartPos) + 1;
                    $footerContentLength = $footerCloseTagStartPos - $footerOpenTagEndPos;
                    $fileContents = substr_replace($fileContents, $GLOBALS["footerTagContent"], $footerOpenTagEndPos,$footerContentLength);
                    file_put_contents($obj, $fileContents);
                }
            }
        }
    }
}
function replaceTitle($folder, $item) {
    $path = $folder . '/' . $item;
    $directoryItems = scandir($path); 
    foreach ($directoryItems as $directoryItem) {
        if(in_array($directoryItem,array(".",".."))) continue;
        $obj = $path . '/' . $directoryItem;
        $folderPath = str_replace($GLOBALS["CompanyPath"].'/', '', $obj);
        if(is_dir($obj) && in_array($folderPath,$GLOBALS["WebFolders"])) {
            replaceTitle($path, $directoryItem);
        } 
        if(is_file($obj) && (pathinfo($obj, PATHINFO_EXTENSION) == "html")) {
            $fileContents = file_get_contents($obj);
            $titleTagStart = "<title>";
            $titleTagEnd = "</title>";
            $titleTagStartPos = strpos($fileContents, $titleTagStart);
            $titleTagEndPos = strpos($fileContents, $titleTagEnd); 
            if($titleTagStartPos !== false && $titleTagEndPos !== false) {
                $newTitleTag = "<title>".$GLOBALS["globalTitle"]."</title>";
                $titleTagEndPos += strlen($titleTagEnd);
                $titleTagLength = $titleTagEndPos - $titleTagStartPos;
                $fileContents = substr_replace($fileContents, $newTitleTag, $titleTagStartPos,$titleTagLength);
                file_put_contents($obj, $fileContents);
            } else {
                $headTagEnd = "</head>";
                $headTagEndPos = strpos($fileContents, $headTagEnd);
                $newTitleTag = "\t<title>".$GLOBALS["globalTitle"]."</title>";
                $fileContents = substr_replace($fileContents, $newTitleTag."\n", $headTagEndPos, 0);
                file_put_contents($obj, $fileContents);                    
            }
        }
    }
}
function replaceFavicon($folder, $item) {
    $path = $folder . '/' . $item;
    $directoryItems = scandir($path); 
    foreach ($directoryItems as $directoryItem) {
        if(in_array($directoryItem,array(".",".."))) continue;
        $obj = $path . '/' . $directoryItem;
        $folderPath = str_replace($GLOBALS["CompanyPath"].'/', '', $obj);
        if(is_dir($obj) && in_array($folderPath,$GLOBALS["WebFolders"])) {
            replaceFavicon($path, $directoryItem);
        } 
        if(is_file($obj) && (pathinfo($obj, PATHINFO_EXTENSION) == "html")) {
            $fileContents = file_get_contents($obj);
            $faviconTagStart = "<link rel=\"icon\"";
            $faviconTagEnd = ">";
            $faviconTagStartPos = strpos($fileContents, $faviconTagStart);
            $faviconTagEndPos = strpos($fileContents, $faviconTagEnd, $faviconTagStartPos);
            if($faviconTagStartPos !== false && $faviconTagEndPos !== false) {
                $faviconTagEndPos += strlen($faviconTagEnd);
                $faviconTagLength = $faviconTagEndPos - $faviconTagStartPos;
                $faviconArray = explode('.', $GLOBALS["globalFavicon"]);
                $faviconExtension = end($faviconArray);
                switch($faviconExtension) {
                    case "ico":
                        $faviconType = "image/x-icon";
                        break;
                    case "png":
                    default:
                        $faviconType = "image/png";
                        break;
                }
                $newFaviconTag = "<link rel=\"icon\" type=\"".$faviconType."\" href=\"".$GLOBALS["globalFavicon"]."\">";
                $fileContents = substr_replace($fileContents, $newFaviconTag, $faviconTagStartPos,$faviconTagLength);
                file_put_contents($obj, $fileContents);
            } else {
                $headTagEnd = "</head>";
                $headTagEndPos = strpos($fileContents, $headTagEnd);                    
                $faviconArray = explode('.', $GLOBALS["globalFavicon"]);
                $faviconExtension = end($faviconArray);
                switch($faviconExtension) {
                    case "ico":
                        $faviconType = "image/x-icon";
                        break;
                    case "png":
                    default:
                        $faviconType = "image/png";
                        break;
                }
                $newFaviconTag = "\t<link rel=\"icon\" type=\"".$faviconType."\" href=\"".$GLOBALS["globalFavicon"]."\">";
                $fileContents = substr_replace($fileContents, $newFaviconTag."\n", $headTagEndPos, 0);
                file_put_contents($obj, $fileContents);
            }
        }
    }
}
function addSnippet($folder, $item) { // PLACES SNIPPET BEFORE CLOSING BODY TAG
    $path = $folder . '/' . $item;
    $directoryItems = scandir($path); 
    foreach ($directoryItems as $directoryItem) {
        if(in_array($directoryItem,array(".",".."))) continue;
        $obj = $path . '/' . $directoryItem;
        $folderPath = str_replace($GLOBALS["CompanyPath"].'/', '', $obj);
        if(is_dir($obj) && in_array($folderPath,$GLOBALS["WebFolders"])) {
            addSnippet($path, $directoryItem);
        } 
        if(is_file($obj) && (pathinfo($obj, PATHINFO_EXTENSION) == "html")) {
            $fileContents = file_get_contents($obj);
            $bodyTagEnd = "</body>";
            $bodyTagEndPos = strpos($fileContents, $bodyTagEnd);
            $fileContents = substr_replace($fileContents, $GLOBALS["globalSnippet"]."\n", $bodyTagEndPos, 0);
            file_put_contents($obj, $fileContents);
        }
    }
}
#endregion
#region Builder Variables
$WebPath = $config["root"]."/web";
$CompanyPath = $WebPath . '/' . $config["name"];
$TemplateRoot = $config["root"]."/templates/";
$TemplateRootDefault = $TemplateRoot . "en/";
#region .WEBFOLDERS
$WebFoldersPath = $CompanyPath . '/.webfolders';
$WebFolders = array();
if(file_exists($WebFoldersPath)) {
    $WebFoldersString = file_get_contents($WebFoldersPath);
    $WebFolders = preg_split("/\r\n|\n|\r/",$WebFoldersString);
}
#endregion
#endregion

try {
    switch ($method)  {
        case "GET": // GET WEBSITE AND TEMPLATE DATA
            $result["WebDirectory"] = getWebDirectory($WebPath, $config["name"]);

            $filter = " WHERE UUID = :UUID";
            $query = "SELECT TemplateUUID FROM Company" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CompanyUUID);
            $sql->execute();
            $row = $sql->fetch();
            $TemplateUUID = $row["TemplateUUID"];

            $filter = " WHERE UUID = :UUID";
            $query = "SELECT TemplateLocation FROM WebTemplate" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$TemplateUUID);
            $sql->execute();
            $row = $sql->fetch();
            $TemplateLocation = $row["TemplateLocation"];
            
            $filter = " WHERE UUID = :UUID";
            $query = "SELECT CustomerLanguage FROM Customer" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CustomerUUID);
            $sql->execute();
            $row = $sql->fetch();
            $CustomerLanguage = $row["CustomerLanguage"];
            if($CustomerLanguage != "en") {
                $langFile = $TemplateRoot . $CustomerLanguage . "/" . $TemplateLocation . "/index.html";
                if(file_exists($langFile)) {
                    $TemplateRoot = $config["root"]."/templates/$CustomerLanguage/";
                } else {
                    $TemplateRoot = $TemplateRootDefault;
                }
            } else {
                $TemplateRoot = $TemplateRootDefault;
            }

            $TemplatePath = $TemplateRoot . $TemplateLocation;
            $result["TemplateDirectory"] = getTemplateDirectory($TemplatePath);
            $response["data"] = $result;
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "POST": // CREATE PAGE
            $response["success"] = 0;
            if(!empty($input["url"]) && preg_match('/^[\w- ]+$/', $input["url"])) {
                $filename = str_replace(" ","_",$input["url"]);
                if(endsWith(strtolower($filename),".html") == false) {
                    $filename = $filename . ".html";
                }
                if(isValidPath($CompanyPath, $input["folder"])) {
                    $fileLocation = $CompanyPath . $input["folder"] . '/' . $filename;
                    $templatePageContent = "<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<h1>" . $input["url"] . "</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus egestas blandit sodales.</p>\n</body>\n</html>";
                    #region COPY CONTENT FROM WEBSITE PAGE
                    if(!empty($input["pageTemplate"])) {
                        if(isValidPath($CompanyPath, '/' . $input["pageTemplate"])) {
                            $templatePageLocation = $CompanyPath . '/' . $input["pageTemplate"];
                            $templatePageContent = file_get_contents($templatePageLocation);
                            #region OVERRIDE PAGE NAME ATTRIBUTE IF IT EXISTS
                            $metaPageTagStart = "<meta name=\"page\"";
                            $metaPageTagStartPos = strpos($templatePageContent, $metaPageTagStart);
                            $metaPageTagEndPos = strpos($templatePageContent, ">", $metaPageTagStartPos);
                            if($metaPageTagStartPos !== false && $metaPageTagEndPos !== false) {
                                $metaPageTagLength = $metaPageTagEndPos + 1 - $metaPageTagStartPos;
                                $pagename = str_replace("_"," ",ucfirst(strtolower($input["url"])));
                                $pagename = str_replace("-"," ",$pagename);
                                $newMetaPageTag = "<meta name=\"page\" content=\"".$pagename."\">";
                                $templatePageContent = substr_replace($templatePageContent, $newMetaPageTag, $metaPageTagStartPos, $metaPageTagLength);
                            }
                            #endregion
                        }
                    }
                    #endregion
                    #region COPY CONTENT FROM TEMPLATE PAGE
                    if(!empty($input["tmplTemplate"])) {
                        $filter = " WHERE UUID = :UUID";
                        $query = "SELECT TemplateUUID, PublicKey FROM Company" . $filter;
                        $sql = $pdo->prepare($query);
                        $sql->bindValue(':UUID',$CompanyUUID);
                        $sql->execute();
                        $row = $sql->fetch();
                        $PublicKey = $row["PublicKey"];

                        $filter = " WHERE UUID = :UUID";
                        $query = "SELECT TemplateLocation FROM WebTemplate" . $filter;
                        $sql = $pdo->prepare($query);
                        $sql->bindValue(':UUID',$row["TemplateUUID"]);
                        $sql->execute();
                        $row = $sql->fetch();
                        $TemplateLocation = $row["TemplateLocation"];

                        $TemplateBase = $config["root"] . "/templates/en/";

                        if(isValidPath($TemplateBase . $TemplateLocation,$input["tmplTemplate"])) {
                            $templatePageLocation = $TemplateBase . $TemplateLocation . $input["tmplTemplate"];
                            $templatePageContent = file_get_contents($templatePageLocation);
                            #region OVERRIDE PAGE NAME ATTRIBUTE IF IT EXISTS
                            $metaPageTagStart = "<meta name=\"page\"";
                            $metaPageTagStartPos = strpos($templatePageContent, $metaPageTagStart);
                            $metaPageTagEndPos = strpos($templatePageContent, ">", $metaPageTagStartPos);
                            if($metaPageTagStartPos !== false && $metaPageTagEndPos !== false) {
                                $metaPageTagLength = $metaPageTagEndPos + 1 - $metaPageTagStartPos;
                                $pagename = str_replace("_"," ",ucfirst(strtolower($input["url"])));
                                $pagename = str_replace("-"," ",$pagename);
                                $newMetaPageTag = "<meta name=\"page\" content=\"".$pagename."\">";
                                $templatePageContent = substr_replace($templatePageContent, $newMetaPageTag, $metaPageTagStartPos, $metaPageTagLength);
                            }
                            #endregion
                            #region ADD SPECIAL TAGS                            
                            $formTagStart = "<form";
                            $formTagStartPos = strpos($templatePageContent, $formTagStart);                    
                            $pageFormProcessorToken = "https://app." . $config["domain"] . "/rsc/js/form.js";
                            $pageAnalyticsToken = "https://app." . $config["domain"] . "/rsc/js/analytics.js";
                            $pageFormProcessorTokenPos = strpos($templatePageContent, $pageFormProcessorToken);
                            $pageAnalyticsTokenPos = strpos($templatePageContent, $pageAnalyticsToken);
                            $bodyTagEndToken = "</body>";
                            $bodyTagEndTokenPos = strpos($templatePageContent, $bodyTagEndToken);
                            if($formTagStartPos !== false && !$pageFormProcessorTokenPos) {
                                $formScriptTag = "\t<script src='" . $pageFormProcessorToken . "'></script>\n";
                                $templatePageContent = substr_replace($templatePageContent, $formScriptTag, $bodyTagEndTokenPos, 0);
                            }
                            if(!$pageAnalyticsTokenPos) {
                                $formAnalyticsTag = "\t<script src='" . $pageAnalyticsToken . "'></script>\n";
                                $templatePageContent = substr_replace($templatePageContent, $formAnalyticsTag, $bodyTagEndTokenPos, 0);
                    
                                $formIDTag = "\t<input type='hidden' id='pk' value='" . $PublicKey . "' />\n";
                                $templatePageContent = substr_replace($templatePageContent, $formIDTag, $bodyTagEndTokenPos, 0);
                            }
                            #endregion
                        }
                    }
                    #endregion
                    if(!is_dir($fileLocation) && !is_file($fileLocation)) {
                        $fileContents = file_put_contents($fileLocation, $templatePageContent);
                        if(isValidPath($CompanyPath,$input["folder"] . '/' . $filename)) {
                            $response["success"] = 1;
                        } else {
                            unlink($fileLocation);
                        }
                    } else {
                        $response["success"] = 2;
                    }
                }
            }
            echo json_encode($response);
            break;
        case "PUT": // SAVE PAGE
            $response["success"] = 0;
            if(!empty($input["file"]) && isValidPath($CompanyPath,$input["file"])) {
                $fileLocation = $CompanyPath . $input["file"];
                $fileContents = $input["content"];
                file_put_contents($fileLocation, $fileContents);
                $response["success"] = 1;
                #region SYNC HEADER TAG ON ALL PAGES
                $headerOpenTag = "<header";
                $headerCloseTag = "</header>";
                $headerOpenTagStartPos = strpos($fileContents, $headerOpenTag);
                $headerCloseTagStartPos = strpos($fileContents, $headerCloseTag);
                if($headerOpenTagStartPos !== false && $headerCloseTagStartPos !== false) {
                    $headerOpenTagEndPos = strpos($fileContents, ">", $headerOpenTagStartPos) + 1;
                    $headerContentLength = $headerCloseTagStartPos - $headerOpenTagEndPos;
                    $headerTagContent = substr($fileContents,$headerOpenTagEndPos,$headerContentLength);
                    replaceHeaderFooter($WebPath, $config["name"]);
                }
                $headerTagContent = NULL;
                #endregion
                #region SYNC FOOTER TAG ON ALL PAGES
                $footerOpenTag = "<footer";
                $footerCloseTag = "</footer>";
                $footerOpenTagStartPos = strpos($fileContents, $footerOpenTag);
                $footerCloseTagStartPos = strpos($fileContents, $footerCloseTag);
                if($footerOpenTagStartPos !== false && $footerCloseTagStartPos !== false) {
                    $footerOpenTagEndPos = strpos($fileContents, ">", $footerOpenTagStartPos) + 1;
                    $footerContentLength = $footerCloseTagStartPos - $footerOpenTagEndPos;
                    $footerTagContent = substr($fileContents,$footerOpenTagEndPos,$footerContentLength);
                    replaceHeaderFooter($WebPath, $config["name"]);
                }
                $footerTagContent = NULL;
                #endregion

                #region SAVE CSS VARS
                $cssFileLocation = $CompanyPath . "/css/style.css";
                if(is_file($cssFileLocation)) {
                    $cssFile = file_get_contents($cssFileLocation);
                    if(strpos($cssFile, ":root") !== false) {
                        foreach($input["cssVars"] as $cssVar) {
                            $cssFile = file_get_contents($cssFileLocation);
                            $cssVarPos = strpos($cssFile, $cssVar->name);
                            if($cssVarPos !== false) {
                                $cssVarEndPos = strpos($cssFile, ";", $cssVarPos);
                                $cssVal = $cssVar->name . ": " . $cssVar->value;
                                $cssFile = substr_replace($cssFile, $cssVal, $cssVarPos, $cssVarEndPos - $cssVarPos);
                                file_put_contents($cssFileLocation, $cssFile);
                            }                            
                        }
                    }
                }
                #endregion
            }
            echo json_encode($response);
            break;
        case "DELETE": // DELETE PAGE
            $response["success"] = 0;
            if(!empty($input["file"]) && isValidPath($CompanyPath,$input["file"])) {
                $fileLocation = $CompanyPath . $input["file"];
                if(unlink($fileLocation)) {
                    $response["success"] = 1;
                }
            }
            echo json_encode($response);
            break;
        case "PATCH": // SAVE WEB SETTINGS
            if(!empty($input["title"])) {
                $globalTitle = $input["title"];
                replaceTitle($WebPath, $config["name"]);
            }
            if(!empty($input["favicon"])) {
                $globalFavicon = $input["favicon"];
                replaceFavicon($WebPath, $config["name"]);
            }
            if(!empty($input["snippet"])) {
                $globalSnippet = $input["snippet"];
                addSnippet($WebPath, $config["name"]);
            }
            $response["success"] = 1;
            echo json_encode($response);
            break;
    }
}
catch(Exception $ex) {
    $response["success"] = 0;
    $response["errorMsg"] = $ex->getMessage();
    echo json_encode($response);
}
$pdo = null;

?>