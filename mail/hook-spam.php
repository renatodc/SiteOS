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
    $query = "UPDATE MailBroadcast SET TotalComplained = TotalComplained + 1, DTComplained = :DTComplained, DateModified = :DateModified".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->bindValue(':DTComplained',date("Y-m-d H:i:s"));
    $sql->bindValue(':DateModified',date("Y-m-d H:i:s"));
    $sql->execute();
}
if(!empty($input["event-data"]["user-variables"]["MailID"])) {
    $entryID = $input["event-data"]["user-variables"]["MailID"];
    $table = "Mail";
    $filter = " WHERE ID = :ID";
    $query = "UPDATE Mail SET IsComplained = 1, DTComplained = :DTComplained".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->bindValue(':DTComplained',date("Y-m-d H:i:s"));
    $sql->execute();
}
if(!empty($entryID) && !empty($table) && !empty($input["event-data"]["recipient"])) {
    $recipient = $input["event-data"]["recipient"];

    $filter = " WHERE ID = :ID";
    $query = "SELECT RecipientsComplained FROM $table".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->execute();
    $row = $sql->fetch();
    $RecipientsComplained = $row["RecipientsComplained"];
    
    if(empty($RecipientsComplained)) {
        $filter = " WHERE ID = :ID";
        $query = "UPDATE $table SET RecipientsComplained = :RecipientsComplained".$filter;
        $sql = $pdo->prepare($query);
        $sql->bindValue(':ID',$entryID);
        $sql->bindValue(':RecipientsComplained',$recipient);
        $sql->execute();
    } else {
        $recipients = explode(",",$RecipientsComplained);
        if(!empty($recipient) && !in_array($recipient,$recipients)) {
            array_push($recipients, $recipient);
            $newRecipients = implode(",", $recipients);
            
            $filter = " WHERE ID = :ID";
            $query = "UPDATE $table SET RecipientsComplained = :RecipientsComplained".$filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':ID',$entryID);
            $sql->bindValue(':RecipientsComplained',$newRecipients);
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