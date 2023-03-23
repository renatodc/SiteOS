<div id="ui-header">

    <div class="ui-right">

        <div id="ui-bar">
            <a href="#" class="ui icon button inverted red" id="range-clear">
                <i class="icon trash"></i>
                <span>Clear</span>
            </a>
            <a href="#" class="ui icon button inverted principal" id="range-refresh">
                <i class="icon refresh"></i>
                <span>Refresh</span>
            </a>

            <div class="ui form" id="ui-range">
                <div class="two fields">
                    <div class="field">
                        <div class="ui calendar" id="range-start">
                            <div class="ui input left icon">
                                <i class="calendar icon"></i>
                                <input type="text" placeholder="Start Date">
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui calendar" id="range-end">
                            <div class="ui input left icon">
                                <i class="calendar icon"></i>
                                <input type="text" placeholder="End Date">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php include "ui-head.php" ?>