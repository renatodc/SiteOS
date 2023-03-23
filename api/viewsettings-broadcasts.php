<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload-json.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST":
            break;
        case "PUT": // UPDATE VIEW COLUMN SETTINGS FOR BROADCASTS CHART
            $response["code"] = 0;
            if(is_numeric($input["ColBroadcastRecipients"]) && 
            is_numeric($input["ColBroadcastDelivered"]) &&
            is_numeric($input["ColBroadcastFailed"]) &&
            is_numeric($input["ColBroadcastOpened"]) &&
            is_numeric($input["ColBroadcastClicked"]) &&
            is_numeric($input["ColBroadcastUnsubscribed"]) &&
            is_numeric($input["ColBroadcastComplained"]) &&
            is_numeric($input["ColBroadcastDateCreated"]) &&
            is_numeric($input["ColBroadcastDateModified"]) &&
            is_numeric($input["ColBroadcastCreatedBy"])) {
                $filter = "WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
                $query = "UPDATE Customer SET ColBroadcastRecipients = :ColBroadcastRecipients, ColBroadcastDelivered = :ColBroadcastDelivered, ColBroadcastFailed = :ColBroadcastFailed, ColBroadcastOpened = :ColBroadcastOpened, ColBroadcastClicked = :ColBroadcastClicked, ColBroadcastUnsubscribed = :ColBroadcastUnsubscribed, ColBroadcastComplained = :ColBroadcastComplained, ColBroadcastDateCreated = :ColBroadcastDateCreated, ColBroadcastDateModified = :ColBroadcastDateModified, ColBroadcastCreatedBy = :ColBroadcastCreatedBy " . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$CustomerUUID);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->bindValue(':ColBroadcastRecipients',$input["ColBroadcastRecipients"]);
                $sql->bindValue(':ColBroadcastDelivered',$input["ColBroadcastDelivered"]);
                $sql->bindValue(':ColBroadcastFailed',$input["ColBroadcastFailed"]);
                $sql->bindValue(':ColBroadcastOpened',$input["ColBroadcastOpened"]);
                $sql->bindValue(':ColBroadcastClicked',$input["ColBroadcastClicked"]);
                $sql->bindValue(':ColBroadcastUnsubscribed',$input["ColBroadcastUnsubscribed"]);
                $sql->bindValue(':ColBroadcastComplained',$input["ColBroadcastComplained"]);
                $sql->bindValue(':ColBroadcastDateCreated',$input["ColBroadcastDateCreated"]);
                $sql->bindValue(':ColBroadcastDateModified',$input["ColBroadcastDateModified"]);
                $sql->bindValue(':ColBroadcastCreatedBy',$input["ColBroadcastCreatedBy"]);
                if($sql->execute()) {
                    $response["code"] = 1;
                }
            }
            echo json_encode($response);
            break;
        case "DELETE":
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