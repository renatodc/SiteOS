<?php

include 'dbtoken.php';
include 'apihead.php';
include 'apihead-json.php';
include 'helper.php';

require_once 'vendor/autoload.php';
use GuzzleHttp\Client;

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST":
            #region CREATE ACCOUNT
            // CREATE CustomerUUID AND CompanyUUID
            $CustomerUUID = generateUUID();
            $CompanyUUID = generateUUID();

            $DotPos = strpos($input["formDomainName"],".");
            $SubDomain = substr($input["formDomainName"],0,$DotPos);

            // INSERT COMPANY RECORD
            $query = "INSERT INTO Company (
            UUID, IsFree, SubDomain, PublicKey, FormRecipient, DateCreated, CreatedBy, IPCreated
            ) VALUES (
            :UUID, :IsFree, :SubDomain, :PublicKey, :FormRecipient, :DateCreated, :CreatedBy, :IPCreated
            )";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CompanyUUID);
            $sql->bindValue(':IsFree',0);
            $sql->bindValue(':SubDomain',$SubDomain);
            $sql->bindValue(':PublicKey',generateUUID());
            $sql->bindValue(':FormRecipient',$input["formEmail"]);
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',$CustomerUUID);
            $sql->bindValue(':IPCreated', "");
            $sql->execute();

            // GENERATE PASSWORD HASH
            $pwdHash = password_hash($input["formPassword"], PASSWORD_BCRYPT);
            
            // INSERT CUSTOMER RECORD
            $query = "INSERT INTO Customer (
            UUID, CompanyUUID, CustomerEmail, CompanyEmail, CustomerPasswordHash, CustomerName, CustomerLanguage, IsAdmin, IsOwner, DateCreated, IPCreated
            ) VALUES (
            :UUID, :CompanyUUID, :CustomerEmail, :CompanyEmail, :CustomerPasswordHash, :CustomerName, :CustomerLanguage, :IsAdmin, :IsOwner, :DateCreated, :IPCreated
            )";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CustomerUUID);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':CustomerEmail',$input["formEmail"]);
            $sql->bindValue(':CompanyEmail',$input["formEmail"]);
            $sql->bindValue(':CustomerPasswordHash',$pwdHash);
            $sql->bindValue(':CustomerName',$input["formCustomerName"]);
            $sql->bindValue(':CustomerLanguage',"en");
            $sql->bindValue(':IsAdmin',1);
            $sql->bindValue(':IsOwner',1);
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':IPCreated', "");
            $sql->execute();

            // GENERATE DEFAULT MAIL FOLDERS
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
                $sql->bindValue(':CompanyEmail',$input["formEmail"]);
                $sql->execute();
            }
            
            // CREATE WEB DIRECTORY
            $webDirectory = "/srv/web/" . $SubDomain;
            if(!file_exists($webDirectory)) {
                mkdir($webDirectory);
            }

            // ADD SUBDOMAIN TO CADDY CONFIG
            $caddyConfigPath = "/etc/caddy/Caddyfile";

            $caddyEntry = "\n";
            $caddyEntry .= $input["formDomainName"] . " {";
            $caddyEntry .= "\n";
            $caddyEntry .= "\troot * /srv/web/" . $SubDomain;
            $caddyEntry .= "\n";
            $caddyEntry .= "\timport html";
            $caddyEntry .= "\n";
            $caddyEntry .= "\timport nocache";
            $caddyEntry .= "\n";
            $caddyEntry .= "}";
            $caddyEntry .= "\n";
            
            $caddyConfig = file_get_contents($caddyConfigPath);
            $caddyEntryFound = strpos($caddyConfig, $caddyEntry);
            if($caddyEntryFound === false) {
                $caddyConfig .= $caddyEntry;
                $caddyConfig = substr_replace($caddyConfig,"app" . $input["formDomainName"],0,3); // replace :80 with app.domain.com
                file_put_contents($caddyConfigPath, $caddyConfig);
            }

            // ADD SUBDOMAIN TO ALLOWED_HTTP_ORIGINS
            $AllowedHttpOriginsPath = "/home/allowed_http_origins.txt";
            $AllowedHttpOrigins = file_get_contents($AllowedHttpOriginsPath);
            $AllowedHttpOrigins .= "\r\n";
            $AllowedHttpOrigins .= "http://" . $input["formDomainName"];
            $AllowedHttpOrigins .= "\r\n";
            $AllowedHttpOrigins .= "https://" . $input["formDomainName"];
            $AllowedHttpOrigins .= "\r\n";
            $AllowedHttpOrigins .= "http://www." . $input["formDomainName"];
            $AllowedHttpOrigins .= "\r\n";
            $AllowedHttpOrigins .= "https://www." . $input["formDomainName"];            
            file_put_contents($AllowedHttpOriginsPath, $AllowedHttpOrigins);            

            // BEGIN SESSION
            session_start();
            $_SESSION["st"] = generateUUID();
            $_SESSION["CustomerUUID"] = $CustomerUUID;
            $_SESSION["CompanyUUID"] = $CompanyUUID;
            setcookie(session_name(), session_id(), time()+2419200, "/", "app" . $input["formDomainName"], TRUE, TRUE); // 4 weeks
            #endregion
            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "PUT":
            break;
        case "DELETE":
            break;
        case "PATCH":
            // RESTART CADDY (called twice)
            shell_exec("curl -X POST 'http://localhost:2019/load' -H 'Content-Type: text/caddyfile' --data-binary @/etc/caddy/Caddyfile");
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