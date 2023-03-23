<div id="ui-header">

    <div class="ui-right">

        <div id="ui-bar">
            <!-- BUTTONS (FLUSH RIGHT) -->
            <a href="#" class="ui icon button inverted red" id="mail-delete" style="display: none">
                <i class="icon trash"></i>
                <span style="color: #FFFFFF">Delete All</span>
            </a>
            <a href="#" class="ui icon button inverted orange" id="mail-spam" data-tooltip="Mark all as Spam" data-inverted="" data-position="bottom center" style="display: none">
                <i class="icon ban"></i>
            </a>
            <div id="mail-move" class="ui selection dropdown">
                <input type="hidden" name="template">
                <i class="dropdown icon"></i>
                <div class="default text">Move all to</div>
                <div class="menu">
                </div>
            </div>
            <a href="#" class="ui icon button inverted principal" id="mail-new" data-tooltip="Mark all as New" data-inverted="" data-position="bottom center" style="display: none">
                <i class="icon hide"></i>
            </a>
            <a href="#" class="ui icon button inverted principal" id="mail-sync" data-tooltip="Sync" data-inverted="" data-position="bottom center">
                <i class="icon refresh"></i>
            </a>
            <a href="#" class="ui icon button inverted green" id="mail-send">
                <i class="icon send"></i>
                <span style="color: #FFFFFF">Compose</span>
            </a>
            <!-- SEARCH (FLUSH LEFT) -->
            <div id="ui-search">
                <div class="ui small icon input">
                    <input type="text" placeholder="Search..."><i class="search icon"></i>
                </div>
            </div>
            <div id="ui-counters" class="one">
                <div id="ui-counter-total"></div>
                <div id="ui-counter-selected"></div>
            </div>
        </div>

        <?php include "ui-head.php" ?>