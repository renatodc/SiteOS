<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload-json.php';
include 'helper.php';

$WebPath = $config["root"] . "/web";
$CompanyPath = $WebPath . '/' . $config["name"];

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST": // SAVE FILE (INSERT/UPDATE)
            $response["success"] = 0;
            if(!empty($input["file"]) && (strpos($input["file"],'/') == 0) && (strpos($input["file"],'..') === false)) {
                $fileLocation = $CompanyPath . $input["file"];
                if(empty($input["create"])) {                
                    if(isValidPath($CompanyPath,$input["file"])) {
                        $saveResult = file_put_contents($fileLocation, $input["srcDoc"]);
                        if($saveResult !== FALSE) {
                            $response["success"] = 1;
                        }
                    }
                } else {
                    if(!is_file($fileLocation) && !is_dir($fileLocation)) {
                        $saveResult = file_put_contents($fileLocation, $input["srcDoc"]);
                        if(isValidPath($CompanyPath,$input["file"])) {
                            if($saveResult !== FALSE) {
                                $response["success"] = 1;
                            }
                        } else {
                            unlink($fileLocation);
                        }
                    } else {
                        $response["success"] = 2;
                    }
                }
            }
            echo json_encode($response);
            break;
        case "PUT": // RENAME FILE
            $response["success"] = 0;
            $fileOldLocation = $CompanyPath . $input["path"] . '/' . $input["oldFileName"];
            $fileNewLocation = $CompanyPath . $input["path"] . '/' . $input["newFileName"];
            if(isValidPath($CompanyPath,$input["path"] . '/' . $input["oldFileName"]) &&
            !is_file($fileNewLocation) && !is_dir($fileNewLocation)) {
                if(rename($fileOldLocation,$fileNewLocation)) {
                    $response["success"] = 1;
                }
            }
            echo json_encode($response);
            break;
        case "DELETE": // DELETE FILE
            $response["success"] = 0;
            $filePath = $input["path"] . '/' . $input["file"];
            if(isValidPath($CompanyPath,$filePath)) {
                $fileLocation = $CompanyPath . $filePath;
                if(unlink($fileLocation)) {
                    $response["success"] = 1;
                }
            }
            echo json_encode($response);
            break;
        case "PATCH": 
            break;
        }
}
catch(Exception $ex) {
    $response["success"] = 0;
    $response["errorMsg"] = $ex->getMessage();
    echo json_encode($response);
}
$pdo = null;

?>