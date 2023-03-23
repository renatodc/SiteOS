<?php

require_once '../api/dbtoken.php';
require_once 'helper.php';
require 'vendor/autoload.php';
use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;
use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;
$mgKey = $config["mg_key"];

try {
#region GET MESSAGE PARAMETERS
$domain = "";
if(!empty($_REQUEST['domain'])) {
    $domain = $_REQUEST['domain'];
}
$from = "";
if(!empty($_REQUEST['from'])) {
    $from = $_REQUEST['from'];
}
$sender = "";
if(!empty($_REQUEST['sender'])) {
    $sender = $_REQUEST['sender'];
}
$recipient = "";
if(!empty($_REQUEST['recipient'])) {
    $recipient = $_REQUEST['recipient'];
}
$recipients = explode(",",$recipient); // parse comma separated recipients
$subject = "";
if(!empty($_REQUEST['subject'])) {
    $subject = $_REQUEST['subject'];
}
$bodyplain = "";
if(!empty($_REQUEST['body-plain'])) {
    $bodyplain = $_REQUEST['body-plain'];
}
$bodyhtml = "";
if(!empty($_REQUEST['body-html'])) {
    $bodyhtml = $_REQUEST['body-html'];
}
$attachments = "";
if(!empty($_REQUEST['attachments'])) {
    $attachments = $_REQUEST['attachments'];
}
$timestamp = 0;
if(!empty($_REQUEST['timestamp'])) {
    $timestamp = $_REQUEST['timestamp'];
}
$msgHeaders = "";
if(!empty($_REQUEST['message-headers'])) {
    $msgHeaders = $_REQUEST['message-headers'];
}
#endregion
foreach($recipients as $receiver) {
#region EXTRACT KEY DATA
#region EXTRACT SENDER NAME AND ADDRESS
$fromMail = $from;
$fromName = $from;
$iBegin = strpos($from, "<");
$iEnd = strpos($from, ">");
$iDiff = $iEnd - $iBegin;
if($iBegin > 0 && $iEnd > 0 && $iEnd > $iBegin) {
    $fromMail = trim(substr($from, $iBegin + 1, $iDiff - 1), " \"");
    $fromName = trim(substr($from,0,$iBegin), " \"");
}
if(empty($fromName)) {
    $fromName = $from;
}
#endregion
#region EXTRACT DOMAIN
$fromDomain = "";
if(preg_match('/^[^@]+[@]([^@]+)$/',$fromMail,$match)) {
    $fromDomain = $match[1];
}
else if(preg_match('/^([^@]+)$/',$fromMail,$match)) {
    $fromDomain = $match[1];
}
#endregion
$toMail = extractEmailAddress($receiver);
#region GET KEY DATA USING DOMAIN
$filter = " WHERE DomainName = :DomainName";
$query = "SELECT UUID, SubDomain, MailReceived FROM Company" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':DomainName',$domain);
$sql->execute();
$result = $sql->fetch();
$CompanyUUID = $result["UUID"];
$SubDomain = $result["SubDomain"];
$MailReceived = intval($result["MailReceived"]);
#region VALIDATE RECIPIENT INTEGRITY
$filter = " WHERE CompanyEmail = :CompanyEmail";
$query = "SELECT CompanyUUID,MailReceived FROM Customer" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':CompanyEmail',$toMail);
$sql->execute();
$result = $sql->fetch();
if(empty($result)) {
    error_log("$toMail not found in DB");
    continue; // RECIPIENT NOT IN DB
}
#endregion
#endregion
#endregion
#region FILTER SPAM ACCORDING TO COMPANY RULES
#region CHECK BLACKLISTED DOMAINS
$isEmailBanned = false;
$filter = " WHERE MailDomain = :MailDomain AND FilterScope = 'Domain' AND FilterType = 'Company' AND CompanyUUID = :CompanyUUID";
$query = "SELECT FilterStatement FROM MailFirewall" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':MailDomain',$domain);
$sql->bindValue(':CompanyUUID',$CompanyUUID);
$sql->execute();
$results = $sql->fetchAll();
foreach($results as $result) {
    if(strpos($result["FilterStatement"], "*") === false) {
        $result["FilterStatement"] = "*" . $result["FilterStatement"];
    }
    if(fnmatch($result["FilterStatement"], $fromDomain)) {
        $isEmailBanned = true;
    }
}
#endregion
#region CHECK BLACKLISTED EMAILS
$filter = " WHERE MailDomain = :MailDomain AND FilterScope = 'Email' AND FilterStatement = :FilterStatement AND FilterType = 'Company' AND CompanyUUID = :CompanyUUID";
$query = "SELECT ID FROM MailFirewall" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':MailDomain',$domain);
$sql->bindValue(':FilterStatement',$fromMail);
$sql->bindValue(':CompanyUUID',$CompanyUUID);
$sql->execute();
$result = $sql->fetch();
if(!empty($result)) {
    $isEmailBanned = true;
}
#endregion
#endregion
#region PROCESS MESSAGE
#region FILTER MESSAGE CONTENT (TAGS)
$bodyhtmlFiltered = removeHeaderTags($bodyhtml);
#endregion
#region CONVERT <STYLE> TAGS TO INLINE CSS
$inliner = new CssToInlineStyles();
do {
    $styleTagStart = "<style";
    $styleTagEnd = "</style>";
    $styleTagStartPos = stripos($bodyhtmlFiltered, $styleTagStart);
    $styleTagEndPos = stripos($bodyhtmlFiltered, $styleTagEnd, $styleTagStartPos);
    $styleTagLengthDiff = $styleTagEndPos + strlen($styleTagEnd) - $styleTagStartPos;
    if($styleTagStartPos !== false) {
        $bodycss = substr($bodyhtmlFiltered, $styleTagStartPos, $styleTagLengthDiff);
        $bodyhtmlFiltered = substr_replace($bodyhtmlFiltered, '', $styleTagStartPos, $styleTagLengthDiff);
        $bodyhtmlFiltered = $inliner->convert($bodyhtmlFiltered, $bodycss);
    }
} while($styleTagStartPos !== false);
#endregion
#region FILTER MESSAGE CONTENT (XSS)
$purifyConfig = HTMLPurifier_Config::createDefault();
$purifier = new HTMLPurifier($purifyConfig);
$bodyhtmlFiltered = $purifier->purify($bodyhtmlFiltered);
#endregion
#endregion
#region UPLOAD ATTACHMENTS TO S3
$s3 = new S3Client([
    'version' => $config["s3_version"],
    'region'  => $config["s3_region"]
]);
$attachLib = array();
$attachmentURLPrefix = "https://api:$mgKey@";
if(!empty($attachments)) {
    $json = json_decode($attachments);
    foreach($json as $file) {
        $arrFile = (array)$file; 
        $keyname = $arrFile["name"];
        if(empty($keyname)) {
            $keyname = "attach0";
        }
        $newUrl = str_replace("https://",$attachmentURLPrefix,$arrFile["url"]);
        $result = $s3->putObject([
            'Bucket' => $config["s3_bucket"],
            'Key'    => $SubDomain . '/' . generateUUID() . '/' . $keyname,
            'Body'   => file_get_contents($newUrl),
            'ACL'    => 'public-read'
        ]);
        // BUILD ATTACHMENT REFERENCE
        $attachObj = array();
        $attachObj["url"] = $result['ObjectURL'];
        $attachObj["content-type"] = $arrFile["content-type"];
        $attachObj["name"] = $arrFile["name"];
        $attachObj["size"] = $arrFile["size"];
        array_push($attachLib, $attachObj);
    }
    $attachments = json_encode($attachLib);
}
#endregion
#region FILTER SPAM ACCORDING TO PERSONAL RULES
#region CHECK BLACKLISTED DOMAINS
$filter = " WHERE MailDomain = :MailDomain AND FilterScope = 'Domain' AND FilterStatement LIKE :FilterStatement AND FilterType = 'Personal' AND CompanyEmail = :CompanyEmail";
$query = "SELECT ID FROM MailFirewall" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':MailDomain',$domain);
$sql->bindValue(':FilterStatement','%'.$fromDomain);
$sql->bindValue(':CompanyEmail',trim($receiver));
$sql->execute();
$result = $sql->fetch();
if(!empty($result)) {
    $isEmailBanned = true;
}
#endregion
#region CHECK BLACKLISTED EMAILS
$filter = " WHERE MailDomain = :MailDomain AND FilterScope = 'Email' AND FilterStatement = :FilterStatement AND FilterType = 'Personal' AND CompanyEmail = :CompanyEmail";
$query = "SELECT ID FROM MailFirewall" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':MailDomain',$domain);
$sql->bindValue(':FilterStatement',$fromMail);
$sql->bindValue(':CompanyEmail',trim($receiver));
$sql->execute();
$result = $sql->fetch();
if(!empty($result)) {
    $isEmailBanned = true;
}
#endregion
$MailFolderUUID = "";
#region GET "Spam" MailFolderUUID
if($isEmailBanned) {
    $filter = " WHERE CompanyUUID = :CompanyUUID AND CompanyEmail = :CompanyEmail AND FolderName = 'Spam'";
    $query = "SELECT UUID FROM MailFolder" . $filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':CompanyUUID',$CompanyUUID);
    $sql->bindValue(':CompanyEmail',trim($receiver));
    $sql->execute();
    $result = $sql->fetch();
    $MailFolderUUID = $result["UUID"];
}
#endregion
#endregion
#region INCREMENT MAILRECEIVED COUNTERS
$filter = " WHERE CompanyEmail = :CompanyEmail";
$query = "UPDATE Customer SET MailReceived = MailReceived + 1" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':CompanyEmail',trim($receiver));
$sql->execute();

