<?php

include 'session.php';
include 'dbtoken.php';
include 'headers.php';
include 'payload-json.php';
include 'helper.php';
requireCsrfToken();

try {
    switch ($method)  {
        case "GET":
            break;
        case "POST": // GET ANALYTICS DATA IN PERIOD RANGE
            $data = array();
            #region FILTER BY PERIOD
            $startDT = date("Y-m-01 00:00:00", time());
            $endDT = date("Y-m-t 23:59:59", time());
            if(!empty($input["startDT"]) && !empty($input["endDT"])) {
                $startDT = $input["startDT"];
                $endDT = $input["endDT"];
            }
            $data["startDT"] = $startDT;
            $data["endDT"] = $endDT;
            $startDTO = new DateTime($startDT);
            $endDTO = new DateTime($endDT);
            $interval = DateInterval::createFromDateString('1 day');
            $period = new DatePeriod($startDTO, $interval, $endDTO);
            #endregion

            #region GET UNIQUE VISITOR COUNT
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT GROUP BY UserIP ORDER BY DateCreated ASC";
            $query = "SELECT ID FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            $data["uniquevisitors"] = count($result);
            #endregion
            #region GET UNIQUE VISITOR CHART DATA
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT GROUP BY UserIP ORDER BY DateCreated ASC";
            $query = "SELECT DATE_FORMAT(DateCreated, :DateFormatter) As DateCreatedFormatted FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->bindValue(':DateFormatter', "%Y-%m-%d");
            $sql->execute();
            $result = $sql->fetchAll();
            $set = array();
            foreach ($period as $dt) {
                $set[$dt->format("Y-m-d")] = 0;
            }
            foreach($result as $row) {
                $set[$row['DateCreatedFormatted']]++;
            }
            $data["uvdata"] = $set;
            #endregion

            #region GET PAGEVIEW DATA
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT GROUP BY PageView ORDER BY Views DESC";
            $query = "SELECT PageView, COUNT(PageView) AS Views, AVG(PageViewLength) AS AvgView, MIN(PageViewLength) AS MinView, MAX(PageViewLength) AS MaxView, DateCreated FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            $data["pageviews"] = $result;
            #endregion
            #region GET PAGEVIEW CHART DATA
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT";
            $query = "SELECT DATE_FORMAT(DateCreated, :DateFormatter) As DateCreatedFormatted FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->bindValue(':DateFormatter', "%Y-%m-%d");
            $sql->execute();
            $result = $sql->fetchAll();
            $data["views"] = count($result);
            $set = array();
            foreach ($period as $dt) {
                $set[$dt->format("Y-m-d")] = 0;
            }
            foreach($result as $row) {
                $set[$row['DateCreatedFormatted']]++;
            }
            $data["viewsdata"] = $set;
            #endregion

            #region GET PAGE SOURCES
            #region FILTER BY COMPANY URL
            $baseURL;
            $filter = " WHERE UUID = :UUID";
            $query = "SELECT SubDomain, DomainName FROM Company" . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':UUID',$CompanyUUID);
            $sql->execute();
            $result = $sql->fetch();
            $baseURL = $result["DomainName"];
            #endregion
            $filter = "WHERE CompanyUUID = :CompanyUUID AND PageSource NOT LIKE :DomainWildCard AND PageSource != :EmptyString AND DateCreated > :StartDT AND DateCreated < :EndDT GROUP BY PageSource ORDER BY Instances DESC";
            $query = "SELECT PageSource, COUNT(PageSource) AS Instances FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':DomainWildCard',"%$baseURL%");
            $sql->bindValue(':EmptyString',"");
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            $data["sources"] = $result;
            #endregion

            #region GET USER COUNTRIES
            #region AS PAGEVIEWS
            $table = "countries";
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserCountry IS NOT NULL AND UserCountry != '' GROUP BY UserCountry ORDER BY PageViews DESC";
            $query = "SELECT UserCountry, COUNT(UserCountry) AS PageViews FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            $data[$table] = $result;
            #endregion
            #region AS UNIQUE VISITORS
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserCountry IS NOT NULL AND UserCountry != '' GROUP BY UserIP";
            $query = "SELECT UserCountry FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            #endregion
            #region PROCESS DATA
            $set = array();
            foreach($result as $row) {
                if(isset($set[$row['UserCountry']])) {
                    $set[$row['UserCountry']]++;
                } else {
                    $set[$row['UserCountry']] = 1;
                }
            }
            foreach($data[$table] as $rowkey => $rowval) {
                foreach($set as $setkey => $setval) {
                    if($rowval["UserCountry"] == $setkey) {
                        $data[$table][$rowkey]["UniqueVisitors"] = $setval;
                    }
                }
            }
            #endregion
            #endregion

            #region GET USER CITIES
            #region AS PAGEVIEWS
            $table = "cities";
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserCity IS NOT NULL AND UserCity != '' GROUP BY UserCity ORDER BY PageViews DESC";
            $query = "SELECT UserCity, UserCountry, COUNT(UserCity) AS PageViews FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            $data[$table] = $result;
            #endregion
            #region AS UNIQUE VISITORS
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserCity IS NOT NULL AND UserCity != '' GROUP BY UserIP";
            $query = "SELECT UserCity FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            #endregion
            #region PROCESS DATA
            $set = array();
            foreach($result as $row) {
                if(isset($set[$row['UserCity']])) {
                    $set[$row['UserCity']]++;
                } else {
                    $set[$row['UserCity']] = 1;
                }
            }
            foreach($data[$table] as $rowkey => $rowval) {
                foreach($set as $setkey => $setval) {
                    if($rowval["UserCity"] == $setkey) {
                        $data[$table][$rowkey]["UniqueVisitors"] = $setval;
                    }
                }
            }
            #endregion
            #endregion

            #region GET USER LANGUAGES
            #region AS PAGEVIEWS
            $table = "languages";
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserLanguage IS NOT NULL AND UserLanguage != '' GROUP BY UserLanguage ORDER BY PageViews DESC";
            $query = "SELECT UserLanguage, COUNT(UserLanguage) AS PageViews FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            $data[$table] = $result;
            #endregion
            #region AS UNIQUE VISITORS
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserLanguage IS NOT NULL AND UserLanguage != '' GROUP BY UserIP";
            $query = "SELECT UserLanguage FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            #endregion
            #region PROCESS DATA
            $set = array();
            foreach($result as $row) {
                if(isset($set[$row['UserLanguage']])) {
                    $set[$row['UserLanguage']]++;
                } else {
                    $set[$row['UserLanguage']] = 1;
                }
            }
            foreach($data[$table] as $rowkey => $rowval) {
                foreach($set as $setkey => $setval) {
                    if($rowval["UserLanguage"] == $setkey) {
                        $data[$table][$rowkey]["UniqueVisitors"] = $setval;
                    }
                }
            }
            #endregion
            #endregion
            
            #region GET USER BROWSERS
            #region AS PAGEVIEWS
            $table = "browsers";
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserBrowser IS NOT NULL AND UserBrowser != '' GROUP BY UserBrowser ORDER BY PageViews DESC";
            $query = "SELECT UserBrowser, COUNT(UserBrowser) AS PageViews FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            $data[$table] = $result;
            #endregion
            #region AS UNIQUE VISITORS
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserBrowser IS NOT NULL AND UserBrowser != '' GROUP BY UserIP";
            $query = "SELECT UserBrowser FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            #endregion
            #region PROCESS DATA
            $set = array();
            foreach($result as $row) {
                if(isset($set[$row['UserBrowser']])) {
                    $set[$row['UserBrowser']]++;
                } else {
                    $set[$row['UserBrowser']] = 1;
                }
            }
            foreach($data[$table] as $rowkey => $rowval) {
                foreach($set as $setkey => $setval) {
                    if($rowval["UserBrowser"] == $setkey) {
                        $data[$table][$rowkey]["UniqueVisitors"] = $setval;
                    }
                }
            }
            #endregion
            #endregion
         
            #region GET USER SCREEN SIZES
            #region AS PAGEVIEWS
            $table = "screensizes";
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserScreenSize IS NOT NULL AND UserScreenSize != '' GROUP BY UserScreenSize ORDER BY PageViews DESC";
            $query = "SELECT UserScreenSize, COUNT(UserScreenSize) AS PageViews FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            $data[$table] = $result;
            #endregion
            #region AS UNIQUE VISITORS
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserScreenSize IS NOT NULL AND UserScreenSize != '' GROUP BY UserIP";
            $query = "SELECT UserScreenSize FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            #endregion
            #region PROCESS DATA
            $set = array();
            foreach($result as $row) {
                if(isset($set[$row['UserScreenSize']])) {
                    $set[$row['UserScreenSize']]++;
                } else {
                    $set[$row['UserScreenSize']] = 1;
                }
            }
            foreach($data[$table] as $rowkey => $rowval) {
                foreach($set as $setkey => $setval) {
                    if($rowval["UserScreenSize"] == $setkey) {
                        $data[$table][$rowkey]["UniqueVisitors"] = $setval;
                    }
                }
            }
            #endregion
            #endregion
            
            #region GET USER PLATFORMS
            #region AS PAGEVIEWS
            $table = "platforms";
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserPlatform IS NOT NULL AND UserPlatform != '' GROUP BY UserPlatform ORDER BY PageViews DESC";
            $query = "SELECT UserPlatform, COUNT(UserPlatform) AS PageViews FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            $data[$table] = $result;
            #endregion
            #region AS UNIQUE VISITORS
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT AND UserPlatform IS NOT NULL AND UserPlatform != '' GROUP BY UserIP";
            $query = "SELECT UserPlatform FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            $result = $sql->fetchAll();
            #endregion
            #region PROCESS DATA
            $set = array();
            foreach($result as $row) {
                if(isset($set[$row['UserPlatform']])) {
                    $set[$row['UserPlatform']]++;
                } else {
                    $set[$row['UserPlatform']] = 1;
                }
            }
            foreach($data[$table] as $rowkey => $rowval) {
                foreach($set as $setkey => $setval) {
                    if($rowval["UserPlatform"] == $setkey) {
                        $data[$table][$rowkey]["UniqueVisitors"] = $setval;
                    }
                }
            }
            #endregion
            #endregion

            $response["data"] = $data;
            $response["code"] = 1;
            echo json_encode($response);
            break;
        case "PUT":
            break;
        case "DELETE": // DELETE ANALYTICS DATA
            #region FILTER BY PERIOD
            $startDT = date("Y-m-01", time());
            $endDT = date("Y-m-t 23:59:59", time());
            if(!empty($input["startDT"]) && !empty($input["endDT"])) {
                $startDT = $input["startDT"];
                $endDT = $input["endDT"];
            }
            #endregion

            #region DELETE DATA
            $filter = "WHERE CompanyUUID = :CompanyUUID AND DateCreated > :StartDT AND DateCreated < :EndDT";
            $query = "DELETE FROM Weblytics " . $filter;
            $sql = $pdo->prepare($query);
            $sql->bindValue(':CompanyUUID',$CompanyUUID);
            $sql->bindValue(':StartDT',$startDT);
            $sql->bindValue(':EndDT',$endDT);
            $sql->execute();
            #endregion

            $response["code"] = 1;
            echo json_encode($response);
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