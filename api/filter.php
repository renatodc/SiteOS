<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET": // GET SPAM FILTER RULES
            $response["data"] = array();
            #region Personal Filters
            $filter = " WHERE FilterType = 'Personal' AND CompanyUUID = :CompanyUUID AND CustomerUUID = :CustomerUUID";
            $query = "SELECT UUID,FilterType,FilterScope,FilterStatement FROM MailFirewall" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':CustomerUUID',$CustomerUUID);
            $sql->execute();
            $individualFilters = $sql->fetchAll();
            if(!empty($individualFilters)) {
                foreach($individualFilters as $filterRule) {
                    array_push($response["data"], $filterRule);
                }
            }
            #endregion
            #region Company Filters
            $filter = " WHERE FilterType = 'Company' AND CompanyUUID = :CompanyUUID";
            $query = "SELECT UUID,FilterType,FilterScope,FilterStatement FROM MailFirewall" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->execute();
            $globalFilters = $sql->fetchAll();
            if(!empty($globalFilters)) {
                foreach($globalFilters as $filterRule) {
                    array_push($response["data"], $filterRule);
                }
            }
            #endregion
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "POST": // INSERT SPAM FILTER RULE
            $filter = " WHERE UUID = :UUID";
            $query = "SELECT CompanyEmail FROM Customer" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CustomerUUID);
            $sql->execute();
            $row = $sql->fetch();
            $CompanyEmail = $row["CompanyEmail"];

            $query = "INSERT INTO MailFirewall (
                UUID, MailDomain, CompanyUUID, CompanyEmail, CustomerUUID, FilterType, FilterScope, FilterStatement, DateCreated, CreatedBy
                ) VALUES (
                :UUID, :MailDomain, :CompanyUUID, :CompanyEmail, :CustomerUUID, :FilterType, :FilterScope, :FilterStatement, :DateCreated, :CreatedBy
                )";
            $sql = $pdo->prepare($query);
            $uuid = generateUUID();
            $sql->bindValue(':UUID',$uuid);
            $sql->bindValue(':MailDomain',$config["domain"]);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':CompanyEmail',$CompanyEmail);
            $sql->bindValue(':CustomerUUID',$CustomerUUID);
            $sql->bindValue(':FilterType',$input["FilterType"]);
            $filterString = $input["FilterStatement"];
            $filterScope = "Email";
            if(preg_match('/^@(.+)/',$filterString,$match) || 
            preg_match('/^[*]@(.+)/',$filterString,$match) || 
            preg_match('/^([^@]+)$/',$filterString,$match)) {
                $filterScope = "Domain";
                $input["FilterStatement"] = $match[1];
            } else if(preg_match('/^[^@]+[@][^@]+$/',$filterString,$match)) {
                $input["FilterStatement"] = $match[0];
            }
            $sql->bindValue(':FilterScope',$filterScope);
            $sql->bindValue(':FilterStatement',$input["FilterStatement"]);
            $sql->bindValue(':DateCreated', date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',$CompanyEmail);
            $sql->execute();
            $response["newUUID"] = $uuid;
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "PUT":
            break;
        case "DELETE": // DELETE SPAM FILTER RULE
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                $filter = " WHERE UUID = :UUID";
                $query = "DELETE FROM MailFirewall" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                if($sql->execute()) {
                    $response["success"] = 1;
                } else {
                    $response["success"] = 0;
                    $response["errorMsg"] = "SQL DELETE execution error";
                }
            }
            echo json_encode($response);
            break;
        case "PATCH":
            break;
    }
}
catch(Exception $ex) {
    $response["success"] = 0;
    $response["errorMsg"] = $ex->getMessage();
    echo json_encode($response);
}
$pdo = null;

?>