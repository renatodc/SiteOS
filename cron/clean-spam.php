<?php

include '../api/dbtoken.php';

$query = "DELETE FROM Mail WHERE MailFolder = 'Spam'";
$sql = $pdo->prepare($query);
$sql->execute();

?>