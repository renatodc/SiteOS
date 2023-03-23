import React, { Component } from 'react';
const mainAPI = "../api/main.php";

export default class TopBar extends Component {    
    state = {
        w_saveChanges: 'Save Changes',
        w_uploadFile: 'Upload Files',
        w_logout: 'Logout',
        w_settings: 'My Settings'
    }
    componentDidUpdate(prevProps) {
        if(this.props.language != prevProps.language) {
            switch(this.props.language) {
                case "es":
                    this.setState({
                        w_saveChanges: 'Guardar Cambios',
                        w_uploadFile: 'Subir Archivos',
                        w_logout: 'Cerrar',
                        w_settings: 'Configuración'
                    });
                    break;
                default:
                    break;
            }
        }
    }
    showUserPanel = e => {
        let el = document.querySelector('.userMenu');
        el.style.height = '100px';
        el.style.display = 'block';
    }
    hideUserPanel = e => {
        let el = document.querySelector('.userMenu');
        el.style.height = '0px';
        el.style.display = 'none';
    }
    showLeftMenu = e => {
        let leftMenu = document.querySelector('.ui-body .ui-left');
        let appBody = document.querySelector('.ui-body .ui-center');
        leftMenu.style.zIndex = '6';
        appBody.style.zIndex = '5';
        if (leftMenu.ownerDocument.defaultView.getComputedStyle(leftMenu, null).display === 'none') {
            leftMenu.style.display = 'block';
        } else {
            leftMenu.style.display = 'none';
        }
    }
    async logout() {
        let req = await fetch(mainAPI, {
            method: "POST"
        });
        let res = await req.json();
        window.location.replace("/index");
    }

    render() {
        let editorDisplay = document.querySelector('.ui.segment.editor');
        if(editorDisplay) {
            editorDisplay = editorDisplay.style.visibility;
        }
        let barButtonClass = "ui icon button green";
        let userButtonClass = "ui button principal userButton";
        if(this.props.theme != "light") {
            barButtonClass += " inverted";
            userButtonClass += " inverted";
        }

        return (
            <div id="ui-header">
                <div className="ui-right">
                    <div id="ui-bar">
                        <a href="#" className={barButtonClass}
                        onClick={this.props.saveFile}
                        style={{ display: editorDisplay == 'visible' ? 'block' : 'none' }}>
                            <i className="icon save"></i>
                            <span>{this.state.w_saveChanges}</span>
                        </a>
                        <a href="#" className={barButtonClass} onClick={e => { this.props.uploadFile('') }}>
                            <i className="icon upload"></i>
                            <span>{this.state.w_uploadFile}</span>
                        </a>
                    </div>
                    <div className={userButtonClass} onMouseEnter={this.showUserPanel} onMouseLeave={this.hideUserPanel}>
                        <i className="icon setting"></i>
                        <i className="icon user"></i>
                    </div>
                    <div className="userMenu" onMouseEnter={this.showUserPanel} onMouseLeave={this.hideUserPanel}>
                        <div className="ui vertical menu userOptions">
                            <a className="item" href="#" onClick={this.logout}>
                                <i className="icon power"></i><span>{this.state.w_logout}</span>
                            </a>
                            <a className="item" href="/account">
                                <i className="icon setting"></i><span>{this.state.w_settings}</span>
                            </a>
                            <div className="item userDetails" style={{display: this.props.companyEmail ? 'block' : 'none'}}>
                                <i className="icon envelope"></i><span>{this.props.companyEmail}</span>
                            </div>
                            <div className="item userDetails" style={{display: this.props.companyPhone ? 'block' : 'none'}}>
                                <i className="icon phone"></i><span>{this.props.companyPhone}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="ui-left">
                    <a href="#" id="mobile" onClick={this.showLeftMenu}><i className="icon content"></i></a>
                    <a href="#" id="logo"><img src={this.props.logoPath ? this.props.logoPath : "../img/logo.png"} /><span id="title">{this.props.fileName}</span></a>
                </div>
            </div>
        )
    }
}