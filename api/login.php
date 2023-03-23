<?php
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';

try {
    switch ($method)  {
        case "POST": // LOGIN
            $filter = " WHERE (CustomerEmail = :LoginEmail OR CompanyEmail = :LoginEmail) AND IsDeleted = 0";
            $query = "SELECT UUID, CompanyUUID, CustomerPasswordHash, CustomerTheme FROM Customer" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':LoginEmail',$input["LoginEmail"]);
            $sql->execute();
            $result = $sql->fetch();
            if(empty($result["UUID"])) {
                $response["code"] = 0;
                $response["msg"] = "Email is not registered";
            } else {
                if(password_verify($input["LoginPassword"],$result["CustomerPasswordHash"]) == 1) {
                    $response["code"] = 1;
                    #region INITIALIZE SESSION
                    session_start();
                    $_SESSION["st"] = generateUUID();
                    $_SESSION["CustomerUUID"] = $result["UUID"];
                    $_SESSION["CompanyUUID"] = $result["CompanyUUID"];
                    $_SESSION["CustomerTheme"] = $result["CustomerTheme"];
                    #endregion
                    #region LOG ACCESS
                    $ipAddr = $_SERVER['REMOTE_ADDR'];
                    $filter = " WHERE UUID = :UUID";
                    $query = "UPDATE Customer SET IPLastLogin=:IPLastLogin,DateLastLogin=:DateLastLogin" . $filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':UUID',$result["UUID"]);
                    $sql->bindValue(':IPLastLogin',$ipAddr);
                    $sql->bindValue(':DateLastLogin',date("Y-m-d H:i:s"));
                    $sql->execute();
                    #endregion
                    #region SET ACCESS EXPIRATION
                    if($input["LoginRemember"] == "true") {
                        #setcookie(session_name(), session_id(), time()+2419200, "/", "app." . $config["domain"], TRUE, TRUE); // 4 weeks
                        setcookie(session_name(), session_id(), time()+2419200, "/", "localhost", TRUE, TRUE); // 4 weeks
                    } else {
                        #setcookie(session_name(), session_id(), time() + 10800, "/", "app." . $config["domain"], TRUE, TRUE); // 3 hours
                        setcookie(session_name(), session_id(), time() + 10800, "/", "localhost", TRUE, TRUE); // 3 hours
                    }
                    #endregion
                } else {
                    $response["code"] = 0;
                    $response["msg"] = "Wrong password";
                }
            }
            echo json_encode($response);
            break;
    }
}
catch(PDOException $ex) {
    $response["code"] = 0;
    $response["msg"] = $ex->getMessage();
    echo json_encode($response);
}
$pdo = null;

?>