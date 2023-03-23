<?php

require_once '../api/session.php';
require_once '../api/dbtoken.php';
require_once 'helper.php';
require 'html2text.php';
require 'vendor/autoload.php';
validateCsrfToken();
use Mailgun\Mailgun;
$mg = Mailgun::create($config["mg_key"]);

try {
#region PROCESS MESSAGE INPUT
#region GET MESSAGE PARAMETERS
$domain = getDomainName($pdo,$CompanyUUID);

$filter = " WHERE UUID = :UUID";
$query = "SELECT CompanyEmail FROM Customer" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':UUID',$CustomerUUID);
$sql->execute();
$result = $sql->fetch();
$from = $result["CompanyEmail"];

$to = "";
if(!empty($_POST['to'])) {
    $to = $_POST['to'];
}
$cc = "";
if(!empty($_POST['cc'])) {
    $cc = $_POST['cc'];
}
$bcc = "";
if(!empty($_POST['bcc'])) {
    $bcc = $_POST['bcc'];
}
$recipients = array_filter(array_merge(explode(",",$to),explode(",",$cc),explode(",",$bcc)));

$msgSubject = "";
if(!empty($_POST['msgSubject'])) {
    $msgSubject = $_POST['msgSubject'];
}
$msgContent = "";
if(!empty($_POST['msgContent'])) {
    $msgContent = $_POST['msgContent'];
}

