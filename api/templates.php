<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload-json.php';
include 'helper.php';

function rcopy($src, $dst, $pk) {
    if (is_dir($src)) {
        if(!is_dir($dst)) {
            mkdir($dst);
        }
        $files = array_diff(scandir($src), array('.','..')); 
        foreach ($files as $file)
            rcopy("$src/$file", "$dst/$file", $pk);
    } else if (file_exists($src) && !fnmatch("*/blog.html",$src) && !fnmatch("*/blog-*.html",$src)) {
        $copy_result = copy($src, $dst);
        $fileContents = file_get_contents($dst);
        $isValidExtension = pathinfo($dst, PATHINFO_EXTENSION) == "html";
        $isValidEnclosedHTML5 = isValidEnclosedHTML5($fileContents);
        
        #region TOKENS
        $token_form_tag = "<form";
        $token_headClose_tag = "</head>";
        $token_bodyClose_tag = "</body>";
        $token_weblytics_link = "https://app." . $config["domain"] . "/rsc/js/analytics.js";
        $token_formProcessor_link = "https://app." . $config["domain"] . "/rsc/js/form.js";
        $token_cssMain_path = "css/style.css";
        $token_jsMain_path = "js/main.js";
        $token_cssMainTemplate_link = "https://fishpulse-templates.s3-us-west-1.amazonaws.com/" . $GLOBALS["TemplateLocation"] . "/$token_cssMain_path";
        $token_jsMainTemplate_link = "https://fishpulse-templates.s3-us-west-1.amazonaws.com/" . $GLOBALS["TemplateLocation"] . "/$token_jsMain_path";
        $token_cssMainLocal_link = "https://app." . $config["domain"] . "/web/" . $GLOBALS["SubDomain"] . "/$token_cssMain_path";
        $token_jsMainLocal_link = "https://app." . $config["domain"] . "/web/" . $GLOBALS["SubDomain"] . "/$token_jsMain_path";
        #endregion
        #region ADD SPECIAL COMPONENT TAGS (FORM PROCESSOR, ANALYTICS, PUBLIC KEY, MAIN CSS, MAIN JS)
        if($isValidExtension && $isValidEnclosedHTML5) {
            $pos_form_tag = strpos($fileContents, $token_form_tag);
            $pos_formProcessor_link = strpos($fileContents, $token_formProcessor_link);
            if($pos_form_tag !== false && $pos_formProcessor_link === false) {
                $pos_bodyClose_tag = strpos($fileContents, $token_bodyClose_tag);
                $fileContents = substr_replace($fileContents, "\t<script src='$token_formProcessor_link'></script>\n", $pos_bodyClose_tag, 0);
            }
            $pos_weblytics_link = strpos($fileContents, $token_weblytics_link);
            if($pos_weblytics_link === false) {
                $pos_bodyClose_tag = strpos($fileContents, $token_bodyClose_tag);
                $fileContents = substr_replace($fileContents, "\t<script src='$token_weblytics_link'></script>\n", $pos_bodyClose_tag, 0);
            }
            $pos_pk_val = strpos($fileContents, $pk);
            if($pos_pk_val === false) {
                $pos_bodyClose_tag = strpos($fileContents, $token_bodyClose_tag);
                $fileContents = substr_replace($fileContents, "\t<input type='hidden' id='pk' value='" . $pk . "' />\n", $pos_bodyClose_tag, 0);
            }
            $pos_cssMainLocal_link = strpos($fileContents, $token_cssMainLocal_link);
            $pos_cssMainTemplate_link = strpos($fileContents, $token_cssMainTemplate_link);
            if($pos_cssMainLocal_link === false && $pos_cssMainTemplate_link !== false) {
                $pos_cssMainTemplateEnd_link = strpos($fileContents, $token_cssMain_path, $pos_cssMainTemplate_link) + strlen($token_cssMain_path);
                $fileContents = substr_replace($fileContents, $token_cssMainLocal_link, $pos_cssMainTemplate_link, $pos_cssMainTemplateEnd_link - $pos_cssMainTemplate_link);
            }
            $pos_jsMainLocal_link = strpos($fileContents, $token_jsMainLocal_link);
            $pos_jsMainTemplate_link = strpos($fileContents, $token_jsMainTemplate_link);
            if($pos_jsMainLocal_link === false && $pos_jsMainTemplate_link !== false) {
                $pos_jsMainTemplateEnd_link = strpos($fileContents, $token_jsMain_path, $pos_jsMainTemplate_link) + strlen($token_jsMain_path);
                $fileContents = substr_replace($fileContents, $token_jsMainLocal_link, $pos_jsMainTemplate_link, $pos_jsMainTemplateEnd_link - $pos_jsMainTemplate_link);
            }
            file_put_contents($dst, $fileContents);
        }
        #endregion
    }
}
function deleteDirectory($dir) {
    $files = array_diff(scandir($dir), array('.','..')); 
    foreach ($files as $file) { 
        (is_dir($dir . "/" . $file)) ? deleteDirectory($dir . "/" . $file) : unlink($dir . "/" . $file); 
    } 
    return rmdir($dir); 
}
$TemplateRoot = $config["root"]."/templates/";
$TemplateRootDefault = $TemplateRoot . "en/";
$langSupported = array("es");

