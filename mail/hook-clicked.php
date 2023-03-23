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
    $query = "UPDATE MailBroadcast SET TotalClicked = TotalClicked + 1, DTClicked = :DTClicked, DateModified = :DateModified".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->bindValue(':DTClicked',date("Y-m-d H:i:s"));
    $sql->bindValue(':DateModified',date("Y-m-d H:i:s"));
    $sql->execute();
}
if(!empty($input["event-data"]["user-variables"]["MailID"])) {
    $entryID = $input["event-data"]["user-variables"]["MailID"];
    $table = "Mail";
    $filter = " WHERE ID = :ID";
    $query = "UPDATE Mail SET IsClicked = 1, DTClicked = :DTClicked".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->bindValue(':DTClicked',date("Y-m-d H:i:s"));
    $sql->execute();
}
if(!empty($entryID) && !empty($table) && !empty($input["event-data"]["recipient"])) {
    $recipient = $input["event-data"]["recipient"];

    $filter = " WHERE ID = :ID";
    $query = "SELECT RecipientsClicked FROM $table".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->execute();
    $row = $sql->fetch();
    $RecipientsClicked = $row["RecipientsClicked"];

    if(empty($RecipientsClicked)) {
        $filter = " WHERE ID = :ID";
        $query = "UPDATE $table SET RecipientsClicked = :RecipientsClicked".$filter;
        $sql = $pdo->prepare($query);
        $sql->bindValue(':ID',$entryID);
        $sql->bindValue(':RecipientsClicked',$recipient);
        $sql->execute();
    } else {
        $recipients = explode(",",$RecipientsClicked);
        if(!empty($recipient) && !in_array($recipient,$recipients)) {
            array_push($recipients, $recipient);
            $newRecipients = implode(",", $recipients);
            
            $filter = " WHERE ID = :ID";
            $query = "UPDATE $table SET RecipientsClicked = :RecipientsClicked".$filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':ID',$entryID);
            $sql->bindValue(':RecipientsClicked',$newRecipients);
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