$filter = " WHERE UUID = :UUID";
$query = "UPDATE Company SET MailReceived = MailReceived + 1" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':UUID',$CompanyUUID);
$sql->execute();
#endregion
#region SAVE MESSAGE
$query = "INSERT INTO Mail
(UUID, CompanyUUID, MailDomain, MailFrom, MailSender, MailTo, MailSubject, MailBodyPlain, MailBodyHTML, MailBodyFiltered, MessageHeaders, MailAttachments, MailFolder, MailFolderUUID, DateSent)
VALUES
(:UUID,:CompanyUUID,:MailDomain,:MailFrom,:MailSender,:MailTo,:MailSubject,:MailBodyPlain,:MailBodyHTML, :MailBodyFiltered, :MessageHeaders, :MailAttachments,:MailFolder,:MailFolderUUID,:DateSent)";
$uuid = generateUUID();
try {
    $sql = $pdo->prepare($query);
    $sql->bindValue(':UUID',$uuid);
    $sql->bindValue(':CompanyUUID',$CompanyUUID);
    $sql->bindValue(':MailDomain',$domain);
    $sql->bindValue(':MailFrom',$from);
    $sql->bindValue(':MailSender',$sender);
    $sql->bindValue(':MailTo',trim($receiver));
    $sql->bindValue(':MailSubject',$subject);
    $sql->bindValue(':MailBodyPlain',$bodyplain);
    $sql->bindValue(':MailBodyHTML',$bodyhtml);
    $sql->bindValue(':MailBodyFiltered',$bodyhtmlFiltered);
    $sql->bindValue(':MessageHeaders',$msgHeaders);
    $sql->bindValue(':MailAttachments',$attachments);
    $sql->bindValue(':MailFolder',($isEmailBanned ? "Spam" : "Inbox"));
    $sql->bindValue(':MailFolderUUID',$MailFolderUUID);
    $sql->bindValue(':DateSent',date("Y-m-d H:i:s", $timestamp));
    $sql->execute();
}
catch(Exception $ex) {
    // ON STORAGE FAILURE, CONVERT CONTENT TO UTF-8
    try {
        $sql = $pdo->prepare($query);
        $subject = utf8_encode($subject);
        $bodyplain = utf8_encode($bodyplain);
        $bodyhtml = utf8_encode($bodyhtml);
        $bodyhtmlFiltered = utf8_encode($bodyhtmlFiltered);
        $sql->bindValue(':UUID',$uuid);
        $sql->bindValue(':CompanyUUID',$CompanyUUID);
        $sql->bindValue(':MailDomain',$domain);
        $sql->bindValue(':MailFrom',$from);
        $sql->bindValue(':MailSender',$sender);
        $sql->bindValue(':MailTo',trim($receiver));
        $sql->bindValue(':MailSubject',$subject);
        $sql->bindValue(':MailBodyPlain',$bodyplain);
        $sql->bindValue(':MailBodyHTML',$bodyhtml);
        $sql->bindValue(':MailBodyFiltered',$bodyhtmlFiltered);
        $sql->bindValue(':MessageHeaders',$msgHeaders);
        $sql->bindValue(':MailAttachments',$attachments);
        $sql->bindValue(':MailFolder',($isEmailBanned ? "Spam" : "Inbox"));
        $sql->bindValue(':MailFolderUUID',$MailFolderUUID);
        $sql->bindValue(':DateSent',date("Y-m-d H:i:s", $timestamp));
        $sql->execute();
    }
    catch(Exception $ex) {
        // MESSAGE STORAGE FAILED
        error_log($ex->getMessage());
    }
}
#endregion
#region CRM ACTIONS
if($isEmailBanned) return true;
// SEARCH FOR SENDER IN CRM
$filter = " WHERE LC.ContactEmail = :ContactEmail AND L.CompanyUUID = :CompanyUUID AND LC.IsDeleted = 0";
$query = "SELECT L.ID AS LeadID FROM LeadContact LC JOIN Lead L ON LC.LeadID = L.ID" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':ContactEmail',$fromMail);
$sql->bindValue(':CompanyUUID',$CompanyUUID);
$sql->execute();
$result = $sql->fetch();
// IF FOUND, ADD "INCOMING EMAIL" LEAD ACTION. IF NOT FOUND, CREATE LEAD, THEN LEAD CONTACT, THEN ADD "INCOMING EMAIL" LEAD ACTION.
if(!empty($result)) {
    $filter = " WHERE CompanyEmail = :CompanyEmail";
    $query = "SELECT CRMSaveIncomingEmail FROM Customer " . $filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':CompanyEmail',trim($receiver));
    $sql->execute();
    $resultCRM = $sql->fetch();
    if($resultCRM["CRMSaveIncomingEmail"] == 1) {
        
        $filter = " WHERE ID = :ID";
        $query = "UPDATE Lead SET DateModified = :DateModified" . $filter;
        $sql = $pdo->prepare($query);
        $sql->bindValue(':ID',$result["LeadID"]);
        $sql->bindValue(':DateModified',date("Y-m-d H:i:s"));
        $sql->execute();
        
        $query = "INSERT INTO LeadAction
        (LeadID, ActionType, ActionStatus, ActionData, ActionPrice, ActionFrom, ActionTo, ActionStartDT, DateCreated, CreatedBy)
        VALUES
        (:LeadID, :ActionType, :ActionStatus, :ActionData, :ActionPrice, :ActionFrom, :ActionTo, :ActionStartDT, :DateCreated, :CreatedBy)";
        $sql = $pdo->prepare($query);
        $sql->bindValue(':LeadID',$result["LeadID"]);
        $sql->bindValue(':ActionType',"Incoming Email");
        $sql->bindValue(':ActionStatus',"Sent"); 
        $sql->bindValue(':ActionData',$bodyplain);
        $sql->bindValue(':ActionPrice',0.0);
        $sql->bindValue(':ActionFrom',$from);
        $sql->bindValue(':ActionTo',trim($receiver));
        $sql->bindValue(':ActionStartDT',date("Y-m-d H:i:s"));
        $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
        $sql->bindValue(':CreatedBy',$domain);
        $sql->execute();
    }
}
else {
    $filter = " WHERE CompanyEmail = :CompanyEmail";
    $query = "SELECT CRMSaveIncomingEmail FROM Customer " . $filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':CompanyEmail',trim($receiver));
    $sql->execute();
    $resultCRM = $sql->fetch();
    if($resultCRM["CRMSaveIncomingEmail"] == 1) {
        $query = "INSERT INTO Lead (
        UUID, LeadName, LeadStatus, LeadSource, CompanyUUID, DateCreated, CreatedBy
        ) VALUES (
        :UUID, :LeadName, :LeadStatus, :LeadSource, :CompanyUUID, :DateCreated, :CreatedBy
        )";
        $sql = $pdo->prepare($query);
        $uuid = generateUUID();
        $sql->bindValue(':UUID',$uuid);
        $sql->bindValue(':LeadName',$fromName);
        $sql->bindValue(':LeadStatus',"Interested");
        $sql->bindValue(':LeadSource',"Email Contact");
        $sql->bindValue(':CompanyUUID',$CompanyUUID);
        $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
        $sql->bindValue(':CreatedBy',"Email System");
        $sql->execute();
        $leadID = $pdo->lastInsertId();

        $query = "INSERT INTO LeadContact (
        LeadID, ContactName, ContactEmail, DateCreated, CreatedBy
        ) VALUES (
        :LeadID, :ContactName, :ContactEmail, :DateCreated, :CreatedBy
        )";
        $sql = $pdo->prepare($query);
        $sql->bindValue(':LeadID',$leadID);
        $sql->bindValue(':ContactName',$fromName);
        $sql->bindValue(':ContactEmail',$fromMail);
        $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
        $sql->bindValue(':CreatedBy',"Email System");
        $sql->execute();
        $contactID = $pdo->lastInsertId();

        $query = "UPDATE Lead SET PrimaryContactID = :PrimaryContactID WHERE UUID = :UUID";
        $sql = $pdo->prepare($query);
        $sql->bindValue(':UUID',$uuid);
        $sql->bindValue(':PrimaryContactID',$contactID);
        $sql->execute();

        $query = "INSERT INTO LeadAction
            (LeadID, ActionType, ActionStatus, ActionData, ActionPrice, ActionFrom, ActionTo, ActionStartDT, DateCreated, CreatedBy)
        VALUES
        (:LeadID, :ActionType, :ActionStatus, :ActionData, :ActionPrice, :ActionFrom, :ActionTo, :ActionStartDT, :DateCreated, :CreatedBy)";
        $sql = $pdo->prepare($query);
        $sql->bindValue(':LeadID',$leadID);
        $sql->bindValue(':ActionType',"Incoming Email");
        $sql->bindValue(':ActionStatus',"Sent");
        $sql->bindValue(':ActionData',$bodyplain);
        $sql->bindValue(':ActionPrice',0.0);
        $sql->bindValue(':ActionFrom',$from);
        $sql->bindValue(':ActionTo',trim($receiver));
        $sql->bindValue(':ActionStartDT',date("Y-m-d H:i:s"));
        $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
        $sql->bindValue(':CreatedBy',$domain);
        $sql->execute();
    }
}
#endregion
}
}
catch(Exception $error) {
    $errorDetail = "ERROR: " . $error->getMessage() . ". FROM: " . $from . ". TO: " . $recipient;
    error_log($errorDetail);
    http_response_code(400);
}

?>