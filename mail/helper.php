<?php

function generateUUID(): string {
    return bin2hex(random_bytes(32));
}
function getDomainFromEmail($email) {
    if(strpos($email,'@')) {
        $domain = substr($email, strrpos($email, '@')+1);
        return $domain;
    } else {
        return $email;
    }
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
function verify($token, $timestamp, $signature): bool {
    $mgKey = $config["mg_key"];
    if (abs(time() - $timestamp) > 15) {
        return false;
    }
    return hash_equals(hash_hmac('sha256', $timestamp.$token, $mgKey), $signature);
}
function removeHeaderTags($content): string {
    # REMOVE <BASE> TAG
    $baseTagStart = "<base";
    $baseTagEnd = ">";
    $baseTagStartPos = stripos($content, $baseTagStart);
    $baseTagEndPos = strpos($content, $baseTagEnd, $baseTagStartPos);
    $baseTagLengthDiff = $baseTagEndPos + strlen($baseTagEnd) - $baseTagStartPos;
    if($baseTagStartPos !== false) {
        $content = substr_replace($content, "", $baseTagStartPos, $baseTagLengthDiff);
    }
    # REMOVE <TITLE> TAG
    $titleTagStart = "<title";
    $titleTagEnd = "</title>";
    $titleTagStartPos = stripos($content, $titleTagStart);
    $titleTagEndPos = stripos($content, $titleTagEnd, $titleTagStartPos);
    $titleTagLengthDiff = $titleTagEndPos + strlen($titleTagEnd) - $titleTagStartPos;
    if($titleTagStartPos !== false) {
        $content = substr_replace($content, "", $titleTagStartPos, $titleTagLengthDiff);
    }
    # REMOVE <META> TAGS
    do {
        $metaTagStart = "<meta";
        $metaTagEnd = ">";
        $metaTagStartPos = stripos($content, $metaTagStart);
        $metaTagEndPos = strpos($content, $metaTagEnd, $metaTagStartPos);
        $metaTagLengthDiff = $metaTagEndPos + strlen($metaTagEnd) - $metaTagStartPos;
        if($metaTagStartPos !== false) {
            $content = substr_replace($content, "", $metaTagStartPos, $metaTagLengthDiff);
        }
    } while($metaTagStartPos !== false);
    return $content;
}
function extractEmailAddress($email) {
    $iBegin = strpos($email, "<");
    $iEnd = strpos($email, ">");
    $iDiff = $iEnd - $iBegin;
    if($iBegin > 0 && $iEnd > 0 && $iEnd > $iBegin) {
        $email = substr($email, $iBegin + 1, $iDiff - 1);
    }
    $email = trim($email, " \"");
    return $email;
}
function validateCsrfToken() {
    $response = array();
    if(isset($_POST["st"]) && hash_equals($_SESSION["st"],$_POST["st"])) {
    } else {
        $response["code"] = 0;
        $response["msg"] = "Session token invalid";
        echo json_encode($response);
        exit();
    }
}

$response = array();
$result = array();

?>