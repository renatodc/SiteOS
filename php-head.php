<?php

include 'api/session.php';
include 'api/dbtoken.php';

#region GET PERMISSION VALUES
$query = "SELECT IsAdmin,IsOwner FROM Customer WHERE UUID = :UUID";
$sql = $pdo->prepare($query);
$sql->bindValue(':UUID',$CustomerUUID);
$sql->execute();
$result = $sql->fetch();
$isAdmin = $result["IsAdmin"];
$isOwner = $result["IsOwner"];

#endregion

#region GET MODULE (USING REQUEST URI)
$moduleURI = substr($_SERVER["REQUEST_URI"],1);
$paramPos = strpos($moduleURI, "?");
$hashPos = strpos($moduleURI, "#");
$dotPos = strpos($moduleURI, ".");
if($paramPos !== false) {
    $moduleURI = substr($moduleURI,0,$paramPos);
}
if($hashPos !== false) {
    $moduleURI = substr($moduleURI,0,$hashPos);
}
if($dotPos !== false) {
    $moduleURI = substr($moduleURI,0,$dotPos);
}
#endregion

#region SET RESTRICTION
$moduleRestricted = false;
if(intval($isOwner) == 0) {
    switch($moduleURI) {
        case "accounts":
            $moduleRestricted = true;
            break;
    }
}
if(intval($isAdmin) == 0) {
    if($moduleURI != "mail" && $moduleURI != "account") {
        $moduleRestricted = true;
    }
}
if($moduleRestricted) {
    header("Location:/mail");
}
#endregion

?>