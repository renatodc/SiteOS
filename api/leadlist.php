<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET": // GET LEAD LISTS/GET LIST LEADS
            if (empty($key)) { 
                #region GET LEAD LISTS
                $filter = " WHERE CompanyUUID = :CompanyUUID AND IsAdmin = :IsAdmin ORDER BY ListName";
                $query = "SELECT ID,UUID,ListName,DateCreated FROM LeadList" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->bindValue(':IsAdmin',0);
                $sql->execute();
                $response["data"] = $sql->fetchAll();
                
                if(isOwner($pdo,$CustomerUUID)) {
                    $filter = " WHERE CompanyUUID = :CompanyUUID AND IsAdmin = :IsAdmin ORDER BY ListName";
                    $query = "SELECT ID,UUID,ListName,DateCreated FROM LeadList" . $filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':CompanyUUID',$CompanyUUID);
                    $sql->bindValue(':IsAdmin',1);
                    $sql->execute();
                    $response["data"] = array_merge($response["data"], $sql->fetchAll());
                }
                #endregion
            } else { 
                #region GET LEADS FROM LEAD LIST
                #region GET LEAD KEYS
                $filter = " WHERE LeadListUUID = :LeadListUUID";
                $query = "SELECT LeadUUID FROM LeadListJunction" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':LeadListUUID',$key);
                $sql->execute();
                $results = $sql->fetchAll();
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
                $response["count"] = count($results);
                if($response["count"] > 0) {
                    $response["data"] = array();
                    foreach($results as $result) {
                        #region GET LEADS
                        $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID AND IsDeleted = 0";
                        $query = "SELECT ID,UUID,PrimaryContactID,LeadName,LeadStatus,LeadLocation,LeadSource,LeadNoteboard,CF1,CF2,CF3,CF4,CF5,CF6,CF7,CF8,CF9,CF10,CF11,CF12,CF13,CF14,CF15,CF16,CF17,CF18,CF19,CF20,DateCreated,DateModified FROM Lead" . $filter;
                        $sql = $pdo->prepare($query);
                        $sql->bindValue(':UUID',$result["LeadUUID"]);
                        $sql->bindValue(':CompanyUUID',$CompanyUUID);
                        $sql->execute();
                        $lead = $sql->fetch();
                        #endregion
                        #region FOR EACH LEAD, ADD PRIMARY CONTACT, CONTACT EMAILS/PHONES, AND LAST ACTION
                        $emailTail = "";
                        $phoneTail = "";
                        $filter = " WHERE ID = :ID";
                        $query = "SELECT ContactName,ContactTitle,ContactAvatar,ContactPhone,ContactEmail FROM LeadContact" . $filter;
                        $sql = $pdo->prepare($query);
                        $sql->bindValue(':ID',$lead["PrimaryContactID"]);
                        $sql->execute();
                        $pconnect = $sql->fetch();
                        $lead["PrimaryContact"] = $pconnect;
                        $emailTail .= $pconnect["ContactEmail"];
                        $phoneTail .= $pconnect["ContactPhone"];

                        $filter = " WHERE LeadID = :LeadID AND IsDeleted = 0";
                        $query = "SELECT ContactEmail,ContactPhone FROM LeadContact" . $filter;
                        $sql = $pdo->prepare($query);
                        $sql->bindValue(':LeadID',$lead["ID"]);
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
                        $lead["EmailTail"] = $emailTail;
                        $lead["PhoneTail"] = $phoneTail;

                        $filter = " WHERE LeadID = :LeadID ORDER BY DateCreated DESC LIMIT 1";
                        $query = "SELECT ActionType FROM LeadAction" . $filter;
                        $sql = $pdo->prepare($query);
                        $sql->bindValue(':LeadID',$lead["ID"]);
                        $sql->execute();
                        $actionCell = $sql->fetch();
                        if(!empty($actionCell)) {
                            $lead["LastAction"] = $actionCell["ActionType"];
                        }
                        #endregion
                        array_push($response["data"], $lead);
                    }
                }
                #endregion
            }
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "POST": // INSERT LIST/ADD LEAD TO LIST
            if (empty($key)) { // INSERT LIST
                $uuid = generateUUID();
                $query = "INSERT INTO LeadList (UUID, ListName, IsAdmin, CompanyUUID, DateCreated, CreatedBy)
                VALUES (:UUID, :ListName, :IsAdmin, :CompanyUUID, :DateCreated, :CreatedBy)";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$uuid);
                $sql->bindValue(':ListName',htmlspecialchars($input["ListName"]));
                $sql->bindValue(':IsAdmin',0);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
                $sql->bindValue(':CreatedBy',$CustomerUUID);
                $sql->execute();
                $response["newID"] = $pdo->lastInsertId();
                $response["newUUID"] = $uuid;
            } else { // ADD LEAD TO LIST
                $query = "DELETE FROM LeadListJunction WHERE LeadUUID = :LeadUUID";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':LeadUUID',$input["LeadUUID"]);
                $sql->execute();

                $query = "INSERT INTO LeadListJunction (LeadListUUID, LeadUUID)
                VALUES (:LeadListUUID, :LeadUUID)";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':LeadListUUID',$key);
                $sql->bindValue(':LeadUUID',$input["LeadUUID"]);
                $sql->execute();
            }
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "PUT": // UPDATE LIST NAME
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                $filter = " WHERE UUID = :UUID";
                $query = "UPDATE LeadList SET ListName = :ListName".$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':ListName',htmlspecialchars($input["ListName"]));
                if($sql->execute()) {
                    $response["success"] = 1;
                } else {
                    $response["success"] = 0;
                    $response["errorMsg"] = "SQL UPDATE execution error";
                }
            }
            echo json_encode($response);
            break;
        case "DELETE": // DELETE LEAD LIST
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                $filter = " WHERE UUID = :UUID";
                $query = "DELETE FROM LeadList" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->execute();

                $filter = " WHERE LeadListUUID = :LeadListUUID";
                $query = "DELETE FROM LeadListJunction" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':LeadListUUID',$key);
                $sql->execute();

                $filter = " WHERE ListUUID = :ListUUID";
                $query = "DELETE FROM LeadSearch" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':ListUUID',$key);
                $sql->execute();

                $response["success"] = 1;
            }
            echo json_encode($response);
            break;
        case "PATCH": // DELETE LEAD IN LIST
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                $filter = " WHERE LeadUUID = :LeadUUID AND LeadListUUID = :LeadListUUID";
                $query = "DELETE FROM LeadListJunction" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':LeadUUID',$input["LeadUUID"]);
                $sql->bindValue(':LeadListUUID',$key);
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