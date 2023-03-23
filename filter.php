<?php include "php-head.php" ?>
<?php include "html-head.php" ?>
    <!--CSS-->
    <link type="text/css" rel="stylesheet" href="node_modules/tablesorter/dist/css/theme.default.css" />
    <!--APP-->
    <link type="text/css" rel="stylesheet" href="css/filter.css">
    
  </head>

  <body>
    <!--HEADER-->
    <?php include "ui-bar-filter.php" ?>
    <!--END OF HEADER-->

    <!--BODY-->
    <div class="ui-body">

        <!-- LEFT MENU -->
        <div class="ui-left">
            <?php include "ui-menu.php" ?>
        </div>

        <!-- MAIN SCREEN -->
        <div class="ui-center">
            <table class="ui-table">
                <thead>
                    <tr>
                        <th id="filter-th-filter">Filter</th>
                        <th id="filter-th-type">Type</th>
                        <th id="filter-th-scope">Scope</th>
                        <th class="col-icon"><i class="icon trash"></i></th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <div class="no-data">
                <p>No blocked emails</p>
            </div>
        </div>

    </div>
    <!--END OF BODY-->
    <div class="ui small modal" id="modal-add-filter">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon ban"></i><span>Add Filter</span>
        </div>
        <div class="content">
            <div class="ui form filterform">
                <div class="two fields">
                    <div class="field" id="filter-statement-field">
                        <label>Filter</label>
                        <div class="ui input left icon" id="filter-add-field">
                            <i class="envelope icon"></i>
                            <input type="text" id="filter-statement" placeholder="Type in email or domain to block...">
                        </div>
                    </div>    
                    <div class="field" id="filter-scope-field">
                        <label>Scope</label>
                        <div class="inline fields" id="filter-scope">
                            <div class="field" id="filter-scope-personal">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="filter-scope" value="Personal" checked="">
                                    <label>Personal Filter</label>
                                </div>
                            </div>
                            <div class="field" id="filter-scope-company">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="filter-scope" value="Company">
                                    <label>Company Filter</label>
                                </div>
                            </div>
                        </div> 
                    </div> 
                </div>                
                <div class="ui error message">
                    <h1>Invalid filter format</h1>
                    <p>Please type in a valid filter statement.</p>
                </div>         
                <div class="ui warning message">
                    <h1>Empty Filter</h1>
                    <p>Missing filter statement.</p>
                </div>
            </div>
            <div class="ui info message">
                <div class="header">Filter Guide</div>
                <p>To filter a specific email address, type in a full email address, for example: <b>user@domain.com</b>
                    <br />
                    You may also filter an entire domain, by excluding the @ sign. For example, adding <b>domain.com</b> will filter all incoming emails from anyone with an email address from <b>domain.com</b>.
                    <br />
                    You may also use wildcards. For example, adding <b>*domain.com</b>, will filter all incoming emails from anyone with an email address that ends in <b>domain.com</b>
                </p>
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="filter-exit">
                <i class="icon delete"></i>
                <span>Exit</span>
            </div>
            <div class="ui inverted orange button" id="add-filter-save">
                <i class="icon plus"></i>
                <span>Add Filter</span>
            </div>
        </div>
    </div>
    <!--END OF MODALS-->

    <div class="ui page dimmer">
        <div class="ui loader"></div>
    </div>

    <input type="hidden" id="st" value="<?=$_SESSION["st"];?>" />
    <!--TABLE SORTER-->
    <script src="node_modules/tablesorter/dist/js/jquery.tablesorter.min.js"></script>
    <!--APP-->
    <script src="js/filter.js"></script>

  </body>
</html>