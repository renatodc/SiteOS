<?php

$response = array();
$result = array();
preg_match('/^(.+?\.php)(\/.*)$/', $_SERVER['REQUEST_URI'], $matches);
if(count($matches) > 1) {
    $request = explode('/', trim($matches[2],'/'));
    $key = str_replace("#","",$request[0]);
} else {
    $key = "";
}
$method = $_SERVER['REQUEST_METHOD'];
$payload = file_get_contents('php://input');

?>