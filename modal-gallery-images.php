<div class="ui modal" id="modal-gallery">
    <i class="close icon"></i>
    <div class="header">
        <i class="icon image"></i><span>Image Gallery</span>
    </div>
    <div class="content">
        <div id="context">
            <div class="ui secondary menu">
                <a class="item" data-tab="stockphotos" id="gallery-tab-stockphotos"><i class="icon camera retro"></i><span>Stock Photos</span></a>
                <a class="item" data-tab="gallery" id="gallery-tab-gallery"><i class="icon image"></i><span>My Images</span></a>
            </div>
            <div class="ui tab segment" data-tab="stockphotos" id="gallery-stockphotos">
                <div class="ui input action" id="gallery-stockphotos-search">
                    <input type="text" name="gallery-stockphotos-search" placeholder="Search categories" />
                    <div class="ui icon button">
                        <i class="icon search"></i>
                    </div>
                </div>
                <div class="gallery">
                </div>
                <div class="ui segment" id="gallery-stockphotos-load">
                    <div class="ui active inverted dimmer">
                        <div class="ui text loader">Loading</div>
                    </div>
                    <p></p>
                </div>
            </div>
            <div class="ui tab segment" data-tab="gallery" id="gallery-gallery">
                <div class="gallery">
                    <div>
                        <a href="#" id="gallery-upload">
                            <span><i class="icon add"></i>Add Image</span>
                            <div class="ui green active progress">
                                <div class="bar">
                                    <div class="progress"></div>
                                </div>
                                <div class="label">Uploading Image</div>
                            </div>
                            <input id="fileupload" type="file" name="files">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>