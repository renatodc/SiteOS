<?php include "php-head.php" ?>
<?php include "html-head.php" ?>
    <!--TABLESORTER-->
    <link type="text/css" rel="stylesheet" href="node_modules/tablesorter/dist/css/theme.default.css" />
    <!--COLOR PICKER-->
    <link type="text/css" rel="stylesheet" href="node_modules/spectrum-colorpicker/spectrum.css">
    <!--APP-->
    <link type="text/css" rel="stylesheet" href="css/mail.css">
    <link type="text/css" rel="stylesheet" href="css/mail-composer.css">
    <link type="text/css" rel="stylesheet" href="css/ui-toolbar.css">
    <!--CODEMIRROR-->
    <link rel="stylesheet" href="node_modules/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="node_modules/codemirror/addon/fold/foldgutter.css" />
    <link rel="stylesheet" href="node_modules/codemirror/addon/display/fullscreen.css">
    <link rel="stylesheet" href="node_modules/codemirror/addon/hint/show-hint.css">
    <link rel="stylesheet" href="node_modules/codemirror/theme/zenburn.css">
</head>

<body>
    <!--HEADER-->
    <?php include "ui-bar-mail.php" ?>
    <!--END OF HEADER-->

    <!--BODY-->
    <div class="ui-body">

        <!-- LEFT MENU -->
        <div class="ui-left">

            <?php include "ui-menu.php" ?>

        </div>

      <!-- MAIN SCREEN -->
        <div class="ui-center">

            <div class="ui-mail">
                <div class="ui-mail-list">
                    <table class="mail-grid tablesorter">
                        <thead>
                            <tr>
                                <th class="col-head-check"><div class='ui fitted checkbox'><input type='checkbox' class='hidden'/></div></th>
                                <th class="col-head-message"><span>Message</span></th>
                                <th class="col-head-date sorter-mmddyy"><span>Date</span></th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <div class="no-mail">
                        <p>No messages</p>
                    </div>
                </div>                
                <div id="mail-page-container">
                    <span id="mail-page-label">Page</span>
                    <div class="ui compact selection dropdown" id="mail-page">
                        <input type="hidden" name="page">
                        <i class="dropdown icon"></i>
                        <div class="default text">Page</div>
                        <div class="menu">
                        </div>
                    </div>
                </div>
                <div class="ui-mail-content">
                    <div class="header">
                        <ul class="mc-toolbar">
                            <li>                     
                                <a class="btn" id="mc-reply" href="#"><i class="icon reply"></i><span>Reply</span></a>
                                <a class="btn" id="mc-reply-all" href="#"><i class="icon reply all"></i><span>Reply All</span></a>
                                <a class="btn" id="mc-forward" href="#"><i class="icon mail forward"></i><span>Forward</span></a> 
                                <a class="btn" id="mc-edit" href="#"><i class="icon edit"></i><span>Edit</span></a>
                                <a class="btn" id="mc-stats" href="#"><i class="icon bar chart"></i><span>Stats</span></a>
                            </li>
                            <li>
                                <div id="mc-move" class="ui selection dropdown">
                                    <input type="hidden" name="template">
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Move to</div>
                                    <div class="menu">
                                    </div>
                                </div>
                                <a class="btn ui mini icon button" id="mc-source" href="#" data-tooltip="View Source" data-inverted="" data-position="bottom right" style="display: none;"><i class="icon code"></i></a>
                                <a class="btn ui mini icon button" id="mc-new" href="#" data-tooltip="Mark as New" data-inverted="" data-position="bottom right"><i class="icon hide"></i></a>
                                <a class="btn ui mini icon button custom-orange" id="mc-spam" href="#" data-tooltip="Mark as Spam" data-inverted="" data-position="bottom right"><i class="icon ban"></i></a>
                                <a class="btn ui mini icon button custom-red" id="mc-delete" href="#" data-tooltip="Delete message" data-inverted="" data-position="bottom right"><i class="icon trash"></i></a>
                            </li>
                            <li>
                            </li>
                        </ul>
                        <div><h1 class="mc-subject"></h1></div>
                        <div class="mc-from-line">
                            <i class="icons">
                                <i class="icon user"></i>
                                <i class="icon corner arrow right green"></i>
                            </i>
                            <a href="#" class="mc-from"></a>
                        </div>
                        <div class="mc-timestamp-line">
                            <i class="icons">
                                <i class="icon time"></i>
                                <i class="icon corner arrow right green"></i>
                            </i>
                            <p class="mc-timestamp"></p>
                        </div>
                        <div id="status-tags"></div>
                        <div class="read-attachments"></div>
                    </div>
                    <div class="message">
                        <div class="content">
                        </div>
                    </div>
                    <div class="no-mail-selected">
                        <i class="icon mail outline"></i>
                        <p>Select a message to read</p>
                    </div>
                    <div class="mail-loader">
                        <div class="ui active dimmer"><div class="ui text loader">Loading</div></div>
                    </div>
                </div>
            </div>

        </div>

    </div>
    <!--END OF BODY-->

    <div class="msg-hover">
        <i class='icon mail' style='font-size: 72px'></i>
    </div>
    <div id="dragSelection"></div>

    <!--MODALS-->
    
    <div class="ui tiny modal" id="modal-add-folder">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon folder"></i><span>Add Folder</span>
        </div>
        <div class="content">
            <div class="ui form">
                <div class="field add-folder-name-field">
                    <div class="ui input left icon" id="add-folder-name">
                        <i class="folder icon"></i>
                        <input type="text" name="add-folder-name" placeholder="Folder Name">
                    </div>
                </div>
                <div class="ui error message">
                    <h1>Folder Name Missing</h1>
                    <p>Please type in a name for your new folder.</p>
                </div>
                <div class="ui warning message">
                    <h1>Server Error</h1>
                    <p>Folder could not be created at the moment. Try again in a few moments, or contact us for assistance.</p>
                </div>
               <div class="ui info message">
                   <h1>Folder Name Already Exists</h1>
                   <p>Please type in a different name for your new folder.</p>
                </div> 
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted green button positive" id="add-folder-save">
                <i class="icon plus"></i>
                <span>Add Folder</span>
            </div>
        </div>
    </div>
    <div class="ui small modal" id="modal-folder">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon folder"></i><span>Folder Details</span>
        </div>
        <div class="content">
            <form class="ui form">
                <div class="field folder-name-field">
                    <label>Folder Name</label>
                    <div class="ui input left icon" id="folder-name">
                        <i class="icon folder"></i>
                        <input type="text" name="folder-name" placeholder="Folder Name">
                    </div>
                </div>
                <div class="ui error message">
                    <div class="header">Folder Name Missing</div>
                    <p>Please type in a name for your new folder.</p>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="modal-folder-delete">
                <i class="icon cancel"></i>
                <span>Delete Folder</span>
            </div>
            <div class="ui inverted green button positive" id="modal-folder-save">
                <i class="icon save"></i>
                <span>Save Changes</span>
            </div>
        </div>
    </div>
    <?php include "modal-info.php" ?>
    <?php include "modal-write.php" ?>
    <?php include "modal-add-link.php" ?>
    <?php include "modal-templates.php" ?>

    <div class="ui small modal" id="modal-stats">
        <i class="close icon"></i>
        <div class="header">
            <i class="bar chart icon"></i><span>Email Statistics</span>
        </div>
        <div class="content">
            <table class="stats-table" id="stats-status">
                <tbody>
                    <tr id="recipients-delivered">
                        <td>Delivered To</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr id="recipients-opened">
                        <td>Opened By</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr id="recipients-clicked">
                        <td>Clicked By</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr id="recipients-bounced">
                        <td>Bounced For</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr id="recipients-failed">
                        <td>Failed For</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr id="recipients-unsubscribed">
                        <td>Unsubscribed By</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr id="recipients-complained">
                        <td>Complained By</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <table class="stats-table" id="stats-recipient">
                <tbody>
                    <tr id="trackedip">
                        <td>IP Address</td>
                        <td></td>
                    </tr>
                    <tr id="trackedcountry">
                        <td>Country</td>
                        <td></td>
                    </tr>
                    <tr id="trackedregion">
                        <td>Region</td>
                        <td></td>
                    </tr>
                    <tr id="trackedcity">
                        <td>City</td>
                        <td></td>
                    </tr>
                    <tr id="trackeduseragent">
                        <td>User Agent</td>
                        <td></td>
                    </tr>
                    <tr id="trackeddevicetype">
                        <td>Device Type</td>
                        <td></td>
                    </tr>
                    <tr id="trackedclienttype">
                        <td>Client Type</td>
                        <td></td>
                    </tr>
                    <tr id="trackedclientname">
                        <td>Client Name</td>
                        <td></td>
                    </tr>
                    <tr id="trackedclientos">
                        <td>Client OS</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="actions">
            <div class="ui inverted green button positive" id="modal-stats-exit">
                <i class="icon log out"></i><span>Back to Message</span>
            </div>
        </div>
    </div>
    <!--END OF MODALS-->

    <div class="ui main page dimmer">
        <div class="ui text loader">Loading</div>
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
    <!--DRAG & DROP-->
    <script src="node_modules/interact.js/dist/interact.min.js"></script>
    <!--GET FILE SIZE-->
    <script src="node_modules/filesize/lib/filesize.min.js"></script>
    <!--TABLE SORTER-->
    <script src="node_modules/tablesorter/dist/js/jquery.tablesorter.min.js"></script>
    <!--DATE FORMATS-->
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-month.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-weekday.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-two-digit-year.min.js"></script>
    <script src="node_modules/sugar-date/dist/sugar-dates.min.js"></script>
    <script src="js/helper-dates.js"></script>
    <!--CODEMIRROR-->
    <script src="node_modules/codemirror/lib/codemirror-full.min.js" async></script>
    <!--CODE INDENTATION-->
    <script src="node_modules/indent.js/lib/indent.min.js"></script>
    <!--SCREEN CAPTURE-->
    <script src="node_modules/html2canvas/dist/html2canvas.min.js" async></script>
    <!--APP-->
    <script src="js/ui-toolbar.js"></script>
    <script src="js/mail.js"></script>
    <script src="js/mail-composer.js"></script>

  </body>
</html>