<?php

require_once '../api/dbtoken.php';
require_once 'helper.php';
require_once 'payload.php';

if(!empty($input["event-data"]["user-variables"]["LeadActionID"])) {
    $leadActionID = $input["event-data"]["user-variables"]["LeadActionID"];
    if(strpos($leadActionID, "\"") !== false) {
        $leadActionID = str_replace("\"","",$leadActionID);
    }

    $filter = " WHERE ID = :ID";
    $query = "UPDATE LeadAction SET ActionStatus = :ActionStatus, DateModified = :DateModified" . $filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$leadActionID);
    $sql->bindValue(':ActionStatus',"Opened");
    $sql->bindValue(':DateModified',date("Y-m-d H:i:s"));
    $sql->execute();
}
if(!empty($input["event-data"]["user-variables"]["CampaignID"])) {
    $entryID = $input["event-data"]["user-variables"]["CampaignID"];
    if(strpos($entryID, "\"") !== false) {
        $entryID = str_replace("\"","",$entryID);
    }
    $table = "MailBroadcast";
    $filter = " WHERE ID = :ID";
    $query = "UPDATE MailBroadcast SET TotalOpened = TotalOpened + 1, DTOpened = :DTOpened, DateModified = :DateModified" . $filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->bindValue(':DTOpened',date("Y-m-d H:i:s"));
    $sql->bindValue(':DateModified',date("Y-m-d H:i:s"));
    $sql->execute();
}
if(!empty($input["event-data"]["user-variables"]["MailID"])) {
    $entryID = $input["event-data"]["user-variables"]["MailID"];
    $table = "Mail";
    $filter = " WHERE ID = :ID";
    $query = "UPDATE Mail SET IsOpened = 1,
    DTOpened = :DTOpened,
    TrackedIP = :TrackedIP,
    TrackedCountry = :TrackedCountry,
    TrackedRegion = :TrackedRegion,
    TrackedCity = :TrackedCity,
    TrackedUserAgent = :TrackedUserAgent,
    TrackedDeviceType = :TrackedDeviceType,
    TrackedClientType = :TrackedClientType,
    TrackedClientName = :TrackedClientName,
    TrackedClientOS = :TrackedClientOS".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->bindValue(':DTOpened',date("Y-m-d H:i:s"));
    $sql->bindValue(':TrackedIP',$ip);
    $sql->bindValue(':TrackedCountry',$country);
    $sql->bindValue(':TrackedRegion',$region);
    $sql->bindValue(':TrackedCity',$city);
    $sql->bindValue(':TrackedUserAgent',$userAgent);
    $sql->bindValue(':TrackedDeviceType',$deviceType);
    $sql->bindValue(':TrackedClientType',$clientType);
    $sql->bindValue(':TrackedClientName',$clientName);
    $sql->bindValue(':TrackedClientOS',$clientOS);
    $sql->execute();
}
if(!empty($entryID) && !empty($table) && !empty($input["event-data"]["recipient"])) {
    $recipient = $input["event-data"]["recipient"];

    $filter = " WHERE ID = :ID";
    $query = "SELECT RecipientsOpened FROM $table".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->execute();
    $row = $sql->fetch();
    $RecipientsOpened = $row["RecipientsOpened"];

    if(empty($RecipientsOpened)) {
        $filter = " WHERE ID = :ID";
        $query = "UPDATE $table SET RecipientsOpened = :RecipientsOpened".$filter;
        $sql = $pdo->prepare($query);
        $sql->bindValue(':ID',$entryID);
        $sql->bindValue(':RecipientsOpened',$recipient);
        $sql->execute();
    } else {
        $recipients = explode(",",$RecipientsOpened);
        if(!empty($recipient) && !in_array($recipient,$recipients)) {
            array_push($recipients, $recipient);
            $newRecipients = implode(",", $recipients);
            
            $filter = " WHERE ID = :ID";
            $query = "UPDATE $table SET RecipientsOpened = :RecipientsOpened".$filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':ID',$entryID);
            $sql->bindValue(':RecipientsOpened',$newRecipients);
            $sql->execute();
        }
    }
} else {
    error_log("Invalid Payload");
    error_log(print_r($input, true));
}

$response = array();
$response["success"] = 1;
$response["message"] = "Post received. Thanks!"; 
echo json_encode($response);

?>