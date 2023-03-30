<div class="ui modal" id="modal-videos">
    <i class="close icon"></i>
    <div class="header">
        <i class="icon video"></i><span>Video Gallery</span>
    </div>
    <div class="content">
        <div class="ui secondary menu">
            <a class="item" data-tab="myvideos" id="videos-tab-myvideos"><i class="icon video"></i><span>My Videos</span></a>
            <a class="item" data-tab="embed" id="videos-tab-embed"><i class="icon code"></i><span>Embed</span></a>
        </div>
        <div class="ui tab segment" data-tab="myvideos" id="videos-myvideos">
            <div class="gallery">
                <div>
                    <a href="#" id="videos-upload">
                        <span><i class="icon add"></i>Add Video</span>
                        <div class="ui green active progress">
                            <div class="bar">
                                <div class="progress"></div>
                            </div>
                            <div class="label">Uploading Video</div>
                        </div>
                        <input id="videoupload" type="file" name="files">
                    </a>
                </div>
            </div>
        </div>
        <div class="ui tab segment" data-tab="embed" id="videos-embed">
            <div class="ui form">
                <div class="field" id="videos-embed-code">
                    <textarea type="text" placeholder="Place embed code here"></textarea>
                </div>
                <div class="ui error message">
                    <div class="header">Invalid Embed Code</div>
                    <p>Please enter a valid embed snippet</p>
                </div>
                <img src="img/icons/ban.png" id="videos-embed-thumb" />
                <button class="ui button"><span>Place Video</span></button>
            </div>
        </div>
    </div>
</div>