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
    $query = "UPDATE MailBroadcast SET TotalFailed = TotalFailed + 1, DTFailed = :DTFailed, DateModified = :DateModified".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->bindValue(':DTFailed',date("Y-m-d H:i:s"));
    $sql->bindValue(':DateModified',date("Y-m-d H:i:s"));
    $sql->execute();
}
if(!empty($input["event-data"]["user-variables"]["MailID"])) {
    $entryID = $input["event-data"]["user-variables"]["MailID"];
    $table = "Mail";
    $filter = " WHERE ID = :ID";
    $query = "UPDATE Mail SET IsFailed = 1, DTFailed = :DTFailed".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->bindValue(':DTFailed',date("Y-m-d H:i:s"));
    $sql->execute();
}
if(!empty($entryID) && !empty($table) && !empty($input["event-data"]["recipient"])) {
    $recipient = $input["event-data"]["recipient"];

    $filter = " WHERE ID = :ID";
    $query = "SELECT RecipientsFailed FROM $table".$filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':ID',$entryID);
    $sql->execute();
    $row = $sql->fetch();
    $RecipientsFailed = $row["RecipientsFailed"];

    if(empty($RecipientsFailed)) {
        $filter = " WHERE ID = :ID";
        $query = "UPDATE $table SET RecipientsFailed = :RecipientsFailed".$filter;
        $sql = $pdo->prepare($query);
        $sql->bindValue(':ID',$entryID);
        $sql->bindValue(':RecipientsFailed',$recipient);
        $sql->execute();
    } else {
        $recipients = explode(",",$RecipientsFailed);
        if(!empty($recipient) && !in_array($recipient,$recipients)) {
            array_push($recipients, $recipient);
            $newRecipients = implode(",", $recipients);
            
            $filter = " WHERE ID = :ID";
            $query = "UPDATE $table SET RecipientsFailed = :RecipientsFailed".$filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':ID',$entryID);
            $sql->bindValue(':RecipientsFailed',$newRecipients);
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