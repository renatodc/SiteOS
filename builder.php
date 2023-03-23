<?php

header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
header("Pragma: no-cache"); // HTTP 1.0.
header("Expires: 0"); // Proxies.

?>
<?php include "php-head.php" ?>
<?php include "html-head.php" ?>
    <!--COLOR-->
    <link rel="stylesheet" href="node_modules/spectrum-colorpicker/spectrum.css">

    <link rel="stylesheet" href="css/sui-accordion.css">
    <link rel="stylesheet" href="css/ui-toolbar.css">
    <link rel="stylesheet" href="css/ui-gallery.css">
    <link rel="stylesheet" href="css/ui-video.css">
    <!-- MONACO -->
    <!-- <link rel="stylesheet" data-name="vs/editor/editor.main" href="js/vendor/node_modules/monaco-editor/min/vs/editor/editor.main.css"> -->
    <link rel="stylesheet" data-name="vs/editor/editor.main" href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/editor/editor.main.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
    <!--APP-->
    <link rel="stylesheet" href="css/builder.css">
</head>
<body>
    <!--HEADER-->
    <?php include "ui-bar-builder.php" ?>
    <!--END OF HEADER-->

    <!--BODY-->
    <div class="ui-body">

        <!-- LEFT MENU -->
        <div class="ui-left">
            <?php include "ui-menu.php" ?>
        </div>

        <!-- MAIN SCREEN -->
        <div class="ui-center">
            <div class="ui segment page"> 
                <div class="ui dimmer">
                    <div class="ui text loader">Loading</div>
                </div>
                <iframe id="page-editor" src=""></iframe>
            </div>
            <div class="ui segment code"> 
                <div class="ui dimmer">
                    <div class="ui text loader">Loading</div>
                </div>
                <div id="code-editor"></div>
            </div>
            <div class="ui segment diff">
                <div id="diff-editor"></div>
            </div>
        </div>

        <div class="ui-right">
            <div class="ui accordion">
                <div class="title active" id="tm-page">
                    <i class="icon dropdown"></i><i class="icon file"></i><span>Page</span>
                </div>
                <div class="content active">
                    <div class="ui form">
                        <div class="field" id="tm-page-name">
                            <label>Name</label>
                            <div class="ui mini input">
                                <input type="text" />
                            </div>
                        </div>
                        <div class="field" id="tm-page-title">
                            <label>Title</label>
                            <div class="ui mini input">
                                <input type="text" />
                            </div>
                        </div>
                        <div class="field" id="tm-page-description">
                            <label>Description</label>
                            <div class="ui mini input">
                                <input type="text" />
                            </div>
                        </div>
                        <div class="field" id="tm-page-url">
                            <label>URL</label>
                            <div class="ui mini action input">
                                <input type="text" readonly />
                                <div class="ui mini icon button">
                                    <i class="copy icon"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="title active" id="tm-design">
                    <i class="icon dropdown"></i><i class="icon eye dropper"></i><span>Design</span>
                </div>
                <div class="content active">
                    <div class="ui form">
                    </div>
                </div>
                <div class="title" id="tm-link">
                    <i class="icon dropdown"></i><i class="icon linkify"></i><span>Link</span>
                </div>
                <div class="content">
                    <div class="ui form">
                        <div class="field" id="tm-link-url">
                            <label>URL</label>
                            <div class="ui mini input">
                                <input type="text" />
                            </div>
                        </div>
                        <div class="field" id="tm-link-newtab">
                            <div class="ui checkbox">
                                <input type="checkbox" class="hidden">
                                <label>Open in new tab</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="title" id="tm-listitem">
                    <i class="icon dropdown"></i><i class="icon list"></i><span>List Item</span>
                </div>
                <div class="content">
                    <div class="ui form">
                        <a href="#" class="btn" id="tm-listitem-dup"><i class="icon copy"></i><span>Duplicate</span></a>
                        <a href="#" class="btn" id="tm-listitem-del"><i class="icon cancel"></i><span>Remove</span></a>
                    </div>
                </div>
                <div class="title" id="tm-img">
                    <i class="icon dropdown"></i><i class="icon image"></i><span>Image</span>
                </div>
                <div class="content">
                    <div class="ui form">
                        <div id="tm-img-preview">
                            <img src="img/icons/pixel.png" />
                        </div>
                        <div class="field">
                            <a href="#" class="btn" id="tm-img-change"><i class="icon image"></i><span>Change Image</span></a>
                            <a href="#" class="btn" id="tm-img-remove"><i class="icon trash"></i><span>Remove Image</span></a>
                        </div>
                        <div class="field" id="tm-img-alt">
                            <label>Alternate Text</label>
                            <div class="ui mini input">
                                <input type="text" />
                            </div>
                        </div>
                        <a href="#" class="btn" id="tm-img-linkify"><i class="icon linkify"></i><span>Linkify</span></a>
                        <a href="#" class="btn" id="tm-img-to-video"><i class="icon video"></i><span>Change to Video</span></a>
                    </div>
                </div>
                <div class="title" id="tm-icon">
                    <i class="icon dropdown"></i><i class="icon star" id="tm-icon-preview"></i><span>Icon</span>
                </div>
                <div class="content">
                    <div class="ui form">
                        <!-- <div id="tm-icon-preview"> -->
                            <!-- <img src="img/icons/pixel.png" /> -->
                            <!-- <i class=""></i> -->
                        <!-- </div> -->
                        <h3 id="tm-icon-header-change">Change Icon</h3>
                        <div class="ui mini input left icon" id="tm-icon-filter">
                            <i class="icon search"></i>
                            <input type="text" />
                        </div>
                        <ul id="tm-icon-lib">
                            <li><i class="fab fa-facebook"></i></li>
                            <li><i class="fab fa-facebook-f"></i></li>
                            <li><i class="fab fa-facebook-square"></i></li>
                            <li><i class="fab fa-instagram"></i></li>
                            <li><i class="fab fa-instagram-square"></i></li>
                            <li><i class="fab fa-linkedin"></i></li>
                            <li><i class="fab fa-linkedin-in"></i></li>
                            <li><i class="fab fa-twitter"></i></li>
                            <li><i class="fab fa-twitter-square"></i></li>
                            <li><i class="fab fa-youtube"></i></li>
                            <li><i class="fab fa-youtube-square"></i></li>

                            <li><i class="fab fa-amazon"></i></li>
                            <li><i class="fab fa-angellist"></i></li>
                            <li><i class="fab fa-angular"></i></li>
                            <li><i class="fab fa-app-store"></i></li>
                            <li><i class="fab fa-app-store-ios"></i></li>
                            <li><i class="fab fa-apple"></i></li>
                            <li><i class="fab fa-audible"></i></li>
                            <li><i class="fab fa-aws"></i></li>
                            <li><i class="fab fa-behance"></i></li>
                            <li><i class="fab fa-behance-square"></i></li>
                            <li><i class="fab fa-bitcoin"></i></li>
                            <li><i class="fab fa-blogger"></i></li>
                            <li><i class="fab fa-blogger-b"></i></li>
                            <li><i class="fab fa-bootstrap"></i></li>
                            <li><i class="fab fa-btc"></i></li>
                            <li><i class="fab fa-deviantart"></i></li>
                            <li><i class="fab fa-discord"></i></li>
                            <li><i class="fab fa-dribbble"></i></li>
                            <li><i class="fab fa-dribbble-square"></i></li>
                            <li><i class="fab fa-flickr"></i></li>
                            <li><i class="fab fa-foursquare"></i></li>
                            <li><i class="fab fa-hackerrank"></i></li>
                            <li><i class="fab fa-imdb"></i></li>
                            <li><i class="fab fa-itunes-note"></i></li>
                            <li><i class="fab fa-medium"></i></li>
                            <li><i class="fab fa-medium-m"></i></li>
                            <li><i class="fab fa-pinterest"></i></li>
                            <li><i class="fab fa-pinterest-p"></i></li>
                            <li><i class="fab fa-pinterest-square"></i></li>
                            <li><i class="fab fa-quora"></i></li>
                            <li><i class="fab fa-reddit"></i></li>
                            <li><i class="fab fa-reddit-alien"></i></li>
                            <li><i class="fab fa-reddit-square"></i></li>
                            <li><i class="fab fa-skype"></i></li>
                            <li><i class="fab fa-snapchat"></i></li>
                            <li><i class="fab fa-snapchat-ghost"></i></li>
                            <li><i class="fab fa-snapchat-square"></i></li>
                            <li><i class="fab fa-soundcloud"></i></li>
                            <li><i class="fab fa-spotify"></i></li>
                            <li><i class="fab fa-stack-exchange"></i></li>
                            <li><i class="fab fa-stack-overflow"></i></li>
                            <li><i class="fab fa-tiktok"></i></li>
                            <li><i class="fab fa-tumblr"></i></li>
                            <li><i class="fab fa-tumblr-square"></i></li>
                            <li><i class="fab fa-twitch"></i></li>
                            <li><i class="fab fa-whatsapp"></i></li>
                            <li><i class="fab fa-whatsapp-square"></i></li>

                            <li><i class="fas fa-ad"></i></li>
                            <li><i class="fas fa-address-book"></i></li>
                            <li><i class="fas fa-address-card"></i></li>
                            <li><i class="fas fa-adjust"></i></li>
                            <li><i class="fas fa-align-justify"></i></li>
                            <li><i class="fas fa-angle-double-down"></i></li>
                            <li><i class="fas fa-angle-double-left"></i></li>
                            <li><i class="fas fa-angle-double-right"></i></li>
                            <li><i class="fas fa-angle-double-up"></i></li>
                            <li><i class="fas fa-angle-down"></i></li>
                            <li><i class="fas fa-angle-left"></i></li>
                            <li><i class="fas fa-angle-right"></i></li>
                            <li><i class="fas fa-angle-up"></i></li>
                            <li><i class="fas fa-ankh"></i></li>
                            <li><i class="fas fa-archive"></i></li>
                            <li><i class="fas fa-arrow-alt-circle-down"></i></li>
                            <li><i class="fas fa-arrow-alt-circle-left"></i></li>
                            <li><i class="fas fa-arrow-alt-circle-right"></i></li>
                            <li><i class="fas fa-arrow-alt-circle-up"></i></li>
                            <li><i class="fas fa-arrow-circle-down"></i></li>
                            <li><i class="fas fa-arrow-circle-left"></i></li>
                            <li><i class="fas fa-arrow-circle-right"></i></li>
                            <li><i class="fas fa-arrow-circle-up"></i></li>
                            <li><i class="fas fa-arrow-down"></i></li>
                            <li><i class="fas fa-arrow-left"></i></li>
                            <li><i class="fas fa-arrow-right"></i></li>
                            <li><i class="fas fa-arrow-up"></i></li>
                            <li><i class="fas fa-asterisk"></i></li>
                            <li><i class="fas fa-at"></i></li>
                            <li><i class="fas fa-atom"></i></li>
                            <li><i class="fas fa-award"></i></li>
                            <li><i class="fas fa-bahai"></i></li>
                            <li><i class="fas fa-balance-scale"></i></li>
                            <li><i class="fas fa-ban"></i></li>
                            <li><i class="fas fa-battery-full"></i></li>
                            <li><i class="fas fa-beer"></i></li>
                            <li><i class="fas fa-bell"></i></li>
                            <li><i class="fas fa-bezier-curve"></i></li>
                            <li><i class="fas fa-binoculars"></i></li>
                            <li><i class="fas fa-bolt"></i></li>
                            <li><i class="fas fa-book"></i></li>
                            <li><i class="fas fa-bookmark"></i></li>
                            <li><i class="fas fa-box"></i></li>
                            <li><i class="fas fa-boxes"></i></li>
                            <li><i class="fas fa-brain"></i></li>
                            <li><i class="fas fa-briefcase"></i></li>
                            <li><i class="fas fa-brush"></i></li>
                            <li><i class="fas fa-building"></i></li>
                            <li><i class="fas fa-bullhorn"></i></li>
                            <li><i class="fas fa-bullseye"></i></li>
                            <li><i class="fas fa-business-time"></i></li>
                            <li><i class="fas fa-calendar"></i></li>
                            <li><i class="fas fa-calendar-alt"></i></li>
                            <li><i class="fas fa-calendar-check"></i></li>
                            <li><i class="fas fa-calendar-day"></i></li>
                            <li><i class="fas fa-calendar-minus"></i></li>
                            <li><i class="fas fa-calendar-plus"></i></li>
                            <li><i class="fas fa-calendar-times"></i></li>
                            <li><i class="fas fa-calendar-week"></i></li>
                            <li><i class="fas fa-camera"></i></li>
                            <li><i class="fas fa-camera-retro"></i></li>
                            <li><i class="fas fa-cannabis"></i></li>
                            <li><i class="fas fa-car"></i></li>
                            <li><i class="fas fa-car-alt"></i></li>
                            <li><i class="fas fa-car-side"></i></li>
                            <li><i class="fas fa-caret-down"></i></li>
                            <li><i class="fas fa-caret-left"></i></li>
                            <li><i class="fas fa-caret-right"></i></li>
                            <li><i class="fas fa-caret-square-down"></i></li>
                            <li><i class="fas fa-caret-square-left"></i></li>
                            <li><i class="fas fa-caret-square-right"></i></li>
                            <li><i class="fas fa-caret-square-up"></i></li>
                            <li><i class="fas fa-caret-up"></i></li>
                            <li><i class="fas fa-cat"></i></li>
                            <li><i class="fas fa-chalkboard"></i></li>
                            <li><i class="fas fa-charging-station"></i></li>
                            <li><i class="fas fa-chart-area"></i></li>
                            <li><i class="fas fa-chart-bar"></i></li>
                            <li><i class="fas fa-chart-line"></i></li>
                            <li><i class="fas fa-chart-pie"></i></li>
                            <li><i class="fas fa-check"></i></li>
                            <li><i class="fas fa-check-circle"></i></li>
                            <li><i class="fas fa-check-double"></i></li>
                            <li><i class="fas fa-check-square"></i></li>
                            <li><i class="fas fa-chevron-circle-down"></i></li>
                            <li><i class="fas fa-chevron-circle-left"></i></li>
                            <li><i class="fas fa-chevron-circle-right"></i></li>
                            <li><i class="fas fa-chevron-circle-up"></i></li>
                            <li><i class="fas fa-chevron-down"></i></li>
                            <li><i class="fas fa-chevron-left"></i></li>
                            <li><i class="fas fa-chevron-right"></i></li>
                            <li><i class="fas fa-chevron-up"></i></li>
                            <li><i class="fas fa-circle"></i></li>
                            <li><i class="fas fa-circle-notch"></i></li>
                            <li><i class="fas fa-city"></i></li>
                            <li><i class="fas fa-clipboard"></i></li>
                            <li><i class="fas fa-clipboard-check"></i></li>
                            <li><i class="fas fa-clipboard-list"></i></li>
                            <li><i class="fas fa-clock"></i></li>
                            <li><i class="fas fa-clone"></i></li>
                            <li><i class="fas fa-closed-captioning"></i></li>
                            <li><i class="fas fa-cloud"></i></li>
                            <li><i class="fas fa-cloud-moon"></i></li>
                            <li><i class="fas fa-code"></i></li>
                            <li><i class="fas fa-coffee"></i></li>
                            <li><i class="fas fa-cog"></i></li>
                            <li><i class="fas fa-cogs"></i></li>
                            <li><i class="fas fa-coins"></i></li>
                            <li><i class="fas fa-comment"></i></li>
                            <li><i class="fas fa-comment-alt"></i></li>
                            <li><i class="fas fa-comment-dots"></i></li>
                            <li><i class="fas fa-comments"></i></li>
                            <li><i class="fas fa-copyright"></i></li>
                            <li><i class="fas fa-crown"></i></li>
                            <li><i class="fas fa-cube"></i></li>
                            <li><i class="fas fa-cubes"></i></li>
                            <li><i class="fas fa-database"></i></li>
                            <li><i class="fas fa-desktop"></i></li>
                            <li><i class="fas fa-directions"></i></li>
                            <li><i class="fas fa-dna"></i></li>
                            <li><i class="fas fa-dog"></i></li>
                            <li><i class="fas fa-dollar-sign"></i></li>
                            <li><i class="fas fa-dolly"></i></li>
                            <li><i class="fas fa-dolly-flatbed"></i></li>
                            <li><i class="fas fa-door-open"></i></li>
                            <li><i class="fas fa-dove"></i></li>
                            <li><i class="fas fa-download"></i></li>
                            <li><i class="fas fa-drafting-compass"></i></li>
                            <li><i class="fas fa-dumbbell"></i></li>
                            <li><i class="fas fa-edit"></i></li>
                            <li><i class="fas fa-ellipsis-h"></i></li>
                            <li><i class="fas fa-envelope"></i></li>
                            <li><i class="fas fa-envelope-open"></i></li>
                            <li><i class="fas fa-envelope-open-text"></i></li>
                            <li><i class="fas fa-envelope-square"></i></li>
                            <li><i class="fas fa-eraser"></i></li>
                            <li><i class="fas fa-euro-sign"></i></li>
                            <li><i class="fas fa-exchange-alt"></i></li>
                            <li><i class="fas fa-external-link-alt"></i></li>
                            <li><i class="fas fa-external-link-square-alt"></i></li>
                            <li><i class="fas fa-eye"></i></li>
                            <li><i class="fas fa-eye-dropper"></i></li>
                            <li><i class="fas fa-fan"></i></li>
                            <li><i class="fas fa-faucet"></i></li>
                            <li><i class="fas fa-fax"></i></li>
                            <li><i class="fas fa-feather"></i></li>
                            <li><i class="fas fa-feather-alt"></i></li>
                            <li><i class="fas fa-female"></i></li>
                            <li><i class="fas fa-file"></i></li>
                            <li><i class="fas fa-file-alt"></i></li>
                            <li><i class="fas fa-film"></i></li>
                            <li><i class="fas fa-fire"></i></li>
                            <li><i class="fas fa-fire-alt"></i></li>
                            <li><i class="fas fa-fish"></i></li>
                            <li><i class="fas fa-fist-raised"></i></li>
                            <li><i class="fas fa-flag"></i></li>
                            <li><i class="fas fa-flag-checkered"></i></li>
                            <li><i class="fas fa-flag-usa"></i></li>
                            <li><i class="fas fa-flask"></i></li>
                            <li><i class="fas fa-folder"></i></li>
                            <li><i class="fas fa-futbol"></i></li>
                            <li><i class="fas fa-gamepad"></i></li>
                            <li><i class="fas fa-gas-pump"></i></li>
                            <li><i class="fas fa-gavel"></i></li>
                            <li><i class="fas fa-gem"></i></li>
                            <li><i class="fas fa-gift"></i></li>
                            <li><i class="fas fa-gifts"></i></li>
                            <li><i class="fas fa-glass-cheers"></i></li>
                            <li><i class="fas fa-glass-martini"></i></li>
                            <li><i class="fas fa-glass-martini-alt"></i></li>
                            <li><i class="fas fa-glass-whiskey"></i></li>
                            <li><i class="fas fa-glasses"></i></li>
                            <li><i class="fas fa-globe"></i></li>
                            <li><i class="fas fa-graduation-cap"></i></li>
                            <li><i class="fas fa-grin"></i></li>
                            <li><i class="fas fa-grin-alt"></i></li>
                            <li><i class="fas fa-grin-beam"></i></li>
                            <li><i class="fas fa-guitar"></i></li>
                            <li><i class="fas fa-hamburger"></i></li>
                            <li><i class="fas fa-hammer"></i></li>
                            <li><i class="fas fa-hand-holding"></i></li>
                            <li><i class="fas fa-hand-holding-medical"></i></li>
                            <li><i class="fas fa-hand-middle-finger"></i></li>
                            <li><i class="fas fa-hand-paper"></i></li>
                            <li><i class="fas fa-hand-peace"></i></li>
                            <li><i class="fas fa-hand-point-right"></i></li>
                            <li><i class="fas fa-hand-point-left"></i></li>
                            <li><i class="fas fa-hands-helping"></i></li>
                            <li><i class="fas fa-handshake"></i></li>
                            <li><i class="fas fa-hard-hat"></i></li>
                            <li><i class="fas fa-hashtag"></i></li>
                            <li><i class="fas fa-hat-cowboy"></i></li>
                            <li><i class="fas fa-hat-wizard"></i></li>
                            <li><i class="fas fa-hdd"></i></li>
                            <li><i class="fas fa-headphones"></i></li>
                            <li><i class="fas fa-headphones-alt"></i></li>
                            <li><i class="fas fa-headset"></i></li>
                            <li><i class="fas fa-heart"></i></li>
                            <li><i class="fas fa-heartbeat"></i></li>
                            <li><i class="fas fa-highlighter"></i></li>
                            <li><i class="fas fa-hiking"></i></li>
                            <li><i class="fas fa-home"></i></li>
                            <li><i class="fas fa-horse-head"></i></li>
                            <li><i class="fas fa-hospital"></i></li>
                            <li><i class="fas fa-hospital-alt"></i></li>
                            <li><i class="fas fa-hospital-user"></i></li>
                            <li><i class="fas fa-hotel"></i></li>
                            <li><i class="fas fa-house-user"></i></li>
                            <li><i class="fas fa-id-badge"></i></li>
                            <li><i class="fas fa-id-card"></i></li>
                            <li><i class="fas fa-id-card-alt"></i></li>
                            <li><i class="fas fa-image"></i></li>
                            <li><i class="fas fa-images"></i></li>
                            <li><i class="fas fa-inbox"></i></li>
                            <li><i class="fas fa-industry"></i></li>
                            <li><i class="fas fa-infinity"></i></li>
                            <li><i class="fas fa-info"></i></li>
                            <li><i class="fas fa-info-circle"></i></li>
                            <li><i class="fas fa-key"></i></li>
                            <li><i class="fas fa-keyboard"></i></li>
                            <li><i class="fas fa-landmark"></i></li>
                            <li><i class="fas fa-language"></i></li>
                            <li><i class="fas fa-laptop"></i></li>
                            <li><i class="fas fa-laptop-code"></i></li>
                            <li><i class="fas fa-layer-group"></i></li>
                            <li><i class="fas fa-leaf"></i></li>
                            <li><i class="fas fa-life-ring"></i></li>
                            <li><i class="fas fa-lightbulb"></i></li>
                            <li><i class="fas fa-link"></i></li>
                            <li><i class="fas fa-list-alt"></i></li>
                            <li><i class="fas fa-location-arrow"></i></li>
                            <li><i class="fas fa-lock"></i></li>
                            <li><i class="fas fa-lock-open"></i></li>
                            <li><i class="fas fa-magic"></i></li>
                            <li><i class="fas fa-mail-bulk"></i></li>
                            <li><i class="fas fa-male"></i></li>
                            <li><i class="fas fa-map-marker"></i></li>
                            <li><i class="fas fa-map-marker-alt"></i></li>
                            <li><i class="fas fa-map-pin"></i></li>
                            <li><i class="fas fa-marker"></i></li>
                            <li><i class="fas fa-mask"></i></li>
                            <li><i class="fas fa-medal"></i></li>
                            <li><i class="fas fa-microphone"></i></li>
                            <li><i class="fas fa-microphone-alt"></i></li>
                            <li><i class="fas fa-mobile"></i></li>
                            <li><i class="fas fa-mobile-alt"></i></li>
                            <li><i class="fas fa-moon"></i></li>
                            <li><i class="fas fa-mountain"></i></li>
                            <li><i class="fas fa-music"></i></li>
                            <li><i class="fas fa-network-wired"></i></li>
                            <li><i class="fas fa-newspaper"></i></li>
                            <li><i class="fas fa-oil-can"></i></li>
                            <li><i class="fas fa-om"></i></li>
                            <li><i class="fas fa-paint-brush"></i></li>
                            <li><i class="fas fa-paint-roller"></i></li>
                            <li><i class="fas fa-palette"></i></li>
                            <li><i class="fas fa-paper-plane"></i></li>
                            <li><i class="fas fa-paperclip"></i></li>
                            <li><i class="fas fa-paragraph"></i></li>
                            <li><i class="fas fa-paw"></i></li>
                            <li><i class="fas fa-peace"></i></li>
                            <li><i class="fas fa-pen"></i></li>
                            <li><i class="fas fa-pen-alt"></i></li>
                            <li><i class="fas fa-pen-fancy"></i></li>
                            <li><i class="fas fa-pen-nib"></i></li>
                            <li><i class="fas fa-pen-square"></i></li>
                            <li><i class="fas fa-pencil-alt"></i></li>
                            <li><i class="fas fa-pencil-ruler"></i></li>
                            <li><i class="fas fa-people-arrows"></i></li>
                            <li><i class="fas fa-people-carry"></i></li>
                            <li><i class="fas fa-pepper-hot"></i></li>
                            <li><i class="fas fa-phone"></i></li>
                            <li><i class="fas fa-phone-alt"></i></li>
                            <li><i class="fas fa-phone-square"></i></li>
                            <li><i class="fas fa-phone-square-alt"></i></li>
                            <li><i class="fas fa-phone-volume"></i></li>
                            <li><i class="fas fa-photo-video"></i></li>
                            <li><i class="fas fa-plane"></i></li>
                            <li><i class="fas fa-play"></i></li>
                            <li><i class="fas fa-plug"></i></li>
                            <li><i class="fas fa-plus"></i></li>
                            <li><i class="fas fa-plus-circle"></i></li>
                            <li><i class="fas fa-plus-square"></i></li>
                            <li><i class="fas fa-podcast"></i></li>
                            <li><i class="fas fa-poll"></i></li>
                            <li><i class="fas fa-poll-h"></i></li>
                            <li><i class="fas fa-portrait"></i></li>
                            <li><i class="fas fa-pound-sign"></i></li>
                            <li><i class="fas fa-power-off"></i></li>
                            <li><i class="fas fa-prescription"></i></li>
                            <li><i class="fas fa-print"></i></li>
                            <li><i class="fas fa-puzzle-piece"></i></li>
                            <li><i class="fas fa-question"></i></li>
                            <li><i class="fas fa-question-circle"></i></li>
                            <li><i class="fas fa-quote-left"></i></li>
                            <li><i class="fas fa-quote-right"></i></li>
                            <li><i class="fas fa-radiation"></i></li>
                            <li><i class="fas fa-radiation-alt"></i></li>
                            <li><i class="fas fa-random"></i></li>
                            <li><i class="fas fa-reply"></i></li>
                            <li><i class="fas fa-ribbon"></i></li>
                            <li><i class="fas fa-road"></i></li>
                            <li><i class="fas fa-robot"></i></li>
                            <li><i class="fas fa-rocket"></i></li>
                            <li><i class="fas fa-rss"></i></li>
                            <li><i class="fas fa-rss-square"></i></li>
                            <li><i class="fas fa-ruler"></i></li>
                            <li><i class="fas fa-ruler-combined"></i></li>
                            <li><i class="fas fa-ruler-horizontal"></i></li>
                            <li><i class="fas fa-ruler-vertical"></i></li>
                            <li><i class="fas fa-running"></i></li>
                            <li><i class="fas fa-rupee-sign"></i></li>
                            <li><i class="fas fa-satellite-dish"></i></li>
                            <li><i class="fas fa-save"></i></li>
                            <li><i class="fas fa-screwdriver"></i></li>
                            <li><i class="fas fa-scroll"></i></li>
                            <li><i class="fas fa-search"></i></li>
                            <li><i class="fas fa-search-minus"></i></li>
                            <li><i class="fas fa-search-plus"></i></li>
                            <li><i class="fas fa-seedling"></i></li>
                            <li><i class="fas fa-server"></i></li>
                            <li><i class="fas fa-shapes"></i></li>
                            <li><i class="fas fa-share"></i></li>
                            <li><i class="fas fa-share-alt"></i></li>
                            <li><i class="fas fa-share-alt-square"></i></li>
                            <li><i class="fas fa-share-square"></i></li>
                            <li><i class="fas fa-shield-alt"></i></li>
                            <li><i class="fas fa-ship"></i></li>
                            <li><i class="fas fa-shipping-fast"></i></li>
                            <li><i class="fas fa-shopping-cart"></i></li>
                            <li><i class="fas fa-sign-in-alt"></i></li>
                            <li><i class="fas fa-sign-out-alt"></i></li>
                            <li><i class="fas fa-signal"></i></li>
                            <li><i class="fas fa-signature"></i></li>
                            <li><i class="fas fa-sitemap"></i></li>
                            <li><i class="fas fa-skull-crossbones"></i></li>
                            <li><i class="fas fa-smile"></i></li>
                            <li><i class="fas fa-smoking"></i></li>
                            <li><i class="fas fa-smoking-ban"></i></li>
                            <li><i class="fas fa-snowflake"></i></li>
                            <li><i class="fas fa-stamp"></i></li>
                            <li><i class="fas fa-star"></i></li>
                            <li><i class="fas fa-star-of-life"></i></li>
                            <li><i class="fas fa-stopwatch"></i></li>
                            <li><i class="fas fa-store"></i></li>
                            <li><i class="fas fa-store-alt"></i></li>
                            <li><i class="fas fa-street-view"></i></li>
                            <li><i class="fas fa-subway"></i></li>
                            <li><i class="fas fa-suitcase"></i></li>
                            <li><i class="fas fa-sun"></i></li>
                            <li><i class="fas fa-sync"></i></li>
                            <li><i class="fas fa-sync-alt"></i></li>
                            <li><i class="fas fa-table"></i></li>
                            <li><i class="fas fa-tablet"></i></li>
                            <li><i class="fas fa-tablet-alt"></i></li>
                            <li><i class="fas fa-tag"></i></li>
                            <li><i class="fas fa-tags"></i></li>
                            <li><i class="fas fa-tasks"></i></li>
                            <li><i class="fas fa-temperature-high"></i></li>
                            <li><i class="fas fa-temperature-low"></i></li>
                            <li><i class="fas fa-terminal"></i></li>
                            <li><i class="fas fa-theater-masks"></i></li>
                            <li><i class="fas fa-thumbs-down"></i></li>
                            <li><i class="fas fa-thumbs-up"></i></li>
                            <li><i class="fas fa-thumbtack"></i></li>
                            <li><i class="fas fa-times"></i></li>
                            <li><i class="fas fa-times-circle"></i></li>
                            <li><i class="fas fa-tint"></i></li>
                            <li><i class="fas fa-toolbox"></i></li>
                            <li><i class="fas fa-tools"></i></li>
                            <li><i class="fas fa-tooth"></i></li>
                            <li><i class="fas fa-trademark"></i></li>
                            <li><i class="fas fa-trash"></i></li>
                            <li><i class="fas fa-trash-alt"></i></li>
                            <li><i class="fas fa-tree"></i></li>
                            <li><i class="fas fa-trophy"></i></li>
                            <li><i class="fas fa-truck"></i></li>
                            <li><i class="fas fa-truck-loading"></i></li>
                            <li><i class="fas fa-truck-moving"></i></li>
                            <li><i class="fas fa-tv"></i></li>
                            <li><i class="fas fa-university"></i></li>
                            <li><i class="fas fa-unlock-alt"></i></li>
                            <li><i class="fas fa-upload"></i></li>
                            <li><i class="fas fa-user"></i></li>
                            <li><i class="fas fa-user-alt"></i></li>
                            <li><i class="fas fa-user-check"></i></li>
                            <li><i class="fas fa-user-circle"></i></li>
                            <li><i class="fas fa-user-clock"></i></li>
                            <li><i class="fas fa-user-cog"></i></li>
                            <li><i class="fas fa-user-edit"></i></li>
                            <li><i class="fas fa-user-friends"></i></li>
                            <li><i class="fas fa-user-minus"></i></li>
                            <li><i class="fas fa-user-plus"></i></li>
                            <li><i class="fas fa-users"></i></li>
                            <li><i class="fas fa-vial"></i></li>
                            <li><i class="fas fa-video"></i></li>
                            <li><i class="fas fa-voicemail"></i></li>
                            <li><i class="fas fa-volume-up"></i></li>
                            <li><i class="fas fa-volume-down"></i></li>
                            <li><i class="fas fa-walking"></i></li>
                            <li><i class="fas fa-warehouse"></i></li>
                            <li><i class="fas fa-weight"></i></li>
                            <li><i class="fas fa-weight-hanging"></i></li>
                            <li><i class="fas fa-wheelchair"></i></li>
                            <li><i class="fas fa-wifi"></i></li>
                            <li><i class="fas fa-wine-glass"></i></li>
                            <li><i class="fas fa-wine-glass-alt"></i></li>
                            <li><i class="fas fa-wrench"></i></li>
                            <li><i class="fas fa-yin-yang"></i></li>

                            <li><i class="far fa-address-book"></i></li>
                            <li><i class="far fa-address-card"></i></li>
                            <li><i class="far fa-bell"></i></li>
                            <li><i class="far fa-bookmark"></i></li>
                            <li><i class="far fa-building"></i></li>
                            <li><i class="far fa-calendar"></i></li>
                            <li><i class="far fa-chart-bar"></i></li>
                            <li><i class="far fa-check-circle"></i></li>
                            <li><i class="far fa-check-square"></i></li>
                            <li><i class="far fa-clipboard"></i></li>
                            <li><i class="far fa-clock"></i></li>
                            <li><i class="far fa-comment"></i></li>
                            <li><i class="far fa-comments"></i></li>
                            <li><i class="far fa-edit"></i></li>
                            <li><i class="far fa-envelope"></i></li>
                            <li><i class="far fa-envelope-open"></i></li>
                            <li><i class="far fa-eye"></i></li>
                            <li><i class="far fa-file"></i></li>
                            <li><i class="far fa-flag"></i></li>
                            <li><i class="far fa-folder"></i></li>
                            <li><i class="far fa-folder-open"></i></li>
                            <li><i class="far fa-gem"></i></li>
                            <li><i class="far fa-hand-point-left"></i></li>
                            <li><i class="far fa-hand-point-right"></i></li>
                            <li><i class="far fa-heart"></i></li>
                            <li><i class="far fa-handshake"></i></li>
                            <li><i class="far fa-hospital"></i></li>
                            <li><i class="far fa-id-badge"></i></li>
                            <li><i class="far fa-id-card"></i></li>
                            <li><i class="far fa-image"></i></li>
                            <li><i class="far fa-images"></i></li>
                            <li><i class="far fa-keyboard"></i></li>
                            <li><i class="far fa-lightbulb"></i></li>
                            <li><i class="far fa-list-alt"></i></li>
                            <li><i class="far fa-question-circle"></i></li>
                            <li><i class="far fa-save"></i></li>
                            <li><i class="far fa-share-square"></i></li>
                            <li><i class="far fa-smile"></i></li>
                            <li><i class="far fa-star"></i></li>
                            <li><i class="far fa-thumbs-down"></i></li>
                            <li><i class="far fa-thumbs-up"></i></li>
                            <li><i class="far fa-user"></i></li>
                            <li><i class="far fa-user-circle"></i></li>
                        </ul>
                        <a href="#" class="btn" id="tm-icon-to-img"><i class="icon image"></i><span>Change to Image</span></a>
                        <h3 id="tm-icon-header-formatting">Formatting</h3>
                        <input type="text" id="tm-icon-color" />
                        <a href="#" class="ibtn" id="tm-icon-removeformat" title="Remove Formatting"><i class="icon erase"></i></a>

                        <h3 id="tm-icon-header-size">Size</h3>
                        <div class="ui mini input">
                            <input type="number" id="tm-icon-size" />
                        </div>
                        <div class="ui mini search selection dropdown" id="tm-icon-length">
                            <input type="hidden">
                            <i class="dropdown icon"></i>
                            <div class="default text">px</div>
                            <div class="menu">
                                <div class="item" data-value="px">px</div>
                                <div class="item" data-value="pt">pt</div>
                                <div class="item" data-value="pc">pc</div>
                                <div class="item" data-value="cm">cm</div>
                                <div class="item" data-value="mm">mm</div>
                                <div class="item" data-value="in">in</div>
                                <div class="item" data-value="em">em</div>
                                <div class="item" data-value="ex">ex</div>
                                <div class="item" data-value="ch">ch</div>
                                <div class="item" data-value="rem">rem</div>
                                <div class="item" data-value="vh">vh</div>
                                <div class="item" data-value="vw">vw</div>
                                <div class="item" data-value="vmin">vmin</div>
                                <div class="item" data-value="vmax">vmax</div>
                                <div class="item" data-value="%">%</div>
                            </div>
                        </div>
                        <a href="#" class="ibtn" id="tm-icon-increasesize" title="Increase Icon Size"><i class="icon plus"></i></a>
                        <a href="#" class="ibtn" id="tm-icon-decreasesize" title="Decrease Icon Size"><i class="icon minus"></i></a>

                        <!-- <h3 id="tm-icon-header-weight">Weight</h3>
                        <a href="#" class="ibtn" id="tm-icon-increaseweight" title="Increase Icon Weight"><i class="icon plus"></i></a>
                        <a href="#" class="ibtn" id="tm-icon-decreaseweight" title="Decrease Icon Weight"><i class="icon minus"></i></a> -->
                    </div>
                </div>
                <div class="title" id="tm-text">
                    <i class="icon dropdown"></i><i class="icon content"></i><span>Text</span>
                </div>
                <div class="content">
                    <div class="ui form">
                        <h3 id="tm-text-header-formatting">Formatting</h3>
                        <a href="#" class="ibtn" id="tm-text-bold" title="Bold"><i class="icon bold"></i></a>
                        <a href="#" class="ibtn" id="tm-text-italic" title="Italic"><i class="icon italic"></i></a>
                        <a href="#" class="ibtn" id="tm-text-underline" title="Underline"><i class="icon underline"></i></a>
                        <a href="#" class="ibtn" id="tm-text-strikethrough" title="Strikethrough"><i class="icon strikethrough"></i></a>
                        <input type="text" id="tm-text-color" /> 
                        <a href="#" class="ibtn" id="tm-text-subscript" title="Subscript"><i class="icon subscript"></i></a>
                        <a href="#" class="ibtn" id="tm-text-superscript" title="Superscript"><i class="icon superscript"></i></a>
                        <a href="#" class="ibtn" id="tm-text-removeformat" title="Remove Formatting"><i class="icon erase"></i></a>
                        <a href="#" class="btn" id="tm-text-linkify"><i class="icon linkify"></i><span>Linkify</span></a>

                        <h3 id="tm-text-header-size">Size</h3>
                        <div class="ui mini input">
                            <input type="number" id="tm-text-size" />
                        </div>
                        <div class="ui mini search selection dropdown" id="tm-text-length">
                            <input type="hidden">
                            <i class="dropdown icon"></i>
                            <div class="default text">px</div>
                            <div class="menu">
                                <div class="item" data-value="px">px</div>
                                <div class="item" data-value="pt">pt</div>
                                <div class="item" data-value="pc">pc</div>
                                <div class="item" data-value="cm">cm</div>
                                <div class="item" data-value="mm">mm</div>
                                <div class="item" data-value="in">in</div>
                                <div class="item" data-value="em">em</div>
                                <div class="item" data-value="ex">ex</div>
                                <div class="item" data-value="ch">ch</div>
                                <div class="item" data-value="rem">rem</div>
                                <div class="item" data-value="vh">vh</div>
                                <div class="item" data-value="vw">vw</div>
                                <div class="item" data-value="vmin">vmin</div>
                                <div class="item" data-value="vmax">vmax</div>
                                <div class="item" data-value="%">%</div>
                            </div>
                        </div>
                        <a href="#" class="ibtn" id="tm-text-increasesize" title="Increase Font Size"><i class="icon plus"></i></a>
                        <a href="#" class="ibtn" id="tm-text-decreasesize" title="Decrease Font Size"><i class="icon minus"></i></a>

                        <h3 id="tm-text-header-alignment">Alignment</h3>
                        <a href="#" class="ibtn" id="tm-text-alignleft" title="Align Left"><i class="icon align left"></i></a>
                        <a href="#" class="ibtn" id="tm-text-aligncenter" title="Align Center"><i class="icon align center"></i></a>
                        <a href="#" class="ibtn" id="tm-text-alignright" title="Align Right"><i class="icon align right"></i></a>
                        <a href="#" class="ibtn" id="tm-text-alignjustify" title="Align Justify"><i class="icon align justify"></i></a>

                        <br />
                        <a href="#" class="btn" id="tm-text-add-img"><i class="icon image"></i><span>Add Image</span></a>
                    </div>
                </div>                             
                <div class="title" id="tm-input">
                    <i class="icon dropdown"></i><i class="icon keyboard"></i><span>Input</span>
                </div>
                <div class="content">
                    <div class="ui form">
                        <div class="field" id="tm-input-name">
                            <label>Name</label>
                            <div class="ui mini input">
                                <input type="text" />
                            </div>
                        </div>
                        <div class="field" id="tm-input-placeholder">
                            <label>Placeholder</label>
                            <div class="ui mini input">
                                <input type="text" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="title" id="tm-section">
                    <i class="icon dropdown"></i><i class="icon expand"></i><span>Section</span>
                </div>
                <div class="content">
                    <div class="ui form">
                        <h3 id="tm-section-header-bgimg">Background Image</h3>
                        <div id="tm-section-bg-img">
                            <img src="img/icons/pixel.png" />
                        </div>
                        <div class="field">
                            <a href="#" class="btn" id="tm-section-bg-img-change"><i class="icon image"></i><span>Change Image</span></a>
                            <a href="#" class="btn" id="tm-section-bg-img-remove"><i class="icon trash"></i><span>Remove Image</span></a>
                        </div>
                        <div class="field" id="tm-section-bg-img-effect">
                            <div class="ui checkbox">
                                <input type="checkbox" />
                                <label>Parallax Effect</label>
                            </div>
                        </div>
                        <div class="field" id="tm-section-bg-img-fullwidth">
                            <div class="ui checkbox">
                                <input type="checkbox" />
                                <label>Full Width</label>
                            </div>
                        </div>
                        <h3 id="tm-section-header-bgcolor">Background Color</h3>
                        <div class="field" id="tm-section-bg-img-color">
                            <input type="text" /><!-- <label>Background Color</label> -->
                        </div>
                        <h3 id="tm-section-header-modify">Modify</h3>
                        <a href="#" class="btn" id="tm-section-remove"><i class="icon trash"></i><span>Remove Section</span></a>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <!--END OF BODY-->

    <div id="tb-img" class="tb">
        <a href="#" class="btn" id="tb-img-change"><i class="icon image"></i><span>Change</span></a>
        <a href="#" class="btn" id="tb-img-move"><i class="icon move"></i><span>Move</span></a>
        <a href="#" class="btn" id="tb-img-resize"><i class="icon expand"></i><span>Resize</span></a>
        <a href="#" class="btn" id="tb-img-transform"><i class="icon expand arrows alternate"></i><span>Transform</span></a>
        <a href="#" class="btn" id="tb-img-reset"><i class="icon undo alternate"></i><span>Reset</span></a>
        <a href="#" class="btn del" id="tb-img-remove"><i class="icon trash"></i><span>Remove</span></a>
    </div>
    <div id="tb-video" class="tb">
        <a href="#" class="btn" id="tb-video-change"><i class="icon video"></i><span>Change Video</span></a>
        <a href="#" class="btn" id="tb-video-to-img"><i class="icon image"></i><span>Change to Image</span></a>
        <a href="#" class="btn" id="tb-video-move"><i class="icon move"></i><span>Move</span></a>
        <a href="#" class="btn" id="tb-video-resize"><i class="icon expand"></i><span>Resize</span></a>
        <a href="#" class="btn" id="tb-video-transform"><i class="icon expand arrows alternate"></i><span>Transform</span></a>
        <a href="#" class="btn" id="tb-video-reset"><i class="icon undo alternate"></i><span>Reset</span></a>
        <a href="#" class="btn del" id="tb-video-remove"><i class="icon trash"></i><span>Remove</span></a>
    </div>
    <div id="tb-slider" class="tb">
        <a href="#" class="btn" id="tb-slider-modify"><i class="icon setting"></i><span>Modify Slider</span></a>
    </div>

    <div id="contextmenu-file" class="ui-contextmenu">
        <div class="title">
            <i class="icon file"></i><span>Title</span>
        </div>
        <ul class="links">
            <li><a href="#" class="copy"><i class="icon copy"></i><span>Copy URL</span></a></li>
            <li><a href="#" class="remove"><i class="icon trash"></i><span>Delete</span></a></li>
        </ul>
        <div class="data">
            <span>Last Modified: </span><span class="modified"></span>
        </div>
    </div>
    <div id="contextmenu-folder" class="ui-contextmenu">
        <div class="title">
            <i class="icon folder"></i><span>Title</span>
        </div>
        <ul class="links">
            <li><a href="#" class="add"><i class="icon plus"></i><span>Add Page</span></a></li>
            <li><a href="#" class="remove"><i class="icon trash"></i><span>Delete</span></a></li>
        </ul>
    </div>
    <!-- DIMMER -->
    <div class="ui main page dimmer">
        <div class="ui loader"></div>
    </div>
    
    <div id="blocker">
    </div>
    
    <!-- MODALS -->
    <div class="ui small modal" id="modal-web-settings">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon setting"></i><span>Website Settings</span>
        </div>
        <div class="scrolling content">
            <div class="ui form">
                <div class="two fields">
                    <div class="field" id="web-settings-theme">
                        <label>Template</label>
                        <a href="/templates" class="btn" id="web-settings-theme-btn"><i class="icon archive"></i><span>Change Template</span></a>
                        <img src="img/icons/pixel.png" />
                    </div>
                    <div class="field" id="web-settings-icon">
                        <label>Favicon</label>
                        <a href="#" class="btn" id="web-settings-icon-btn"><i class="icon star"></i><span>Change Favicon</span></a>
                        <img src="img/icons/pixel.png" />
                    </div>
                </div>

                <div class="field" id="web-settings-snippet">
                    <!-- <a href="#" class="btn" id="web-settings-integration"><i class="icon cubes"></i><span>View Integrations</span></a> -->
                    <label data-tooltip="Adds code snippet to all pages, right before the closing </body> tag." data-position="right center"><i class="question circle icon"></i>Add Snippet</label>
                    <textarea></textarea>
                </div>

                <div class="ui accordion" id="web-settings-advanced">
                    <div class="title">
                        <i class="dropdown icon"></i><span>Advanced Settings</span>
                    </div>
                    <div class="content">
                        <div class="field" id="web-settings-title">
                            <label data-tooltip="Set the content of the <title> tag in all pages" data-position="right center"><i class="question circle icon"></i>Set Title</label>
                            <div class="ui input left icon">
                                <i class="icon content"></i>
                                <input type="text" />
                            </div>
                        </div>
                        <!-- <div class="field" id="web-settings-title-overwrite">
                            <div class="ui radio checkbox">
                                <input type="radio" name="web-settings-title" value="Overwrite">
                                <label>Overwrite all page titles</label>
                            </div>
                        </div>
                        <div class="field" id="web-settings-title-prefix">
                            <div class="ui radio checkbox">
                                <input type="radio" name="web-settings-title" value="Prefix">
                                <label>Prefix current page titles</label>
                            </div>
                        </div>
                        <div class="field" id="web-settings-title-suffix">
                            <div class="ui radio checkbox">
                                <input type="radio" name="web-settings-title" value="Suffix">
                                <label>Suffix current page titles</label>
                            </div>
                        </div> -->
                    </div>
                </div>

            </div>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="modal-web-settings-exit">
                <i class="icon remove"></i>
                <span>Exit</span>
            </div>
            <div class="ui inverted green button positive" id="modal-web-settings-save">
                <i class="icon save"></i>
                <span>Save</span>
            </div>
        </div>
    </div>

    <div class="ui small modal" id="modal-slider-settings">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon setting"></i><span>Slider Images</span>
        </div>
        <div class="content">
            <ul id="slider-images">
                <li>
                    <div>
                        <a href="#" id="slider-image-upload-container">
                            <div>
                                <svg class="ui-icon sc-ui-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 31 24">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <path id="Shape" fill-rule="nonzero" d="M26.7704335,2.83988084 L21.8837953,2.83988084 L20.1805259,0 L10.6766169,0 L8.97334755,2.83988084 L4.08670931,2.83988084 C1.83333333,2.83988084 0,4.56352145 0,6.68207256 L0,20.1578083 C0,22.2763594 1.83333333,24 4.08670931,24 L26.7704335,24 C29.0238095,24 30.8571429,22.2763594 30.8571429,20.1578083 L30.8571429,6.68207256 C30.8571429,4.56352145 29.0238095,2.83988084 26.7704335,2.83988084 Z M15.4285714,20.8695652 C11.3324111,20.8695652 8,17.5924657 8,13.5650482 C8,9.53796907 11.3324111,6.26086957 15.4285714,6.26086957 C19.5247318,6.26086957 22.8571429,9.53796907 22.8571429,13.5650482 C22.8571429,17.5924657 19.5247318,20.8695652 15.4285714,20.8695652 Z M16.6699507,9.39130435 L14.1871921,9.39130435 L14.1871921,12.9535232 L10.2857143,12.9535232 L10.2857143,15.2203898 L14.1871921,15.2203898 L14.1871921,18.7826087 L16.6699507,18.7826087 L16.6699507,15.2203898 L20.5714286,15.2203898 L20.5714286,12.9535232 L16.6699507,12.9535232 L16.6699507,9.39130435 Z"></path>
                                    </g>
                                </svg>
                                <div>Add Image</div>
                            </div>
                            <div class="ui green active progress">
                                <div class="bar">
                                    <div class="progress"></div>
                                </div>
                                <div class="label">Uploading Image</div>
                            </div>
                            <input id="slider-image-upload" type="file" name="files">
                        </a>
                    </div>
                </li>
            </ul>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="modal-slider-settings-exit">
                <i class="icon remove"></i>
                <span>Exit</span>
            </div>
            <div class="ui inverted green button positive" id="modal-slider-settings-save">
                <i class="icon save"></i>
                <span>Save</span>
            </div>
        </div>
    </div>

    <?php include "modal-gallery-images.php" ?>
    <?php include "modal-gallery-videos.php" ?>
    
    <div class="ui tiny modal" id="modal-page-add">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon file"></i><span>Add Web Page</span>
        </div>
        <div class="scrolling content">
            <div class="ui form">
                <div class="field" id="page-add-url">
                    <label>Page Name</label>
                    <div class="ui right labeled input">
                        <label class="ui label"></label>
                        <input type="text" />
                    </div>
                </div>
                <!-- <div class="two fields"> -->
                    <div class="field" id="page-add-template">
                        <label>Page Template</label>
                        <div class="ui selection dropdown">
                            <input type="hidden">
                            <i class="dropdown icon"></i>
                            <div class="default text">Index</div>
                            <div class="menu">
                                <div class="item" data-value="">Blank Page</div>
                                <div class="header template">
                                    <i class="folder icon"></i>
                                    <span>Template</span>
                                </div>
                                <div class="header website">
                                    <i class="world icon"></i>
                                    <span>Website</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field" id="page-add-folder">
                        <label>Folder</label>
                        <div class="ui selection dropdown">
                            <input type="hidden">
                            <i class="dropdown icon"></i>
                            <div class="default text">/</div>
                            <div class="menu">
                                <div class="item" data-value="/">/</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- <div class="field" id="page-add-navlink">
                        <div class="ui checkbox">
                            <input type="checkbox" class="hidden">
                            <label>Add page to navigation links</label>
                        </div>
                    </div> -->
                    <i class="circular huge file icon"></i>

                <!-- </div> -->
                <!-- <div class="two fields">
                    <div class="field" id="page-add-name">
                        <label>Name</label>
                        <div class="ui input">
                            <input type="text" />
                        </div>
                    </div>
                    <div class="field" id="page-add-url">
                        <label>URL*</label>
                        <div class="ui labeled input">
                            <div class="ui label"></div>
                            <input type="text" />
                        </div>
                    </div>
                </div> -->
                <!-- <div class="two fields">
                    <div class="field" id="page-add-title">
                        <label>Title</label>
                        <div class="ui input">
                            <input type="text" />
                        </div>
                    </div>
                    <div class="field" id="page-add-description">
                        <label>Description</label>
                        <div class="ui input">
                            <input type="text" />
                        </div>
                    </div>
                </div> -->                
                <div class="ui error message">
                    <div class="header">Invalid Data</div>
                    <p>Please enter a valid page name, using only alphanumeric characters.</p>
                </div>
                <div class="ui warning message">
                    <div class="header">Page name already exists</div>
                    <p>Please enter a different page name.</p>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="modal-page-add-exit">
                <i class="icon remove"></i>
                <span>Exit</span>
            </div>
            <div class="ui inverted green button" id="modal-page-add-save">
                <i class="icon plus"></i>
                <span>Add Web Page</span>
            </div>
        </div>
    </div>

    <div class="ui tiny modal" id="modal-folder-add">
        <i class="close icon"></i>
        <div class="header">
            <i class="icon folder"></i><span>Add Web Folder</span>
        </div>
        <div class="scrolling content">
            <div class="ui form">
                <div class="field" id="folder-add-name">
                    <label>Name</label>
                    <div class="ui input">
                        <input type="text" placeholder="Folder Name" />
                    </div>
                </div>
                <div class="ui error message">
                    <div class="header">Missing Folder Name</div>
                    <p>Please add a folder name.</p>
                </div>
                <div class="ui warning message">
                    <div class="header">Server Error</div>
                    <p>Couldn't create folder.</p>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui inverted red button negative left floated" id="modal-folder-add-exit">
                <i class="icon remove"></i>
                <span>Exit</span>
            </div>
            <div class="ui inverted green button" id="modal-folder-add-save">
                <i class="icon plus"></i>
                <span>Add Web Folder</span>
            </div>
        </div>
    </div>

    <input type="hidden" id="st" value="<?=$_SESSION["st"];?>" />
    <!--DRAG & DROP & RESIZE-->
    <script src="node_modules/interact.js/dist/interact.min.js"></script>
    <!-- SORTABLE -->
    <script src="node_modules/sortablejs/Sortable.min.js"></script>
    
    <!--COLOR-->
    <script src="node_modules/jquery-easing/jquery.easing.1.3.js"></script>
    <script src="node_modules/jquery-color/jquery.color-2.1.2.min.js"></script>
    <script src="node_modules/spectrum-colorpicker/spectrum.js"></script>
    
    <!--FILE UPLOAD-->
    <script src="node_modules/blueimp-file-upload/js/vendor/jquery.ui.widget.js"></script>
    <script src="node_modules/blueimp-file-upload/js/jquery.iframe-transport.js"></script>
    <script src="node_modules/blueimp-file-upload/js/jquery.fileupload.min.js"></script>

    <!-- MONACO EDITOR -->
    <script>var require = { paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/' } };</script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/loader.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/editor/editor.main.nls.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/editor/editor.main.js"></script>

    <!-- SITEOS -->
    <script src="js/sui-accordion.js"></script>
    <script src="js/ui-gallery.js"></script>
    <script src="js/ui-video.js"></script>
    <script src="js/builder.js"></script>
</body>
</html>