<?php

$leftMenu = "";
if(intval($isOwner) == 1) {
    // PRINT EVERYTHING
$leftMenu = <<<'MENU'
<nav>
<ul>
    <li id="module-mail"><a class="inbox dropzone" href="/mail"><i class="icon inbox"></i><span>Inbox</span><span id="counter-inbox-new"></span></a></li>
    <div class="submenu" id="nav-mail-list"></div>
    <li id="module-builder"><a href="/builder"><i class="icon world"></i><span>Website</span></a></li>
    <div class="submenu" id="nav-website-list"></div>
    <li id="module-analytics"><a href="/analytics"><i class="icon pie chart"></i><span>Analytics</span></a></li>
    <div class="submenu" id="nav-analytics-list"></div>
    <li id="module-leads"><a href="/leads"><i class="icon users"></i><span>Leads</span></a></li>
    <div class="submenu" id="nav-lead-list"></div>
</ul>
<ul>
    <li id="module-accounts"><a href="/accounts"><i class="icon envelope"></i><span>Email Accounts</span></a></li>
    <li id="module-filter"><a href="/filter"><i class="icon ban"></i><span>Spam Filter</span></a></li>
    <li id="module-files"><a href="/files"><i class="icon folder"></i><span>Files</span></a></li>
    <div class="submenu" id="nav-folders"></div>
</ul>
</nav>
MENU;
} 
else {
    if(intval($isAdmin) == 1) {
        // PRINT USER MENU
$leftMenu = <<<'MENU'
<nav>
<ul>
    <li id="module-mail"><a class="inbox dropzone" href="/mail"><i class="icon inbox"></i><span>Inbox</span><span id="counter-inbox-new"></span></a></li>
    <div class="submenu" id="nav-mail-list"></div>
    <li id="module-builder"><a href="/builder"><i class="icon world"></i><span>Website</span></a></li>
    <div class="submenu" id="nav-website-list"></div>
    <li id="module-analytics"><a href="/analytics"><i class="icon pie chart"></i><span>Analytics</span></a></li>
    <div class="submenu" id="nav-analytics-list"></div>
    <li id="module-leads"><a href="/leads"><i class="icon users"></i><span>Leads</span></a></li>
    <div class="submenu" id="nav-lead-list"></div>
</ul>
<ul>
    <li id="module-filter"><a href="/filter"><i class="icon ban"></i><span>Spam Filter</span></a></li>
    <li id="module-files"><a href="/files"><i class="icon folder"></i><span>Files</span></a></li>
    <div class="submenu" id="nav-folders"></div>
</ul>
</nav>
MENU;
    } 
    else {
        // PRINT EMAIL ONLY
$leftMenu = <<<'MENU'
<nav>
<ul>
    <li id="module-mail"><a class="inbox dropzone" href="/mail"><i class="icon inbox"></i><span>Inbox</span><span id="counter-inbox-new"></span></a></li>
    <div class="submenu" id="nav-mail-list"></div>
</ul>
</nav>
MENU;
    }
}
echo $leftMenu;

?>