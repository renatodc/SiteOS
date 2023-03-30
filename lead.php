<?php include "php-head.php" ?>
<?php include "html-head.php" ?>

    <!--CSS-->
    <link type="text/css" rel="stylesheet" href="node_modules/tablesorter/dist/css/theme.default.css" />
    <!--COLOR PICKER-->
    <link type="text/css" rel="stylesheet" href="node_modules/spectrum-colorpicker/spectrum.css" />
    <!--CALENDAR UI-->
    <link type="text/css" rel="stylesheet" href="semantic/dist/components/calendar.min.css" />
    <!--APP-->
    <link type="text/css" rel="stylesheet" href="css/ui-toolbar.css">
    <link type="text/css" rel="stylesheet" href="css/ui-cf.css">
    <link type="text/css" rel="stylesheet" href="css/mail-composer.css" />
    <link type="text/css" rel="stylesheet" href="css/lead.css" />
    <!--CODEMIRROR-->
    <link rel="stylesheet" href="node_modules/codemirror/lib/codemirror.css" />
    <link rel="stylesheet" href="node_modules/codemirror/addon/fold/foldgutter.css" />
    <link rel="stylesheet" href="node_modules/codemirror/addon/display/fullscreen.css" />
    <link rel="stylesheet" href="node_modules/codemirror/addon/hint/show-hint.css" />
    <link rel="stylesheet" href="node_modules/codemirror/theme/zenburn.css" />
    
  </head>

  <body>
    <!--HEADER-->
    <?php include "inc/ui-bar-lead.php" ?>
    <!--END OF HEADER-->

    <div class="ui-runcall">
        <div class="runcall-timing">
            <a href="#" class="btn runcall-pause">
                <i class="icon pause"></i>
            </a>
            <span class="runcall-timer">00:05</span>
        </div>
        <a href="#" class="btn runcall-next" data-position="right center">
            <i class="icon user"></i>
            <i class="icon arrow right"></i>
        </a>
    </div>
    <!--BODY-->
    <div class="ui-body">
        <!-- LEFT MENU -->
        <div class="ui-left">
            <?php include "ui-menu.php" ?>
        </div>
        <!-- MAIN SCREEN -->
        <div class="ui-center">
            <div class="phone-tab">
                <div class="phone-info">
                    <i class="icon call square"></i>
                    <i class="icon arrow right"></i>
                    <span class="call-name" id="call-name"></span>
                    <span class="call-number" id="call-number"></span>
                    <span class="call-separator">|</span>
                    <span class="call-status" id="call-status"></span>
                    <span class="call-separator">|</span>
                    <span class="call-duration" id="call-duration"></span>
                </div>
                <a href="#" class="call-mute" id="call-mute">
                    <i class="icon mute"></i>
                </a>
                <div class="phone-spectrum">
                    <canvas class="visualizer"></canvas>
                </div>
                <a href="#" class="call-hang" id="call-hang">
                    <i class="icon phone"></i><span>Hang up</span>
                </a>
            </div>
            <div class="ui-lead">
                <div class="lead-grid">
                    <div class="lead-contacts">
                        <div class="head-bar">
                            <h3><i class="icon user"></i><span>Contacts</span><counter></counter></h3>
                            <a class="btn" href="#" id="lead-add-contact">
                                <i class="icon add user"></i><span>Add Contact</span>
                            </a>
                        </div>
                        <ul></ul>
                        <div class="no-contacts">
                            <p>No contacts available</p>
                        </div>
                        <div class="loader"><div class='ui data inverted dimmer'><div class='ui loader'></div></div></div>
                    </div>
                    <div class="lead-noteboard">
                        <div class="head-bar">
                            <h3><i class="icon calendar outline"></i><span>Noteboard</span></h3>
                            <a class="btn" href="#" id="lead-noteboard-save">
                                <i class="icon save"></i><span>Save</span>
                            </a>
                        </div>
                        <textarea></textarea>
                    </div>
                </div>
                <div class="lead-actionlog">
                    <div class="head-bar">
                        <h3>
                            <i class="icon browser"></i>
                            <span>Action Log</span><counter></counter>
                        </h3>
                        <a class="btn" href="#" id="btn-log-note">
                            <i class="icon add"></i>
                            <i class="icon sticky note outline"></i>
                            <span>Add Note</span>
                        </a>
                        <a class="btn" href="#" id="btn-log-email">
                            <i class="icon add"></i>
                            <i class="icon envelope"></i>
                            <span>Add Email</span>
                        </a>
                        <a class="btn" href="#" id="btn-log-call">
                            <i class="icon add"></i>
                            <i class="icon call"></i>
                            <span>Add Call</span>
                        </a>
                        <a class="btn" href="#" id="btn-log-task">
                            <i class="icon add"></i>
                            <i class="icon clipboard check"></i>
                            <span>Add Task</span>
                        </a>
                        <a class="btn" href="#" id="btn-log-sale">
                            <i class="icon add"></i>
                            <i class="icon dollar"></i>
                            <span>Add Sale</span>
                        </a>
                    </div>
                    <div class="docker">
                        <table class="tablesorter">
                            <thead>
                                <tr>
                                    <th id="actionlog-th-type">Type</th>
                                    <th id="actionlog-th-description">Description</th>
                                    <th id="actionlog-th-time" class="sorter-mmddyy">Date</th>
                                    <th id="actionlog-th-user">User</th>
                                    <th id="actionlog-th-set"><i class="icon settings"></i></th>
                                    <th id="actionlog-th-trash"><i class="icon trash"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    <div class="no-actions">
                        <p>No actions available</p>
                    </div>
                    <div class="loader"><div class='ui data inverted dimmer'><div class='ui loader'></div></div></div>
                </div>
            </div>
        </div>
    </div>
    <!--END OF BODY-->

    <!--MODALS-->
    <?php include "inc/modal-info.php" ?>
    
    <div class="ui modal" id="modal-add-contact">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon user"></i><span>Contact Details</span>
        </div>
        <div class="scrolling content">
            <form class="ui form">
                <div class="three fields">
                    <div class="field" id="modal-add-contact-name">
                        <label>Name</label>
                        <div class="ui input left icon">
                            <i class="icon user"></i>
                            <input type="text" name="contact-name" placeholder="" />
                        </div>
                    </div>
                    <div class="field" id="modal-add-contact-email">
                        <label>Email</label>
                        <div class="ui input left icon">
                            <i class="icon envelope"></i>
                            <input type="email" name="contact-email" placeholder="">
                        </div>
                    </div>
                    <div class="field" id="modal-add-contact-phone">
                        <label>Phone</label>
                        <div class="ui input left icon">
                            <i class="icon phone"></i>
                            <input type="text" name="contact-phone" placeholder="">
                        </div>
                    </div>
                </div>
                <div class="three fields">
                    <div class="field" id="modal-add-contact-title">
                        <label>Title</label>
                        <div class="ui input left icon">
                            <i class="icon tag"></i>
                            <input type="text" name="contact-title" placeholder="">
                        </div>
                    </div>
                    <div class="field" id="modal-add-contact-avatar">
                        <label>Avatar</label>
                        <div class="ui input left icon">
                            <i class="icon image"></i>
                            <input type="text" name="contact-avatar" placeholder="">
                        </div>
                    </div>
                    <div class="field" id="modal-add-contact-location">
                        <label>Location</label>
                        <div class="ui input left icon">
                            <i class="icon marker"></i>
                            <input type="text" name="contact-location" placeholder="">
                        </div>
                    </div>
                </div>
                <div class="ui error message">
                    <div class="header">Invalid Fields</div>
                    <p>Please fill in all required fields.</p>
                </div>
                <div class="ui warning message">
                    <div class="header">Autofill Failed</div>
                    <p>Unable to retrieve records with the email address provided.</p>
                </div>
                <div class="ui info message">
                    <div class="header">Autofill Queued</div>
                    <p>Please click 'Autofill' again in a few seconds.</p>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="modal-add-contact-exit">
                <i class="icon cancel"></i><span>Exit</span>
            </div>
            <div class="ui inverted red button negative left floated" id="modal-add-contact-delete">
                <i class="icon trash"></i><span>Delete</span>
            </div>
            <!-- <div class="ui inverted principal button left floated" id="modal-add-contact-auto" data-tooltip="Scans email address to populate fields" data-position="right center">
                <i class="icon crosshairs"></i><span>Autofill</span>
            </div> -->
            <div class="ui inverted principal button left floated" id="modal-add-contact-edit">
                <i class="icon browser"></i><span>Edit Fields</span>
            </div>
            <div class="ui inverted green button" id="modal-add-contact-save">
                <i class="icon save"></i><span>Save</span>
            </div>
        </div>
    </div>

    <div class="ui small modal" id="modal-log-call">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon phone"></i><span>Call Details</span>
        </div>
        <div class="content">
            <form class="ui form">
                <div class="two fields">
                    <div class="field" id="log-call-from">
                        <label>From</label>
                        <div class="ui input left icon">
                            <i class="user icon"></i>
                            <input type="text" name="log-call-from" placeholder="Caller" />
                        </div>
                    </div>
                    <div class="field" id="log-call-to">
                        <label>To</label>
                        <div class="ui input left icon">
                            <i class="user icon"></i>
                            <input type="text" name="log-call-to" placeholder="Callee">
                        </div>
                    </div>
                </div>
                <div class="three fields">
                    <div class="ui calendar field" id="log-call-date">
                        <label>Date</label>
                        <div class="ui input left icon">
                            <i class="calendar icon"></i>
                            <input type="text" name="log-call-date" placeholder="">
                        </div>
                    </div>
                    <div class="ui calendar field" id="log-call-time">
                        <label>Time</label>
                        <div class="ui input left icon">
                            <i class="time icon"></i>
                            <input type="text" name="log-call-time" placeholder="">
                        </div>
                    </div>
                    <div class="field" id="log-call-duration">
                        <label>Duration (minutes)</label>
                        <input type="number" name="log-call-duration" min="0" max="60" placeholder="0">
                    </div>
                </div>
                <div class="two fields">
                    <div class="field" id="log-call-status">
                        <label>Call Status</label>
                        <div class="ui toggle checkbox">
                            <input type="checkbox" name="log-call-status" class="hidden">
                            <label>Answered</label>
                        </div>
                    </div>
                    <div class="field" id="log-call-type">
                        <label>Call Type</label>
                        <div class="inline fields">
                            <div class="field" id="log-call-type-outgoing">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="log-call-type" class="hidden" value="Outgoing Call" checked="">
                                    <label><i class="icon phone"></i><i class="icon arrow right"></i><span>Outgoing</span></label>
                                </div>
                            </div>
                            <div class="field" id="log-call-type-incoming">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="log-call-type" class="hidden" value="Incoming Call">
                                    <label><i class="icon phone"></i><i class="icon arrow left"></i><span>Incoming</span></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field" id="log-call-transcript">
                    <label>Transcript</label>
                    <textarea name="log-call-transcript"></textarea>
                </div>
                <div class="ui error message">
                    <div class="header">Missing Form Fields</div>
                    <p>Please fill out all required fields</p>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="log-call-exit">
                <i class="icon cancel"></i><span>Exit</span>
            </div>
            <div class="ui inverted red button negative left floated" id="log-call-delete">
                <i class="icon trash"></i><span>Delete</span>
            </div>
            <div class="ui inverted green button positive" id="log-call-save">
                <i class="icon save"></i><span>Save</span>
            </div>
        </div>
    </div>
    <div class="ui small modal" id="modal-log-email">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon envelope"></i><span>Email Details</span>
        </div>
        <div class="content">
            <form class="ui form">
                <div class="two fields">
                    <div class="field" id="log-email-from">
                        <label>From</label>
                        <div class="ui input left icon">
                            <i class="user icon"></i>
                            <input type="text" name="log-email-from" placeholder="Sender" />
                        </div>
                    </div>
                    <div class="field" id="log-email-to">
                        <label>To</label>
                        <div class="ui input left icon">
                            <i class="user icon"></i>
                            <input type="text" name="log-email-to" placeholder="Receiver">
                        </div>
                    </div>
                </div>

                <div class="two fields">
                    <div class="ui calendar field" id="log-email-date">
                        <label>Date</label>
                        <div class="ui input left icon">
                            <i class="calendar icon"></i>
                            <input type="text" name="log-email-date" placeholder="">
                        </div>
                    </div>
                    <div class="ui calendar field" id="log-email-time">
                        <label>Time</label>
                        <div class="ui input left icon">
                            <i class="time icon"></i>
                            <input type="text" name="log-email-time" placeholder="">
                        </div>
                    </div>
                </div>
                <div class="field" id="log-email-type">
                    <label>Email Type</label>
                    <div class="inline fields">
                        <div class="field" id="log-email-type-outgoing">
                            <div class="ui radio checkbox">
                                <input type="radio" name="log-email-type" class="hidden" value="Outgoing Email" checked="">
                                <label><i class="icon envelope"></i><i class="icon arrow right"></i><span>Outgoing</span></label>
                            </div>
                        </div>
                        <div class="field" id="log-email-type-incoming">
                            <div class="ui radio checkbox">
                                <input type="radio" name="log-email-type" class="hidden" value="Incoming Email">
                                <label><i class="icon inbox"></i><i class="icon arrow left"></i><span>Incoming</span></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field" id="log-email-transcript">
                    <label>Message</label>
                    <textarea name="log-email-transcript"></textarea>
                </div>
                <div class="ui error message">
                    <div class="header">Missing Form Fields</div>
                    <p>Please fill out all required fields</p>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="log-email-exit">
                <i class="icon cancel"></i><span>Exit</span>
            </div>
            <div class="ui inverted red button negative left floated" id="log-email-delete">
                <i class="icon trash"></i><span>Delete</span>
            </div>
            <div class="ui inverted green button positive" id="log-email-save">
                <i class="icon save"></i><span>Save</span>
            </div>
        </div>
    </div>
    <div class="ui small modal" id="modal-log-note">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon sticky note outline"></i><span>Note Details</span>
        </div>
        <div class="content">
            <form class="ui form">
                <div class="field" id="log-note-title">
                    <div class="ui input">
                        <input type="text" name="log-note-title" placeholder="Note Title" tabindex="1" />
                    </div>
                </div>
                <div class="field write-message" id="log-note-content">
                    <a href="#" class="btn tb-html"><i class="icon code"></i><span>Plain / HTML</span></a>
                    <label>Message</label>
                    <div contenteditable="true" class="ui-message" id="log-note-editor" placeholder="Description" tabindex="2"></div>
                    <?php include "inc/ui-toolbar-content-slim.php" ?>
                </div>
                <div class="field" id="log-note-attachments">
                    <label>Attachments</label>
                </div>
                <div class="ui error message">
                    <div class="header">Empty Note</div>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="log-note-exit">
                <i class="icon cancel"></i><span>Exit</span>
            </div>
            <div class="ui inverted red button negative left floated" id="log-note-delete">
                <i class="icon trash"></i><span>Delete</span>
            </div>
            <div class="ui inverted green button positive" id="log-note-save" tabindex="3">
                <i class="icon save"></i><span>Save</span>
            </div>
        </div>
    </div>
    <div class="ui small modal" id="modal-log-task">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon clipboard check"></i><span>Task Details</span>
        </div>
        <div class="content">
            <form class="ui form">
                <div class="field" id="log-task-to">
                    <label>Assign To</label>
                    <div class="ui input left icon">
                        <i class="user icon"></i>
                        <input type="text" name="log-task-to" placeholder="">
                    </div>
                </div>

                <div class="two fields">
                    <div class="ui calendar field" id="log-task-date">
                        <label>Due Date</label>
                        <div class="ui input left icon">
                            <i class="calendar icon"></i>
                            <input type="text" name="log-task-date" placeholder="">
                        </div>
                    </div>
                    <div class="ui calendar field" id="log-task-time">
                        <label>Due Time</label>
                        <div class="ui input left icon">
                            <i class="time icon"></i>
                            <input type="text" name="log-task-time" placeholder="">
                        </div>
                    </div>
                </div>
                <div class="field" id="log-task-status">
                    <label>Task Status</label>
                    <div class="inline fields">
                        <div class="field" id="log-task-status-open">
                            <div class="ui radio checkbox">
                                <input type="radio" name="log-task-status" class="hidden" value="Open" checked="">
                                <label><i class="icon clipboard check"></i><span>Open</span></label>
                            </div>
                        </div>
                        <div class="field" id="log-task-status-finished">
                            <div class="ui radio checkbox">
                                <input type="radio" name="log-task-status" class="hidden" value="Finished">
                                <label><i class="icon checkmark"></i><span>Finished</span></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field" id="log-task-transcript">
                    <label>Task Description</label>
                    <textarea name="log-task-transcript"></textarea>
                </div>
                <div class="ui error message">
                    <div class="header">Missing Form Fields</div>
                    <p>Please fill out all required fields</p>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="log-task-exit">
                <i class="icon cancel"></i><span>Exit</span>
            </div>
            <div class="ui inverted red button negative left floated" id="log-task-delete">
                <i class="icon trash"></i><span>Delete</span>
            </div>
            <div class="ui inverted green button positive" id="log-task-save">
                <i class="icon save"></i><span>Save</span>
            </div>
        </div>
    </div>
    <div class="ui small modal" id="modal-log-sale">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon dollar"></i><span>Sale Details</span>
        </div>
        <div class="content">
            <form class="ui form">
                <div class="field" id="log-sale-item">
                    <label>Sale Item</label>
                    <input type="text" name="log-sale-item" placeholder="Add Product/Service Description">
                </div>
                <div class="two fields">
                    <div class="field" id="log-sale-price">
                        <label>Sale Price</label>
                        <div class="ui input left icon">
                            <i class="dollar icon"></i>
                            <input type="number" name="log-sale-price" placeholder="">
                        </div>
                    </div>
                    <div class="field" id="log-sale-type">
                        <label>Sale Type</label>
                        <div class="inline fields">
                            <div class="field" id="log-sale-type-one">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="log-sale-type" class="hidden" value="One-Time" checked="">
                                    <label>One-Time</label>
                                </div>
                            </div>
                            <div class="field" id="log-sale-type-monthly">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="log-sale-type" class="hidden" value="Monthly">
                                    <label>Monthly</label>
                                </div>
                            </div>
                            <div class="field" id="log-sale-type-annually">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="log-sale-type" class="hidden" value="Annually">
                                    <label>Annually</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field" id="log-sale-status">
                    <label>Sale Status</label>
                    <div class="inline fields">
                        <div class="field" id="log-sale-status-sold">
                            <div class="ui radio checkbox">
                                <input type="radio" name="log-sale-status" class="hidden" value="Successful Sale" checked="">
                                <label><i class="icon dollar"></i><span>Successful Sale</span></label>
                            </div>
                        </div>
                        <div class="field" id="log-sale-status-active">
                            <div class="ui radio checkbox">
                                <input type="radio" name="log-sale-status" class="hidden" value="Active Opportunity">
                                <label><i class="icon trophy"></i><span>Active Opportunity</span></label>
                            </div>
                        </div>
                        <div class="field" id="log-sale-status-lost">
                            <div class="ui radio checkbox">
                                <input type="radio" name="log-sale-status" class="hidden" value="Lost Opportunity">
                                <label><i class="icons"><i class="icon trophy"></i><i class="icon corner cancel"></i></i><span>Lost Opportunity</span></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ui error message">
                    <div class="header">Missing Form Fields</div>
                    <p>Please fill out all required fields</p>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="log-sale-exit">
                <i class="icon cancel"></i><span>Exit</span>
            </div>
            <div class="ui inverted green button positive" id="log-sale-save">
                <i class="icon save"></i><span>Save</span>
            </div>
        </div>
    </div>
    <div class="ui small modal" id="modal-message">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon envelope"></i><span>Message Details</span>
        </div>
        <div class="scrolling content">
            <form class="ui form">
                <div class="field" id="modal-message-target">
                    <label></label>
                    <span></span>
                </div>
                <div class="field" id="modal-message-content-field">
                    <label>Message:</label>
                    <div id="modal-message-content"></div>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui inverted green button positive" id="modal-message-exit">
                <i class="icon log out"></i><span>Back to Lead</span>
            </div>
        </div>        
    </div>
    <div class="ui small modal" id="modal-sms">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon comment"></i><span>SMS Details</span>
        </div>
        <div class="scrolling content">
            <form class="ui form">
                <div class="field" id="sms-message">
                    <label>Message</label>
                    <textarea name="sms-message"></textarea>
                </div>
                <div class="ui error message">
                    <div class="header">Empty Message</div>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="sms-exit">
                <i class="icon cancel"></i><span>Exit</span>
            </div>
            <div class="ui inverted green button positive" id="sms-send">
                <i class="icon comment"></i><span>Send SMS</span>
            </div>
        </div>
    </div>
    
    <?php include "inc/modal-lead.php" ?>
    <?php include "inc/modal-field.php" ?>
    <?php include "inc/modal-field-delete.php" ?>
    <?php include "inc/modal-write.php" ?>
    <?php include "inc/modal-add-link.php" ?>
    <?php include "inc/modal-templates.php" ?>
    <!--END OF MODALS-->

    <div class="ui main page dimmer">
        <div class="ui loader"></div>
    </div>

    <!--SCRIPTS-->
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
    <!--URL PARSING-->
    <script src="js/url-parse.js"></script>
    <!--CALENDAR UI-->
    <script src="semantic/dist/components/calendar.min.js"></script>
    <!--TABLE SORTER-->
    <script src="node_modules/tablesorter/dist/js/jquery.tablesorter.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-month.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-weekday.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-two-digit-year.min.js"></script>
    <!--CODEMIRROR-->
    <script src="node_modules/codemirror/lib/codemirror-full.min.js" async></script>
    <!--CODE INDENTATION-->
    <script src="node_modules/indent.js/lib/indent.min.js"></script>
    <!--SCREEN CAPTURE-->
    <script src="node_modules/html2canvas/dist/html2canvas.min.js" async></script>
    <!--APP-->
    <script src="js/ui-toolbar.js"></script>
    <script src="js/ui-cf.js"></script>
    <script src="js/sui-rating.js"></script>
    <script src="js/lead.js"></script>
    <script src="js/mail-composer.js"></script>

  </body>
</html>