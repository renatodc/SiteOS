<?php

include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST": // VALIDATE RECOVERY TOKEN, RESET PASSWORD
            if (!empty($key)) {
                $dateFilter = "DateCreated + INTERVAL 30 MINUTE > NOW()";
                $filter = " WHERE TokenUUID = :TokenUUID AND IsDeleted = 0 AND ".$dateFilter;
                $query = "SELECT CustomerUUID FROM TokenRecovery ".$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':TokenUUID',$key);
                $sql->execute();
                $result = $sql->fetch();
                if(empty($result)) {
                    $response["msg"] = "Missing/expired token.";
                    $response["code"] = 0;
                } else {
                    $uuid = $result["CustomerUUID"];
                    #region UPDATE PASSWORD
                    $filter = " WHERE UUID = :UUID";
                    $query = "UPDATE Customer SET CustomerPasswordHash = :CustomerPasswordHash".$filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':UUID',$uuid);
                    $pwdHash = password_hash($input["LoginPassword"], PASSWORD_BCRYPT);
                    $sql->bindValue(':CustomerPasswordHash',$pwdHash);
                    $sql->execute();
                    #endregion
                    #region DELETE RECOVERY TOKEN
                    $filter = " WHERE CustomerUUID = :CustomerUUID";
                    $query = "UPDATE TokenRecovery SET IsDeleted = 1".$filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':CustomerUUID',$uuid);
                    $sql->execute();
                    #endregion
                    #region INITIALIZE SESSION
                    session_start();
                    $_SESSION["st"] = generateUUID();
                    $_SESSION["CustomerUUID"] = $uuid;
                    $query = "SELECT CompanyUUID FROM Customer WHERE UUID = :UUID";
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':UUID',$uuid);
                    $sql->execute();
                    $_SESSION["CompanyUUID"] = $sql->fetch()["CompanyUUID"];
                    #endregion

                    $response["code"] = 1;
                }
            } else {
                $response["msg"] = "Missing url parameter.";
                $response["code"] = 0;
            }
            echo json_encode($response);
            break;
        case "PUT": 
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