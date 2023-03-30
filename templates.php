<?php include "php-head.php" ?>
<?php include "html-head.php" ?>
    <link type="text/css" rel="stylesheet" href="node_modules/spectrum-colorpicker/spectrum.css">
    <link type="text/css" rel="stylesheet" href="css/sui-accordion.css">
    <link type="text/css" rel="stylesheet" href="css/ui-toolbar.css">
    <link type="text/css" rel="stylesheet" href="css/templates.css">
</head>
<body>
    <!--HEADER-->
    <?php include "inc/ui-bar-templates.php" ?>
    <!--END OF HEADER-->

    <!--BODY-->
    <div class="ui-body">

        <!-- LEFT MENU -->
        <div class="ui-left">
            <?php include "ui-menu.php" ?>
        </div>

        <!-- MAIN SCREEN -->
        <div class="ui-center">
            <div id="context">
                <div class="ui segment" id="templates">
                    <div class="tags">
                        <a class="ui label">All</a>
                        <a class="ui label">Designer/Developer</a>
                        <a class="ui label">Photographer</a>
                        <a class="ui label">Personal</a>
                        <a class="ui label">Business</a>
                        <a class="ui label">Apps</a>
                    </div>
                    <div class="gallery">
                    </div>
                    <div class="ui segment" id="templates-load">
                        <div class="ui active inverted dimmer">
                            <div class="ui text loader">Loading Templates</div>
                        </div>
                        <p></p>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <!--END OF BODY-->

    <!-- DIMMER -->
    <div class="ui main page dimmer">
        <div class="ui text loader">Deploying Template</div>
    </div>

    <input type="hidden" id="st" value="<?=$_SESSION["st"];?>" />
    <!-- SORTABLE -->
    <script src="node_modules/sortablejs/Sortable.min.js"></script>
    
    <!--COLOR-->
    <script src="node_modules/jquery-easing/jquery.easing.1.3.js"></script>
    <script src="node_modules/jquery-color/jquery.color-2.1.2.min.js"></script>
    <script src="node_modules/spectrum-colorpicker/spectrum.js"></script>
    
    <!--FILE UPLOAD-->
    <script src="node_modules/blueimp-file-upload/js/vendor/jquery.ui.widget.js"></script>
    <script src="node_modules/blueimp-file-upload/js/jquery.iframe-transport.js"></script>
    <script src="node_modules/blueimp-file-upload/js/jquery.fileupload.min.js"></script>

    <!-- SiteOS -->
    <script src="js/sui-accordion.js"></script>
    <script src="js/templates.js"></script>
</body>
</html>