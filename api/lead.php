<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET": // GET LEAD(S) AND ASSOCIATED DATA
            $response["data"] = array();
            if(empty($key)) { // leads.php
                #region GET LEADS
                $filter = " WHERE L.CompanyUUID = :CompanyUUID AND L.IsDeleted = 0 AND LLJ.LeadListUUID IS NULL";
                $query = "SELECT L.ID,L.UUID,L.PrimaryContactID,L.LeadName,L.LeadStatus,L.LeadLocation,L.LeadSource,L.LeadNoteboard,L.CF1,L.CF2,L.CF3,L.CF4,L.CF5,L.CF6,L.CF7,L.CF8,L.CF9,L.CF10,L.CF11,L.CF12,L.CF13,L.CF14,L.CF15,L.CF16,L.CF17,L.CF18,L.CF19,L.CF20,L.DateCreated,L.DateModified FROM Lead L LEFT JOIN LeadListJunction LLJ ON L.UUID = LLJ.LeadUUID" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $results = $sql->fetchAll();
                $response["count"] = count($results);
                #endregion
                #region GET CUSTOM FIELDS
                $filter = " WHERE CompanyUUID = :CompanyUUID AND IsDeleted = 0";
                $query = "SELECT ID,UUID,FieldName,FieldType,FieldIcon,ValuePos,FieldDefault,FieldPlaceholder,FieldSelections,FieldMin,FieldMax,HasSearch,HasDropdown,IsRequired,IsViewable,IsIndexed,DateCreated,DateModified FROM LeadCF" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $leadcf = $sql->fetchAll();
                $response["LeadCF"] = $leadcf;
                #endregion
                #region FOR EACH LEAD, ADD PRIMARY CONTACT, CONTACT EMAILS/PHONES, AND LAST ACTION
                if($response["count"] > 0) {
                    foreach($results as $result) {
                        $emailTail = "";
                        $phoneTail = "";
                        $filter = " WHERE ID = :ID";
                        $query = "SELECT ContactName,ContactTitle,ContactAvatar,ContactPhone,ContactEmail FROM LeadContact" . $filter;
                        $sql = $pdo->prepare($query);
                        $sql->bindValue(':ID',$result["PrimaryContactID"]);
                        $sql->execute();
                        $pconnect = $sql->fetch();
                        $result["PrimaryContact"] = $pconnect;
                        $emailTail .= $pconnect["ContactEmail"];
                        $phoneTail .= $pconnect["ContactPhone"];

                        $filter = " WHERE LeadID = :LeadID AND IsDeleted = 0";
                        $query = "SELECT ContactEmail,ContactPhone FROM LeadContact" . $filter;
                        $sql = $pdo->prepare($query);
                        $sql->bindValue(':LeadID',$result["ID"]);
                        $sql->execute();
                        $allconnect = $sql->fetchAll();
                        foreach($allconnect as $tailconnect) {
                            if($tailconnect["ContactEmail"] != $pconnect["ContactEmail"] && $tailconnect["ContactEmail"] != "") {
                                $emailTail .= ",";
                                $emailTail .= $tailconnect["ContactEmail"];
                            }
                            if($tailconnect["ContactPhone"] != $pconnect["ContactPhone"] && $tailconnect["ContactPhone"] != "") {
                                $phoneTail .= "<";
                                $phoneTail .= $tailconnect["ContactPhone"];
                            }
                        }
                        $result["EmailTail"] = $emailTail;
                        $result["PhoneTail"] = $phoneTail;

                        $filter = " WHERE LeadID = :LeadID ORDER BY DateCreated DESC LIMIT 1";
                        $query = "SELECT ActionType FROM LeadAction" . $filter;
                        $sql = $pdo->prepare($query);
                        $sql->bindValue(':LeadID',$result["ID"]);
                        $sql->execute();
                        $actionCell = $sql->fetch();
                        if(!empty($actionCell)) {
                            $result["LastAction"] = $actionCell["ActionType"];
                        }

                        array_push($response["data"], $result);
                    }
                }
                #endregion
            } else { // lead.php
                #region GET LEAD
                $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID AND IsDeleted = 0";
                $query = "SELECT ID,UUID,PrimaryContactID,LeadName,LeadStatus,LeadLocation,LeadSource,LeadNoteboard,CF1,CF2,CF3,CF4,CF5,CF6,CF7,CF8,CF9,CF10,CF11,CF12,CF13,CF14,CF15,CF16,CF17,CF18,CF19,CF20,DateCreated,DateModified FROM Lead" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $result = $sql->fetch();
                if(empty($result)) {
                    $response["success"] = 0;
                    echo json_encode($response);
                    return false;
                }
                #endregion
                #region GET ASSOCIATED LEAD DATA
                $filter = " WHERE LeadID = :LeadID AND IsDeleted = 0";
                $query = "SELECT ID,LeadID,ContactName,ContactTitle,ContactAvatar,ContactPhone,ContactEmail,ContactLocation,CF1,CF2,CF3,CF4,CF5,CF6,CF7,CF8,CF9,CF10,CF11,CF12,CF13,CF14,CF15,CF16,CF17,CF18,CF19,CF20,ClearBit,DateCreated,DateModified FROM LeadContact" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':LeadID',$result["ID"]);
                $sql->execute();
                $result["Contacts"] = $sql->fetchAll();

                $filter = " WHERE LeadID = :LeadID AND IsDeleted = 0";
                $query = "SELECT ID,LeadID,ActionType,ActionStatus,ActionLink,ActionData,ActionPrice,ActionFrom,ActionTo,ActionStartDT,ActionEndDT,DateCreated,DateModified FROM LeadAction" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':LeadID',$result["ID"]);
                $sql->execute();
                $result["Actions"] = $sql->fetchAll();

                $filter = " WHERE CompanyUUID = :CompanyUUID AND IsDeleted = 0";
                $query = "SELECT ID,UUID,FieldName,FieldType,FieldIcon,ValuePos,FieldDefault,FieldPlaceholder,FieldSelections,FieldMin,FieldMax,HasSearch,HasDropdown,IsRequired,IsViewable,IsIndexed,DateCreated,DateModified FROM LeadCF" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $leadcf = $sql->fetchAll();
                $result["LeadCF"] = $leadcf;
                
                $filter = " WHERE CompanyUUID = :CompanyUUID AND IsDeleted = 0";
                $query = "SELECT ID,UUID,FieldName,FieldType,FieldIcon,ValuePos,FieldDefault,FieldPlaceholder,FieldSelections,FieldMin,FieldMax,HasSearch,HasDropdown,IsRequired,IsPillAction,IsIndexed,DateCreated,DateModified FROM LeadContactCF" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $leadcontactcf = $sql->fetchAll();
                $result["LeadContactCF"] = $leadcontactcf;
                #endregion
                $response["data"] = $result;
            }
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "POST": // INSERT LEAD
            $response["success"] = 0;

            $uuid = generateUUID();
            $insert_cols = 'UUID,CompanyUUID';
            $insert_vals = ':UUID,:CompanyUUID';
            $parameter_list = array("PrimaryContactID","LeadName","LeadStatus","LeadLocation","LeadSource","LeadNoteboard","CF1","CF2","CF3","CF4","CF5","CF6","CF7","CF8","CF9","CF10","CF11","CF12","CF13","CF14","CF15","CF16","CF17","CF18","CF19","CF20");
            for ($i=0;$i<count($input_keys);$i++) {
                if(!in_array($input_keys[$i],$parameter_list)) {
                    $response["errorMsg"] = "Corrupt parameters detected";
                    echo json_encode($response);
                    exit();
                }
                $insert_cols.=",".$input_keys[$i];
                $insert_vals.=",:".$input_keys[$i];
            }
            $insert_cols .= ",DateCreated,CreatedBy";
            $insert_vals .= ",:DateCreated,:CreatedBy";
            $query = "INSERT INTO Lead (" .$insert_cols . ") VALUES (" . $insert_vals . ")";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$uuid);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            for ($i=0;$i<count($input_keys);$i++) {
                $sql->bindValue(':'.$input_keys[$i],$input_vals[$i]);
            }
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',$CustomerUUID);
            if($sql->execute()) {
                $response["success"] = 1;
                $response["newID"] = $pdo->lastInsertId();
                $response["newUUID"] = $uuid;
            } else {
                $response["errorMsg"] = "SQL INSERT INTO execution error";
            }
            echo json_encode($response);
            break;
        case "PUT": // UPDATE LEAD
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
                $update_cols = '';
                $parameter_list = array("PrimaryContactID","LeadName","LeadStatus","LeadLocation","LeadSource","LeadNoteboard","CF1","CF2","CF3","CF4","CF5","CF6","CF7","CF8","CF9","CF10","CF11","CF12","CF13","CF14","CF15","CF16","CF17","CF18","CF19","CF20");
                for ($i=0;$i<count($input_keys);$i++) {
                    if(!in_array($input_keys[$i],$parameter_list)) {
                        $response["success"] = 0;
                        $response["errorMsg"] = "Corrupt parameters detected";
                        echo json_encode($response);
                        exit();
                    }
                    $update_cols.=($i>0?',':'').$input_keys[$i]."=:".$input_keys[$i];
                }
                $update_cols .= ",DateModified=:DateModified,ModifiedBy=:ModifiedBy";
                $query = "UPDATE Lead SET ".$update_cols.$filter;
                $sql = $pdo->prepare($query);
                for ($i=0;$i<count($input_keys);$i++) {
                    $sql->bindValue(':'.$input_keys[$i],$input_vals[$i]);
                }
                $sql->bindValue(':DateModified',date("Y-m-d H:i:s"));
                $sql->bindValue(':ModifiedBy',$CustomerUUID);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                if($sql->execute()) {
                    $response["success"] = 1;
                } else {
                    $response["success"] = 0;
                    $response["errorMsg"] = "SQL UPDATE execution error";
                }
            }
            echo json_encode($response);
            break;
        case "DELETE": // DELETE LEAD
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                #region SOFT DELETE ASSOCIATED LEAD CONTACTS
                $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
                $query = "SELECT ID FROM Lead" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $result = $sql->fetch();

                $filter = " WHERE LeadID = :LeadID";
                $query = "UPDATE LeadContact SET IsDeleted = 1" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':LeadID',$result["ID"]);
                $sql->execute();
                #endregion
                #region SOFT DELETE LEAD
                $filter = " WHERE ID = :ID";
                $query = "UPDATE Lead SET IsDeleted = 1" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':ID',$result["ID"]);
                $sql->execute();
                #endregion
                #region DELETE ASSOCIATED LEAD LISTS
                $filter = " WHERE LeadUUID = :UUID";
                $query = "DELETE FROM LeadListJunction" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->execute();
                #endregion
                $response["success"] = 1;
            }
            echo json_encode($response);
            break;
        case "PATCH": // MERGE LEAD/UPDATE STATUS
            #region MERGE LEAD
            if(!empty($input["merge"])) {
                if(empty($key)) {
                    $response["success"] = 0;
                    $response["errorMsg"] = "Missing URL key";
                } else {
                    $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
                    $query = "SELECT ID FROM Lead" . $filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':UUID',$key);
                    $sql->bindValue(':CompanyUUID',$CompanyUUID);
                    $sql->execute();
                    $row = $sql->fetch();
                    $LeadMasterID = $row["ID"];

                    foreach($input["leads"] as $lead) {
                        if($lead != $key) {
                            $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
                            $query = "SELECT ID FROM Lead" . $filter;
                            $sql = $pdo->prepare($query);
                            $sql->bindValue(':UUID',$lead);
                            $sql->bindValue(':CompanyUUID',$CompanyUUID);
                            $sql->execute();
                            $row = $sql->fetch();
                            $LeadID = $row["ID"];

                            $filter = " WHERE LeadID = :LeadID";
                            $query = "UPDATE LeadContact SET LeadID = :LeadMasterID" . $filter;
                            $sql = $pdo->prepare($query);
                            $sql->bindValue(':LeadMasterID',$LeadMasterID);
                            $sql->bindValue(':LeadID',$LeadID);
                            $sql->execute();

                            $filter = " WHERE LeadID = :LeadID";
                            $query = "UPDATE LeadAction SET LeadID = :LeadMasterID" . $filter;
                            $sql = $pdo->prepare($query);
                            $sql->bindValue(':LeadMasterID',$LeadMasterID);
                            $sql->bindValue(':LeadID',$LeadID);
                            $sql->execute();

                            $filter = " WHERE LeadUUID = :UUID";
                            $query = "DELETE FROM LeadListJunction" . $filter;
                            $sql = $pdo->prepare($query);
                            $sql->bindValue(':UUID',$lead);
                            $sql->execute();

                            $filter = " WHERE ID = :ID";
                            $query = "UPDATE Lead SET IsDeleted = 1" . $filter;
                            $sql = $pdo->prepare($query);
                            $sql->bindValue(':ID',$LeadID);
                            $sql->execute();
                        }
                    }
                    $response["success"] = 1;
                }
            }
            #endregion
            #region UPDATE LEAD STATUS
            if(!empty($input["statusUpdates"])) {
                foreach($input["leads"] as $lead) {
                    $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
                    $query = "UPDATE Lead SET LeadStatus = :LeadStatus" . $filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':LeadStatus',$input["leadStatus"]);
                    $sql->bindValue(':UUID',$lead);
                    $sql->bindValue(':CompanyUUID',$CompanyUUID);
                    $sql->execute();
                }
                $response["success"] = 1;
            }
            #endregion
            echo json_encode($response);
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