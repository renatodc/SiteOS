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
        case "POST": // DOWNLOAD FILE AS BINARY
            if(isValidPath($CompanyPath,$input["file"])) {
                $fileLocation = $CompanyPath . $input["file"];
                $fileContents = file_get_contents($fileLocation);
                echo $fileContents;
            }
            break;
        case "PUT": // DOWNLOAD FILE AS TEXT/JSON
            $response["success"] = 0;
            if(isValidPath($CompanyPath,$input["file"])) {
                $fileLocation = $CompanyPath . $input["file"];
                $fileContents = file_get_contents($fileLocation);

                $fileBlob = array();
                $fileBlob["file"] = $fileContents;

                $response["data"] = $fileBlob;
                $response["success"] = 1;
            }
            echo json_encode($response);
            break;
        case "DELETE":
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