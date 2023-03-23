<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';
require 'vendor/autoload.php';
use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST": // UPLOAD MAIL TEMPLATE THUMB TO S3
            $response["success"] = 0;
            $uuid = $_POST["UUID"];
            if(preg_match('/^[\w-]+$/', $uuid)) {
                $base64String = $_POST["base64"];
                $base64String = str_replace('data:image/png;base64,', '', $base64String);
                $base64String = str_replace(' ', '+', $base64String);
                $imgData = base64_decode($base64String,true);
                if($imgData) {
                    $s3 = new S3Client([
                        'version' => $config["s3_version"],
                        'region'  => $config["s3_region"]
                    ]);
                    $result = $s3->putObject([
                        'Bucket' => $config["s3_bucket"],
                        'Key'    => $config["name"] . '/templates-email/' . $uuid . ".png",
                        'Body'   => $imgData,
                        'ACL'    => 'public-read'
                    ]);
                    $response["success"] = 1;
                }
            }
            echo json_encode($response);
            break;
        case "PUT":
            break;
        case "DELETE":
            break;
        case "PATCH":
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