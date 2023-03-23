<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET": // GET LEAD SEARCHES
            $filter = " WHERE CompanyUUID = :CompanyUUID ORDER BY SearchName";
            $query = "SELECT ID,SearchQuery,ListUUID,SearchName,DateCreated FROM LeadSearch" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->execute();
            $response["data"] = $sql->fetchAll();
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "POST": // INSERT LEAD SEARCH
            $query = "INSERT INTO LeadSearch (SearchQuery, ListUUID, SearchName, IsAdmin, CompanyUUID, DateCreated, CreatedBy)
                VALUES (:SearchQuery, :ListUUID, :SearchName, :IsAdmin, :CompanyUUID, :DateCreated, :CreatedBy)";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':SearchQuery',urlencode($input["SearchQuery"]));
            $sql->bindValue(':ListUUID',htmlspecialchars($input["ListUUID"]));
            $sql->bindValue(':SearchName',$input["SearchName"]);
            $sql->bindValue(':IsAdmin',0);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',$CustomerUUID);
            $sql->execute();
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "PUT":
            break;
        case "DELETE": //DELETE LEAD SEARCH
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                $filter = " WHERE ID = :ID";
                $query = "DELETE FROM LeadSearch" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':ID',$key);
                $sql->execute();
                $response["success"] = 1;
            }
            echo json_encode($response);
            break;
    }
}
catch(PDOException $ex) {
    $response["success"] = 0;
    $response["errorMsg"] = $ex->getMessage();
    echo json_encode($response);
}
$pdo = null;

?>