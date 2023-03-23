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
        case "PUT": // UPDATE VIEW COLUMN SETTINGS FOR ACCOUNTS CHART
            $response["code"] = 0;
            if(is_numeric($input["ColAccountsName"]) && 
            is_numeric($input["ColAccountsCompanyEmail"]) &&
            is_numeric($input["ColAccountsRole"]) &&
            is_numeric($input["ColAccountsType"]) &&
            is_numeric($input["ColAccountsCompanyPhone"])) {
                $filter = "WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
                $query = "UPDATE Customer SET ColAccountsName = :ColAccountsName, ColAccountsCompanyEmail = :ColAccountsCompanyEmail, ColAccountsRole = :ColAccountsRole, ColAccountsType = :ColAccountsType, ColAccountsCompanyPhone = :ColAccountsCompanyPhone " . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$CustomerUUID);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->bindValue(':ColAccountsName',$input["ColAccountsName"]);
                $sql->bindValue(':ColAccountsCompanyEmail',$input["ColAccountsCompanyEmail"]);
                $sql->bindValue(':ColAccountsRole',$input["ColAccountsRole"]);
                $sql->bindValue(':ColAccountsType',$input["ColAccountsType"]);
                $sql->bindValue(':ColAccountsCompanyPhone',$input["ColAccountsCompanyPhone"]);
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