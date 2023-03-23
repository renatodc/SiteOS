<?php

include 'dbtoken.php';
include 'headers.php';
include 'payload-json.php';
include 'helper.php';
require_once 'vendor/autoload.php';
use GeoIp2\Database\Reader;
use GuzzleHttp\Client;

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST":
            #region VALIDATION
            // VERIFY EMAIL IS NOT IN USE
            $filter = " WHERE CustomerEmail = :CustomerEmail AND IsDeleted = 0";
            $query = "SELECT UUID FROM Customer" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CustomerEmail',$input["email"]);
            $sql->execute();
            $result = $sql->fetch();
            if(!empty($result["UUID"])) {
                $response["code"] = 3;
                echo json_encode($response);
                return;
            }

            // VERIFY USERNAME IS NOT IN USE
            $filter = " WHERE CompanyEmail = :CompanyEmail AND IsDeleted = 0";
            $query = "SELECT UUID FROM Customer" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyEmail',$input["username"] . "@fishpulse.com");
            $sql->execute();
            $result = $sql->fetch();
            if(!empty($result["UUID"])) {
                $response["code"] = 2;
                echo json_encode($response);
                return;
            }
            // VERIFY USERNAME IS NOT AN EXISTING SUBDOMAIN
            $filter = " WHERE SubDomain = :SubDomain AND IsDeleted = 0";
            $query = "SELECT UUID FROM Company" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':SubDomain',$input["username"]);
            $sql->execute();
            $result = $sql->fetch();
            if(!empty($result["UUID"])) {
                $response["code"] = 2;
                echo json_encode($response);
                return;
            }
            #endregion
            #region reCAPTCHA v3
            $IPAddress = $_SERVER['REMOTE_ADDR'];
            $guzzleClient = new Client();
            $guzzleResponse = $guzzleClient->request('POST', 'https://www.google.com/recaptcha/api/siteverify', [
                'form_params' => [
                    'secret' => $config["recaptchav3_secret_key"],
                    'response' => $input["token"],
                    'remoteip' => $IPAddress
                ]
            ]);
            $guzzleResponse = json_decode($guzzleResponse->getBody(), true);
            // $response["guzzle"] = $guzzleResponse;
            if($guzzleResponse["success"] && $guzzleResponse["score"] > 0.5 && $guzzleResponse["action"] == "submit") {
                // HUMAN
            } else {
                // BOT
                $response["code"] = 4;
                echo json_encode($response);
                return;
            }
            #endregion
            #region CREATE ACCOUNT
            // CREATE CustomerUUID AND CompanyUUID
            $CustomerUUID = generateUUID();
            $CompanyUUID = generateUUID();

            // TRACK LOCATION
            $userLocation = "";
            switch($IPAddress) {
                case "::1":
                case "localhost":
                case "127.0.0.1":
                    $userLocation = "Localhost";
                    break;
                default:
                    try {
                        $IPReader = new Reader('/home/GeoLite2-City.mmdb');
                        $IPRecord = $IPReader->city($IPAddress);
                        $IPCountry = $IPRecord->country->name;
                        $IPCity = $IPRecord->city->name;
                        if(!empty($IPCountry)) {
                            $userLocation = $IPCountry;
                        }
                        if(!empty($IPCountry) && !empty($IPCity)) {
                            $userLocation = $IPCity . ", " . $IPCountry;
                        }
                    }
                    catch(Exception $ex) {
                        $userLocation = "";
                    }
                    break;                  
            }

            // INSERT COMPANY RECORD
            $query = "INSERT INTO Company (
            UUID, SubDomain, PublicKey, FormRecipient, DateCreated, CreatedBy, IPCreated
            ) VALUES (
            :UUID, :SubDomain, :PublicKey, :FormRecipient, :DateCreated, :CreatedBy, :IPCreated
            )";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CompanyUUID);
            $sql->bindValue(':SubDomain',$input["username"]);
            $sql->bindValue(':PublicKey',generateUUID());
            $sql->bindValue(':FormRecipient',$input["username"] . "@fishpulse.com");
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':CreatedBy',$CustomerUUID);
            $sql->bindValue(':IPCreated', $IPAddress);
            $sql->execute();

            // PARSE CUSTOMER LANGUAGE
            if(!array_key_exists("lang",$input)) {
                $input["lang"] = "en";
            }
            switch($input["lang"]) {
                case "es":
                    $lang = "es";
                    break;
                case "en":
                default:
                    $lang = "en";
                    break;
            }
            // GENERATE PASSWORD HASH
            $pwdHash = password_hash($input["password"], PASSWORD_BCRYPT);
            
            // INSERT CUSTOMER RECORD
            $query = "INSERT INTO Customer (
            UUID, CompanyUUID, CustomerEmail, CompanyEmail, CustomerPasswordHash, CustomerName, CustomerLanguage, IsAdmin, IsOwner, DateCreated, IPCreated
            ) VALUES (
            :UUID, :CompanyUUID, :CustomerEmail, :CompanyEmail, :CustomerPasswordHash, :CustomerName, :CustomerLanguage, :IsAdmin, :IsOwner, :DateCreated, :IPCreated
            )";
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CustomerUUID);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':CustomerEmail',$input["email"]);
            $sql->bindValue(':CompanyEmail',$input["username"] . "@fishpulse.com");
            $sql->bindValue(':CustomerPasswordHash',$pwdHash);
            $sql->bindValue(':CustomerName',$input["name"]);
            $sql->bindValue(':CustomerLanguage',$lang);
            $sql->bindValue(':IsAdmin',1);
            $sql->bindValue(':IsOwner',1);
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->bindValue(':IPCreated', $IPAddress);
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
                $sql->bindValue(':CompanyEmail',$input["username"] . "@fishpulse.com");
                $sql->execute();
            }
            
            // CREATE WEB DIRECTORY
            $webDirectory = "/home/ec2-user/fishpulse/app/web/" . $input["username"];
            if(!file_exists($webDirectory)) {
                mkdir($webDirectory);
            }

            // ADD SUBDOMAIN TO CADDY CONFIG
            $caddyConfigPath = "/home/ec2-user/fishpulse/Caddyfile";

            $caddyEntry = "\n";
            $caddyEntry .= $input["username"] . ".fishpulse.com {";
            $caddyEntry .= "\n";
            $caddyEntry .= "\troot app/web/" . $input["username"];
            $caddyEntry .= "\n";
            $caddyEntry .= "\timport acl";
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
                file_put_contents($caddyConfigPath, $caddyConfig);
            }

            // ADD SUBDOMAIN TO ALLOWED_HTTP_ORIGINS
            $AllowedHttpOriginsPath = "/home/ec2-user/allowed_http_origins.txt";
            $AllowedHttpOrigins = file_get_contents($AllowedHttpOriginsPath);
            $AllowedHttpOrigins .= "\r\n";
            $AllowedHttpOrigins .= "http://" . $input["username"] . ".fishpulse.com";
            $AllowedHttpOrigins .= "\r\n";
            $AllowedHttpOrigins .= "https://" . $input["username"] . ".fishpulse.com";
            $AllowedHttpOrigins .= "\r\n";
            $AllowedHttpOrigins .= "http://www." . $input["username"] . ".fishpulse.com";
            $AllowedHttpOrigins .= "\r\n";
            $AllowedHttpOrigins .= "https://www." . $input["username"] . ".fishpulse.com";            
            file_put_contents($AllowedHttpOriginsPath, $AllowedHttpOrigins);            

            // BEGIN SESSION
            session_start();
            $_SESSION["st"] = generateUUID();
            $_SESSION["CustomerUUID"] = $CustomerUUID;
            $_SESSION["CompanyUUID"] = $CompanyUUID;
            setcookie(session_name(), session_id(), time()+2419200, "/", "app." . $config["domain"], TRUE, TRUE); // 4 weeks
            #endregion
            #region ADD TO CRM

            $filter = " WHERE DomainName = :DomainName";
            $query = "SELECT UUID FROM Company" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':DomainName',"fishpulse.com");
            $sql->execute();
            $FishPulseCompanyUUID = $sql->fetch()["UUID"];

            $filter = " WHERE A.ContactEmail = :ContactEmail AND B.CompanyUUID = :CompanyUUID AND B.IsDeleted = 0";
            $query = "SELECT A.ID FROM LeadContact A JOIN Lead B ON A.LeadID = B.ID" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':ContactEmail',$input["email"]);
            $sql->bindValue(':CompanyUUID',$FishPulseCompanyUUID);
            $sql->execute();
            $row = $sql->fetch();
            if(empty($row)) {
                // INSERT LEAD
                $leadUUID = generateUUID();
                $query = "INSERT INTO Lead (
                UUID, LeadName, LeadLocation, LeadStatus, LeadSource, CompanyUUID, DateCreated, CreatedBy
                ) VALUES (
                :UUID, :LeadName, :LeadLocation, :LeadStatus, :LeadSource, :CompanyUUID, :DateCreated, :CreatedBy
                )";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$leadUUID);
                $sql->bindValue(':LeadName',$input["name"]);
                $sql->bindValue(':LeadLocation', $userLocation);
                $sql->bindValue(':LeadStatus',"Interested");
                $sql->bindValue(':LeadSource',"Signed Up");
                $sql->bindValue(':CompanyUUID',$FishPulseCompanyUUID);
                $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
                $sql->bindValue(':CreatedBy',"Signed Up");
                $sql->execute();
                $leadID = $pdo->lastInsertId();

                $query = "INSERT INTO LeadContact (
                LeadID, ContactName, ContactEmail, ContactLocation, DateCreated, CreatedBy
                ) VALUES (
                :LeadID, :ContactName, :ContactEmail, :ContactLocation, :DateCreated, :CreatedBy
                )";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':LeadID',$leadID);
                $sql->bindValue(':ContactName',$input["name"]);
                $sql->bindValue(':ContactEmail',$input["email"]);
                $sql->bindValue(':ContactLocation',$userLocation);
                $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
                $sql->bindValue(':CreatedBy',"Signed Up");
                $sql->execute();
                $contactID = $pdo->lastInsertId();

                $query = "UPDATE Lead SET PrimaryContactID = :PrimaryContactID WHERE UUID = :UUID";
                $sql = $pdo->prepare($query);
                $sql->bindValue(':UUID',$leadUUID);
                $sql->bindValue(':PrimaryContactID',$contactID);
                $sql->execute();
            }            
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
            shell_exec("curl -X POST 'http://localhost:2019/load' -H 'Content-Type: text/caddyfile' --data-binary @/home/ec2-user/fishpulse/Caddyfile");
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