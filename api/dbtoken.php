<?php

$config = parse_ini_file('/home/config.ini');
$pdoHost = $config["pdo_host"];
$pdoDBName = $config["pdo_dbname"];
$pdoUsername = $config["pdo_username"];
$pdoPassword = $config["pdo_password"];
$connString = "mysql:host=$pdoHost;dbname=$pdoDBName;charset=utf8mb4";
try {
    $pdo = new PDO($connString,$pdoUsername,$pdoPassword);
}
catch(Exception $ex) {
    error_log($ex->getMessage());
}
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
?>