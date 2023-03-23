<?php

session_start();
if(array_key_exists("CustomerUUID",$_SESSION) && array_key_exists("CompanyUUID",$_SESSION) && isset($_SESSION["CustomerUUID"]) && isset($_SESSION["CompanyUUID"])) {
    header("Location:/mail");
}

#region REDIRECT TO INSTALL IF DB DOESN'T EXIST
include 'api/dbtoken.php';
$query = "SELECT * FROM Company";
$sql = $pdo->prepare($query);
$sql->execute();
$result = $sql->fetchAll();
if(count($result) == 0) {
    header("Location:/install");
}
#endregion

?>

<!DOCTYPE html>
<html>
  <head>
    <title>Log In to SiteOS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="img/logo.png">

    <link type="text/css" rel="stylesheet" href="css/font.css" />
    <!--Google Fonts-->
    <!-- <link href="https://fonts.googleapis.com/css?family=Michroma" rel="stylesheet"> -->
    <!-- <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"> -->
    <!--Reset.css-->
    <link type="text/css" rel="stylesheet" href="css/vendor/reset.css">
    <!--Semantic UI-->
    <link type="text/css" rel="stylesheet" href="semantic/dist/semantic.min.css">
    <!--SiteOS-->
    <link type="text/css" rel="stylesheet" href="css/theme-standard.css">
    <link type="text/css" rel="stylesheet" href="css/main.css">
    <link type="text/css" rel="stylesheet" href="css/sui.css">
    <link type="text/css" rel="stylesheet" href="css/login.css">

    <!--jQuery-->
    <script src="js/vendor/jquery.min.js"></script>
    <!--Semantic UI-->
    <script src="semantic/dist/semantic.min.js"></script>
    <!--SiteOS-->
    <script src="js/login.js"></script>
    
  </head>

    <body>
        <div class="login-head">
            <div>
                <img src="img/logo-large.png" />
                <h1>SiteOS</h1>
            </div>
        </div>
        <div class="login-body">
            <div class="ui form">
                <div class="field" id="login-email">
                    <input type="text" name="login-email" placeholder="Email">
                </div>
                <div class="field" id="login-password">
                    <input type="password" name="login-password" placeholder="Password">
                </div>
                <div class="field" id="login-remember">
                    <div class="ui checkbox">
                        <input type="checkbox" class="hidden">
                        <label>Stay logged in</label>
                    </div>
                </div>
                <button class="ui button" id="login-do">Login</button>
                <div class="ui error message">
                    <p></p>
                </div>
            </div>
            <a class="forgot" href="#">Forgot your password?</a>
        </div>
        <div class="ui basic small modal" id="modal-recovery">
            <i class="close icon"></i>
            <div class="header">
                Password Recovery
            </div>
            <div class="content">
                <p>Reset instructions have been sent to your email</p>
            </div>
            <div class="actions">
                <div class="ui ok green basic inverted button">
                    <i class="checkmark icon"></i>
                    Go back to login
                </div>
            </div>
        </div>
        <div class="ui page dimmer">
            <div class="ui loader"></div>
        </div>

    </body>
</html>