<?php

$AllowedHttpOriginsPath = "../../../allowed_http_origins.txt";
$AllowedHttpOriginsString = file_get_contents($AllowedHttpOriginsPath);
$allowed_http_origins = preg_split("/\r\n|\n|\r/",$AllowedHttpOriginsString);
if (array_key_exists("HTTP_ORIGIN",$_SERVER) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_http_origins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    error_log("Unable to determine HTTP Origin");
    $response = array();
    $response["code"] = 0;
    $response["msg"] = "Unable to determine HTTP Origin";
    echo json_encode($response);
    exit;
}
header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Cache-Control, Pragma");

?>