<?php include "php-head.php" ?>
<?php include "html-head.php" ?>
    <link type="text/css" rel="stylesheet" href="node_modules/tablesorter/dist/css/theme.default.css" />
    <!--COLOR-->
    <link type="text/css" rel="stylesheet" href="node_modules/spectrum-colorpicker/spectrum.css">
    <!--CODEMIRROR-->
    <link rel="stylesheet" href="node_modules/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="node_modules/codemirror/addon/fold/foldgutter.css" />
    <link rel="stylesheet" href="node_modules/codemirror/addon/display/fullscreen.css">
    <link rel="stylesheet" href="node_modules/codemirror/addon/hint/show-hint.css">
    <link rel="stylesheet" href="node_modules/codemirror/theme/zenburn.css">
    <!--APP-->
    <link type="text/css" rel="stylesheet" href="css/sui-accordion.css">
    <link type="text/css" rel="stylesheet" href="css/ui-account.css">
    <link type="text/css" rel="stylesheet" href="css/ui-gallery.css">
    <link type="text/css" rel="stylesheet" href="css/ui-toolbar.css">
    <link type="text/css" rel="stylesheet" href="css/accounts.css">
  </head>

  <body>
    <!--HEADER-->
    <?php include "inc/ui-bar-accounts.php" ?>
    <!--END OF HEADER-->

    <!--BODY-->
    <div class="ui-body">

        <!-- LEFT MENU -->
        <div class="ui-left">
            <?php include "ui-menu.php" ?>
        </div>

        <!-- MAIN SCREEN -->
        <div class="ui-center">
            <div class="ui form">
                <table class="ui-table">
                    <thead>
                        <tr>
                            <th class="col-name">Name</th>
                            <th class="col-companyemail">Company Email</th>
                            <th class="col-role">Role</th>
                            <th class="col-type">Access</th>
                            <th class="col-companyphone">Company Phone</th>
                            <th class="col-icon"><i class="icon trash"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="no-data">
                    <p>No users available</p>
                </div>
            </div>
        </div>

    </div>
    <!--END OF BODY-->

    <!--MODALS-->
    <div class="ui small modal" id="modal-adduser">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon user"></i><span>Account Details</span>
        </div>
        <div class="scrolling content">
            <div class="ui form">
                <div class="two fields">
                    <div class="field" id="user-name">
                        <label>Name</label>
                        <div class="ui input left icon">
                            <i class="icon user"></i>
                            <input type="text" placeholder="" tabindex="1" />
                        </div>
                    </div>
                    <div class="field" id="user-role">
                        <label>Role</label>
                        <div class="ui input left icon">
                            <i class="icon tag"></i>
                            <input type="text" placeholder="" tabindex="2" />
                        </div>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field" id="user-companyemail">
                        <label>Email</label>
                        <div class="ui right labeled left icon input">
                            <i class="icon envelope"></i>
                            <input type="text" placeholder="" tabindex="3" />
                            <div class="ui basic label"></div>
                        </div>
                    </div>
                    <div class="field" id="user-password">
                        <label>Password</label>
                        <div class="ui input left icon">
                            <i class="icon key"></i>
                            <input type="password" tabindex="4" />
                        </div>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field" id="user-emailonly">
                        <div class="ui checkbox" data-tooltip="Removes access to all other modules" data-position="bottom left">
                            <input type="checkbox" name="user-emailonly">
                            <label>Email only</label>
                        </div>
                    </div>
                    <div class="field" id="user-register">
                        <div class="ui checkbox" data-tooltip="A registration link will be sent to user's personal email address" data-position="bottom right">
                            <input type="checkbox" name="user-register">
                            <label>Let user set password</label>
                        </div>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field" id="user-companyphone">
                        <label>Phone</label>
                        <div class="ui selection dropdown" tabindex="">
                            <input type="hidden">
                            <i class="dropdown icon"></i>
                            <div class="default text">Select Phone...</div>
                            <div class="menu">
                            </div>
                        </div>
                    </div>
                </div>                
                <div class="ui accordion">
                    <div class="title active ui dividing header" id="header-personal">
                        <i class="dropdown icon"></i><span>Contact Info</span>
                    </div>
                    <div class="content active">
                        <div class="two fields">
                            <div class="field" id="user-customeremail">
                                <label>Personal Email</label>
                                <div class="ui input left icon">
                                    <i class="icon envelope"></i>
                                    <input type="text" placeholder="" tabindex="5">
                                </div>
                            </div>
                            <div class="field" id="user-customerphone">
                                <label>Personal Phone</label>
                                <div class="ui input left icon">
                                    <i class="icon phone"></i>
                                    <input type="text" placeholder="" tabindex="6" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="title active ui dividing header" id="header-emailfeatures">
                        <i class="dropdown icon"></i><span>Email Features</span>
                    </div>
                    <div class="content active">
                        <div class="field" id="user-savetocrm">
                            <label>Email to CRM</label>
                            <div class="field" id="user-savetocrm-incomingmail">
                                <div class="ui checkbox">
                                    <input type="checkbox" name="user-savetocrm-incomingmail">
                                    <label>Generate leads from email senders</label>
                                </div>
                            </div>
                            <div class="field" id="user-savetocrm-outgoingmail">
                                <div class="ui checkbox">
                                    <input type="checkbox" name="user-savetocrm-outgoingmail">
                                    <label>Generate leads from email recipients</label>
                                </div>
                            </div>
                        </div>
                        <div class="field write-message" id="user-signature">
                            <a href="#" class="btn tb-html" id="toolbar-html"><i class="icon code"></i><span>Plain / HTML</span></a>
                            <label>Email Signature</label>
                            <div contenteditable="true" class="user-mail-signature ui-message" id="user-mail-signature" tabindex="7"></div>
                            <?php include "inc/ui-toolbar-content-signature.php" ?>
                        </div>
                    </div>
                    <div class="title active ui dividing header" id="header-display">
                        <i class="dropdown icon"></i><span>Display</span>
                    </div>
                    <div class="content active">
                        <div class="two fields">
                            <div class="field" id="user-language">
                                <label>Language</label>                        
                                <div class="ui selection dropdown">
                                    <input type="hidden">
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Select Language...</div>
                                    <div class="menu">
                                        <div class="item" data-value="en"><i class="us flag"></i><span>English</span></div>
                                        <div class="item" data-value="es"><i class="es flag"></i><span>Español</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="field" id="user-theme">
                                <label>Theme</label>                        
                                <div class="ui selection dropdown">
                                    <input type="hidden">
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Select Theme...</div>
                                    <div class="menu">
                                        <div class="item" data-value="standard"><span>Standard</span></div>
                                        <div class="item" data-value="light"><span>Light</span></div>
                                        <div class="item" data-value="neonblue"><span>Neon Blue</span></div>
                                        <div class="item" data-value="neonred"><span>Neon Red </span></div>
                                        <div class="item" data-value="neongreen"><span>Neon Green</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ui info message">
                    <div class="header">Personal Email Required</div>
                    <p>Please fill in the personal email address field to send an invite link</p>
                </div>
                <div class="ui warning message">
                    <div class="header">Company Email Already In Use</div>
                    <p>Please type in a different company email address</p>
                </div>
                <div class="ui error message">
                    <div class="header">Invalid Data</div>
                    <p>Enter valid data for all required fields</p>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="modal-adduser-exit">
                <i class="icon log out"></i><span>Exit</span>
            </div>
            <div class="ui inverted green button" id="modal-adduser-save">
                <i class="icon save"></i><span>Add User</span>
            </div>
        </div>
        <div class="ui dimmer save-template">
            <div class="ui medium text loader"><span>Saving Template</span></div>
        </div>
        <div class="ui dimmer save-template2">
            <div class="ui medium text loader"><span>Saving Template</span></div>
        </div>
        <div class="ui dimmer save-account">
            <div class="ui medium text loader"><span>Saving Account</span></div>
        </div>
        <div class="ui dimmer create-account">
            <div class="ui medium text loader"><span>Creating Account</span></div>
        </div>
        <div class="ui dimmer create-mail-folders">
            <div class="ui medium text loader"><span>Creating Mail Folders</span></div>
        </div>
        <div class="ui dimmer send-invite">
            <div class="ui medium text loader"><span>Sending Registration Link</span></div>
        </div>
    </div>
    <div class="ui tiny modal" id="modal-columns">
        <i class="close icon"></i>
        <div class="header">
            <span>Show/Hide Columns</span>
        </div>
        <div class="content">
            <form class="ui form" style="">
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-name">
                        <input type="checkbox" name="modal-col-name" data-name='name'>
                        <label>Name</label>
                    </div>
                </div>          
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-companyemail">
                        <input type="checkbox" name="modal-col-companyemail" data-name='companyemail'>
                        <label>Email</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-role">
                        <input type="checkbox" name="modal-col-role" data-name='role'>
                        <label>Role</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-type">
                        <input type="checkbox" name="modal-col-type" data-name='type'>
                        <label>Access</label>
                    </div>
                </div>      
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-companyphone">
                        <input type="checkbox" name="modal-col-companyphone" data-name='companyphone'>
                        <label>Phone</label>
                    </div>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui inverted green button positive" id="modal-columns-save">
                <i class="icon save"></i><span>Save</span>
            </div>
        </div>
    </div>

    <?php include "inc/modal-info.php" ?>
    <?php include "inc/modal-add-link.php" ?>
    <?php include "inc/modal-templates.php" ?>
    <?php include "inc/modal-gallery-images.php" ?>
    <!--END OF MODALS-->

    <div class="ui main page dimmer">
        <div class="ui loader"></div>
    </div>

    <input type="hidden" id="st" value="<?=$_SESSION["st"];?>" />
    <!--FILE UPLOAD-->
    <script src="node_modules/blueimp-file-upload/js/vendor/jquery.ui.widget.js"></script>
    <script src="node_modules/blueimp-file-upload/js/jquery.iframe-transport.js"></script>
    <script src="node_modules/blueimp-file-upload/js/jquery.fileupload.min.js"></script>
    <!--COLOR-->
    <script src="node_modules/jquery-easing/jquery.easing.1.3.js"></script>
    <script src="node_modules/jquery-color/jquery.color-2.1.2.min.js"></script>
    <script src="node_modules/spectrum-colorpicker/spectrum.js"></script>
    <!--DATE FORMATS-->
    <script src="node_modules/sugar-date/dist/sugar-dates.min.js"></script>
    <script src="js/helper-dates.js"></script>
    <!--TABLE SORT-->
    <script src="node_modules/tablesorter/dist/js/jquery.tablesorter.min.js"></script>
    <!--CODEMIRROR-->
    <script src="node_modules/codemirror/lib/codemirror-full.min.js" async></script>
    <!--CODE INDENTATION-->
    <script src="node_modules/indent.js/lib/indent.min.js"></script>
    <!--SCREEN CAPTURE-->
    <script src="node_modules/html2canvas/dist/html2canvas.min.js" async></script>
    <!--APP-->
    <script src="js/sui-accordion.js"></script>
    <script src="js/ui-gallery.js"></script>
    <script src="js/ui-toolbar.js"></script>
    <script src="js/accounts.js"></script>
  </body>
</html>