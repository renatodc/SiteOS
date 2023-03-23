<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST":
            break;
        case "PUT": // UPDATE VIEW COLUMN SETTINGS FOR LEADS CHART
            $response["code"] = 0;
            if(is_numeric($input["ColLeadsCompany"]) && 
            is_numeric($input["ColLeadsContactName"]) &&
            is_numeric($input["ColLeadsContactEmail"]) &&
            is_numeric($input["ColLeadsStatus"]) &&
            is_numeric($input["ColLeadsLocation"]) &&
            is_numeric($input["ColLeadsSource"]) &&
            is_numeric($input["ColLeadsDateCreated"]) &&
            is_numeric($input["ColLeadsDateModified"]) &&
            is_numeric($input["ColLeadsLastAction"])) {
                $filter = "WHERE UUID = :UUID";
                $query = "UPDATE Customer SET ColLeadsCompany = :ColLeadsCompany, ColLeadsContactName = :ColLeadsContactName, ColLeadsContactEmail = :ColLeadsContactEmail, ColLeadsStatus = :ColLeadsStatus, ColLeadsLocation = :ColLeadsLocation, ColLeadsSource = :ColLeadsSource, ColLeadsDateCreated = :ColLeadsDateCreated, ColLeadsDateModified = :ColLeadsDateModified, ColLeadsLastAction = :ColLeadsLastAction " . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$CustomerUUID);
                $sql->bindValue(':ColLeadsCompany',$input["ColLeadsCompany"]);
                $sql->bindValue(':ColLeadsContactName',$input["ColLeadsContactName"]);
                $sql->bindValue(':ColLeadsContactEmail',$input["ColLeadsContactEmail"]);
                $sql->bindValue(':ColLeadsStatus',$input["ColLeadsStatus"]);
                $sql->bindValue(':ColLeadsLocation',$input["ColLeadsLocation"]);
                $sql->bindValue(':ColLeadsSource',$input["ColLeadsSource"]);
                $sql->bindValue(':ColLeadsDateCreated',$input["ColLeadsDateCreated"]);
                $sql->bindValue(':ColLeadsDateModified',$input["ColLeadsDateModified"]);
                $sql->bindValue(':ColLeadsLastAction',$input["ColLeadsLastAction"]);
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