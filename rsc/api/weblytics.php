<?php

include 'allowed_http_origins.php';
include '../../api/dbtoken.php';
include '../../api/headers.php';
include '../../api/payload-json.php';
include '../../api/helper.php';
require_once 'vendor/autoload.php';
use GeoIp2\Database\Reader;

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST": // INSERT ANALYTICS RECORD
            $IPAddress = $_SERVER['REMOTE_ADDR'];
            // DETECT BOT TRAFFIC
            if(startsWith($IPAddress,"66.249")) {
                $response["code"] = 0;
                $response["msg"] = "Bot detected";
                echo json_encode($response);
                return;
            }
            #region GET COMPANY UUID
            $filter = " WHERE PublicKey = :PublicKey";
            $query = "SELECT UUID, BeaconInterval FROM Company" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':PublicKey', $input["pk"]);
            $sql->execute();
            $result = $sql->fetch();
            $CompanyUUID = $result["UUID"];
            #endregion
            #region GET USER DATA
            $screensize = empty($input["screensize"]) ? "" : $input["screensize"];
            $language = empty($input["language"]) ? "" : $input["language"];
            $platform = empty($input["platform"]) ? "" : $input["platform"];
            $platformversion = empty($input["platformversion"]) ? "" : $input["platformversion"];
            $browser = empty($input["browser"]) ? "" : $input["browser"];
            $browserversion = empty($input["browserversion"]) ? "" : $input["browserversion"];
            $devicetype = empty($input["devicetype"]) ? "" : $input["devicetype"];
            $devicevendor = empty($input["devicevendor"]) ? "" : $input["devicevendor"];
            $devicemodel = empty($input["devicemodel"]) ? "" : $input["devicemodel"];
            #endregion
            #region GET USER LOCATION
            switch($IPAddress) {
                case "::1":
                case "localhost":
                case "127.0.0.1":
                    $IPCountry = "";
                    $IPCity = "";
                    break;
                default:
                    try {
                        $IPReader = new Reader('/home/GeoLite2-City.mmdb');
                        $IPRecord = $IPReader->city($IPAddress);
                        $IPCountry = $IPRecord->country->name;
                        $IPCity = $IPRecord->city->name;
                    } catch(Exception $ex) {
                        $IPCountry = "";
                        $IPCity = "";
                    }
                    break;
            }
            #endregion
            #region INSERT WEBLYTICS
            $query = "INSERT INTO Weblytics (
                UUID, CompanyUUID, PageView, PageViewLength, PageSource, UserBrowser, UserBrowserVersion, UserScreenSize, UserLanguage, UserPlatform, UserPlatformVersion, UserIP, UserCity, UserCountry, UserDeviceType, UserDeviceVendor, UserDeviceModel, DateCreated, UserAgent
                ) VALUES (
                :UUID, :CompanyUUID, :PageView, :PageViewLength, :PageSource, :UserBrowser, :UserBrowserVersion, :UserScreenSize, :UserLanguage, :UserPlatform, :UserPlatformVersion, :UserIP, :UserCity, :UserCountry, :UserDeviceType, :UserDeviceVendor, :UserDeviceModel, :DateCreated, :UserAgent
                )";

            $sql = $pdo->prepare($query);
            $UUID = generateUUID();
            $sql->bindValue(':UUID',$UUID);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':PageView',$input["url"]);
            $sql->bindValue(':PageViewLength',0);
            $sql->bindValue(':PageSource',$input["referrer"]);
            $sql->bindValue(':UserBrowser',$browser);
            $sql->bindValue(':UserBrowserVersion',$browserversion);
            $sql->bindValue(':UserScreenSize',$screensize);
            $sql->bindValue(':UserLanguage',$language);
            $sql->bindValue(':UserPlatform',$platform);
            $sql->bindValue(':UserPlatformVersion',$platformversion);
            $sql->bindValue(':UserIP',$IPAddress);
            $sql->bindValue(':UserCity',$IPCity);
            $sql->bindValue(':UserCountry',$IPCountry);
            $sql->bindValue(':UserDeviceType',$devicetype);
            $sql->bindValue(':UserDeviceVendor',$devicevendor);
            $sql->bindValue(':UserDeviceModel',$devicemodel);
            $sql->bindValue(':UserAgent',$input["useragent"]);
            $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
            $sql->execute();
            #endregion
            
            $data = array(
                "UUID" => $UUID,
                "BeaconInterval" => $result["BeaconInterval"]
            );
            $response["data"] = $data;
            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "PUT": // UPDATE ANALYTICS
            $filter = " WHERE UUID = :UUID";
            $query = "UPDATE Weblytics SET PageViewLength = :PageViewLength".$filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$input["weblyticsUUID"]);
            $sql->bindValue(':PageViewLength',intval($input["viewTimer"]));
            $result = $sql->execute();
            $response["code"] = ($result ? 1 : 0);
            echo json_encode($response);
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