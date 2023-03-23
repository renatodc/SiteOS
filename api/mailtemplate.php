<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';
require 'vendor/autoload.php';

try {
    switch ($method)  {
        case "GET": // GET MAIL TEMPLATES
            $filter = " WHERE IsDeleted = 0 AND IsPrivate = 0";
            $query = "SELECT UUID,TemplateName,TemplateContent,IsPrivate FROM MailTemplate" . $filter;
            $sql = $pdo->prepare($query);
            $sql->execute();
            $response["data"] = $sql->fetchAll();

            $filter = " WHERE IsDeleted = 0 AND IsPrivate = 1 AND CompanyUUID = :CompanyUUID";
            $query = "SELECT UUID,TemplateName,TemplateContent,IsPrivate FROM MailTemplate" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->execute();
            $private = $sql->fetchAll();
            if(!empty($private) && count($private) > 0) {
                foreach($private as $priv) {
                    array_push($response["data"], $priv);
                }
            }
            $response["s3_bucket"] = $config["s3_bucket"];
            $response["s3_version"] = $config["s3_version"];
            $response["s3_region"] = $config["s3_region"];
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "POST": // INSERT MAIL TEMPLATE
            $response["success"] = 0;
            $TemplateName = $input["templateName"];
            $TemplateContent = $input["templateContent"];
            if(preg_match('/^[\w- ]+$/', $TemplateName)) {
                #region FILTER MESSAGE CONTENT (XSS)
                $purifyConfig = HTMLPurifier_Config::createDefault();
                $purifier = new HTMLPurifier($purifyConfig);
                $TemplateContent = $purifier->purify($TemplateContent);
                #endregion
                $uuid = generateUUID();
                $insert_cols = 'UUID,CompanyUUID,TemplateName,TemplateContent,IsPrivate,CreatedBy,DateCreated';
                $insert_vals = ':UUID,:CompanyUUID,:TemplateName,:TemplateContent,:IsPrivate,:CreatedBy,:DateCreated';
                $query = "INSERT INTO MailTemplate (" .$insert_cols . ") VALUES (" . $insert_vals . ")";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$uuid);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->bindValue(':TemplateName',$TemplateName);
                $sql->bindValue(':TemplateContent',$TemplateContent);
                $sql->bindValue(':IsPrivate',1);
                $sql->bindValue(':CreatedBy',$CustomerUUID);
                $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
                if($sql->execute()) {
                    $response["success"] = 1;
                    $response["newID"] = $pdo->lastInsertId();
                    $response["newUUID"] = $uuid;
                } else {
                    $response["errorMsg"] = "SQL INSERT INTO execution error";
                }
            }
            echo json_encode($response);
            break;
        case "PUT":
            break;
        case "DELETE": // SOFT DELETE MAIL TEMPLATE
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
                $query = "UPDATE MailTemplate SET IsDeleted = 1" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $response["success"] = 1;
            }
            echo json_encode($response);
            break;
        case "PATCH":
            break;
    }
}
catch(PDOException $ex) {
    $response["success"] = 0;
    $response["errorMsg"] = $ex->getMessage();
    echo json_encode($response);
}
$pdo = null;

?>