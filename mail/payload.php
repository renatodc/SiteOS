<?php

$payload = file_get_contents('php://input');
$input = json_decode($payload, true);

$event = "";
if(!empty($input["event-data"]["event"])) {
    $event = $input["event-data"]["event"];
}

$recipient = "";
if(!empty($input["event-data"]["recipient"])) {
    $recipient = $input["event-data"]["recipient"];
}

$domain = "";
if(!empty($input["event-data"]["recipient-domain"])) {
    $domain = $input["event-data"]["recipient-domain"];
}

$ip = "";
if(!empty($input["event-data"]["ip"])) {
    $ip = $input["event-data"]["ip"];
}

$country = "";
if(!empty($input["event-data"]["geolocation"]["country"])) {
    $country = $input["event-data"]["geolocation"]["country"];
}

$region = "";
if(!empty($input["event-data"]["geolocation"]["region"])) {
    $region = $input["event-data"]["geolocation"]["region"];
}

$city = "";
if(!empty($input["event-data"]["geolocation"]["city"])) {
    $city = $input["event-data"]["geolocation"]["city"];
}

$userAgent = "";
if(!empty($input["event-data"]["client-info"]["user-agent"])) {
    $userAgent = $input["event-data"]["client-info"]["user-agent"];
}

$deviceType = "";
if(!empty($input["event-data"]["client-info"]["device-type"])) {
    $deviceType = $input["event-data"]["client-info"]["device-type"];
}

$clientType = "";
if(!empty($input["event-data"]["client-info"]["client-type"])) {
    $clientType = $input["event-data"]["client-info"]["client-type"];
}

$clientName = "";
if(!empty($input["event-data"]["client-info"]["client-name"])) {
    $clientName = $input["event-data"]["client-info"]["client-name"];
}

$clientOS = "";
if(!empty($input["event-data"]["client-info"]["client-os"])) {
    $clientOS = $input["event-data"]["client-info"]["client-os"];
}

$timestamp = 0;
if(!empty($input["signature"]["timestamp"])) {
    $timestamp = $input["signature"]["timestamp"];
}

$token = "";
if(!empty($input["signature"]["token"])) {
    $token = $input["signature"]["token"];
}

$signature = "";
if(!empty($input["signature"]["signature"])) {
    $signature = $input["signature"]["signature"];
}

if(!verify($token,$timestamp,$signature)) {
    exit;
}

?>