<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';
require 'vendor/autoload.php';

function getCompanyEmail($pdo, $CustomerUUID) {
    $filter = " WHERE UUID = :UUID";
    $query = "SELECT CompanyEmail FROM Customer" . $filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':UUID',$CustomerUUID);
    $sql->execute();
    $result = $sql->fetch();
    return $result["CompanyEmail"];
}
$CompanyEmail = getCompanyEmail($pdo,$CustomerUUID);
$MailLimit = 100;

try {
    switch ($method)  {
        case "GET": // GET MAIL FOLDERS AND MESSAGES
            #region GET MAIL FOLDERS
            $filter = " WHERE CompanyEmail = :CompanyEmail AND IsDeleted = 0";
            $query = "SELECT FolderName,UUID FROM MailFolder" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyEmail',$CompanyEmail);
            $sql->execute();
            $mailFolders = $sql->fetchAll();
            $response["mailfolder"] = [];
            // GET COUNT OF NEW EMAIL IN EVERY FOLDER, ADD TO FOLDER ENTRY
            foreach($mailFolders as $mf) {
                if($mf["FolderName"] != "Sent" && $mf["FolderName"] != "Drafts" && $mf["FolderName"] != "Spam" && $mf["FolderName"] != "Trash") {
                    $filter = " WHERE MailTo = :MailTo AND MailFolderUUID = :MailFolderUUID AND IsDeleted = 0 AND IsRead = 0";
                    $query = "SELECT COUNT(*) AS MailCount FROM Mail" . $filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':MailTo',$CompanyEmail);
                    if($mf["FolderName"] != "Inbox") {
                        $sql->bindValue(':MailFolderUUID', $mf["UUID"]);
                    } else {
                        $sql->bindValue(':MailFolderUUID', "");
                    }
                    $sql->execute();
                    $mf["NewCount"] = $sql->fetch()["MailCount"];
                } 
                array_push($response["mailfolder"], $mf);
            }
            #endregion
            #region GET MESSAGES
            $pager = " LIMIT $MailLimit";
            $sorter = " ORDER BY ID DESC";
            if(empty($key)) { // GET FROM INBOX
                $filter = " WHERE MailTo = :MailTo AND MailFolder = 'Inbox' AND IsDeleted = 0";
                $query = "SELECT COUNT(ID) AS MailCount FROM Mail" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':MailTo',$CompanyEmail);
                $sql->execute();
                $count = intval($sql->fetch()["MailCount"]);
                $query = "SELECT UUID,MailFrom,MailSender,MailTo,MailSubject,SUBSTR(MailBodyPlain,1,50) AS MailBodyPlain,IsRead,DateSent FROM Mail" . $filter . $sorter;
                if($count > $MailLimit) {
                    $query .= $pager;
                }
                $sql = $pdo->prepare($query);
                $sql->bindValue(':MailTo',$CompanyEmail);
                $sql->execute();
            } else { // GET FROM MAIL FOLDER (NOT INBOX)
                $filter = " WHERE MailTo = :MailTo AND MailFolderUUID = :MailFolderUUID AND IsDeleted = 0";
                foreach($response["mailfolder"] as $mf) {
                    if($mf["UUID"] == $key) {
                        switch($mf["FolderName"]) {
                            case "Sent":
                                $filter = " WHERE MailFrom = :MailTo AND MailFolderUUID = :MailFolderUUID AND IsDeleted = 0";
                                break;
                            case "Trash":
                                $filter = " WHERE (MailFrom = :MailTo OR MailTo =:MailTo) AND MailFolderUUID = :MailFolderUUID AND IsDeleted = 0";
                                break;
                            case "Drafts":
                                $filter = " WHERE MailFrom = :MailTo AND MailFolderUUID = :MailFolderUUID AND IsDeleted = 0";
                                break;
                        }
                    }
                }                
                $query = "SELECT COUNT(ID) AS MailCount FROM Mail" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':MailTo',$CompanyEmail);
                $sql->execute();
                $count = intval($sql->fetch()["MailCount"]);
                $query = "SELECT UUID,MailFrom,MailSender,MailTo,MailSubject,SUBSTR(MailBodyPlain,1,50) AS MailBodyPlain,IsRead,DateSent FROM Mail" . $filter . $sorter;
                if($count > $MailLimit) {
                    $query .= $pager;
                }
                $sql = $pdo->prepare($query);
                $sql->bindValue(':MailTo',$CompanyEmail);
                $sql->bindValue(':MailFolderUUID',$key);
                $sql->execute();
            }
            $response["mail"] = $sql->fetchAll();
            $response["count"] = $count;
            $response["factor"] = $MailLimit;
            #endregion
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "POST": // SAVE TO DRAFTS
            validateCsrfToken();
            #region GET DRAFTS FOLDER KEY
            $filter = " WHERE FolderName = :FolderName AND CompanyEmail = :CompanyEmail";
            $query = "SELECT UUID FROM MailFolder" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyEmail',$CompanyEmail);
            $sql->bindValue(':FolderName',"Drafts");
            $sql->execute();
            $MailFolderUUID = $sql->fetch()["UUID"];
            #endregion
            $uuid = generateUUID();
            $DomainName = getDomainName($pdo,$CompanyUUID);
            #region FILTER MESSAGE CONTENT (XSS)
            $purifyConfig = HTMLPurifier_Config::createDefault();
            $purifier = new HTMLPurifier($purifyConfig);
            $bodyhtmlFiltered = $purifier->purify($input["MailBodyHTML"]);
            #endregion
            #region SAVE MAIL TO DB
            $insert_cols = 'UUID,CompanyUUID,MailDomain,MailFrom,MailTo,MailCC,MailBCC,MailSubject,MailBodyPlain,MailBodyHTML,MailBodyFiltered,MailAttachments,IsRead,MailFolder,MailFolderUUID,DateSent';
            $insert_vals = ':UUID,:CompanyUUID,:MailDomain,:MailFrom,:MailTo,:MailCC,:MailBCC,:MailSubject,:MailBodyPlain,:MailBodyHTML,:MailBodyFiltered,:MailAttachments,:IsRead,:MailFolder,:MailFolderUUID,:DateSent';
            $query = "INSERT INTO Mail (" .$insert_cols . ") VALUES (" . $insert_vals . ")";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$uuid);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':MailDomain',$DomainName);
            $sql->bindValue(':MailFrom',$CompanyEmail);
            $sql->bindValue(':MailTo',$input["MailTo"]);
            $sql->bindValue(':MailCC',$input["MailCC"]);
            $sql->bindValue(':MailBCC',$input["MailBCC"]);
            $sql->bindValue(':MailSubject',$input["MailSubject"]);
            $sql->bindValue(':MailBodyPlain',$input["MailBodyPlain"]);
            $sql->bindValue(':MailBodyHTML',$input["MailBodyHTML"]);
            $sql->bindValue(':MailBodyFiltered',$bodyhtmlFiltered);
            $sql->bindValue(':MailAttachments',$input["MailAttachments"]);
            $sql->bindValue(':IsRead',1);
            $sql->bindValue(':MailFolder',"Drafts");
            $sql->bindValue(':MailFolderUUID',$MailFolderUUID);
            $sql->bindValue(':DateSent',date("Y-m-d H:i:s"));
            if($sql->execute()) {
                $response["success"] = 1;
                $response["newID"] = $pdo->lastInsertId();
                $response["newUUID"] = $uuid;
            } else {
                $response["success"] = 0;
                $response["msg"] = "SQL INSERT INTO execution error";
            }
            #endregion
            echo json_encode($response);
            break;
        case "PUT": // MARK AS NEW
            if (empty($key)) {
                $response["success"] = 0;
                $response["msg"] = "Missing URL key";
            } else { 
                $filter = " WHERE UUID = :UUID";
                $query = "UPDATE Mail SET IsRead = 0" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                if($sql->execute()) {
                    $response["success"] = 1;
                } else {
                    $response["success"] = 0;
                    $response["msg"] = "SQL UPDATE execution error";
                }
            }
            echo json_encode($response);
            break;
        case "DELETE": // DELETE FROM TRASH FOLDER
            if (empty($key)) {
                $response["success"] = 0;
                $response["msg"] = "Missing URL key";
            } else {
                $filter = " WHERE UUID = :UUID";
                $query = "UPDATE Mail SET IsDeleted = 1" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->execute();
                $response["success"] = 1;
            }
            echo json_encode($response);
            break;
        case "PATCH": // UTILITY API
            if(!empty($input["getMessage"])) { // READ MESSAGE
                if (empty($key)) {
                    $response["success"] = 0;
                    $response["msg"] = "Missing URL key";
                } else {
                    $filter = " WHERE UUID = :UUID";
                    $query = "UPDATE Mail SET IsRead = 1" . $filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':UUID',$key);
                    $sql->execute();

                    $filter = " WHERE UUID = :UUID AND IsDeleted = 0";
                    $query = "SELECT UUID,MailFrom,MailTo,MailCC,MailBCC,MailSubject,MailBodyPlain,MailBodyFiltered,MailAttachments,MailFolder,MailFolderUUID,IsRead,IsDelivered,IsOpened,IsClicked,IsBounced,IsFailed,IsUnsubscribed,IsComplained,RecipientsDelivered,RecipientsOpened,RecipientsClicked,RecipientsBounced,RecipientsFailed,RecipientsUnsubscribed,RecipientsComplained,DTDelivered,DTOpened,DTClicked,DTBounced,DTFailed,DTUnsubscribed,DTComplained,TrackedIP,TrackedCountry,TrackedRegion,TrackedCity,TrackedUserAgent,TrackedDeviceType,TrackedClientType,TrackedClientName,TrackedClientOS,DateSent FROM Mail" . $filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':UUID',$key);
                    $sql->execute();
                    $response["mail"] = $sql->fetch();
                    $response["success"] = 1;
                }
            }
            if(!empty($input["moveToFolder"])) { // MOVE TO FOLDER BY UUID
                $filter = " WHERE CompanyEmail = :CompanyEmail AND UUID = :UUID AND IsDeleted = 0";
                $query = "SELECT FolderName FROM MailFolder" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':CompanyEmail',$CompanyEmail);
                $sql->bindValue(':UUID',$input["folderDestUUID"]);
                $sql->execute();
                $result = $sql->fetch();
                $MailFolderName = $result["FolderName"];

                $filter = " WHERE UUID = :UUID";
                $query = "UPDATE Mail SET MailFolder = :MailFolder, MailFolderUUID = :MailFolderUUID" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':MailFolder',$MailFolderName);
                $sql->bindValue(':MailFolderUUID',$input["folderDestUUID"]);
                $sql->execute();
                $response["success"] = 1;
            }
            if(!empty($input["moveToPlain"])) { // MOVE TO FOLDER BY NAME
                $filter = " WHERE CompanyEmail = :CompanyEmail AND FolderName = :FolderName AND IsDeleted = 0";
                $query = "SELECT UUID FROM MailFolder" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':CompanyEmail',$CompanyEmail);
                $sql->bindValue(':FolderName',$input["plainFolder"]);
                $sql->execute();
                $result = $sql->fetch();
                $MailFolderUUID = $result["UUID"];

                $filter = " WHERE UUID = :UUID";
                $query = "UPDATE Mail SET MailFolder = :MailFolder, MailFolderUUID = :MailFolderUUID" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':MailFolder',$input["plainFolder"]);
                if($input["plainFolder"] == "Inbox") {
                    $sql->bindValue(':MailFolderUUID',"");
                } else {
                    $sql->bindValue(':MailFolderUUID',$MailFolderUUID);
                }
                $sql->execute();
                $response["success"] = 1;
            }
            if(!empty($input["moveToSpam"])) { // MOVE TO SPAM
                $filter = " WHERE CompanyEmail = :CompanyEmail AND FolderName = :FolderName AND IsDeleted = 0";
                $query = "SELECT UUID FROM MailFolder" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':FolderName', "Spam");
                $sql->bindValue(':CompanyEmail',$CompanyEmail);
                $sql->execute();
                $result = $sql->fetch();
                $MailFolderUUID = $result["UUID"];

                $filter = " WHERE UUID = :UUID";
                $query = "UPDATE Mail SET MailFolder = :MailFolder, MailFolderUUID = :MailFolderUUID" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':MailFolder', "Spam");
                $sql->bindValue(':MailFolderUUID',$MailFolderUUID);
                $sql->execute();

                #region ADD SENDER TO SPAM LIST
                $filter = " WHERE UUID = :UUID";
                $query = "SELECT MailFrom, MailDomain FROM Mail" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->execute();
                $result = $sql->fetch();
                $from = $result["MailFrom"];
                $domainName = $result["MailDomain"];

                $fromMail = $from;
                $iBegin = strpos($from, "<");
                $iEnd = strpos($from, ">");
                $iDiff = $iEnd - $iBegin;
                if($iBegin > 0 && $iEnd > 0 && $iEnd > $iBegin) {
                    $fromMail = substr($from, $iBegin + 1, $iDiff - 1);
                }
                
                if(!empty($domainName)) {
                    $query = "INSERT INTO MailFirewall (
                        UUID, MailDomain, CompanyUUID, CompanyEmail, CustomerUUID, FilterType, FilterScope, FilterStatement, DateCreated, CreatedBy
                        ) VALUES (
                        :UUID, :MailDomain, :CompanyUUID, :CompanyEmail, :CustomerUUID, :FilterType, :FilterScope, :FilterStatement, :DateCreated, :CreatedBy
                        )";
                    $sql = $pdo->prepare($query);
                    $uuid = generateUUID();
                    $sql->bindValue(':UUID',$uuid);
                    $sql->bindValue(':MailDomain',$domainName);
                    $sql->bindValue(':CompanyUUID',$CompanyUUID);
                    $sql->bindValue(':CompanyEmail',$CompanyEmail);
                    $sql->bindValue(':CustomerUUID',$CustomerUUID);
                    $sql->bindValue(':FilterType', "Personal");
                    $sql->bindValue(':FilterScope', "Domain");
                    $sql->bindValue(':FilterStatement',$fromMail);
                    $sql->bindValue(':DateCreated', date("Y-m-d H:i:s"));
                    $sql->bindValue(':CreatedBy',$CompanyEmail);
                    $sql->execute();
                }
                #endregion
                $response["success"] = 1;
            }
            if(isset($input["page"])) { // GET MESSAGE PAGE
                #region GET MAIL FOLDERS
                $filter = " WHERE CompanyEmail = :CompanyEmail AND IsDeleted = 0";
                $query = "SELECT FolderName,UUID FROM MailFolder" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':CompanyEmail',$CompanyEmail);
                $sql->execute();
                $mailFolders = $sql->fetchAll();
                $response["mailfolder"] = [];
                // GET COUNT OF NEW EMAIL IN EVERY FOLDER, ADD TO FOLDER ENTRY
                foreach($mailFolders as $mf) {
                    if($mf["FolderName"] != "Sent" && $mf["FolderName"] != "Drafts" && $mf["FolderName"] != "Spam" && $mf["FolderName"] != "Trash") {
                        $filter = " WHERE MailTo = :MailTo AND MailFolderUUID = :MailFolderUUID AND IsDeleted = 0 AND IsRead = 0";
                        $query = "SELECT COUNT(*) AS MailCount FROM Mail" . $filter;
                        $sql = $pdo->prepare($query);
                        $sql->bindValue(':MailTo',$CompanyEmail);
                        if($mf["FolderName"] != "Inbox") {
                            $sql->bindValue(':MailFolderUUID', $mf["UUID"]);
                        } else {
                            $sql->bindValue(':MailFolderUUID', "");
                        }
                        $sql->execute();
                        $mf["NewCount"] = $sql->fetch()["MailCount"];
                    } 
                    array_push($response["mailfolder"], $mf);
                }
                #endregion
                #region GET MAIL
                $pager = " LIMIT $MailLimit";
                $page = intval($input["page"]);
                if($page > 0) {
                    $offset = $MailLimit * $page;
                    $pager = " LIMIT $offset,$MailLimit";
                }
                $sorter = " ORDER BY ID DESC";
                if(empty($key)) { // GET FROM INBOX
                    $filter = " WHERE MailTo = :MailTo AND MailFolder = 'Inbox' AND IsDeleted = 0";
                    $query = "SELECT COUNT(ID) AS MailCount FROM Mail" . $filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':MailTo',$CompanyEmail);
                    $sql->execute();
                    $count = intval($sql->fetch()["MailCount"]);
                    $query = "SELECT UUID,MailFrom,MailSender,MailTo,MailSubject,SUBSTR(MailBodyPlain,1,50) AS MailBodyPlain,IsRead,DateSent FROM Mail" . $filter . $sorter;
                    if($count > $MailLimit) {
                        $query .= $pager;
                    }
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':MailTo',$CompanyEmail);
                    $sql->execute();
                } else { // GET FROM MAIL FOLDER (NOT INBOX)
                    $filter = " WHERE MailTo = :MailTo AND MailFolderUUID = :MailFolderUUID AND IsDeleted = 0";
                    foreach($response["mailfolder"] as $mf) {
                        if($mf["UUID"] == $key) {
                            switch($mf["FolderName"]) {
                                case "Sent":
                                    $filter = " WHERE MailFrom = :MailTo AND MailFolderUUID = :MailFolderUUID AND IsDeleted = 0";
                                    break;
                                case "Trash":
                                    $filter = " WHERE (MailFrom = :MailTo OR MailTo =:MailTo) AND MailFolderUUID = :MailFolderUUID AND IsDeleted = 0";
                                    break;
                                case "Drafts":
                                    $filter = " WHERE MailFrom = :MailTo AND MailFolderUUID = :MailFolderUUID AND IsDeleted = 0";
                                    break;
                            }
                        }
                    }                
                    $query = "SELECT COUNT(ID) AS MailCount FROM Mail" . $filter;
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':MailTo',$CompanyEmail);
                    $sql->bindValue(':MailFolderUUID',$key);
                    $sql->execute();
                    $count = intval($sql->fetch()["MailCount"]);
                    $query = "SELECT UUID,MailFrom,MailSender,MailTo,MailSubject,SUBSTR(MailBodyPlain,1,50) AS MailBodyPlain,IsRead,DateSent FROM Mail" . $filter . $sorter;
                    if($count > $MailLimit) {
                        $query .= $pager;
                    }
                    $sql = $pdo->prepare($query);
                    $sql->bindValue(':MailTo',$CompanyEmail);
                    $sql->bindValue(':MailFolderUUID',$key);
                    $sql->execute();
                }
                $response["mail"] = $sql->fetchAll();
                $response["count"] = $count;
                $response["factor"] = $MailLimit;
                #endregion
                $response["success"] = 1;
            }
            echo json_encode($response);
            break;
    }
}
catch(PDOException $ex) {
    $response["success"] = 0;
    $response["msg"] = $ex->getMessage();
    echo json_encode($response);
}
$pdo = null;

?>