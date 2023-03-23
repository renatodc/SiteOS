<?php include "php-head.php" ?>
<?php include "html-head.php" ?>
    <!--CSS-->
    <!--TABLESORTER-->
    <link type="text/css" rel="stylesheet" href="node_modules/tablesorter/dist/css/theme.default.css" />
    <!--COLOR-->
    <link type="text/css" rel="stylesheet" href="node_modules/spectrum-colorpicker/spectrum.css">
    <!--APP-->
    <link type="text/css" rel="stylesheet" href="css/broadcasts.css">
    <link type="text/css" rel="stylesheet" href="css/mail-composer.css">
    <link type="text/css" rel="stylesheet" href="css/ui-toolbar.css">
    <link type="text/css" rel="stylesheet" href="css/sui-table.css">
    <!--CODEMIRROR-->
    <link rel="stylesheet" href="node_modules/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="node_modules/codemirror/addon/fold/foldgutter.css" />
    <link rel="stylesheet" href="node_modules/codemirror/addon/display/fullscreen.css">
    <link rel="stylesheet" href="node_modules/codemirror/addon/hint/show-hint.css">
    <link rel="stylesheet" href="node_modules/codemirror/theme/zenburn.css">
</head>

<body>
    <!--HEADER-->
    <?php include "ui-bar-broadcasts.php" ?>
    <!--END OF HEADER-->

    <!--BODY-->
    <div class="ui-body">

        <!-- LEFT MENU -->
        <div class="ui-left">
            <?php include "ui-menu.php" ?>
        </div>

        <!-- MAIN SCREEN -->
        <div class="ui-center">
            
            <table class="ui-table">
                <thead>
                    <tr>
                        <th class="col-head-check"><div class='ui fitted checkbox'><input type='checkbox' class='hidden'/></div></th>
                        <th class="col-name"><span>Subject</span></th>
                        <th class="col-recipients"><span>Recipients</span></th>
                        <th class="col-delivered"><span>Delivered</span></th>
                        <th class="col-bounced"><span>Bounced</span></th>
                        <th class="col-failed"><span>Failed</span></th>
                        <th class="col-opened"><span>Opened</span></th>
                        <th class="col-clicked"><span>Clicked</span></th>
                        <th class="col-unsubscribed"><span>Unsubscribed</span></th>
                        <th class="col-complained"><span>Complained</span></th>
                        <th class="col-datecreated sorter-mmddyy"><span>Date Sent</span></th>
                        <th class="col-datemodified sorter-mmddyy"><span>Last Update</span></th>
                        <th class="col-createdby"><span>Sent By</span></th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
            <div class="no-data">
                <p>No broadcasts available</p>
            </div>

        </div>

    </div>
    <!--END OF BODY-->

    <!--TOOLBAR-->
    <div class="toolbar-image">
        <a href="#" class="btn" id="toolbar-img-change">
            <i class="icon image"></i><span>Change Picture</span>
            <input id="fileupload3" type="file" name="files">
        </a>
    </div>
    <!--END OF TOOLBAR-->
    <!--MODALS-->
    <div class="ui tiny modal" id="modal-columns">
        <i class="close icon"></i>
        <div class="header">
            <span>Show/Hide Columns</span>
        </div>
        <div class="content">
            <form class="ui form">
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-recipients">
                        <input type="checkbox" name="modal-col-recipients" data-name='recipients'>
                        <label>Recipients</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-delivered">
                        <input type="checkbox" name="modal-col-delivered" data-name='delivered'>
                        <label>Delivered</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-bounced">
                        <input type="checkbox" name="modal-col-bounced" data-name='bounced'>
                        <label>Bounced</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-failed">
                        <input type="checkbox" name="modal-col-failed" data-name='failed'>
                        <label>Failed</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-opened">
                        <input type="checkbox" name="modal-col-opened" data-name='opened'>
                        <label>Opened</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-clicked">
                        <input type="checkbox" name="modal-col-clicked" data-name='clicked'>
                        <label>Clicked</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-unsubscribed">
                        <input type="checkbox" name="modal-col-unsubscribed" data-name='unsubscribed'>
                        <label>Unsubscribed</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-complained">
                        <input type="checkbox" name="modal-col-complained" data-name='complained'>
                        <label>Complained</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-datecreated">
                        <input type="checkbox" name="modal-col-datecreated" data-name='datecreated'>
                        <label>Date Sent</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-datemodified">
                        <input type="checkbox" name="modal-col-datemodified" data-name='datemodified'>
                        <label>Last Update</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-createdby">
                        <input type="checkbox" name="modal-col-createdby" data-name='createdby'>
                        <label>Sent By</label>
                    </div>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui green button positive inverted" id="modal-columns-save">
                <i class="icon save"></i><span>Save</span>
            </div>
        </div>
    </div>

    <div class="ui modal" id="modal-recipients">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon envelope"></i><span>Email Recipients</span>
        </div>
        <div class="content">
            <table class="ui-table">
                <thead>
                    <tr>
                        <th></th>
                        <th id="r-delivered">Delivered</th>
                        <th id="r-opened">Opened</th>
                        <th id="r-clicked">Clicked</th>
                        <th id="r-bounced">Bounced</th>
                        <th id="r-failed">Failed</th>
                        <th id="r-unsubscribed">Unsubscribed</th>
                        <th id="r-complained">Complained</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
        <div class="actions">
            <div class="ui principal button positive inverted" id="modal-recipients-view-msg">
                <i class="icon external alternate"></i><span>View Message</span>
            </div>
            <div class="ui green button positive inverted" id="modal-recipients-exit">
                <i class="icon log out"></i><span>Return</span>
            </div>
        </div>
    </div>

    <div class="ui modal" id="modal-msg">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon envelope"></i><span>Message Details</span>
        </div>
        <div class="content">
        </div>
        <div class="actions">
            <div class="ui green button positive inverted" id="modal-msg-exit">
                <i class="icon log out"></i><span>Return</span>
            </div>
        </div>
    </div>


    <?php include "modal-info.php" ?>
    <?php include "modal-write.php" ?>
    <?php include "modal-add-link.php" ?>
    <?php include "modal-templates.php" ?>
    <!--END OF MODALS-->

    <div class="ui main page dimmer">
        <div class="ui loader"></div>
    </div>

    <!--JS-->

    <input type="hidden" id="st" value="<?=$_SESSION["st"];?>" />
    <!--FILE UPLOAD-->
    <script src="node_modules/blueimp-file-upload/js/vendor/jquery.ui.widget.js"></script>
    <script src="node_modules/blueimp-file-upload/js/jquery.iframe-transport.js"></script>
    <script src="node_modules/blueimp-file-upload/js/jquery.fileupload.min.js"></script>
    <!--COLOR-->
    <script src="node_modules/jquery-easing/jquery.easing.1.3.js"></script>
    <script src="node_modules/jquery-color/jquery.color-2.1.2.min.js"></script>
    <script src="node_modules/spectrum-colorpicker/spectrum.js"></script>
    <!--GET FILE SIZE-->
    <script src="node_modules/filesize/lib/filesize.min.js"></script>
    <!--DATE FORMATS-->
    <script src="node_modules/sugar-date/dist/sugar-dates.min.js"></script>
    <script src="js/helper-dates.js"></script>
    <!--TABLE SORTER-->
    <script src="node_modules/tablesorter/dist/js/jquery.tablesorter.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-month.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-weekday.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-two-digit-year.min.js"></script>
    <!--CODE MIRROR-->
    <script src="node_modules/codemirror/lib/codemirror-full.min.js" async></script>
    <!--CODE INDENTATION-->
    <script src="node_modules/indent.js/lib/indent.min.js"></script>
    <!--SCREEN CAPTURE-->
    <script src="node_modules/html2canvas/dist/html2canvas.min.js" async></script>
    <!--APP-->
    <script src="js/ui-toolbar.js"></script>
    <script src="js/broadcasts.js"></script>
    <script src="js/mail-composer.js"></script>
</body>
</html>