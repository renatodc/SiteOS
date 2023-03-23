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
    'version' => $config["version"],
    'region'  => $config["region"]
]);

try {
    switch ($method)  {
        case "GET": // GET VIDEOS AND VIDEO THUMBS
            $result = $s3->listObjectsV2([
                'Bucket' => $config["s3_bucket"],
                'Prefix'    => $config["name"] . '/video/'
            ]);
            $images = array();
            if(!empty($result['Contents'])) {
                foreach($result['Contents'] as $imageData) {
                    if($imageData['Size'] > 0) {
                        $imgdata = array();
                        $imgdata["name"] = basename($imageData['Key']);
                        $imgdata["url"] = "https://" . $config["s3_bucket"] . ".s3-" . $config["s3_region"] . ".amazonaws.com/" . $imageData['Key'];
                        $imgdata["thumb"] = str_replace('/video/','/video-thumb/',$imgdata["url"]);
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
        case "POST": // UPLOAD VIDEO, GENERATE VIDEO THUMB
            $response["code"] = 0;
            $response["msg"] = "";
            $tempFile = $_FILES['files']['tmp_name'];
            $tempFileSize = $_FILES['files']['size'];
            $targetName = pathinfo($_FILES['files']['name'], PATHINFO_FILENAME);
            $targetExt = strtolower(pathinfo($_FILES['files']['name'], PATHINFO_EXTENSION));
            if(empty($tempFile)) { // NO VIDEO FOUND
                $response["code"] = 2;
            } else if(!is_uploaded_file($_FILES['files']['tmp_name'])) { // CORRUPT VIDEO
                $response["code"] = 3;                
            } else if($tempFileSize == 0) { // EMPTY VIDEO
                $response["code"] = 4;
            } else if(filesize($tempFile) > $config["max_attachment_size"]) { // VIDEO MAX FILE SIZE EXCEEDED
                $response["code"] = 5;
                $response["msg"] = human_filesize($tempFileSize);
            } else {
                $targetName = filterName($targetName);
                $ffmpeg = FFMpeg\FFMpeg::create(array(
                    'ffmpeg.binaries'  => $config["root_ffmpeg"] . '/ffmpeg',
                    'ffprobe.binaries' => $config["root_ffmpeg"] . '/ffmpeg/ffprobe',
                    'timeout'          => 3600,
                    'ffmpeg.threads'   => 12
                ));
                if($targetExt == "mp4" || $targetExt == "webm" || $targetExt == "ogg") {
                    $tmpVideoPath = $tempFile;
                } else {
                    #region CONVERT TO WEBM FORMAT
                    $format = new FFMpeg\Format\Video\WebM();
                    $video = $ffmpeg->open($tempFile);
                    $tmpVideoPath = $config["root"] . "/tmp/{$targetName}.webm";
                    $video->save($format, $tmpVideoPath);
                    $targetExt = "webm";
                    #endregion
                }
                $targetFile = $targetName . '.' . $targetExt;
                $result = $s3->putObject([
                    'Bucket' => $config["s3_bucket"],
                    'Key'    => $config["name"] . '/video/' . $targetFile,
                    'Body'   => file_get_contents($tmpVideoPath),
                    'ACL'    => 'public-read'
                ]);
                #region GET VIDEO FRAME
                $video = $ffmpeg->open($tmpVideoPath);
                $frame = $video->frame(FFMpeg\Coordinate\TimeCode::fromSeconds(2));
                $thumbnailPath = $config["root"] . "/tmp/video-thumb/{$targetName}.jpg";
                $frame->save($thumbnailPath);
                #endregion
                $thumbResult = $s3->putObject([
                    'Bucket' => $config["s3_bucket"],
                    'Key'    => $config["name"] . '/video-thumb/' . $targetFile,
                    'Body'   => file_get_contents($thumbnailPath),
                    'ACL'    => 'public-read'
                ]);

                $imgdata = array();
                $imgdata["name"] = $targetFile;
                $imgdata["url"] = $result['ObjectURL'];
                $imgdata["size"] = human_filesize(filesize($tmpVideoPath));
                $imgdata["date"] = date("Y-m-d H:i:s", filemtime($tmpVideoPath));
                $imgdata["thumb"] = $thumbResult['ObjectURL'];

                $response["data"] = $imgdata;
                $response["code"] = 1;
            }
            echo json_encode($response);
            break;
        case "PUT":
            break;
        case "DELETE": // DELETE VIDEO AND VIDEO THUMB
            $response["code"] = 0;
            if(strpos($key,'/') === false && strpos($key,'..') === false) {
                $result = $s3->deleteObject([
                    'Bucket' => $config["s3_bucket"],
                    'Key'    => $config["name"] . '/video/' . $key
                ]);
                $thumbResult = $s3->deleteObject([
                    'Bucket' => $config["s3_bucket"],
                    'Key'    => $config["name"] . '/video-thumb/' . $key
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