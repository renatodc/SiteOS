<div id="ui-header">

    <div class="ui-right">

        <div id="ui-bar">
            <a href="#" class="ui icon button inverted red" id="leads-delete">
                <i class="icon trash"></i>
                <span>Delete</span>
            </a>
            <a href="#" class="ui icon button inverted orange" id="leads-merge">
                <i class="icon random"></i>
                <span>Merge</span>
            </a>
            <!-- <a href="#" class="ui icon button inverted green" id="leads-sms">
                <i class="icon comment"></i>
                <span>SMS</span>
            </a>
            <a href="#" class="ui icon button inverted green" id="leads-call">
                <i class="icon phone"></i>
                <span>Call</span>
            </a> -->
            <a href="#" class="ui icon button inverted green" id="leads-email">
                <i class="icon envelope"></i>
                <span>Send Broadcast</span>
            </a>
            <a href="#" class="ui icon button inverted green" id="leads-add">
                <i class="icon add"></i>
                <span>Add Lead</span>
            </a>
            <div class="lead-status">
                <div class="ui selection dropdown">
                    <input type="hidden">
                    <i class="dropdown icon"></i>
                    <div class="default text">Change Status</div>
                    <div class="menu">
                        <div class="item" data-value="Prospect">Prospect</div>
                        <div class="item" data-value="Interested">Interested</div>
                        <div class="item" data-value="Ready to Buy">Ready to Buy</div>
                        <div class="item" data-value="Customer">Customer</div>
                        <div class="item" data-value="Not Interested">Not Interested</div>
                        <div class="item" data-value="Blacklisted">Blacklisted</div>
                    </div>
                </div>
            </div>
        </div>

        <?php include "ui-head.php" ?>