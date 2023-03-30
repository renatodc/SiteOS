<div class="ui small modal" id="modal-detail">
    <i class="close icon"></i>
    <div class="header">
        <i class="icon user"></i><span>Lead Details</span>
    </div>
    <div class="scrolling content">
        <div class="ui form">
            <div class="leadcf">
                <div class="two fields">
                    <div class="field" id="detail-name">
                        <label>Name</label>
                        <div class="ui input left icon">
                            <i class="icon building"></i>
                            <input type="text" name="detail-name" placeholder="Company/Organization" />
                        </div>
                    </div>
                    <div class="field" id="detail-location">
                        <label>Location</label>
                        <div class="ui input left icon">
                            <i class="icon marker"></i>
                            <input type="text" name="detail-location" placeholder="" />
                        </div>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field" id="detail-source">
                        <label>Source</label>
                        <div class="ui input left icon">
                            <i class="icon lab"></i>
                            <input type="text" name="detail-source" placeholder="" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="two fields">
                <div class="field" id="cf-add-field">
                    <a href="#" class="btn" id="cf-add">
                        <i class="icon add"></i><span>Add Field</span>
                    </a>
                </div>
            </div>
            <div class="ui error message">
                <div class="header">Fields Missing</div>
                <p>Please fill in all required fields.</p>
            </div>
        </div>
    </div>
    <div class="actions">
        <div class="ui inverted red button negative left floated" id="modal-detail-exit">
            <i class="icon cancel"></i><span>Exit</span>
        </div>
        <div class="ui inverted red button negative left floated" id="modal-detail-delete">
            <i class="icon trash"></i><span>Delete</span>
        </div>
        <div class="ui inverted principal button left floated" id="modal-detail-edit">
            <i class="icon browser"></i><span>Edit Fields</span>
        </div>
        <div class="ui inverted green button positive" id="modal-detail-save">
            <i class="icon save"></i><span>Save</span>
        </div>
    </div>
</div>