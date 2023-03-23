<?php

include '../api/dbtoken.php';

#region LEADS
$query = "DELETE FROM Lead WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM LeadAction WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM LeadCF WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM LeadContact WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM LeadContactCF WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM LeadList WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM LeadSearch WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();
#endregion

#region MAIL
$query = "DELETE FROM Mail WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM MailBroadcast WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM MailFirewall WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM MailFolder WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM MailTemplate WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();
#endregion

#region PHONE
$query = "DELETE FROM Phone WHERE IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM RunCall";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM RunCallJunction";
$sql = $pdo->prepare($query);
$sql->execute();
#endregion

#region TOKENS
$query = "DELETE FROM TokenRecovery WHERE DateCreated < NOW() - INTERVAL 30 MINUTE";
$sql = $pdo->prepare($query);
$sql->execute();

$query = "DELETE FROM TokenRegister WHERE DateCreated < NOW() - INTERVAL 21 DAY";
$sql = $pdo->prepare($query);
$sql->execute();
#endregion

#region COMPANY/CUSTOMER
// $query = "DELETE FROM Company WHERE IsDeleted = 1";
// $sql = $pdo->prepare($query);
// $sql->execute();

// $query = "DELETE FROM Customer WHERE IsDeleted = 1";
// $sql = $pdo->prepare($query);
// $sql->execute();
#endregion

?>