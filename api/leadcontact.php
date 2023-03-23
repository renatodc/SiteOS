<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET": // GET LEAD CONTACT
            $filter = " WHERE A.CompanyUUID = :CompanyUUID AND A.IsDeleted = 0 AND B.IsDeleted = 0 AND B.ContactEmail != ''";
            $query = "SELECT DISTINCT B.ContactEmail FROM Lead A JOIN LeadContact B ON A.ID = B.LeadID" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->execute();
            $response["data"] = $sql->fetchAll();
            $response["count"] = count($response["data"]);
            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "POST": // INSERT LEAD CONTACT
            $insert_cols = '';
            $insert_vals = '';
            $parameter_list = array("LeadID","ContactName","ContactTitle","ContactAvatar","ContactPhone","ContactEmail","ContactLocation","CF1","CF2","CF3","CF4","CF5","CF6","CF7","CF8","CF9","CF10","CF11","CF12","CF13","CF14","CF15","CF16","CF17","CF18","CF19","CF20","ClearBit");
            for ($i=0;$i<count($input_keys);$i++) {
                if(!in_array($input_keys[$i],$parameter_list)) {
                    $response["code"] = 0;
                    $response["msg"] = "Corrupt parameters detected";
                    echo json_encode($response);
                    exit();
                }
                $insert_cols.=($i>0?',':'').$input_keys[$i];
                $insert_vals.=($i>0?',':'').":".$input_keys[$i];
            }
            $insert_cols .= ",DateCreated,CreatedBy";
            $insert_vals .= ",:DateCreated,:CreatedBy";

            if(!empty($input["ContactEmail"])) {
                $filter = " WHERE A.ContactEmail = :ContactEmail AND B.CompanyUUID = :CompanyUUID AND A.IsDeleted = 0";
                $query = "SELECT A.ID FROM LeadContact A JOIN Lead B ON A.LeadID = B.ID" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':ContactEmail',$input["ContactEmail"]);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $row = $sql->fetch();
                if(!empty($row)) {
                    $response["code"] = 2;
                    $response["msg"] = "Contact email already exists";
                    echo json_encode($response);
                    exit();
                }
            }

            $query = "INSERT INTO LeadContact (" .$insert_cols . ") VALUES (" . $insert_vals . ")";
            $sql = $pdo->prepare($query);
            for ($i=0;$i<count($input_keys);$i++) {
                $sql->bindValue(':'.$input_keys[$i],$input_vals[$i]);
            }
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',$CustomerUUID);
            if($sql->execute()) {
                $response["newID"] = $pdo->lastInsertId();
                $response["code"] = 1;
            } else {
                $response["code"] = 0;
                $response["msg"] = "SQL INSERT INTO execution error";
            }
            echo json_encode($response);
            break;
        case "PUT": // UPDATE LEAD CONTACT
            if (empty($key)) {
                $response["code"] = 0;
                $response["msg"] = "Missing URL key";
            } else {
                $update_cols = '';
                $parameter_list = array("ContactName","ContactTitle","ContactAvatar","ContactPhone","ContactEmail","ContactLocation","CF1","CF2","CF3","CF4","CF5","CF6","CF7","CF8","CF9","CF10","CF11","CF12","CF13","CF14","CF15","CF16","CF17","CF18","CF19","CF20","ClearBit");
                for ($i=0;$i<count($input_keys);$i++) {
                    if(!in_array($input_keys[$i],$parameter_list)) {
                        $response["code"] = 0;
                        $response["msg"] = "Corrupt parameters detected";
                        echo json_encode($response);
                        exit();
                    }
                    $update_cols.=($i>0?',':'').$input_keys[$i]."=:".$input_keys[$i];
                }
                $update_cols .= ",DateModified=:DateModified,ModifiedBy=:ModifiedBy";

                $filter = " WHERE ID = :ID";
                $query = "SELECT ContactEmail FROM LeadContact" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':ID',$key);
                $sql->execute();
                $row = $sql->fetch();
                
                if(!empty($input["ContactEmail"]) && $input["ContactEmail"] != $row["ContactEmail"]) {
                    $filter = " WHERE A.ContactEmail = :ContactEmail AND B.CompanyUUID = :CompanyUUID AND A.IsDeleted = 0";
                    $query = "SELECT A.ID FROM LeadContact A JOIN Lead B ON A.LeadID = B.ID" . $filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':ContactEmail',$input["ContactEmail"]);
                    $sql->bindValue(':CompanyUUID',$CompanyUUID);
                    $sql->execute();
                    $row = $sql->fetch();
                    if(!empty($row)) {
                        $response["code"] = 2;
                        $response["msg"] = "Contact email already exists";
                        echo json_encode($response);
                        exit();
                    }
                }

                $filter = " WHERE ID = :ID";
                $query = "UPDATE LeadContact SET ".$update_cols.$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':ID',$key);
                for ($i=0;$i<count($input_keys);$i++) {
                    $sql->bindValue(':'.$input_keys[$i],$input_vals[$i]);
                }
                $sql->bindValue(':DateModified',date("Y-m-d H:i:s"));
                $sql->bindValue(':ModifiedBy',$CustomerUUID);
                if($sql->execute()) {
                    $response["code"] = 1;
                } else {
                    $response["code"] = 0;
                    $response["msg"] = "SQL UPDATE execution error";
                }
            }
            echo json_encode($response);
            break;
        case "DELETE": // SOFT DELETE LEAD CONTACT
            if (empty($key)) {
                $response["code"] = 0;
                $response["msg"] = "Missing URL key";
            } else {
                $filter = " WHERE ID = :ID";
                $query = "UPDATE LeadContact SET IsDeleted = 1" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':ID',$key);
                if($sql->execute()) {
                    $response["code"] = 1;
                } else {
                    $response["code"] = 0;
                    $response["msg"] = "SQL DELETE execution error";
                }
            }
            echo json_encode($response);
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