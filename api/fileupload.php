<?php

include 'session.php';
include 'dbtoken.php';
include 'helper.php';
$method = $_SERVER['REQUEST_METHOD'];
$response = array();
$result = array();

$WebPath = $config["root"] . "/web";
$CompanyPath = $WebPath . '/' . $config["name"];

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST": // UPLOAD FILE
            $response["success"] = 0;
            if (isset($_FILES['files'])) {
                $file_name = $_FILES['files']['name'][0];
                $file_tmp = $_FILES['files']['tmp_name'][0];
                $file_type = $_FILES['files']['type'][0];
                $file_size = $_FILES['files']['size'][0];
                $file_path = $_POST['folder'] . '/' . $file_name;
                $fileLocation = $CompanyPath . $file_path;
                if(isValidPath($CompanyPath, $_POST['folder']) && (strpos($file_name, "/") === false) && (strpos($file_name, "..") === false) && move_uploaded_file($file_tmp, $fileLocation)) {
                    $response["success"] = 1;
                    $response["filePath"] = $file_path;
                }
            }
            echo json_encode($response);            
            break;
        case "PUT":
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