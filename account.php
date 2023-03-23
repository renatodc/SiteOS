<?php include "php-head.php" ?>
<?php include "html-head.php" ?>
    <!--COLOR-->
    <link type="text/css" rel="stylesheet" href="node_modules/spectrum-colorpicker/spectrum.css">
    <!--CODEMIRROR-->
    <link rel="stylesheet" href="node_modules/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="node_modules/codemirror/addon/fold/foldgutter.css" />
    <link rel="stylesheet" href="node_modules/codemirror/addon/display/fullscreen.css">
    <link rel="stylesheet" href="node_modules/codemirror/addon/hint/show-hint.css">
    <link rel="stylesheet" href="node_modules/codemirror/theme/zenburn.css">
    <!--APP-->
    <link type="text/css" rel="stylesheet" href="css/sui-tab.css">
    <link type="text/css" rel="stylesheet" href="css/ui-account.css">
    <link type="text/css" rel="stylesheet" href="css/ui-gallery.css">
    <link type="text/css" rel="stylesheet" href="css/ui-toolbar.css">
    <link type="text/css" rel="stylesheet" href="css/account.css">
    
  </head>

  <body>
    <!--HEADER-->
    <?php include "ui-bar-account.php" ?>
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
                <div class="ui top attached tabular menu">
                    <a class="item active" data-tab="display"><i class="icon desktop"></i><span>Display</span></a>
                    <a class="item" data-tab="email"><i class="icon envelope"></i><span>Email</span></a>
                    <a class="item" data-tab="contact"><i class="icon user"></i><span>Contact</span></a>
                    <!-- <a class="item" data-tab="keys"><i class="icon key"></i><span>Keys</span></a> -->
                    <?php if(intval($isOwner) == 1) { echo "<a class='item' data-tab='company'><i class='icon sitemap'></i><span>Company</span></a>"; } ?>
                </div>
                <div class="ui bottom attached tab segment active" data-tab="display">
                    <div class="two fields">
                        <div class="field" id="user-language">
                            <label>Language</label>                        
                            <div class="ui selection dropdown">
                                <input type="hidden">
                                <i class="dropdown icon"></i>
                                <div class="default text">Select Language...</div>
                                <div class="menu">
                                    <div class="item" data-value="en"><i class="us flag"></i><span>English</span></div>
                                    <div class="item" data-value="es"><i class="es flag"></i><span>Spanish</span></div>
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
                    <div class="field" id="user-basecolor">
                        <label>Base Color</label>
                        <input type="text" />
                    </div>
                </div>
                <div class="ui bottom attached tab segment" data-tab="email">
                    <div class="two fields">
                        <div class="field" id="user-password-change">
                            <label>Password</label>
                            <div class="ui small button">
                                <i class="icon key"></i><span>Change Password</span>
                            </div>
                        </div>
                        <div class="field" id="user-password">
                            <label>Password</label>
                            <div class="ui input left icon">
                                <i class="icon key"></i>
                                <input type="password" name="detail-password" placeholder="">
                            </div>
                        </div>                        
                        <div class="field" id="user-savetocrm">
                            <label>Email to CRM</label>
                            <div class="field" id="user-savetocrm-incomingmail">
                                <div class="ui checkbox">
                                    <input type="checkbox" name="user-savetocrm-incomingmail" checked="">
                                    <label>Generate leads from email senders</label>
                                </div>
                            </div>
                            <div class="field" id="user-savetocrm-outgoingmail">
                                <div class="ui checkbox">
                                    <input type="checkbox" name="user-savetocrm-outgoingmail" checked="">
                                    <label>Generate leads from email recipients</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field write-message" id="user-signature">
                        <a href="#" class="btn tb-html" id="toolbar-html"><i class="icon code"></i><span>Plain / HTML</span></a>
                        <label>Email Signature</label>
                        <div contenteditable="true" class="user-mail-signature ui-message" id="user-mail-signature" tabindex="8"></div>
                        <?php include "ui-toolbar-content-signature.php" ?>
                    </div>
                </div>
                <div class="ui bottom attached tab segment" data-tab="contact">
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
                                <input type="text" placeholder="" tabindex="2">
                            </div>
                        </div>
                    </div>
                    <div class="two fields">
                        <div class="field" id="user-customeremail">
                            <label>Email</label>
                            <div class="ui input left icon">
                                <i class="icon envelope"></i>
                                <input type="text" placeholder="" tabindex="3">
                            </div>
                        </div>
                        <div class="field" id="user-customerphone">
                            <label>Phone</label>
                            <div class="ui input left icon">
                                <i class="icon phone"></i>
                                <input type="text" placeholder="" tabindex="4" />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="ui bottom attached tab segment" data-tab="keys">
                    <h1 id="imap-title">IMAP Configuration:</h1>
                    <span id="imap-username-label">Username: </span><span id="imap-username-value"></span>
                </div> -->
                <div class="ui bottom attached tab segment" data-tab="company">
                    <div class="two fields">
                        <div class="field" id="user-logo">
                            <label>Logo</label>
                            <div class="ui small button" id="user-logo-change">
                                <i class="icon image"></i><span>Change Logo</span>
                            </div>
                            <div class="ui small icon button" id="user-logo-reset">
                                <i class="icon undo"></i><span>Reset Logo</span>
                            </div>
                        </div>
                        <div class="field" id="user-formrecipient">
                            <label>Website Form Recipient</label>
                            <div class="ui input left icon">
                                <i class="icon mail"></i>
                                <input type="text" placeholder="" tabindex="" />
                            </div>
                        </div>
                    </div>
                    <div class="two fields">
                        <div class="field" id="user-terminate">
                            <label>Account Termination</label>
                            <div class="ui small red button" id="user-terminate-btn">
                                <i class="icon close"></i><span>Close Account</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ui error message">
                    <div class="header">Invalid Fields</div>
                    <p>Please fill in all required fields</p>
                </div>
                <div class="ui warning message">
                    <div class="header">Server Error</div>
                    <p>Unable to save changes</p>
                </div>
            </div>
        </div>

    </div>
    <!--END OF BODY-->

    <!--MODALS-->
    <?php include "modal-info.php" ?>
    <?php include "modal-terminate.php" ?>
    <?php include "modal-gallery-images.php" ?>
    <?php include "modal-add-link.php" ?>
    <?php include "modal-templates.php" ?>
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
    <!--CODEMIRROR-->
    <script src="node_modules/codemirror/lib/codemirror-full.min.js" async></script>
    <!--CODE INDENTATION-->
    <script src="node_modules/indent.js/lib/indent.min.js"></script>
    <!--SCREEN CAPTURE-->
    <script src="node_modules/html2canvas/dist/html2canvas.min.js" async></script>
    <!--APP-->
    <script src="js/sui-tab.js"></script>
    <script src="js/ui-gallery.js"></script>
    <script src="js/ui-toolbar.js"></script>
    <script src="js/account.js"></script>

  </body>
</html>