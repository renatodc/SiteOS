<?php

session_start();
$response = array();
if(!array_key_exists("CustomerUUID",$_SESSION) && 
!array_key_exists("CompanyUUID",$_SESSION) && 
!isset($_SESSION["CustomerUUID"]) && 
!isset($_SESSION["CompanyUUID"])) {
    $response["code"] = 0;
} else {
    $response["code"] = 1;
}
echo json_encode($response);

?>