<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET": // GET LEAD ACTION
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing key";
            } else {
                $filter = " WHERE ID = :ID";
                $query = "SELECT ID,LeadID,ActionType,ActionStatus,ActionLink,ActionData,ActionPrice,ActionFrom,ActionTo,ActionStartDT,ActionEndDT,DateCreated,DateModified FROM LeadAction" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':ID',$key);
                if($sql->execute()) {
                    $response["success"] = 1;
                    $response["data"] = $sql->fetch();
                } else {
                    $response["success"] = 0;
                    $response["errorMsg"] = "SQL GET execution error";
                }
            }
            echo json_encode($response);
            break;
        case "POST": // INSERT LEAD ACTION
            $insert_cols = '';
            $insert_vals = '';
            $parameter_list = array("LeadID","ActionType","ActionStatus","ActionLink","ActionData","ActionPrice","ActionFrom","ActionTo","ActionStartDT","ActionEndDT");
            for ($i=0;$i<count($input_keys);$i++) {
                if(!in_array($input_keys[$i],$parameter_list)) {
                    $response["success"] = 0;
                    $response["errorMsg"] = "Corrupt parameters detected";
                    echo json_encode($response);
                    exit();
                }
                $insert_cols.=($i>0?',':'').$input_keys[$i];
                $insert_vals.=($i>0?',':'').":".$input_keys[$i];
            }
            $insert_cols .= ",DateCreated,CreatedBy";
            $insert_vals .= ",:DateCreated,:CreatedBy";
            // MAP FROM/TO to LEADCONTACTS/CUSTOMERS for data analysis purposes
            $query = "INSERT INTO LeadAction (" .$insert_cols . ") VALUES (" . $insert_vals . ")";
            $sql = $pdo->prepare($query);
            for ($i=0;$i<count($input_keys);$i++) {
                $sql->bindValue(':'.$input_keys[$i],$input_vals[$i]);
            }
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',$CustomerUUID);
            if($sql->execute()) {
                $response["newID"] = $pdo->lastInsertId();
                $response["success"] = 1;
            } else {
                $response["success"] = 0;
                $response["errorMsg"] = "SQL INSERT INTO execution error";
            }
            echo json_encode($response);
            break;
        case "PUT": // UPDATE LEAD ACTION
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                $filter = " WHERE ID = :ID";
                $update_cols = '';
                $parameter_list = array("LeadID","ActionType","ActionStatus","ActionLink","ActionData","ActionPrice","ActionFrom","ActionTo","ActionStartDT","ActionEndDT");
                for ($i=0;$i<count($input_keys);$i++) {
                    if(!in_array($input_keys[$i],$parameter_list)) {
                        $response["success"] = 0;
                        $response["errorMsg"] = "Corrupt parameters detected";
                        echo json_encode($response);
                        exit();
                    }
                    $update_cols.=($i>0?',':'').$input_keys[$i]."=:".$input_keys[$i];
                }
                $query = "UPDATE LeadAction SET ".$update_cols.$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':ID',$key);
                for ($i=0;$i<count($input_keys);$i++) {
                    $sql->bindValue(':'.$input_keys[$i],$input_vals[$i]);
                }
                if($sql->execute()) {
                    $response["success"] = 1;
                } else {
                    $response["success"] = 0;
                    $response["errorMsg"] = "SQL UPDATE execution error";
                }
            }
            echo json_encode($response);
            break;
        case "DELETE": // DELETE LEAD ACTION
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                $filter = " WHERE ID = :ID";
                $query = "UPDATE LeadAction SET IsDeleted = 1" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':ID',$key);
                if($sql->execute()) {
                    $response["success"] = 1;
                } else {
                    $response["success"] = 0;
                    $response["errorMsg"] = "SQL DELETE execution error";
                }
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