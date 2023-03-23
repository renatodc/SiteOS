<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload-json.php';
include 'helper.php';

try {
    switch ($method)  {
        case "POST": // GENERATE STANDARD MAIL FOLDERS
            validateCsrfToken();            
            #region SOFT DELETE OLD EMAILS
            $filter = " WHERE CompanyEmail = :CompanyEmail AND CompanyUUID = :CompanyUUID AND IsDeleted = 0";
            $query = "SELECT FolderName,UUID FROM MailFolder" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyEmail',$input["email"]);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->execute();
            $mfs = $sql->fetchAll();
            foreach($mfs as $mf) {
                switch($mf["FolderName"]) {
                    case "Inbox":
                        $filter = " WHERE MailTo = :MailTo AND MailFolder = 'Inbox' AND MailFolderUUID = :MailFolderUUID";
                        $mf["UUID"] = "";
                        break;
                    case "Sent":
                    case "Drafts":
                        $filter = " WHERE MailFrom = :MailTo AND MailFolderUUID = :MailFolderUUID";
                        break;
                    case "Spam":
                    case "Trash":
                        break;
                    default:
                        $filter = " WHERE MailTo = :MailTo AND MailFolderUUID = :MailFolderUUID";
                        break;
                }
                $query = "UPDATE Mail SET IsDeleted = 1" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':MailTo',$input["email"]);
                $sql->bindValue(':MailFolderUUID',$mf["UUID"]);
                $sql->execute();
            }
            #endregion
            #region DELETE OLD MAIL FOLDERS
            $query = "DELETE FROM MailFolder WHERE CompanyEmail = :CompanyEmail AND CompanyUUID = :CompanyUUID";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyEmail',$input["email"]);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->execute();
            #endregion
            #region CREATE NEW MAIL FOLDERS
            $query = "INSERT INTO MailFolder (
                UUID, CompanyUUID, FolderName, CompanyEmail
                ) VALUES (
                :UUID, :CompanyUUID, :FolderName, :CompanyEmail
                )";

            $folders = array("Inbox","Sent","Spam","Trash","Drafts");
            foreach($folders as $i => $folder) {
                $sql = $pdo->prepare($query);
                $newFolderUUID = generateUUID();
                $sql->bindValue(':UUID',$newFolderUUID);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->bindValue(':FolderName',$folder);
                $sql->bindValue(':CompanyEmail',$input["email"]);
                $sql->execute();
            }
            #endregion

            $response["code"] = 1;
            echo json_encode($response);
            break;
    }
}
catch(Exception $ex) {
    $response["code"] = 0;
    $response["msg"] = $ex->getMessage();
    echo json_encode($response);
}
$pdo = null;

?>