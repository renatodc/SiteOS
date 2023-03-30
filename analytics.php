<?php include "php-head.php" ?>
<?php include "html-head.php" ?>
    <link type="text/css" rel="stylesheet" href="node_modules/tablesorter/dist/css/theme.default.css" />
    <link type="text/css" rel="stylesheet" href="css/sui-accordion.css">
    <link type="text/css" rel="stylesheet" href="css/sui-table.css">
    <link type="text/css" rel="stylesheet" href="css/sui-calendar.css">
    <link type="text/css" rel="stylesheet" href="css/analytics.css">
    
  </head>

  <body>
    <!--HEADER-->
    <?php include "inc/ui-bar-analytics.php" ?>
    <!--END OF HEADER-->

    <!--BODY-->
    <div class="ui-body">

      <!-- LEFT MENU -->
      <div class="ui-left">
          <?php include "ui-menu.php" ?>
      </div>

      <!-- MAIN SCREEN -->
      <div class="ui-center">
        <div class="ui accordion">
            <div class="title active ui dividing header" id="header-uv">
                <i class="dropdown icon"></i><span><i class="icon user"></i></span><span id="header-uv-data"></span> <span id="header-uv-label">Users</span>
            </div>
            <div class="content active">
                <div id="box-uvchart">
                    <canvas id="data-uvchart"></canvas>
                </div>
            </div>
            <div class="title active ui dividing header" id="header-views">
                <i class="dropdown icon"></i><span><i class="icon eye"></i></span><span id="header-views-data"></span> <span id="header-views-label">Page Views</span>
            </div>
            <div class="content active">
                <div id="box-viewschart">
                    <canvas id="data-viewschart"></canvas>
                </div>
                <div id="box-views">
                    <table class="ui-table" id="data-views">
                        <thead>
                            <tr>
                                <th class="col-pagename"><span>Page Name</span></th>
                                <th class="col-views"><span>Views</span></th>
                                <th class="col-avgtime" data-tooltip="Average View Duration (mm:ss)" title="Average View Duration (mm:ss)" data-position="top right"><span>Avg</span></th>
                                <th class="col-maxtime" data-tooltip="Maximum View Duration (mm:ss)" title="Maximum View Duration (mm:ss)" data-position="top right"><span>Max</span></th>
                                <th class="col-mintime" data-tooltip="Minimum View Duration (mm:ss)" title="Minimum View Duration (mm:ss)" data-position="top right"><span>Min</span></th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <div class="no-data">
                        <p>No data available</p>
                    </div>
                </div>
            </div>
            <div class="title active ui dividing header" id="header-sources">
                <i class="dropdown icon"></i><span><i class="icon exchange"></i></span><span id="header-sources-data"></span><span id="header-sources-label">Traffic Sources</span>
            </div>
            <div class="content active">
                <div id="box-sources">
                    <table class="ui-table" id="data-sources">
                        <thead>
                            <tr>
                                <th class="col-source"><span>Traffic Source</span></th>
                                <th class="col-users"><span>Users</span></th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <div class="no-data">
                        <p>No data available</p>
                    </div>
                </div>
            </div>
            <div class="title active ui dividing header" id="header-statistics">
                <i class="dropdown icon"></i><span><i class="icon pie chart"></i></span><span id="header-statistics-data"></span><span id="header-statistics-label">User Statistics</span>
            </div>
            <div class="content active">
                <div class="grid-stats">
                    <div id="box-countries">
                        <h1><i class="icon world"></i><span>Countries</span></h1>
                        <table class="ui-table" id="data-countries">
                            <thead>
                                <tr>
                                    <th class="col-country"><span>Country</span></th>
                                    <th class="col-uv"><span>Users</span></th>
                                    <th class="col-views"><span>Views</span></th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="no-data">
                            <p>No data available</p>
                        </div>
                    </div>
                    <div id="box-cities">
                        <h1><i class="icon map marker alternate"></i><span>Cities</span></h1>
                        <table class="ui-table" id="data-cities">
                            <thead>
                                <tr>
                                    <th class="col-city"><span>City</span></th>
                                    <th class="col-uv"><span>Users</span></th>
                                    <th class="col-views"><span>Views</span></th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="no-data">
                            <p>No data available</p>
                        </div>
                    </div>
                    <div id="box-languages">
                        <h1><i class="icon comment alternate"></i><span>Languages</span></h1>
                        <table class="ui-table" id="data-languages">
                            <thead>
                                <tr>
                                    <th class="col-language"><span>Language</span></th>
                                    <th class="col-uv"><span>Users</span></th>
                                    <th class="col-views"><span>Views</span></th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="no-data">
                            <p>No data available</p>
                        </div>
                    </div>
                </div>
                <div class="grid-stats">
                    <div id="box-browsers">
                        <h1><i class="icon window maximize outline"></i><span>Browsers</span></h1>
                        <table class="ui-table" id="data-browsers">
                            <thead>
                                <tr>
                                    <th class="col-browser"><span>Browser</span></th>
                                    <th class="col-uv"><span>Users</span></th>
                                    <th class="col-views"><span>Views</span></th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="no-data">
                            <p>No data available</p>
                        </div>
                    </div>
                    <div id="box-screensizes">
                        <h1><i class="icon desktop"></i><span>Screen Resolutions</span></h1>
                        <table class="ui-table" id="data-screensizes">
                            <thead>
                                <tr>
                                    <th class="col-screensize"><span>Screen Resolution</span></th>
                                    <th class="col-uv"><span>Users</span></th>
                                    <th class="col-views"><span>Views</span></th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="no-data">
                            <p>No data available</p>
                        </div>
                    </div>
                    <div id="box-platforms">
                        <h1><i class="icon hdd"></i><span>Platforms</span></h1>
                        <table class="ui-table" id="data-platforms">
                            <thead>
                                <tr>
                                    <th class="col-platform"><span>Platform</span></th>
                                    <th class="col-uv"><span>Users</span></th>
                                    <th class="col-views"><span>Views</span></th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="no-data">
                            <p>No data available</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

    </div>
    <!--END OF BODY-->

    <!--MODALS-->
    <div class="ui tiny basic modal" id="modal-clear-data-confirm">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon trash"></i><span>Clear Data</span>
        </div>
        <div class="content">
            <p>Are you sure you would like to clear analytics data for the given time range?</p>
        </div>
        <div class="actions">
            <div class="ui left floated red button negative" id="modal-clear-data-confirm-no">
                <i class="icon cancel"></i>
                <span>No</span>
            </div>
            <div class="ui green button positive" id="modal-clear-data-confirm-yes">
                <i class="icon checkmark"></i>
                <span>Yes</span>
            </div>
        </div>
    </div>
    <!--END OF MODALS-->
    <div class="ui main page dimmer">
        <div class="ui loader"></div>
    </div>

    <input type="hidden" id="st" value="<?=$_SESSION["st"];?>" />
    <!--TABLE SORTER-->
    <script src="node_modules/tablesorter/dist/js/jquery.tablesorter.min.js"></script>
    
    <!--CHART-->
    <script src="js/vendor/moment-with-locales.min.js"></script>
    <script src="js/vendor/chart.min.js"></script>

    <script src="js/sui-accordion.js"></script>
    <script src="js/sui-calendar.js"></script>
    <script src="js/analytics.js"></script>
  </body>
</html>