try {
    switch ($method)  {
        case "GET": // GET WEB TEMPLATES
            $query = "SELECT * FROM WebTemplate ORDER BY Difficulty";
            $sql = $pdo->prepare($query);
            $sql->execute();
            $templateRows = $sql->fetchAll();
            $templates = array();
            foreach($templateRows as $template) {
                #region GET LANGUAGES SUPPORTED FOR EACH TEMPLATE
                $langSupport = array();
                foreach($langSupported as $lang) {
                    $langFile = $TemplateRoot . $lang . "/" . $template["TemplateLocation"] . "/index.html";
                    if(file_exists($langFile)) {
                        array_push($langSupport, $lang);
                    }
                }
                #endregion
                $template["LangSupport"] = $langSupport;
                array_push($templates, $template);
            }
            $response["data"] = $templates;
            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "POST": // DEPLOY TEMPLATE
            validateCsrfToken();
            if(empty($input["tmplUUID"])) {
                $response["code"] = 0;
                $response["msg"] = "Missing Template UUID";
            } else {
                $query = "UPDATE Company SET TemplateUUID = :TemplateUUID WHERE UUID = :UUID";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':TemplateUUID',$input["tmplUUID"]);
                $sql->bindValue(':UUID',$CompanyUUID);
                $sql->execute();

                $query = "SELECT TemplateLocation FROM WebTemplate WHERE UUID = :UUID";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$input["tmplUUID"]);
                $sql->execute();
                $row = $sql->fetch();
                $TemplateLocation = $row["TemplateLocation"];
                
                $query = "SELECT SubDomain, PublicKey FROM Company WHERE UUID = :UUID";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$CompanyUUID);
                $sql->execute();
                $row = $sql->fetch();
                $PublicKey = $row["PublicKey"];
                $SubDomain = $row["SubDomain"];
                
                $query = "SELECT CustomerLanguage FROM Customer WHERE UUID = :UUID";
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

                $src = $TemplateRoot . $TemplateLocation;
                $dst = $config["root"]."/web/" . $SubDomain;
                
                #region CLEAR DIRECTORY
                $files = array_diff(scandir($dst), array('.','..')); 
                foreach ($files as $file) { 
                    (is_dir($dst . "/" . $file)) ? deleteDirectory($dst . "/" . $file) : unlink($dst . "/" . $file); 
                }
                #endregion
                rcopy($src,$dst,$PublicKey); // DEPLOY TEMPLATE
                $response["code"] = 1;
            }
            echo json_encode($response);
            break;
        case "PUT":
            break;
        case "DELETE":
            break;
    }
}
catch(PDOException $ex) {
    $response["code"] = 0;
    $response["msg"] = $ex->getMessage();
    echo json_encode($response);
}
$pdo = null;

?>