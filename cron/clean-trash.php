<?php

include '../api/dbtoken.php';

$query = "DELETE FROM Mail WHERE MailFolder = 'Trash' OR IsDeleted = 1";
$sql = $pdo->prepare($query);
$sql->execute();

?>