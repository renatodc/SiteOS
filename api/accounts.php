<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';
require 'vendor/autoload.php';
requireCsrfToken();

try {
    switch ($method)  {
        case "GET": // SELECT ALL COMPANY CUSTOMERS
            $query = "SELECT UUID, CustomerName, CompanyEmail, CompanyPhone, CustomerEmail, CustomerPhone, CustomerRole, CustomerLanguage, CustomerTheme, CustomerBaseColor, ClearBitKey, ConfigUsePhone, ConfigUseSMS, ConfigTimeFormat, LeadsTimeFormat, LeadTimeFormat, MailTimeFormat, ConfigRecordCalls, ConfigTranscribeCalls, ConfigCountryCode, ConfigRunCallPause, ColLeadsCompany, ColLeadsContactName, ColLeadsContactEmail, ColLeadsStatus, ColLeadsLocation, ColLeadsSource, ColLeadsDateCreated, ColLeadsDateModified, ColLeadsLastAction, ColBroadcastRecipients, ColBroadcastDelivered, ColBroadcastBounced, ColBroadcastFailed, ColBroadcastOpened, ColBroadcastClicked, ColBroadcastUnsubscribed, ColBroadcastComplained, ColBroadcastDateCreated, ColBroadcastDateModified, ColBroadcastCreatedBy, CRMSaveIncomingEmail, CRMSaveOutgoingEmail, ColAccountsCompanyEmail, ColAccountsName, ColAccountsUserEmail, ColAccountsRole, ColAccountsType, ColAccountsUserPhone, ColAccountsCompanyPhone, EmailSignature, IsAdmin, IsOwner FROM Customer WHERE CompanyUUID = :CompanyUUID AND IsDeleted = 0";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->execute();

            $response["data"] = $sql->fetchAll();
            $response["CustomerUUID"] = $CustomerUUID;
            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "POST": // INSERT CUSTOMER
            #region VERIFY UNIQUE COMPANY EMAIL
            if(!empty($input["CompanyEmail"])) {
                $filter = " WHERE CompanyEmail = :CompanyEmail";
                $query = "SELECT ID FROM Customer" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':CompanyEmail',$input["CompanyEmail"]);
                $sql->execute();
                $companyEmailResult = $sql->fetch();
                if(!empty($companyEmailResult["UUID"])) {
                    $response["code"] = 2;
                    echo json_encode($response);
                    break;
                }
            }
            #endregion
            $uuid = generateUUID();
            $insert_cols = 'UUID,CompanyUUID';
            $insert_vals = ':UUID,:CompanyUUID';
            #region VALIDATE/PREPARE DATA
            for ($i=0;$i<count($input_keys);$i++) {
                $parameter_list = array("EmailSignature","IsAdmin","CustomerName","CustomerRole","CompanyEmail","CompanyPhone","CustomerEmail","CustomerPhone","CustomerLanguage","CustomerTheme","CRMSaveIncomingEmail","CRMSaveOutgoingEmail","CustomerBaseColor","Logo","FormRecipient","CustomerPassword");
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
                $insert_cols.=",".$input_keys[$i];
                $insert_vals.=",:".$input_keys[$i];
            }
            #endregion
            $insert_cols .= ",DateCreated,CreatedBy";
            $insert_vals .= ",:DateCreated,:CreatedBy";
            $query = "INSERT INTO Customer (" .$insert_cols . ") VALUES (" . $insert_vals . ")";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$uuid);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
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
                    case "CompanyEmail":
                    case "CustomerTheme":
                    case "CustomerLanguage":
                    case "CustomerBaseColor":
                        if(trim($input_vals[$i]) == "") {
                            $input_vals[$i] = NULL;
                        }
                        break;
                    // SET TO INT
                    case "IsAdmin":
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
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',$CustomerUUID);
            $sql->execute();

            $response["newID"] = $pdo->lastInsertId();
            $response["newUUID"] = $uuid;
            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "PUT": // UPDATE COMPANY CUSTOMER BY KEY
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
            $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
            $update_cols = '';
            #region VALIDATE/PREPARE DATA
            for ($i=0;$i<count($input_keys);$i++) {
                $parameter_list = array("EmailSignature","IsAdmin","CustomerName","CustomerRole","CompanyEmail","CompanyPhone","CustomerEmail","CustomerPhone","CustomerLanguage","CustomerTheme","CRMSaveIncomingEmail","CRMSaveOutgoingEmail","CustomerBaseColor","Logo","FormRecipient","CustomerPassword");
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
            $sql->bindValue(':UUID',$key);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
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
                    case "CompanyEmail":
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
                    case "IsAdmin":
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

            $response["code"] = $result ? 1 : 0;
            echo json_encode($response);
            break;
        case "DELETE": // DELETE CUSTOMER
            $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
            $query = "DELETE FROM Customer".$filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$key);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->execute();

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