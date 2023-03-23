<div class="toolbar toolbar-content-slim">
    <div class="ui fluid three item menu toolbar-tabs">
        <a class="item tb-tab-attachments" data-tab="attachments" id="toolbar-tab-attachments"><i class="icon attach"></i><span class="title">Attachments</span></a>
        <a class="item tb-tab-styling" data-tab="formatting" id="toolbar-tab-formatting"><i class="icon pencil"></i><span class="title">Styling</span></a>
        <a class="item tb-tab-color" data-tab="color" id="toolbar-tab-color"><i class="icon theme"></i><span class="title">Color</span></a>
    </div>
    <div class="ui bottom attached tab segment" data-tab="attachments">
        <a href="#" class="btn tb-add-attachment" id="toolbar-attachment">
            <i class="icon attach"></i><span>Add Attachment</span>
            <input id="fileupload1" type="file" name="files">
        </a>
        <a href="#" class="btn tb-add-image" id="toolbar-image">
            <i class="icon image"></i><span>Add Image</span>
            <input id="fileupload2" type="file" name="files">
        </a>
        <a href="#" class="btn tb-add-link" id="toolbar-link"><i class="icon linkify"></i><span>Add Link</span></a>
    </div>
    <div class="ui bottom attached tab segment" data-tab="formatting">
        <a href="#" class="ibtn tb-bold" id="toolbar-bold2"><i class="icon bold"></i></a>
        <a href="#" class="ibtn tb-italic" id="toolbar-italic2"><i class="icon italic"></i></a>
        <a href="#" class="ibtn tb-underline" id="toolbar-underline2"><i class="icon underline"></i></a>
        <a href="#" class="ibtn tb-justifyleft" id="toolbar-justifyleft2"><i class="icon align left"></i></a>
        <a href="#" class="ibtn tb-justifycenter" id="toolbar-justifycenter2"><i class="icon align center"></i></a>
        <a href="#" class="ibtn tb-justifyright" id="toolbar-justifyright2"><i class="icon align right"></i></a>
        <a href="#" class="ibtn tb-justifyfull" id="toolbar-justifyfull2"><i class="icon align justify"></i></a>
        <a href="#" class="ibtn tb-sizeup" id="toolbar-sizeup2"><i class="icon caret up"></i></a>
        <a href="#" class="ibtn tb-sizedown" id="toolbar-sizedown2"><i class="icon caret down"></i></a>

        <div class="ui mini selection dropdown tb-size" id="toolbar-size2" tabindex="0" >
            <input type="hidden" name="toolbar-size" value="14">
            <i class="dropdown icon"></i>
            <div class="default text">Size</div>
            <div class="menu">
                <div class="item" data-value="8">
                    8
                </div>
                <div class="item" data-value="9">
                    9
                </div>
                <div class="item" data-value="10">
                    10
                </div>
                <div class="item" data-value="11">
                    11
                </div>
                <div class="item" data-value="12">
                    12
                </div>
                <div class="item" data-value="14">
                    14
                </div>
                <div class="item" data-value="16">
                    16
                </div>
                <div class="item" data-value="18">
                    18
                </div>
                <div class="item" data-value="20">
                    20
                </div>
                <div class="item" data-value="22">
                    22
                </div>
                <div class="item" data-value="24">
                    24
                </div>
                <div class="item" data-value="26">
                    26
                </div>
                <div class="item" data-value="28">
                    28
                </div>
                <div class="item" data-value="32">
                    32
                </div>
                <div class="item" data-value="36">
                    36
                </div>
                <div class="item" data-value="48">
                    48
                </div>
                <div class="item" data-value="72">
                    72
                </div>
            </div>
        </div>
        <div class="ui mini selection dropdown tb-font" id="toolbar-font2" tabindex="0">
            <input type="hidden" name="toolbar-font">
            <i class="dropdown icon"></i>
            <div class="default text">Select Font</div>
            <div class="menu">
                <div class="item" data-value="Roboto" style="font-family: 'Roboto'">
                    Roboto
                </div>
                <div class="item" data-value="Michroma" style="font-family: 'Michroma'">
                    Michroma
                </div>
                <!-- <div class="item" data-value="Open Sans" style="font-family: 'Open Sans'">
                    Open Sans
                </div>
                <div class="item" data-value="Raleway" style="font-family: 'Raleway'">
                    Raleway
                </div>
                <div class="item" data-value="Rubik" style="font-family: 'Rubik'">
                    Rubik
                </div>
                <div class="item" data-value="Source Sans Pro" style="font-family: 'Source Sans Pro'">
                    Source Sans Pro
                </div>
                <div class="item" data-value="Montserrat" style="font-family: 'Montserrat'">
                    Montserrat
                </div>
                <div class="item" data-value="Pontano Sans" style="font-family: 'Pontano Sans'">
                    Pontano Sans
                </div>
                <div class="item" data-value="Questrial" style="font-family: 'Questrial'">
                    Questrial
                </div>
                <div class="item" data-value="Roboto Slab" style="font-family: 'Roboto Slab'">
                    Roboto Slab
                </div>
                <div class="item" data-value="Oxygen" style="font-family: 'Oxygen'">
                    Oxygen
                </div>
                <div class="item" data-value="PT Sans" style="font-family: 'PT Sans'">
                    PT Sans
                </div>
                <div class="item" data-value="Droid Sans" style="font-family: 'Droid Sans'">
                    Droid Sans
                </div>
                <div class="item" data-value="Roboto Condensed" style="font-family: 'Roboto Condensed'">
                    Roboto Condensed
                </div>
                <div class="item" data-value="Lora" style="font-family: 'Lora'">
                    Lora
                </div>
                <div class="item" data-value="Nunito" style="font-family: 'Nunito'">
                    Nunito
                </div>
                <div class="item" data-value="Slabo 27px" style="font-family: 'Slabo 27px'">
                    Slabo
                </div>
                <div class="item" data-value="Droid Serif" style="font-family: 'Droid Serif'">
                    Droid Serif
                </div>
                <div class="item" data-value="Arimo" style="font-family: 'Arimo'">
                    Arimo
                </div>
                <div class="item" data-value="Noto Sans" style="font-family: 'Noto Sans'">
                    Noto Sans
                </div>
                <div class="item" data-value="Titillium Web" style="font-family: 'Titillium Web'">
                    Titillium Web
                </div>
                <div class="item" data-value="PT Serif" style="font-family: 'PT Serif'">
                    PT Serif
                </div>
                <div class="item" data-value="Muli" style="font-family: 'Muli'">
                    Muli
                </div>
                <div class="item" data-value="Ubuntu" style="font-family: 'Ubuntu'">
                    Ubuntu
                </div>
                <div class="item" data-value="Oswald" style="font-family: Oswald">
                    Oswald
                </div>
                <div class="item" data-value="Bitter" style="font-family: 'Bitter'">
                    Bitter
                </div>
                <div class="item" data-value="Poppins" style="font-family: 'Poppins'">
                    Poppins
                </div>
                <div class="item" data-value="Merriweather" style="font-family:'Merriweather'">
                    Merriweather
                </div>
                <div class="item" data-value="Forum" style="font-family:'Forum'">
                    Forum
                </div>
                <div class="item" data-value="Cinzel" style="font-family:'Cinzel'">
                    Cinzel
                </div>
                <div class="item" data-value="Sanchez" style="font-family:'Sanchez'">
                    Sanchez
                </div>
                <div class="item" data-value="Cabin" style="font-family:'Cabin'">
                    Cabin
                </div>
                <div class="item" data-value="Anton" style="font-family:'Anton'">
                    Anton
                </div>
                <div class="item" data-value="Crimson Text" style="font-family:'Crimson Text'">
                    Crimson Text
                </div>
                <div class="item" data-value="Libre Baskerville" style="font-family: 'Libre Baskerville'">
                    Libre Baskerville
                </div>
                <div class="item" data-value="Varela Round" style="font-family:'Varela Round'">
                    Varela Round
                </div>
                <div class="item" data-value="Quicksand" style="font-family:'Quicksand'">
                    Quicksand
                </div>
                <div class="item" data-value="Racing Sans One" style="font-family: 'Racing Sans One'">
                    Racing Sans One
                </div>
                <div class="item" data-value="Arvo" style="font-family: 'Arvo'">
                    Arvo
                </div>
                <div class="item" data-value="Kadwa" style="font-family:'Kadwa'">
                    Kadwa
                </div>
                <div class="item" data-value="Krona One" style="font-family:'Krona One'">
                    Krona One
                </div>
                <div class="item" data-value="Archivo Black" style="font-family:'Archivo Black'">
                    Archivo Black
                </div> -->
            </div>
        </div>

        <a href="#" class="ibtn tb-reset" id="toolbar-reset2"><i class="icon undo"></i></a>
        <a href="#" class="ibtn tb-redo" id="toolbar-redo2"><i class="icon repeat"></i></a>
    </div>
    <div class="ui bottom attached tab segment" data-tab="color">
        <div class="tb-bgcolor">
            <input type="text" id="toolbar-bgcolor2" />
            <span class="label" id="toolbar-bgcolor-text">Background Color</span>
        </div>
        <div class="tb-color">
            <input type="text" id="toolbar-color2" />
            <span class="label" id="toolbar-color-text">Text Color</span>
        </div>
    </div>
</div>

                