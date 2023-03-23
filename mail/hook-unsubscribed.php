<?php

require_once '../api/dbtoken.php';
require_once 'helper.php';
require_once 'payload.php';

if(!empty($input["event-data"]["user-variables"]["CampaignID"])) {
    $entryID = $input["event-data"]["user-variables"]["CampaignID"];
    if(strpos($entryID, "\"") !== false) {
        $entryID = str_replace("\"","",$entryID);
    }
    $table = "MailBroadcast";
    $filter = " WHERE ID = :ID";
    $query = "UPDATE MailBroadcast SET TotalUnsubscribed = TotalUnsubscribed + 1, DTUnsubscribed = :DTUnsubscribed, DateModified = :DateModified".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->bindValue(':DTUnsubscribed',date("Y-m-d H:i:s"));
    $sql->bindValue(':DateModified',date("Y-m-d H:i:s"));
    $sql->execute();
}
if(!empty($input["event-data"]["user-variables"]["MailID"])) {
    $entryID = $input["event-data"]["user-variables"]["MailID"];
    $table = "Mail";
    $filter = " WHERE ID = :ID";
    $query = "UPDATE Mail SET IsUnsubscribed = 1, DTUnsubscribed = :DTUnsubscribed".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->bindValue(':DTUnsubscribed',date("Y-m-d H:i:s"));
    $sql->execute();
}
if(!empty($entryID) && !empty($table) && !empty($input["event-data"]["recipient"])) {
    $recipient = $input["event-data"]["recipient"];

    $filter = " WHERE ID = :ID";
    $query = "SELECT RecipientsUnsubscribed FROM $table".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->execute();
    $row = $sql->fetch();
    $RecipientsUnsubscribed = $row["RecipientsUnsubscribed"];

    if(empty($RecipientsUnsubscribed)) {
        $filter = " WHERE ID = :ID";
        $query = "UPDATE $table SET RecipientsUnsubscribed = :RecipientsUnsubscribed".$filter;
        $sql = $pdo->prepare($query);
        $sql->bindValue(':ID',$entryID);
        $sql->bindValue(':RecipientsUnsubscribed',$recipient);
        $sql->execute();
    } else {
        $recipients = explode(",",$RecipientsUnsubscribed);
        if(!empty($recipient) && !in_array($recipient,$recipients)) {
            array_push($recipients, $recipient);
            $newRecipients = implode(",", $recipients);
            
            $filter = " WHERE ID = :ID";
            $query = "UPDATE $table SET RecipientsUnsubscribed = :RecipientsUnsubscribed".$filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':ID',$entryID);
            $sql->bindValue(':RecipientsUnsubscribed',$newRecipients);
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