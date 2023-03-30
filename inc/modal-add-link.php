<div class="ui small modal" id="modal-add-link">
    <i class="close icon"></i>
    <div class="header">
        <i class="linkify icon"></i><span>Add Link</span>
    </div>
    <div class="content">
        <div class="ui form">

            <div class="ui grid">
                <div class="eight wide column">

                    <div class="grouped fields" id="add-link-type">
                        <label>Link Type</label>
                        <div class="field">
                            <div class="ui radio checkbox" id="add-link-type-web">
                                <input type="radio" name="add-link-type" class="hidden" value="Web" checked="">
                                <label>Web</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui radio checkbox" id="add-link-type-email">
                                <input type="radio" name="add-link-type" class="hidden" value="Email">
                                <label>Email</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui radio checkbox" id="add-link-type-document">
                                <input type="radio" name="add-link-type" class="hidden" value="Document">
                                <label>Document</label>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="eight wide column">

                    <div class="field" id="add-link-text-field">
                        <label>Link Text</label>
                        <div class="ui input left icon" id="add-link-text">
                            <i class="linkify icon"></i>
                            <input type="text" name="add-link-text" placeholder="">
                        </div>
                    </div>
                    <div class="field" id="add-link-url-field">
                        <label>Link URL</label>
                        <div class="ui input left icon" id="add-link-url">
                            <i class="world icon"></i>
                            <input type="text" name="add-link-url" placeholder="">
                        </div>
                    </div>
                    <div class="field" id="add-link-newtab-field">
                        <div class="ui checkbox" id="add-link-newtab">
                            <input type="checkbox" name="add-link-newtab" class="hidden" value="New Tab">
                            <label>Open in new tab</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ui error message">
                <div class="header">Missing Link Fields</div>
                <p>Please fill in all link fields</p>
            </div>
        </div>
    </div>
    <div class="actions">
        <div class="ui inverted red button negative left floated" id="add-link-exit">
            <i class="icon cancel"></i><span>Exit</span>
        </div>
        <div class="ui inverted green button" id="add-link-save">
            <i class="icon add"></i><span>Add Link</span>
        </div>
    </div>
</div>