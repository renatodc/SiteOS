<?php

function generateUUID() {
    return bin2hex(random_bytes(32));
}

function filterName($targetName) {
    $targetName = preg_replace('/[^a-z0-9_-]+/i','',$targetName);
    if((strlen($targetName) > 200)) {
        $targetName = substr($targetName, 0, 200);
    }
    return $targetName;
}

function getSubDomain($pdo, $CompanyUUID) {
    $filter = " WHERE UUID = :UUID";
    $query = "SELECT SubDomain FROM Company" . $filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':UUID',$CompanyUUID);
    $sql->execute();
    $result = $sql->fetch();
    return $result["SubDomain"];
}

function getDomainName($pdo, $CompanyUUID) {
    $filter = " WHERE UUID = :UUID";
    $query = "SELECT DomainName FROM Company" . $filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':UUID',$CompanyUUID);
    $sql->execute();
    $result = $sql->fetch();
    return $result["DomainName"];
}

function human_filesize($bytes, $decimals = 2) {
    $sz = 'BKMGTP';
    $factor = floor((strlen($bytes) - 1) / 3);
    return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . " " . @$sz[$factor] . "B";
}

function startsWith($haystack, $needle) {
    $length = strlen($needle);
    return substr($haystack, 0, $length) === $needle;
}

function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }
    return (substr($haystack, -$length) === $needle);
}

function isValidEnclosedHTML5($fileContents) {
    return ((stripos($fileContents,"<!DOCTYPE html>") !== false) && (strpos($fileContents,"</html>") !== false));
}

function isValidPath($root,$path) { // VERIFY PATH INPUT BELONGS TO ROOT
    $realpath = realpath($root . $path);
    if(!$realpath) return false;
    return ((strpos($realpath, $root) !== false) && (strpos($realpath, $root) == 0));
}

function validateCsrfToken() {
    $response = array();
    if(isset($GLOBALS["input"]["st"]) && hash_equals($_SESSION["st"],$GLOBALS["input"]["st"])) {
        #region REMOVE TOKEN PARAMETER FROM INPUT ARRAYS
        $stIndex = 0;
        for ($i=0;$i<count($GLOBALS["input_keys"]);$i++) {
            if($GLOBALS["input_keys"][$i] == "st") {
                $stIndex = $i;
            }
        }
        array_splice($GLOBALS["input_keys"],$stIndex,1);
        array_splice($GLOBALS["input_vals"],$stIndex,1);
        #endregion
    } else {
        $response["code"] = 0;
        $response["msg"] = "Session token invalid";
        echo json_encode($response);
        exit();
    }
}

function requireCsrfToken() {
    switch ($_SERVER['REQUEST_METHOD']) {
        case "POST":
        case "PUT":
        case "DELETE":
        case "PATCH":
            validateCsrfToken();
            break;
    }    
}

function isOwner($pdo, $CustomerUUID) {
    $filter = " WHERE UUID = :UUID";
    $query = "SELECT IsOwner FROM Customer" . $filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':UUID',$CustomerUUID);
    $sql->execute();
    $result = $sql->fetch()["IsOwner"];
    if(intval($result) == 1) {
        return true;
    } else {
        return false;
    }
}

?>