<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload-json.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET": // GET BROADCAST RECORD(S)
            $response["data"] = array();
            $params = "UUID,CampaignName,MailFrom,MailTo,MailCC,MailBCC,MailSubject,MailAttachments,MailBodyPlain,MailBodyFiltered,RecipientsDelivered,RecipientsOpened,RecipientsClicked,RecipientsBounced,RecipientsFailed,RecipientsUnsubscribed,RecipientsComplained,DTDelivered,DTOpened,DTClicked,DTBounced,DTFailed,DTUnsubscribed,DTComplained,TotalRecipients,TotalDelivered,TotalBounced,TotalFailed,TotalOpened,TotalClicked,TotalUnsubscribed,TotalComplained,DateCreated,CreatedBy,DateModified";
            if (empty($key)) {
                $filter = " WHERE CompanyUUID = :CompanyUUID AND IsDeleted = 0";
                $query = "SELECT $params FROM MailBroadcast" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $results = $sql->fetchAll();
                $response["count"] = count($results);
                $response["data"] = $results;
            } else {
                $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID AND IsDeleted = 0";
                $query = "SELECT $params FROM MailBroadcast" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $response["data"] = $sql->fetch();
            }
            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "POST":
            break;
        case "PUT":
            break;
        case "DELETE": // DELETE BROADCAST RECORD
            if (empty($key)) {
                $response["code"] = 0;
                $response["msg"] = "Missing URL key";
            } else {
                $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
                $query = "UPDATE MailBroadcast SET IsDeleted = 1" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();

                $response["code"] = 1;
            }
            echo json_encode($response);
            break;
        case "PATCH":
            break;
    }
}
catch(Exception $ex) {
    $response["code"] = 0;
    $response["msg"] = $ex->getMessage();
    echo json_encode($response);
}
$pdo = null;

?>