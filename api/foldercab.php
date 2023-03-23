<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload-json.php';
include 'helper.php';

#region Folder Methods
function getDirectorySize($directory) {
    $size = 0;
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory)) as $file) {
        $size += $file->getSize();
    }
    return human_filesize($size);
}
function getWebDirectory($folder, $item) {
    $path = $folder . '/' . $item;
    $directory = array();
    $directory["name"] = $item;
    $directory["root"] = str_replace($GLOBALS["CompanyPath"], '', $path);
    $directory["files"] = array();
    $directory["folders"] = array();
    $directory["isOpen"] = $folder == $GLOBALS["WebPath"] ? 1 : 0;
    $directory["size"] = getDirectorySize($path);
    $directoryItems = scandir($path);
    foreach ($directoryItems as $directoryItem) {
        if (in_array($directoryItem,array(".",".."))) continue;
        $obj = $path . '/' . $directoryItem;
        if(is_dir($obj)) {
            array_push($directory["folders"], getWebDirectory($path, $directoryItem));
        }
        if(is_file($obj)) {
            $file = array();
            $file["name"] = $directoryItem;
            $file["path"] = str_replace($GLOBALS["CompanyPath"], '', $path);
            $file["size"] = human_filesize(filesize($obj));
            $file["modified"] = date("Y-m-d g:i a", filemtime($obj));
            array_push($directory["files"], $file);
        }
    }
    return $directory;
}
function deleteDirectory($dir) {
    $files = array_diff(scandir($dir), array('.','..')); 
    foreach ($files as $file) { 
        (is_dir($dir . "/" . $file)) ? deleteDirectory($dir . "/" . $file) : unlink($dir . "/" . $file); 
    } 
    return rmdir($dir); 
}
#endregion
#region Folder Variables
$WebPath = $config["root"] . "/web";
$CompanyPath = $WebPath . '/' . $config["name"];
#endregion

try {
    switch ($method)  {
        case "GET": // GET WEBSITE FOLDERS
            $result["directory"] = getWebDirectory($WebPath, $config["name"]);            
            $response["data"] = $result;
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "POST": // INSERT FOLDER
            $response["success"] = 0;
            $folderLocation = $CompanyPath . $input["path"] . '/' . $input["folder"];
            if(!empty($input["folder"]) && isValidPath($CompanyPath, $input["path"]) && !is_dir($folderLocation)) {
                $response["success"] = (mkdir($folderLocation)) ? 1 : 0;
                #region ADD ENTRY TO .WEBFOLDERS FILE
                if(!empty($input["webfolder"])) {
                    $WebFoldersPath = $CompanyPath . '/.webfolders';
                    $WebFoldersString = "";
                    if(file_exists($WebFoldersPath)) {
                        $WebFoldersString = file_get_contents($WebFoldersPath);
                        if(strlen($WebFoldersString) > 0) {
                            $WebFoldersString .= "\r\n";
                        }
                    }
                    if(empty($input["path"])) {
                        $WebFoldersString .= $input["folder"];
                    } else {
                        $WebFoldersString .= $input["path"] . '/' . $input["folder"];
                    }
                    file_put_contents($WebFoldersPath, $WebFoldersString);
                }
                #endregion
            }
            $response["folderLocation"] = $folderLocation;
            echo json_encode($response);
            break;
        case "PUT": // UPDATE FOLDER
            $response["success"] = 0;
            $folderOldLocation = $CompanyPath . $input["oldPath"];
            $folderNewLocation = $CompanyPath . $input["newPath"];
            if(!empty($input["oldPath"]) && (strpos($input["oldPath"],'/') == 0) && (strlen($input["oldPath"]) > 1) &&
            !empty($input["newPath"]) && (strpos($input["newPath"],'/') == 0) && (strlen($input["newPath"]) > 1) && (strpos($input["newPath"],'..') === false) &&
            isValidPath($CompanyPath, $input["oldPath"]) && !is_file($folderNewLocation) && !is_dir($folderNewLocation)) {
                if(rename($folderOldLocation,$folderNewLocation)) {
                    $response["success"] = 1;
                }
            }
            echo json_encode($response);
            break;
        case "DELETE": // DELETE FOLDER
            $response["success"] = 0;
            if(!empty($input["path"]) && (strpos($input["path"],'/') == 0) && (strlen($input["path"]) > 1) && isValidPath($CompanyPath, $input["path"])) {
                $folderLocation = $CompanyPath . $input["path"];
                if(deleteDirectory($folderLocation)) {
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