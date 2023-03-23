<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';
require 'vendor/autoload.php';
use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;
$s3 = new S3Client([
    'version' => $config["s3_version"],
    'region'  => $config["s3_region"]
]);

try {
    switch ($method)  {
        case "GET": // GET S3 IMGS
            $result = $s3->listObjectsV2([
                'Bucket' => $config["s3_bucket"],
                'Prefix'    => $config["name"] . '/img/'
            ]);
            $images = array();
            if(!empty($result['Contents'])) {
                foreach($result['Contents'] as $imageData) {
                    if($imageData['Size'] > 0) {
                        $imgdata = array();
                        $imgdata["name"] = basename($imageData['Key']);
                        $imgdata["url"] = "https://" . $config["s3_bucket"] . ".s3-" . $config["s3_region"] . ".amazonaws.com/" . $imageData['Key'];
                        $imgdata["size"] = human_filesize($imageData['Size']);
                        $imgdata["date"] = date("Y-m-d H:i:s", strtotime($imageData['LastModified']));
                        array_push($images,$imgdata);
                    }
                }
            }
            $response["data"] = $images;
            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "POST": // UPLOAD IMG TO S3
            $response["code"] = 0;
            $response["msg"] = "";
            $tempFile = $_FILES['files']['tmp_name'];
            $tempFileSize = $_FILES['files']['size'];
            $targetName = pathinfo($_FILES['files']['name'], PATHINFO_FILENAME);
            $targetExt = strtolower(pathinfo($_FILES['files']['name'], PATHINFO_EXTENSION));
            if(empty($tempFile)) { // NO IMG FOUND
                $response["code"] = 2;
            } else if(!is_uploaded_file($_FILES['files']['tmp_name'])) { // CORRUPT IMG
                $response["code"] = 3;                
            } else if($tempFileSize == 0) { // EMPTY IMG
                $response["code"] = 4;                
            } else if(filesize($tempFile) > $config["max_attachment_size"]) { // IMG MAX FILE SIZE EXCEEDED
                $response["code"] = 5;
                $response["msg"] = human_filesize($tempFileSize);
            } else if($targetExt != "jpg" && $targetExt != "jpeg" && $targetExt != "png" && $targetExt != "gif" && $targetExt != "bmp" && $targetExt != "ico" && $targetExt != "webp") { // WRONG IMG FORMAT
                $response["code"] = 6;
                $response["msg"] = $targetExt;
            } else {
                $targetName = filterName($targetName);
                $targetFile = $targetName . '.' . $targetExt;
                $result = $s3->putObject([
                    'Bucket' => $config["s3_bucket"],
                    'Key'    => $config["name"] . '/img/' . $targetFile,
                    'Body'   => file_get_contents($tempFile),
                    'ACL'    => 'public-read'
                ]);

                $imgdata = array();
                $imgdata["name"] = $targetFile;
                $imgdata["url"] = $result['ObjectURL'];
                $imgdata["size"] = human_filesize(filesize($tempFile));
                $imgdata["date"] = date("Y-m-d H:i:s", filemtime($tempFile));
                $response["data"] = $imgdata;
                $response["code"] = 1;
            }
            echo json_encode($response);
            break;
        case "PUT":
            break;
        case "DELETE": // DELETE IMG FROM S3
            $response["code"] = 0;
            if(strpos($key,'/') === false && strpos($key,'..') === false) {
                $result = $s3->deleteObject([
                    'Bucket' => $config["s3_bucket"],
                    'Key'    => $config["name"] . '/img/' . $key
                ]);
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