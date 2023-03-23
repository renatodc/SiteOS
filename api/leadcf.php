<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST": // INSERT LEAD CUSTOM FIELD
            #region PREPARE CUSTOM FIELD
            #region VERIFY UNIQUE CUSTOM FIELD NAME
            $filter = " WHERE CompanyUUID = :CompanyUUID AND IsDeleted = 0 AND FieldName = :FieldName";
            $query = "SELECT ID FROM LeadCF" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':FieldName',$input["FieldName"]);
            $sql->execute();
            $cfResults = $sql->fetchAll();
            if(count($cfResults) > 0) {
                $response["code"] = 0;
                $response["msg"] = "Field Name already exists.";
                echo json_encode($response);
                break;
            }
            #endregion
            #region GET NEXT AVAILABLE CUSTOM FIELD POSITION
            $filter = " WHERE CompanyUUID = :CompanyUUID AND IsDeleted = 0 ORDER BY ValuePos ASC";
            $query = "SELECT ValuePos FROM LeadCF" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->execute();
            $valueTree = $sql->fetchAll();
            $valueModel = array();
            for ($i=1;$i<=20;$i++) {
                $valueModel[$i] = false;
            }
            foreach($valueTree as $valueTaken) {
                $valueModel[$valueTaken["ValuePos"]] = true;
            }
            $valuePos = false;
            for ($i=1;$i<=20;$i++) {
                if(!$valueModel[$i]) {
                    $valuePos = $i;
                    $i = 30;
                }
            }
            if(!$valuePos) {
                $response["code"] = 0;
                $response["msg"] = "All Custom Fields are in use.";
                echo json_encode($response);
                break;
            }
            #endregion
            #region CLEAN CUSTOM FIELD VALUE
            $filter = " WHERE CompanyUUID = :CompanyUUID";
            $query = "UPDATE Lead SET CF" . $valuePos . " = NULL" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->execute();
            #endregion
            #endregion
            #region ADD CUSTOM FIELD
            $uuid = generateUUID();
            $insert_cols = 'UUID,CompanyUUID';
            $insert_vals = ':UUID,:CompanyUUID';
            $parameter_list = array("FieldName","FieldType","FieldIcon","FieldDefault","FieldPlaceholder","FieldSelections","FieldMin","FieldMax","HasSearch","HasDropdown","IsRequired","IsViewable","IsIndexed");
            for ($i=0;$i<count($input_keys);$i++) {
                if(!in_array($input_keys[$i],$parameter_list)) {
                    $response["code"] = 0;
                    $response["msg"] = "Corrupt parameters detected";
                    echo json_encode($response);
                    exit();
                }
                $insert_cols.=",".$input_keys[$i];
                $insert_vals.=",:".$input_keys[$i];
            }
            $insert_cols .= ",ValuePos,DateCreated,CreatedBy";
            $insert_vals .= ",:ValuePos,:DateCreated,:CreatedBy";
            $query = "INSERT INTO LeadCF (" .$insert_cols . ") VALUES (" . $insert_vals . ")";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$uuid);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            for ($i=0;$i<count($input_keys);$i++) {
                $sql->bindValue(':'.$input_keys[$i],$input_vals[$i]);
            }
            $sql->bindValue(':ValuePos',$valuePos);
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',$CustomerUUID);
            if($sql->execute()) {
                $response["code"] = 1;
                $response["newID"] = $pdo->lastInsertId();
                $response["newUUID"] = $uuid;
            } else {
                $response["code"] = 0;
                $response["msg"] = "SQL INSERT INTO execution error";
            }
            #endregion
            echo json_encode($response);
            break;
        case "PUT": // UPDATE LEAD CUSTOM FIELD
            if (empty($key)) {
                $response["code"] = 0;
                $response["msg"] = "Missing URL key";
            } else {
                // IF FIELD NAME EXISTS, RETURN FALSE
                $filter = " WHERE CompanyUUID = :CompanyUUID AND IsDeleted = 0 AND FieldName = :FieldName AND UUID NOT LIKE :UUID";
                $query = "SELECT ID FROM LeadCF" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->bindValue(':FieldName',$input["FieldName"]);
                $sql->bindValue(':UUID',$key);
                $sql->execute();
                $cfResults = $sql->fetchAll();
                if(count($cfResults) > 0) {
                    $response["code"] = 0;
                    $response["msg"] = "Field Name already exists.";
                } else {                
                    // UPDATE CUSTOM FIELD
                    $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";                    
                    $parameter_list = array("FieldName","FieldType","FieldIcon","ValuePos","FieldDefault","FieldPlaceholder","FieldSelections","FieldMin","FieldMax","HasSearch","HasDropdown","IsRequired","IsViewable","IsIndexed");
                    $update_cols = '';
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
                    $query = "UPDATE LeadCF SET ".$update_cols.$filter;
                    $sql = $pdo->prepare($query);
                    for ($i=0;$i<count($input_keys);$i++) {
                        $sql->bindValue(':'.$input_keys[$i],$input_vals[$i]);
                    }
                    $sql->bindValue(':DateModified',date("Y-m-d H:i:s"));
                    $sql->bindValue(':ModifiedBy',$CustomerUUID);
                    $sql->bindValue(':UUID',$key);
                    $sql->bindValue(':CompanyUUID',$CompanyUUID);
                    if($sql->execute()) {
                        $response["code"] = 1;
                    } else {
                        $response["code"] = 0;
                        $response["msg"] = "SQL UPDATE execution error";
                    }
                }
            }
            echo json_encode($response);
            break;
        case "DELETE": // SOFT DELETE LEAD CUSTOM FIELD
            if (empty($key)) {
                $response["code"] = 0;
                $response["msg"] = "Missing URL key";
            } else {
                // DELETE Lead
                $filter = " WHERE ID = :ID";
                $query = "UPDATE LeadCF SET IsDeleted = 1" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':ID',$key);
                $sql->execute();

                $response["code"] = 1;
            }
            echo json_encode($response);
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