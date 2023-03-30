<div class="ui small modal" id="modal-write">
    <i class="close icon"></i>
    <div class="header">
        <i class="icon envelope"></i><span>Send Email</span>
    </div>
    <div class="scrolling content">
        <form class="ui form">
            <div class="two fields">
                <div class="field" id="modal-write-to">
                    <div class="ui fluid multiple search selection dropdown recipient rto" id="recipientTO">
                        <input name="tags" type="hidden">
                        <div class="default text">To</div>
                        <div class="menu">
                        </div>
                    </div>
                </div>
                <div class="field ccbuttons">
                    <div class="ui buttons">
                        <div class="ui button cc btn">CC</div>
                        <div class="or" data-text="or"></div>
                        <div class="ui button bcc btn">BCC</div>
                    </div>
                </div>
            </div>
            <div class="two fields extrarecipients">
                <div class="field" id="modal-write-cc">
                    <div class="ui fluid multiple search selection dropdown recipient rcc" id="recipientCC">
                        <input name="tags" type="hidden">
                        <div class="default text">CC</div>
                        <div class="menu">
                        </div>
                    </div>
                </div>
                <div class="field" id="modal-write-bcc">
                <div class="ui fluid multiple search selection dropdown recipient rbcc" id="recipientBCC">
                    <input name="tags" type="hidden">
                    <div class="default text">BCC</div>
                    <div class="menu">
                    </div>
                </div>
            </div>
            </div>
            <div class="field" id="modal-write-subject">
                <div class="ui input">
                    <input type="text" name="modal-write-subject" placeholder="Subject" tabindex="1">
                </div>
            </div>
            <div class="field write-message">
                <a href="#" class="btn tb-html"><i class="icon code"></i><span>Plain / HTML</span></a>
                <div contenteditable="true" class="modal-write-message ui-message" id="modal-write-message" tabindex="2"></div>
                <?php include "ui-toolbar-content.php" ?>
            </div>
            <div class="field" id="modal-write-attachments">
                <label>Attachments</label>
            </div>
            <div class="ui error message">
                <div class="header">Missing Email Fields</div>
                <p>Please fill out all required fields</p>
            </div>
        </form>
    </div>
    <div class="actions">
        <div class="ui inverted red button negative" id="modal-write-discard">
            <i class="icon delete"></i><span>Exit</span>
        </div>
        <div class="ui inverted principal button positive" id="modal-write-save">
            <i class="icon edit"></i><span>Save</span>
        </div>
        <div class="ui inverted green button positive" id="modal-write-send" tabindex="3">
            <i class="icon send"></i><span>Send</span>
        </div>
    </div>
    <div class="ui dimmer save-template">
        <div class="ui medium text loader">Saving Template</div>
    </div>
    <div class="ui dimmer save-template2">
        <div class="ui medium text loader">Saving Template</div>
    </div>
    <div class="ui dimmer save-message">
        <div class="ui medium text loader">Saving Message</div>
    </div>
    <div class="ui dimmer send-message">
        <div class="ui medium text loader">Sending Message</div>
    </div>
</div>