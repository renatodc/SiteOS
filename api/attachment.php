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
        case "POST": // UPLOAD ATTACHMENT
            $response["code"] = 0;
            $response["msg"] = "";
            $tempFile = $_FILES['files']['tmp_name'];
            $tempFileSize = $_FILES['files']['size'];
            // VALIDATE
            if(empty($tempFile)) { // NO ATTACHMENT FOUND
                $response["code"] = 2;
            } else if(!is_uploaded_file($_FILES['files']['tmp_name'])) { // CORRUPT ATTACHMENT
                $response["code"] = 3;
            } else if($tempFileSize == 0) { // EMPTY ATTACHMENT
                $response["code"] = 4;
            } else if(filesize($tempFile) > $config["max_attachment_size"]) { // ATTACHMENT MAX FILE SIZE EXCEEDED
                $response["code"] = 5;
                $response["msg"] = human_filesize($tempFileSize);
            } 
            else { // UPLOAD TO S3
                $targetName = pathinfo($_FILES['files']['name'], PATHINFO_FILENAME);
                $targetExt = pathinfo($_FILES['files']['name'], PATHINFO_EXTENSION);
                $targetName = filterName($targetName);
                $targetFile = $targetName . '.' . $targetExt;                
                $s3 = new S3Client([
                    'version' => $config["s3_version"],
                    'region'  => $config["s3_region"]
                ]);
                $result = $s3->putObject([
                    'Bucket' => $config["s3_bucket"],
                    'Key'    => $config["domain"] . '/' . generateUUID() . '/' . $targetFile,
                    'Body'   => file_get_contents($tempFile),
                    'ACL'    => 'public-read'
                ]);
                $attachment = array();
                $attachment["name"] = $targetFile;
                $attachment["url"] = $result['ObjectURL'];
                $attachment["size"] = human_filesize(filesize($tempFile));
                $attachment["date"] = date("Y-m-d H:i:s", filemtime($tempFile));
                $response["data"] = $attachment;
                $response["code"] = 1;
            }
            echo json_encode($response);
            break;
    }
}
catch(PDOException $ex) {
    $response["code"] = 0;
    $response["msg"] = $ex->getMessage();
    echo json_encode($response);
}
$pdo = null;

?>