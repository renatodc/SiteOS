<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';
require 'vendor/autoload.php';
requireCsrfToken();

try {
    switch ($method) {
        case "GET":
            break;
        case "POST":
            break;
        case "PUT": // UPDATE CUSTOMER AND COMPANY
            #region UPDATE COMPANY VALUES
            if(isset($input["Logo"])) {
                $logoIndex = 0;
                for ($i=0;$i<count($input_keys);$i++) {
                    if($input_keys[$i] == "Logo") {
                        $logoIndex = $i;
                    }
                }
                array_splice($input_keys,$logoIndex,1);
                array_splice($input_vals,$logoIndex,1);
                $filter = " WHERE UUID = :UUID";
                $query = "UPDATE Company SET Logo=:Logo".$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$CompanyUUID);
                if($input["Logo"] == "") {
                    $input["Logo"] = NULL;
                }
                $sql->bindValue(':Logo',$input["Logo"]);
                $result = $sql->execute();
            }
            if(isset($input["FormRecipient"])) {
                $frIndex = 0;
                for ($i=0;$i<count($input_keys);$i++) {
                    if($input_keys[$i] == "FormRecipient") {
                        $frIndex = $i;
                    }
                }
                array_splice($input_keys,$frIndex,1);
                array_splice($input_vals,$frIndex,1);
                $filter = " WHERE UUID = :UUID";
                $query = "UPDATE Company SET FormRecipient=:FormRecipient".$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$CompanyUUID);
                if($input["FormRecipient"] == "") {
                    $input["FormRecipient"] = NULL;
                }
                $sql->bindValue(':FormRecipient',$input["FormRecipient"]);
                $result = $sql->execute();
            }
            #endregion
            $filter = " WHERE UUID = :UUID";
            $update_cols = '';
            #region VALIDATE/PREPARE DATA
            for ($i=0;$i<count($input_keys);$i++) {
                $parameter_list = array("EmailSignature","CustomerName","CustomerRole","CustomerEmail","CustomerPhone","CustomerLanguage","CustomerTheme","CRMSaveIncomingEmail","CRMSaveOutgoingEmail","CustomerBaseColor","Logo","FormRecipient","CustomerPassword");
                if(!in_array($input_keys[$i],$parameter_list)) {
                    $response["msg"] = "Corrupt parameters detected";
                    $response["code"] = 0;
                    echo json_encode($response);
                    exit();
                }
                switch($input_keys[$i]) {
                    case "CustomerPassword":
                        $input_keys[$i] = "CustomerPasswordHash";
                        break;
                }
                $update_cols.=($i>0?',':'').$input_keys[$i]."=:".$input_keys[$i];
            }
            #endregion
            $query = "UPDATE Customer SET ".$update_cols.$filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CustomerUUID);
            for ($i=0;$i<count($input_keys);$i++) {                
                #region PROCESS DATA
                switch($input_keys[$i]) {
                    // PASSWORD ENCRYPTION
                    case "CustomerPasswordHash":
                        $pwdHash = password_hash($input["CustomerPassword"], PASSWORD_BCRYPT);
                        $input_vals[$i] = $pwdHash;
                        break;
                    // SET TO NULL
                    case "CustomerEmail":
                    case "CustomerLanguage":
                    case "CustomerBaseColor":
                        if(trim($input_vals[$i]) == "") {
                            $input_vals[$i] = NULL;
                        }
                        break;
                    case "CustomerTheme":
                        if(trim($input_vals[$i]) == "") {
                            $input_vals[$i] = NULL;
                        } else {
                            $_SESSION["CustomerTheme"] = $input_vals[$i];
                        }
                        break;
                    // SET TO INT
                    case "CRMSaveIncomingEmail":
                    case "CRMSaveOutgoingEmail":
                        $input_vals[$i] = intval($input_vals[$i]);
                        break;
                    // FILTER XSS
                    case "EmailSignature":
                        $purifyConfig = HTMLPurifier_Config::createDefault();
                        $purifier = new HTMLPurifier($purifyConfig);
                        $input_vals[$i] = $purifier->purify($input_vals[$i]);
                        break;
                }
                #endregion
                $sql->bindValue(':'.$input_keys[$i],$input_vals[$i]);
            }
            $result = $sql->execute();

            if($result) {
                $response["code"] = 1;
            } else {
                $response["code"] = 0;
                $response["msg"] = "Unable to update customer record";
            }
            echo json_encode($response);
            break;
        case "DELETE": // DELETE COMPANY CUSTOMERS
            $filter = " WHERE CompanyUUID = :CompanyUUID";
            $query = "SELECT UUID FROM Customer" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->execute();
            $customers = $sql->fetchAll();
            foreach($customers as $customer) {
                $filter = " WHERE UUID = :UUID";
                $query = "DELETE FROM Customer" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$customer["UUID"]);
                $sql->execute();
            }
            #region LOGOUT
            $_SESSION = array();
            setcookie(session_name(), '', time() - 42000);
            session_destroy();
            #endregion
            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "PATCH":
            break;
    }
}
catch(Exception $ex) {
    $response["msg"] = $ex->getMessage();
    $response["code"] = 0;
    echo json_encode($response);
}
$pdo = null;

?>