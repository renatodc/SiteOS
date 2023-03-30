<?php include "php-head.php" ?>
<?php include "html-head.php" ?>
<?php 

if(array_key_exists("list",$_GET) && !empty($_GET["list"])) {
    $key = $_GET["list"];
    $filter = " WHERE UUID = :UUID AND CompanyUUID = :CompanyUUID";
    $query = "SELECT IsAdmin FROM LeadList" . $filter;
    $sql = $pdo->prepare($query);
    $sql->bindValue(':UUID',$key);
    $sql->bindValue(':CompanyUUID',$CompanyUUID);
    $sql->execute();
    $row = $sql->fetch();
    if(intval($row["IsAdmin"]) == 1 && intval($isOwner) == 0) {        
        header("Location:/mail");
    }
}

?>

    <!--CSS-->
    <link type="text/css" rel="stylesheet" href="node_modules/tablesorter/dist/css/theme.default.css" />
    <!--CALENDAR UI-->
    <link type="text/css" rel="stylesheet" href="semantic/dist/components/calendar.min.css">
    <!--APP-->
    <link type="text/css" rel="stylesheet" href="css/ui-cf.css">
    <link type="text/css" rel="stylesheet" href="css/leads.css" />
    
  </head>

  <body>
    <!--HEADER-->
    <?php include "inc/ui-bar-leads.php" ?>
    <!--END OF HEADER-->

    <!--BODY-->
    <div class="ui-body">

      <!-- LEFT MENU -->
      <div class="ui-left">

          <?php include "ui-menu.php" ?>

      </div>

      <!-- MAIN SCREEN -->
      <div class="ui-center">
        <div class="leads-bar">
            <a class="btn" id="leads-export" href="#"><i class="icon upload"></i><span>Export Leads</span></a>
            <a class="btn" id="leads-import" href="#"><i class="icon download"></i><span>Import Leads</span></a>
            <a class="btn" id="leads-columns" href="#"><i class="icon columns"></i><span>Change Columns</span></a>
            <a class="btn" id="leads-remove" href="#"><i class="icon minus square"></i><span>Remove from List</span></a>
            <a class="btn" id="leads-list" href="#"><i class="icon list layout"></i><span>Add to List</span></a>
            <!--SEARCH BAR-->
            <div class="leads-search">
                <div class="ui small icon input" id="leads-search">
                    <input type="text" placeholder="Search...">
                    <i class="search icon"></i>
                </div>
                <a class="btn" id="leads-savesearch" href="#" style="float: none;"><i class="icon save"></i><span>Save Search</span></a>
            </div>
            <div class="counters">
                <span class="leads-data" id="leads-total-counter"></span>
                <span class="leads-data" id="leads-selected-counter"></span>
            </div>
        </div>
        <div class="docker">
            <table class="ui-table">
                <thead>
                    <tr>
                        <th class="col-head-check" data-sorter="false"><div class='ui fitted checkbox'><input type='checkbox' class='hidden'/></div></th>
                        <th class="col-company" style="min-width: 230px"><span>Name</span></th>
                        <th class="col-contactname" style="min-width: 230px"><span>Contact</span></th>
                        <th class="col-contactemail" style="min-width: 230px"><span>Contact Email</span></th>
                        <th class="col-status" style="min-width: 130px"><span>Status</span></th>
                        <th class="col-location" style="min-width: 130px"><span>Location</span></th>
                        <th class="col-source" style="min-width: 130px"><span>Source</span></th>
                        <th class="col-datecreated sorter-mmddyy" style="min-width: 130px"><span>Date Created</span></th>
                        <th class="col-datemodified sorter-mmddyy" style="min-width: 130px"><span>Last Modified</span></th>
                        <th class="col-lastaction" style="min-width: 170px"><span>Last Action</span></th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
        <div class="no-data">
          <p>No leads available</p>
        </div>
        <div class="loader">
          <div class='ui data inverted dimmer'><div class='ui loader'></div></div>
        </div>
      </div>

    </div>
    <!--END OF BODY-->

    <div id="dragSelection"></div>

    <!--MODALS-->

    <div class="ui tiny modal" id="modal-import">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon download"></i><span>Import Leads</span>
        </div>
        <div class="content">
            <div class="ui form">
                <div class="field" id="modal-import-file">
                    <label>CSV File</label>
                    <div class="ui action input">
                        <input type="text" id="import-name" readonly>
                        <label for="import-file" class="ui blue button">
                            <i class="search icon" style="margin-bottom: 5px"></i>
                            <span>Browse</span>
                        </label>
                        <input type="file" id="import-file" accept=".csv">
                    </div>
                </div>
                <div class="ui error message">
                    <h1>CSV File Missing</h1>
                    <p>Please upload a CSV file before importing.</p>
                </div>
                <div class="ui warning message">
                    <h1>CSV Parsing Error</h1>
                    <p>There was an error processing the CSV file.</p>
                </div>
                <div class="ui green active progress" style="margin-top: 20px;">
                    <div class="bar">
                        <div class="progress"></div>
                    </div>
                    <div class="label">Importing <span>CSV</span></div>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted principal button left floated" id="import-tips">
                <i class="icon cubes"></i>
                <span>Download Schema</span>
            </div>
            <div class="ui inverted green button" id="import-start">
                <i class="icon download"></i>
                <span>Begin import</span>
            </div>
        </div>
    </div>

    <div class="ui tiny modal" id="modal-list">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon list layout"></i><span>Add to List</span>
        </div>
        <div class="content">
            <div class="ui form">
                <div class="two fields" id="list-type-existing">
                    <div class="field" style="line-height: 36px" id="list-existing">
                        <div class="ui radio checkbox">
                            <input type="radio" name="list-type" class="hidden" value="Existing List">
                            <label>Add to Existing List</label>
                        </div>
                    </div>
                    <div class="field" id="list-select">
                        <select class="ui dropdown" name="list-select">
                        </select>
                    </div>
                </div>
                <div class="two fields" id="list-type-new">
                    <div class="field" style="line-height: 36px" id="list-new">
                        <div class="ui radio checkbox">
                            <input type="radio" name="list-type" class="hidden" value="New List">
                            <label>Add to New List</label>
                        </div>
                    </div>
                    <div class="field" style="" id="list-type-new-field">
                        <div class="ui input left icon" id="list-name">
                            <i class="list layout icon"></i>
                            <input type="text" name="list-name" placeholder="">
                        </div>
                    </div>
                </div>

                <div class="ui error message">
                    <h1>Invalid List Name</h1>
                    <p>Please type in a valid name for your new list.</p>
                </div>
                <div class="ui warning message">
                    <h1>List Name Already Exists</h1>
                    <p>Please type in a different name for your new list.</p>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted green button positive" id="list-add">
                <i class="icon plus"></i>
                <span>Add Leads to List</span>
            </div>
        </div>
    </div>

    <div class="ui tiny modal" id="modal-list-detail">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon list layout"></i><span>List Details</span>
        </div>
        <div class="content">
            <div class="ui form" style="">
                <div class="field" id="list-detail-name">
                    <label>Name</label>
                    <div class="ui input left icon">
                        <i class="icon list layout"></i>
                        <input type="text" name="list-detail-name" placeholder="" />
                    </div>
                </div>
                <div class="ui error message">
                    <h1>Invalid List Name</h1>
                    <p>Please type in a valid name for your list.</p>
                </div>
                <div class="ui warning message">
                    <div class='header'>List Name Already Exists</div>
                    <p>Please type in a different name for your list.</p>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="list-detail-delete">
                <i class="icon cancel"></i>
                <span>Delete</span>
            </div>
            <div class="ui inverted green button positive" id="list-detail-save">
                <i class="icon save"></i>
                <span>Save</span>
            </div>
        </div>
    </div>

    <div class="ui tiny basic modal" id="modal-list-delete-confirm">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon list layout"></i><span>Delete List</span>
        </div>
        <div class="content">
            <p>Are you sure you would like to delete this lead list?</p>
        </div>
        <div class="actions">
            <div class="ui left floated red button negative" id="modal-list-delete-confirm-no">
                <i class="icon cancel"></i>
                <span>No</span>
            </div>
            <div class="ui green button positive" id="modal-list-delete-confirm-yes">
                <i class="icon checkmark"></i>
                <span>Yes</span>
            </div>
        </div>
    </div>

    <div class="ui tiny modal" id="modal-add-folder">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon list layout"></i><span>Add List</span>
        </div>
        <div class="content">
            <div class="ui form">
                <div class="field add-folder-name-field">
                    <div class="ui input left icon" id="add-folder-name">
                        <i class="list layout icon"></i>
                        <input type="text" name="add-folder-name" placeholder="List Name">
                    </div>
                </div>
                <div class="ui error message">
                    <h1>List Name Missing</h1>
                    <p>Please type in a name for your new list.</p>
                </div>
                <div class="ui warning message">
                    <h1>List Name Already Exists</h1>
                    <p>Please type in a different name for your new list.</p>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted green button positive" id="add-folder-save">
                <i class="icon plus"></i>
                <span>Add List</span>
            </div>
        </div>
    </div>

    <div class="ui tiny modal" id="modal-columns">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon setting"></i><span>Show/Hide Columns</span>
        </div>
        <div class="content">
            <div class="ui form">
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-company">
                        <input type="checkbox" name="modal-col-company" data-name='company'>
                        <label>Company Name</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-contactname">
                        <input type="checkbox" name="modal-col-contactname" data-name='contactname'>
                        <label>Contact</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-contactemail">
                        <input type="checkbox" name="modal-col-contactemail" data-name='contactemail'>
                        <label>Contact Email</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-status">
                        <input type="checkbox" name="modal-col-status" data-name='status'>
                        <label>Status</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-location">
                        <input type="checkbox" name="modal-col-location" data-name='location'>
                        <label>Location</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-source">
                        <input type="checkbox" name="modal-col-source" data-name='source'>
                        <label>Source</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-datecreated">
                        <input type="checkbox" name="modal-col-datecreated" data-name='datecreated'>
                        <label>Date Created</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-datemodified">
                        <input type="checkbox" name="modal-col-datemodified" data-name='datemodified'>
                        <label>Last Modified</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui toggle checkbox" id="modal-col-lastaction">
                        <input type="checkbox" name="modal-col-lastaction" data-name='lastaction'>
                        <label>Last Action</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted green button positive" id="modal-columns-save">
                <i class="icon save"></i>
                <span>Save</span>
            </div>
        </div>
    </div>

    <div class="ui tiny modal" id="modal-emailer">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon envelope"></i><span>Email Leads</span>
        </div>
        <div class="content">
            <p>For every lead selected, would you like to reach only the primary contacts or all contacts available?</p>
        </div>
        <div class="actions">
            <div class="ui inverted principal button negative" id="modal-emailer-primary">
                <i class="icon user"></i>
                <span>Primary Contacts Only</span>
            </div>
            <div class="ui inverted green button positive" id="modal-emailer-all">
                <i class="icon users"></i>
                <span>All Contacts</span>
            </div>
        </div>
    </div>

    <div class="ui small modal" id="modal-sms">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon comment"></i><span>SMS Details</span>
        </div>
        <div class="content">
            <div class="ui form">
                <div class="field" id="sms-message">
                    <label>Message</label>
                    <textarea name="sms-message"></textarea>
                </div>
                <div class="ui error message">
                    <div class="header">Empty Message</div>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted principal button negative" id="modal-sms-primary">
                <i class="icon user"></i>
                <span>Send SMS to Primary Contacts Only</span>
            </div>
            <div class="ui inverted green button positive" id="modal-sms-all">
                <i class="icon users"></i>
                <span>Send SMS to All Contacts</span>
            </div>
        </div>
    </div>
    
    <div class="ui tiny modal" id="modal-merge">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon random"></i><span>Merge Leads</span>
        </div>
        <div class="content">
            <div class="ui form">
                <div class="field" id="modal-merge-field">
                    <label>Merge Into</label>
                    <div class="ui selection dropdown" id="modal-merge-dd">
                        <input type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Lead</div>
                        <div class="menu">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted green button positive" id="modal-merge-confirm">
                <i class="icon checkmark"></i><span>Merge</span>
            </div>
        </div>
    </div>

    <?php include "inc/modal-info.php" ?>
    <?php include "inc/modal-lead.php" ?>
    <?php include "inc/modal-field.php" ?>
    <?php include "inc/modal-field-delete.php" ?>
    <!--END OF MODALS-->

    <div class="ui main page dimmer">
        <div class="ui loader"></div>
    </div>

    <!--JS-->
    <input type="hidden" id="st" value="<?=$_SESSION["st"];?>" />
    <!--CSV PARSER-->
    <script src="node_modules/papaparse/papaparse.min.js"></script>
    <!--DRAG & DROP-->
    <script src="node_modules/interact.js/dist/interact.min.js"></script>
    <!--DATE FORMATS-->
    <script src="node_modules/sugar-date/dist/sugar-dates.min.js"></script>
    <script src="js/helper-dates.js"></script>
    <!--TABLE SORTER-->
    <script src="node_modules/tablesorter/dist/js/jquery.tablesorter.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-month.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-weekday.min.js"></script>
    <script src="node_modules/tablesorter/dist/js/parsers/parser-date-two-digit-year.min.js"></script>
    <!--CALENDAR UI-->
    <script src="semantic/dist/components/calendar.min.js"></script>
    <!--APP-->
    <script src="js/ui-cf.js"></script>
    <script src="js/sui-rating.js"></script>
    <script src="js/leads.js"></script>

  </body>
</html>