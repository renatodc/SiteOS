<?php

session_start();
if(!array_key_exists("CustomerUUID",$_SESSION) && !array_key_exists("CompanyUUID",$_SESSION) && !isset($_SESSION["CustomerUUID"]) && !isset($_SESSION["CompanyUUID"])) {
    header("Location:/index");
    exit;
} else {
    $CompanyUUID = $_SESSION["CompanyUUID"];
    $CustomerUUID = $_SESSION["CustomerUUID"];
}

?>