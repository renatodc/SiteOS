<?php

include 'allowed_http_origins.php';
include '../../api/dbtoken.php';
include '../../api/headers.php';
include '../../api/payload-json.php';
include '../../api/helper.php';
require_once 'vendor/autoload.php';
use GeoIp2\Database\Reader;
use Mailgun\Mailgun;
$mgKey = $config["mg_key"];

try {
#region GET FORM DATA
$leadEmail = "";
if(!empty($input["leadEmail"])) {
    $leadEmail = $input["leadEmail"];
}
$leadName = $leadEmail;
if(!empty($input["leadName"])) {
    $leadName = $input["leadName"];
}
$leadSubject = "";
if(!empty($input["leadSubject"])) {
    $leadSubject = $input["leadSubject"];
}
$leadPhone = "";
if(!empty($input["leadPhone"])) {
    $leadPhone = $input["leadPhone"];
}
$leadMessage = "";
if(!empty($input["leadMessage"])) {
    $leadMessage = $input["leadMessage"];
}
$leadSource = "Form Submission";
if(!empty($input["formName"])) {
    $leadSource = $input["formName"] . " " . $leadSource;
}
#endregion
#region SEND FORM DATA TO COMPANY RECIPIENT
#region GET COMPANY RECIPIENT
$filter = " WHERE PublicKey = :PublicKey";
$query = "SELECT UUID, FormRecipient, DomainName FROM Company" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':PublicKey', $input["pk"]);
$sql->execute();
$row = $sql->fetch();
$CompanyUUID = $row["UUID"];
$recipient = $row["FormRecipient"];
$DomainName = $row["DomainName"];
if(empty($CompanyUUID)) {
    $response["code"] = 0;
    $response["msg"] = "Invalid Public Key";
    echo json_encode($response);
    exit();
}
if(!empty($input["formRecipient"])) {
    $recipient = $input["formRecipient"];
}
#endregion
#region PREPARE FORM DATA AS MESSAGE
$msgText = "Name: " . $leadName;
$msgText .= "\r\nEmail: " . $leadEmail;
$msgText .= "\r\nPhone: " . $leadPhone;
if(!empty($leadSubject)) {
    $msgText .= "\r\nSubject: $leadSubject";
}
$msgText .= "\r\nMessage: " . $leadMessage;
$msgHTML = "Name: " . $leadName;
$msgHTML .= "<br />Email: " . $leadEmail;
if(!empty($leadSubject)) {
    $msgHTML .= "<br />Subject: $leadSubject";
}
$msgHTML .= "<br />Phone: " . $leadPhone;
$msgHTML .= "<br />Message: " . $leadMessage;
#endregion
#region SEND FORM DATA VIA EMAIL
$mg = new Mailgun($mgKey);
$params = array(
    'from'    => "forms@$DomainName",
    'to'      => $recipient,
    'subject' => $leadSource,
    'text'    => $msgText,
    'html' => $msgHTML
);
$mg->sendMessage($DomainName, $params);
#endregion
#endregion
#region SAVE TO CRM
$filter = " WHERE L.CompanyUUID = :CompanyUUID AND L.IsDeleted = 0 AND LC.ContactEmail = :ContactEmail";
$query = "SELECT L.ID FROM LeadContact LC JOIN Lead L ON L.ID = LC.LeadID" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':CompanyUUID',$CompanyUUID);
$sql->bindValue(':ContactEmail',$leadEmail);
$sql->execute();
$row = $sql->fetch();
if(!empty($row)) {
    $query = "INSERT INTO LeadAction (
    LeadID, ActionType, ActionData, ActionStartDT, ActionFrom, DateCreated, CreatedBy
    ) VALUES (
    :LeadID, :ActionType, :ActionData, :ActionStartDT, :ActionFrom, :DateCreated, :CreatedBy
    )";
    $sql = $pdo->prepare($query);
    $sql->bindValue(':LeadID',$row["ID"]);
    $sql->bindValue(':ActionType',"Note");
    $sql->bindValue(':ActionData',"{$leadSource}\r\n{$leadSubject}{$leadMessage}");
    $sql->bindValue(':ActionStartDT',date("Y-m-d H:i:s"));
    $sql->bindValue(':ActionFrom',$leadEmail);
    $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
    $sql->bindValue(':CreatedBy',"System");
    $sql->execute();
} else {
    #region GET USER LOCATION
    $IPAddress = $_SERVER['REMOTE_ADDR'];
    $userLocation = "";
    switch($IPAddress) {
        case "::1":
        case "localhost":
        case "127.0.0.1":
            $userLocation = "Localhost";
            break;
        default:
            try {
                $IPReader = new Reader('/home/GeoLite2-City.mmdb');
                $IPRecord = $IPReader->city($IPAddress);
                $IPCountry = $IPRecord->country->name;
                $IPCity = $IPRecord->city->name;
                if(!empty($IPCountry)) {
                    $userLocation = $IPCountry;
                }
                if(!empty($IPCountry) && !empty($IPCity)) {
                    $userLocation = $IPCity . ", " . $IPCountry;
                }
            }
            catch(Exception $ex) {
                $userLocation = "";
            }  
            break;                  
    }
    #endregion
    $uuid = generateUUID();
    $query = "INSERT INTO Lead (
    UUID, LeadName, LeadLocation, LeadStatus, LeadSource, CompanyUUID, DateCreated, CreatedBy
    ) VALUES (
    :UUID, :LeadName, :LeadLocation, :LeadStatus, :LeadSource, :CompanyUUID, :DateCreated, :CreatedBy
    )";
    $sql = $pdo->prepare($query);
    $sql->bindValue(':UUID',$uuid);
    $sql->bindValue(':LeadName',$leadName);
    $sql->bindValue(':LeadLocation', $userLocation);
    $sql->bindValue(':LeadStatus',"Interested");
    $sql->bindValue(':LeadSource',$leadSource);
    $sql->bindValue(':CompanyUUID',$CompanyUUID);
    $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
    $sql->bindValue(':CreatedBy',"System");
    $sql->execute();
    $leadID = $pdo->lastInsertId();

    $query = "INSERT INTO LeadContact (
    LeadID, ContactName, ContactPhone, ContactEmail, ContactLocation, DateCreated, CreatedBy
    ) VALUES (
    :LeadID, :ContactName, :ContactPhone, :ContactEmail, :ContactLocation, :DateCreated, :CreatedBy
    )";
    $sql = $pdo->prepare($query);
    $sql->bindValue(':LeadID',$leadID);
    $sql->bindValue(':ContactName',$leadName);
    $sql->bindValue(':ContactPhone',$leadPhone);
    $sql->bindValue(':ContactEmail',$leadEmail);
    $sql->bindValue(':ContactLocation',$userLocation);
    $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
    $sql->bindValue(':CreatedBy',"System");
    $sql->execute();
    $contactID = $pdo->lastInsertId();

    $query = "UPDATE Lead SET PrimaryContactID = :PrimaryContactID WHERE UUID = :UUID";
    $sql = $pdo->prepare($query);
    $sql->bindValue(':UUID',$uuid);
    $sql->bindValue(':PrimaryContactID',$contactID);
    $sql->execute();

    $query = "INSERT INTO LeadAction (
    LeadID, ActionType, ActionData, ActionStartDT, ActionFrom, DateCreated, CreatedBy
    ) VALUES (
    :LeadID, :ActionType, :ActionData, :ActionStartDT, :ActionFrom, :DateCreated, :CreatedBy
    )";
    $sql = $pdo->prepare($query);
    $sql->bindValue(':LeadID',$leadID);
    $sql->bindValue(':ActionType',"Note");
    $sql->bindValue(':ActionData',"{$leadSource}\r\n{$leadSubject}{$leadMessage}");
    $sql->bindValue(':ActionStartDT',date("Y-m-d H:i:s"));
    $sql->bindValue(':ActionFrom',$leadEmail);
    $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
    $sql->bindValue(':CreatedBy',"System");
    $sql->execute();
}
#endregion

$response["code"] = 1;
echo json_encode($response);
}
catch(Exception $ex) {
    $response["code"] = 0;
    $response["msg"] = $ex->getMessage();
    error_log("Form Submission Error: " . $ex->getMessage());
    echo json_encode($response);
}
$pdo = null;

?>