$attachments = "";
if(!empty($_POST['attachments'])) {
    $attachments = $_POST['attachments'];
}
$attachmentLinks = "";
if(!empty($_POST['attachmentLinks'])) {
    $attachmentLinks = $_POST['attachmentLinks'];
}
#endregion
#region CONVERT HTML TO TEXT
try {
    $msgText = convert_html_to_text($msgContent);
}
catch(Exception $htmlConversionException) {
    $msgText = "";
}
#endregion
#region FILTER MESSAGE CONTENT
try {
    $msgContentFiltered = removeHeaderTags($msgContent);
    $purifyConfig = HTMLPurifier_Config::createDefault();
    $purifier = new HTMLPurifier($purifyConfig);
    $msgContentFiltered = $purifier->purify($msgContentFiltered);
}
catch(Exception $htmlPurifyException) {
    $msgContentFiltered = $msgContent;
}
#endregion
#endregion
#region VALIDATE MESSAGE
if(!isset($CompanyUUID)) { # AUTHENTICATION FAILED
    $response["error"] = "noauth";
    $response["msg"] = "Authentication expired. Please log in again.";
    $response["code"] = 2;
    echo json_encode($response);
    return;
}
if(empty($to)) { # NO RECIPIENT
    $response["error"] = "norecipient";
    $response["msg"] = "Message has no recipient";
    $response["code"] = 3;
    echo json_encode($response);
    return;
}
if(count($recipients) > $config["max_recipients"]) { # EXCEEDED MAX LIMIT OF RECIPIENTS
    $response["error"] = "maxrecipients";
    $response["msg"] = "Exceeded maximum limit of recipients.";
    $response["code"] = 5;
    echo json_encode($response);
    return;
}
#endregion
#region PREPARE MESSAGE
$params = array(
    'from'    => $from,
    'to'      => $to,
    'subject' => $msgSubject,
    'text'    => $msgText,
    'html'    => $msgContentFiltered
);
if(!empty($cc)) {
    $params["cc"] = $cc;
}
if(!empty($bcc)) {
    $params["bcc"] = $bcc;
}
if(!empty($attachments)) {
    $attachmentPayload = array();
    foreach(array_filter(explode(",",$attachmentLinks)) as $att) {
        if(!empty($att)) {
            $attachmentObj = array(
                'filePath' => $att,
                'filename' => $att
            );
            array_push($attachmentPayload, $attachmentObj);
        }
    }
    $params["attachment"] = $attachmentPayload;
}
#endregion
#region CRM ACTIONS
$recipientVars = array();
#region CRM -> GET LEAD CONTACTS
$filter = " WHERE L.CompanyUUID = :CompanyUUID AND LC.IsDeleted = 0";
$query = "SELECT * FROM LeadContact LC JOIN Lead L ON LC.LeadID = L.ID" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':CompanyUUID',$CompanyUUID);
$sql->execute();
$contacts = $sql->fetchAll();
#endregion
#region SEARCH FOR RECIPIENT IN CRM. IF CONTACT FOUND: SET RECIPIENT_VARS. IF NOT FOUND: CREATE LEAD. ALWAYS: ADD "OUTGOING EMAIL" LEAD ACTION.
$LeadActionID = 0;
foreach($recipients as $recipient) {
    $contactFoundInCRM = false;
    $recipientAddress = extractEmailAddress($recipient);
    #region SEARCH FOR RECIPIENT IN CRM. IF CONTACT FOUND: ADD "OUTGOING EMAIL" LEAD ACTION, SET RECIPIENT_VARS.
    foreach($contacts as $contact) {
        if($contact["ContactEmail"] == $recipientAddress) {
            $contactFoundInCRM = true;            
            
            $filter = " WHERE ID = :ID";
            $query = "UPDATE Lead SET DateModified = :DateModified" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':ID',$contact["LeadID"]);
            $sql->bindValue(':DateModified',date("Y-m-d H:i:s"));
            $sql->execute();

            #region CRM -> ADD "OUTGOING EMAIL" LEAD ACTION
            $query = "INSERT INTO LeadAction
            (LeadID, ActionType, ActionStatus, ActionData, ActionPrice, ActionFrom, ActionTo, ActionStartDT, DateCreated, CreatedBy)
            VALUES
            (:LeadID, :ActionType, :ActionStatus, :ActionData, :ActionPrice, :ActionFrom, :ActionTo, :ActionStartDT, :DateCreated, :CreatedBy)";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':LeadID',$contact["LeadID"]);
            $sql->bindValue(':ActionType',"Outgoing Email");
            $sql->bindValue(':ActionStatus',"Sent");
            $sql->bindValue(':ActionData',$msgText);
            $sql->bindValue(':ActionPrice',0.00050);
            $sql->bindValue(':ActionFrom',$from);
            $sql->bindValue(':ActionTo',$recipient);
            $sql->bindValue(':ActionStartDT',date("Y-m-d H:i:s"));
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',$domain);
            $sql->execute();
            $LeadActionID = $pdo->lastInsertId();
            #endregion
            #region RECIPIENT_VARS SET
            #region EXTRACT NAME PARTS
            if(strpos($contact["ContactName"], " ") > -1) {
                $firstName = substr($contact["ContactName"],0,strpos($contact["ContactName"], " "));
                $lastName = substr($contact["ContactName"],strlen($firstName)+1);
            } else {
                $firstName = $contact["ContactName"];
                $lastName = $contact["ContactName"];
            }
            #endregion
            $recipientObj = array();
            $recipientObj["name"] = $contact["ContactName"];
            $recipientObj["fname"] = $firstName;
            $recipientObj["lname"] = $lastName;
            $recipientObj["email"] = $recipientAddress;
            $recipientObj["LeadActionID"] = $LeadActionID;
            $recipientVars[$recipientAddress] = $recipientObj;
            #endregion
        }
    }
    #endregion
    #region IF NOT FOUND: CREATE LEAD, LEAD CONTACT, ADD "OUTGOING EMAIL" LEAD ACTION, SET RECIPIENT_VARS.
    if($contactFoundInCRM == false) {
        #region VERIFY CRMSaveOutgoingEmail IS ON
        $filter = " WHERE CompanyEmail = :CompanyEmail";
        $query = "SELECT CRMSaveOutgoingEmail FROM Customer " . $filter;
        $sql = $pdo->prepare($query);
        $sql->bindValue(':CompanyEmail',$from);
        $sql->execute();
        $result = $sql->fetch();
        #endregion
        if($result["CRMSaveOutgoingEmail"] == 1) {
            #region CRM -> ADD LEAD
            $query = "INSERT INTO Lead (
            UUID, LeadName, LeadStatus, LeadSource, CompanyUUID, DateCreated, CreatedBy
            ) VALUES (
            :UUID, :LeadName, :LeadStatus, :LeadSource, :CompanyUUID, :DateCreated, :CreatedBy
            )";
            $sql = $pdo->prepare($query);
            $uuid = generateUUID();
            $sql->bindValue(':UUID',$uuid);
            $sql->bindValue(':LeadName',$recipientAddress);
            $sql->bindValue(':LeadStatus',"Prospect");
            $sql->bindValue(':LeadSource',"Email Contact");
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',"Email System");
            $sql->execute();
            $leadID = $pdo->lastInsertId();
            #endregion
            #region CRM -> ADD LEAD CONTACT
            $query = "INSERT INTO LeadContact (
            LeadID, ContactName, ContactEmail, DateCreated, CreatedBy
            ) VALUES (
            :LeadID, :ContactName, :ContactEmail, :DateCreated, :CreatedBy
            )";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':LeadID',$leadID);
            $sql->bindValue(':ContactName',$recipientAddress);
            $sql->bindValue(':ContactEmail',$recipientAddress);
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',"Email System");
            $sql->execute();
            $contactID = $pdo->lastInsertId();
            #endregion
            #region CRM -> SET AS PRIMARY CONTACT
            $query = "UPDATE Lead SET PrimaryContactID = :PrimaryContactID WHERE UUID = :UUID";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$uuid);
            $sql->bindValue(':PrimaryContactID',$contactID);
            $sql->execute();
            #endregion
            #region CRM -> ADD "OUTGOING EMAIL" LEAD ACTION
            $query = "INSERT INTO LeadAction
            (LeadID, ActionType, ActionStatus, ActionData, ActionPrice, ActionFrom, ActionTo, ActionStartDT, DateCreated, CreatedBy)
            VALUES
            (:LeadID, :ActionType, :ActionStatus, :ActionData, :ActionPrice, :ActionFrom, :ActionTo, :ActionStartDT, :DateCreated, :CreatedBy)";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':LeadID',$leadID);
            $sql->bindValue(':ActionType',"Outgoing Email");
            $sql->bindValue(':ActionStatus',"Sent");
            $sql->bindValue(':ActionData',$msgText);
            $sql->bindValue(':ActionPrice',0.00050);
            $sql->bindValue(':ActionFrom',$from);
            $sql->bindValue(':ActionTo',$recipientAddress);
            $sql->bindValue(':ActionStartDT',date("Y-m-d H:i:s"));
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',$domain);
            $sql->execute();
            $LeadActionID = $pdo->lastInsertId();
            #endregion
            #region RECIPIENT_VARS SET
            $recipientObj = array();
            $recipientObj["name"] = $recipientAddress;
            $recipientObj["fname"] = $recipientAddress;
            $recipientObj["lname"] = $recipientAddress;
            $recipientObj["email"] = $recipientAddress;
            $recipientObj["LeadActionID"] = $LeadActionID;
            $recipientVars[$recipientAddress] = $recipientObj;
            #endregion
        }
    }
    #endregion
}
#endregion
$params["v:LeadActionID"] = "%recipient.LeadActionID%";
#endregion
if(!empty($_POST['IsBroadcast'])) {
    #region SAVE BROADCAST
    $query = "INSERT INTO MailBroadcast
    (UUID, CampaignName, MailFrom, MailTo, MailCC, MailBCC, MailBodyPlain, MailBodyHTML, MailBodyFiltered, MailSubject, MailAttachments, CompanyUUID, TotalRecipients, DateCreated, CreatedBy)
    VALUES
    (:UUID, :CampaignName, :MailFrom, :MailTo, :MailCC, :MailBCC, :MailBodyPlain, :MailBodyHTML, :MailBodyFiltered, :MailSubject, :MailAttachments, :CompanyUUID, :TotalRecipients, :DateCreated, :CreatedBy)";
    $sql = $pdo->prepare($query);
    $uuid = generateUUID();
    $sql->bindValue(':UUID',$uuid);
    $sql->bindValue(':CampaignName',$msgSubject);
    $sql->bindValue(':MailFrom',$from);
    $sql->bindValue(':MailTo',$to);
    $sql->bindValue(':MailCC',$cc);
    $sql->bindValue(':MailBCC',$bcc);
    $sql->bindValue(':MailBodyPlain',$msgText);
    $sql->bindValue(':MailBodyHTML',$msgContent);
    $sql->bindValue(':MailBodyFiltered',$msgContentFiltered);
    $sql->bindValue(':MailSubject',$msgSubject);
    $sql->bindValue(':MailAttachments',$attachments);
    $sql->bindValue(':TotalRecipients',count($recipients));
    $sql->bindValue(':CompanyUUID',$CompanyUUID);
    $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
    $sql->bindValue(':CreatedBy',$from);
    $sql->execute();
    #endregion
    #region SEND BROADCAST
    $CampaignID = $pdo->lastInsertId();
    $batchMessage = $mg->messages()->getBatchMessage($domain);
    $batchMessage->setFromAddress($from);
    $batchMessage->setSubject($msgSubject);
    $batchMessage->setTextBody($msgText);
    $batchMessage->setHtmlBody($msgContentFiltered);
    $batchMessage->setClickTracking(true);
    $batchMessage->setOpenTracking(true);
    $batchMessage->addCustomData("CampaignID", $CampaignID);
    $batchMessage->addCustomData("LeadActionID", "%recipient.LeadActionID%");
    
    if(!empty($attachments)) {
        foreach(array_filter(explode(",",$attachmentLinks)) as $att) {
            $batchMessage->addAttachment($att);
        }
    }
    
    foreach(array_filter(explode(",",$to)) as $recipient) {
        $recipientAddress = extractEmailAddress($recipient);
        if(array_key_exists($recipientAddress, $recipientVars)) {
            $batchMessage->addToRecipient($recipientAddress, $recipientVars[$recipientAddress]);
        } else {
            $batchMessage->addToRecipient($recipientAddress);
        }
    }
    foreach(array_filter(explode(",",$cc)) as $recipient) {
        $recipientAddress = extractEmailAddress($recipient);
        if(array_key_exists($recipientAddress, $recipientVars)) {
            $batchMessage->addCcRecipient($recipientAddress, $recipientVars[$recipientAddress]);
        } else {
            $batchMessage->addCcRecipient($recipientAddress);
        }
    }
    foreach(array_filter(explode(",",$bcc)) as $recipient) {
        $recipientAddress = extractEmailAddress($recipient);
        if(array_key_exists($recipientAddress, $recipientVars)) {
            $batchMessage->addBccRecipient($recipientAddress, $recipientVars[$recipientAddress]);
        } else {
            $batchMessage->addBccRecipient($recipientAddress);
        }
    }

    $batchMessage->finalize();
    $response["code"] = 1;
    #endregion
} else {
    #region SAVE MESSAGE
    #region Get 'Sent' MailFolderUUID
    $filter = " WHERE CompanyUUID = :CompanyUUID AND FolderName = :FolderName AND CompanyEmail = :CompanyEmail";
    $query = "SELECT UUID FROM MailFolder" . $filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':CompanyEmail',$from);
    $sql->bindValue(':CompanyUUID',$CompanyUUID);
    $sql->bindValue(':FolderName',"Sent");
    $sql->execute();
    $MailFolderUUID = $sql->fetch()["UUID"];
    #endregion
    $query = "INSERT INTO Mail
    (UUID, CompanyUUID, MailDomain, MailFrom, MailSender, MailTo, MailCC, MailBCC, MailSubject, MailBodyPlain, MailBodyHTML, MailBodyFiltered, MailAttachments, MailFolder, MailFolderUUID, IsRead, DateSent)
    VALUES
    (:UUID, :CompanyUUID, :MailDomain, :MailFrom, :MailSender, :MailTo, :MailCC, :MailBCC, :MailSubject, :MailBodyPlain, :MailBodyHTML, :MailBodyFiltered, :MailAttachments, :MailFolder, :MailFolderUUID, :IsRead, :DateSent)";
    $sql = $pdo->prepare($query);
    $uuid = generateUUID();
    $sql->bindValue(':UUID',$uuid);
    $sql->bindValue(':CompanyUUID',$CompanyUUID);
    $sql->bindValue(':MailDomain',$domain);
    $sql->bindValue(':MailFrom',$from);
    $sql->bindValue(':MailSender',$from);
    $sql->bindValue(':MailTo',$to);
    $sql->bindValue(':MailCC',$cc);
    $sql->bindValue(':MailBCC',$bcc);
    $sql->bindValue(':MailSubject',$msgSubject);
    $sql->bindValue(':MailBodyPlain',$msgText);
    $sql->bindValue(':MailBodyHTML',$msgContent);
    $sql->bindValue(':MailBodyFiltered',$msgContentFiltered);
    $sql->bindValue(':MailAttachments',$attachments);
    $sql->bindValue(':MailFolder', "Sent");
    $sql->bindValue(':MailFolderUUID',$MailFolderUUID);
    $sql->bindValue(':IsRead', 1);
    $sql->bindValue(':DateSent',date("Y-m-d H:i:s"));
    $sql->execute();
    $params["v:MailID"] = $pdo->lastInsertId();
    #endregion
    #region SEND MESSAGE
    $mg->messages()->send($domain, $params);
    $response["code"] = 1;
    #endregion
}
#region INCREMENT MAILSENT COUNTERS
$filter = " WHERE UUID = :UUID";
$query = "UPDATE Company SET MailSent = MailSent + :Recipients" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':UUID',$CompanyUUID);
$sql->bindValue(':Recipients',count($recipients));
$sql->execute();

$filter = " WHERE UUID = :UUID";
$query = "UPDATE Customer SET MailSent = MailSent + :Recipients" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':UUID',$CustomerUUID);
$sql->bindValue(':Recipients',count($recipients));
$sql->execute();
#endregion
}
catch(Exception $error) {
    $response["error"] = $error;
    $response["msg"] = $error->getMessage();
    $response["code"] = 0;
    $errorDetail = "ERROR: " . $error->getMessage() . ". FROM: " . $from . ". TO: " . $to . ". DOMAIN: " . $domain;
    error_log($errorDetail);
    error_log(print_r($params, true));
}

echo json_encode($response);

?>