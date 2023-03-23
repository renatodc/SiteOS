<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload-json.php';
include 'helper.php';

try {
    switch ($method)  {
        case "GET": // GET CUSTOMER/COMPANY DATA
            $filter = "WHERE UUID = :UUID AND IsDeleted = 0";
            $query = "SELECT CustomerName, CompanyEmail, CompanyPhone, CustomerEmail, CustomerPhone, CustomerRole, CustomerLanguage, CustomerTheme, CustomerBaseColor, ClearBitKey, ConfigUsePhone, ConfigUseSMS, ConfigTimeFormat, LeadsTimeFormat, LeadTimeFormat, MailTimeFormat, ConfigRecordCalls, ConfigTranscribeCalls, ConfigCountryCode, ConfigRunCallPause, ColLeadsCompany, ColLeadsContactName, ColLeadsContactEmail, ColLeadsStatus, ColLeadsLocation, ColLeadsSource, ColLeadsDateCreated, ColLeadsDateModified, ColLeadsLastAction, ColBroadcastRecipients, ColBroadcastBounced, ColBroadcastDelivered, ColBroadcastFailed, ColBroadcastOpened, ColBroadcastClicked, ColBroadcastUnsubscribed, ColBroadcastComplained, ColBroadcastDateCreated, ColBroadcastDateModified, ColBroadcastCreatedBy, CRMSaveIncomingEmail, CRMSaveOutgoingEmail, ColAccountsCompanyEmail, ColAccountsName, ColAccountsUserEmail, ColAccountsRole, ColAccountsType, ColAccountsUserPhone, ColAccountsCompanyPhone, EmailSignature, IsAdmin, IsOwner FROM Customer " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CustomerUUID);
            $sql->execute();
            $result = $sql->fetch();
            $response["data"] = $result;

            $filter = "WHERE UUID = :UUID";
            $query = "SELECT SubDomain, DomainName, DomainStatus, CompanyName, FormRecipient, Logo FROM Company " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CompanyUUID);
            $sql->execute();
            $result = $sql->fetch();
            $response["data"]["SubDomain"] = $result["SubDomain"];
            $response["data"]["DomainName"] = $result["DomainName"];
            $response["data"]["DomainStatus"] = $result["DomainStatus"];
            $response["data"]["CompanyName"] = $result["CompanyName"];
            $response["data"]["FormRecipient"] = $result["FormRecipient"];
            $response["data"]["Logo"] = $result["Logo"];

            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "POST": // LOGOUT
            $_SESSION = array();
            setcookie(session_name(), '', time() - 42000);
            session_destroy();
            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "PUT":
            break;
        case "DELETE":
            break;
        case "PATCH":
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