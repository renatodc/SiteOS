<!DOCTYPE html>
<html>
  <head>
    <!--META-->
    <title>SiteOS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="img/logo.png">

    <!--CSS-->

    <!--FONTS-->
    <link type="text/css" rel="stylesheet" href="css/font.css" />
    <!--RESET-->
    <link type="text/css" rel="stylesheet" href="css/vendor/reset.css">
    <!--SEMANTIC-->
    <link type="text/css" rel="stylesheet" href="semantic/dist/semantic.min.css">
    <!-- TOASTR -->
    <link type="text/css" rel="stylesheet" href="css/vendor/toastr.min.css">
    <!--APP-->
    <?php
    if(isset($_SESSION["CustomerTheme"])) {
      echo("<link type='text/css' rel='stylesheet' href='css/theme-" . $_SESSION["CustomerTheme"] . ".css'>");
    } else {
      echo("<link type='text/css' rel='stylesheet' href='css/theme-standard.css'>");
    }
    ?>
    
    <link type="text/css" rel="stylesheet" href="css/main.css">
    <link type="text/css" rel="stylesheet" href="css/sui.css">

    <!--JS-->

    <!--JQUERY-->
    <script src="node_modules/jquery/dist/jquery.min.js"></script>
    <!--SEMANTIC-->
    <script src="semantic/dist/semantic.min.js"></script>
    <!--TOASTER-->
    <script src="js/vendor/toastr.min.js"></script>
    <!--APP-->
    <script src="js/main.js"></script>