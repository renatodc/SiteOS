<?php

include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST": // GET INVITE DETAILS (DomainName,CompanyEmail)
            if (!empty($key)) {
                $dateFilter = "DateCreated + INTERVAL 21 DAY > NOW()";
                $filter = " WHERE TokenUUID = :TokenUUID AND IsDeleted = 0 AND ".$dateFilter;
                $query = "SELECT CustomerUUID FROM TokenRegister ".$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':TokenUUID',$key);
                $sql->execute();
                $row = $sql->fetch();
                $CustomerUUID = $row["CustomerUUID"];

                if(empty($CustomerUUID)) {
                    $response["msg"] = "Missing/expired token";
                    $response["code"] = 2;
                    echo json_encode($response);
                    break;
                }

                $filter = " WHERE UUID = :UUID AND IsDeleted = 0";
                $query = "SELECT CompanyUUID, CompanyEmail, CustomerLanguage FROM Customer ".$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$CustomerUUID);
                $sql->execute();
                $row = $sql->fetch();
                $result["CompanyEmail"] = $row["CompanyEmail"];
                $result["CustomerLanguage"] = $row["CustomerLanguage"];

                $query = "SELECT DomainName FROM Company WHERE UUID = :UUID";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$row["CompanyUUID"]);
                $sql->execute();
                $row = $sql->fetch();
                $result["DomainName"] = $row["DomainName"];

                $response["data"] = $result;
                $response["code"] = 1;
            } else {
                $response["msg"] = "Missing url parameter";
                $response["code"] = 0;
            }
            echo json_encode($response);
            break;
        case "PUT": // VALIDATE REGISTRATION TOKEN, SET PASSWORD
            if (empty($key)) {
                $response["code"] = 0;
                $response["msg"] = "Missing URL key";
            } else if(strlen($input["CustomerPassword"]) < 8) {
                $response["code"] = 2;
                $response["msg"] = "Password doesn't meet requirements";
            } else {
                #region VALIDATE REGISTRATION TOKEN
                $dateFilter = "DateCreated + INTERVAL 21 DAY > NOW()";
                $filter = " WHERE TokenUUID = :TokenUUID AND IsDeleted = 0 AND ".$dateFilter;
                $query = "SELECT CustomerUUID FROM TokenRegister ".$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':TokenUUID',$key);
                $sql->execute();
                $row = $sql->fetch();
                $CustomerUUID = $row["CustomerUUID"];
                #endregion
                #region UPDATE PASSWORD
                $filter = " WHERE UUID = :UUID";
                $query = "UPDATE Customer SET 
                CustomerPasswordHash = :CustomerPasswordHash,
                IPCreated = :IPCreated".$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$CustomerUUID);
                $pwdHash = password_hash($input["CustomerPassword"], PASSWORD_BCRYPT);
                $sql->bindValue(':CustomerPasswordHash',$pwdHash);
                $ipAddr = $_SERVER['REMOTE_ADDR'];
                $sql->bindValue(':IPCreated',$ipAddr);
                $sql->execute();
                #endregion
                #region DELETE REGISTRATION TOKEN
                $filter = " WHERE TokenUUID = :TokenUUID";
                $query = "UPDATE TokenRegister SET IsDeleted = 1".$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':TokenUUID',$key);
                $sql->execute();
                #endregion
                #region INITIALIZE SESSION
                session_start();
                $_SESSION["st"] = generateUUID();
                $_SESSION["CustomerUUID"] = $CustomerUUID;
                $query = "SELECT CompanyUUID FROM Customer WHERE UUID = :UUID";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$CustomerUUID);
                $sql->execute();
                $_SESSION["CompanyUUID"] = $sql->fetch()["CompanyUUID"];
                #endregion
                
                $response["code"] = 1;
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