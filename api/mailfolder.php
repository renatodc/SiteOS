<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload.php';
include 'helper.php';
requireCsrfToken();

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST": // INSERT MAIL FOLDER
            $filter = " WHERE UUID = :UUID";
            $query = "SELECT CompanyEmail FROM Customer" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CustomerUUID);
            $sql->execute();
            $row = $sql->fetch();

            $uuid = generateUUID();
            $query = "INSERT INTO MailFolder (
                UUID, CompanyUUID, FolderName, CompanyEmail
                ) VALUES (
                :UUID, :CompanyUUID, :FolderName, :CompanyEmail
                )";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$uuid);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':FolderName',htmlspecialchars($input["folderName"]));
            $sql->bindValue(':CompanyEmail',$row["CompanyEmail"]);
            $sql->execute();
            $response["newUUID"] = $uuid;
            $response["success"] = 1;
            echo json_encode($response);
            break;
        case "PUT": // UPDATE MAIL FOLDER NAME
            if(empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
                $query = "UPDATE MailFolder SET FolderName = :FolderName".$filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':FolderName',htmlspecialchars($input["folderName"]));
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $response["success"] = 1;
            }
            echo json_encode($response);
            break;
        case "DELETE": // DELETE MAIL FOLDER
            if (empty($key)) {
                $response["success"] = 0;
                $response["errorMsg"] = "Missing URL key";
            } else {
                $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
                $query = "UPDATE MailFolder SET IsDeleted = 1" . $filter;
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$key);
                $sql->bindValue(':CompanyUUID',$CompanyUUID);
                $sql->execute();
                $response["success"] = 1;
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