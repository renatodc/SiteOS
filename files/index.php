<?php include "../php-head.php" ?>

<!DOCTYPE html>
<html>
  <head>
    <title>SiteOS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    
    <link rel="icon" type="image/png" href="../img/logo.png">
    <link type="text/css" rel="stylesheet" href="../semantic/dist/semantic.min.css">
    <link type="text/css" rel="stylesheet" href="../css/font.css" />
    <link type="text/css" rel="stylesheet" href="../css/vendor/reset.css">
    <?php
    if(isset($_SESSION["CustomerTheme"])) {
      echo("<link type='text/css' rel='stylesheet' href='../css/theme-" . $_SESSION["CustomerTheme"] . ".css'>");
    } else {
      echo("<link type='text/css' rel='stylesheet' href='../css/theme-standard.css'>");
    }
    ?>
    <link type="text/css" rel="stylesheet" href="../css/main.css">
    <link type="text/css" rel="stylesheet" href="../css/sui.css">
    <link type="text/css" rel="stylesheet" href="../css/files.css">
  </head>
  <body style="font-family: Roboto">
    <div id="app"></div>
    <script src="./bundle.js"></script>
  </body>
</html>
