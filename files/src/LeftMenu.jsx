import React, { Component } from 'react';
import Popover from '@material-ui/core/Popover';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import icon_ai from './icon/ai.svg';
import icon_audio from './icon/audio.svg';
import icon_config from './icon/config.svg';
import icon_css from './icon/css.svg';
import icon_csv from './icon/csv.svg';
import icon_db from './icon/db.svg';
import icon_eslint from './icon/eslint.svg';
import icon_favicon from './icon/favicon.svg';
import icon_font from './icon/font.svg';
import icon_git from './icon/git.svg';
import icon_html from './icon/html.svg';
import icon_img from './icon/image.svg';
import icon_img2 from './icon/image2.svg';
import icon_java from './icon/java.svg';
import icon_js from './icon/js.svg';
import icon_json from './icon/json.svg';
import icon_less from './icon/less.svg';
import icon_license from './icon/license.svg';
import icon_markdown from './icon/markdown.svg';
import icon_pdf from './icon/pdf.svg';
import icon_php from './icon/php.svg';
import icon_ppt from './icon/powerpoint.svg';
import icon_psd from './icon/psd.svg';
import icon_py from './icon/python.svg';
import icon_react from './icon/react.svg';
import icon_sass from './icon/sass.svg';
import icon_scss from './icon/scss.svg';
import icon_svg from './icon/svg.svg';
import icon_txt from './icon/txt.svg';
import icon_ts from './icon/typescript.svg';
import icon_video from './icon/youtube.svg';
import icon_webpack from './icon/webpack.svg';
import icon_word from './icon/word.svg';
import icon_xls from './icon/excel.svg';
import icon_xml from './icon/xml.svg';
import icon_zip from './icon/zip.svg';
import icon_zip2 from './icon/zip2.svg';
const getIcon = extension => {
    switch(extension) {
        case "ai":
            return <img src={icon_ai} />
        case "css":
            return <img src={icon_css} />
        case "csv":
            return <img src={icon_csv} />
        case "config":
        case "webfolders":
            return <img src={icon_config} />
        case "db":
            return <img src={icon_db} />
        case "doc":
        case "docx":
            return <img src={icon_word} />
        case "font":
            return <img src={icon_font} />
        case "html":
            return <img src={icon_html} />
        case "java":
        case "class":
            return <img src={icon_java} />
        case "jpg":
        case "jpeg":
            return <img src={icon_img} />
        case "png":
        case "bmp":
        case "gif":
            return <img src={icon_img2} />
        case "mp3":
        case "wav":
            return <img src={icon_audio} />
        case "mp4":
        case "flv":
        case "wmv":
            return <img src={icon_video} />
        case "ico":
            return <img src={icon_favicon} />
        case "js":
            return <img src={icon_js} />
        case "jsx":
            return <img src={icon_react} />
        case "json":
            return <img src={icon_json} />
        case "pdf":
            return <img src={icon_pdf} />
        case "php":
            return <img src={icon_php} />
        case "png":
            return <img src={icon_png} />
        case "ppt":
        case "pptx":
            return <img src={icon_ppt} />
        case "psd":
            return <img src={icon_psd} />
        case "py":
            return <img src={icon_py} />
        case "sass":
            return <img src={icon_sass} />
        case "scss":
            return <img src={icon_scss} />
        case "svg":
            return <img src={icon_svg} />
        case "ts":
            return <img src={icon_ts} />
        case "txt":
        case "md":
        case "gitignore":
        case "log":
        case "lock":
            return <img src={icon_txt} />
        case "xls":
        case "xlsx":
            return <img src={icon_xls} />
        case "xml":
            return <img src={icon_xml} />
        case "zip":
            return <img src={icon_zip} />
        case "phar":
        case "tar":
        case "jar":
        case "gz":
            return <img src={icon_zip2} />
        default:
            return <i className='icon file' style={{color: '#bbbbbb'}}></i>
    }
}

export default class LeftMenu extends Component {
    state = {
        isContextFileMenuOpen: false,
        fileMenuTop: 0,
        fileMenuLeft: 0,
        fileMenuName: '',
        fileMenuSize: '',
        fileMenuLastModified: '',
        fileMenuPath: '',
        isFileBeingRenamed: false,
        fileMenuRename: '',
        isFileDeleteModalOpen: false,

        isContextFolderMenuOpen: false,
        folderMenuTop: 0,
        folderMenuLeft: 0,
        folderMenuName: '',
        folderMenuSize: '',
        folderMenuPath: '',
        isFolderBeingRenamed: false,
        folderMenuRename: '',
        isFolderDeleteModalOpen: false,

        w_inbox: 'Inbox',
        w_files: 'Files',
        w_createFolder: 'Create Folder',
        w_createFile: 'Create File',
        w_uploadFile: 'Upload Files',
        w_website: 'Website',
        w_analytics: 'Analytics',
        w_leads: 'Leads',
        w_accounts: 'Email Accounts',
        w_phones: 'Phones',
        w_filter: 'Spam Filter',
        w_domain: 'Domain Name',
        w_rename: 'Rename',
        w_renamePlaceholder: 'Rename...',
        w_copyURL: 'Copy URL',
        w_download: 'Download',
        w_delete: 'Delete',
        w_size: 'Size',
        w_lastmodified: 'Last Modified',
        w_deleteFile: 'Delete File',
        w_deleteFolder: 'Delete Folder',
        w_deleteQuestion: 'Are you sure you would like to delete',
        w_exit: "Exit"
    }
    componentDidUpdate(prevProps) {
        if(this.props.language != prevProps.language) {
            switch(this.props.language) {
                case "es":
                    this.setState({
                        w_inbox: 'Bandeja',
                        w_files: 'Archivos',
                        w_createFolder: 'Crear Carpeta',
                        w_createFile: 'Crear Archivo',
                        w_uploadFile: 'Subir Archivos',
                        w_website: 'Página Web',
                        w_analytics: 'Analítica',
                        w_leads: 'Clientes',
                        w_accounts: 'Cuentas de Correo',
                        w_phones: 'Teléfonos',
                        w_filter: 'Filtro de Spam',
                        w_domain: 'Nombre de Dominio',
                        w_rename: 'Renombrar',
                        w_renamePlaceholder: 'Renombrar...',
                        w_copyURL: 'Copiar Enlace',
                        w_download: 'Descargar',
                        w_delete: 'Eliminar',
                        w_size: 'Tamaño',
                        w_lastmodified: 'Última Modificación',
                        w_exit: "Salir"
                    });
                    break;
                default:
                    break;
            }
        }
    }
    deleteFile = () => {
        this.closeFileMenu();
        this.setState({isFileDeleteModalOpen: false});
        this.props.removeFile(this.state.fileMenuPath,this.state.fileMenuName);
    }
    deleteFolder = () => {
        this.closeFolderMenu();
        this.setState({isFolderDeleteModalOpen: false});
        this.props.removeFolder(this.state.folderMenuPath);
    }
    renameFile = () => {
        this.props.renameFile(this.state.fileMenuPath,this.state.fileMenuName,this.state.fileMenuRename);
        this.closeFileMenu();
    }
    renameFolder = () => {
        this.props.renameFolder(this.state.folderMenuPath,this.state.folderMenuRename);
        this.closeFolderMenu();
    }
    fileContextMenu = (e,name,path,size,modified) => {
        e.preventDefault();
        this.setState({ 
            isContextFileMenuOpen: true, 
            fileMenuTop: e.clientY,
            fileMenuLeft: e.clientX,
            fileMenuName: name,
            fileMenuPath: path,
            fileMenuSize: size,
            fileMenuLastModified: modified,
            fileMenuRename: name
        });
    }
    folderContextMenu = (e,name,root,size) => {
        e.preventDefault();
        this.setState({ 
            isContextFolderMenuOpen: true, 
            folderMenuTop: e.clientY,
            folderMenuLeft: e.clientX,
            folderMenuName: name,
            folderMenuPath: root,
            folderMenuSize: size,
            folderMenuRename: name
        });
    }
    closeFileMenu = () => {
        this.setState({ isContextFileMenuOpen: false, isFileBeingRenamed: false });
    }
    closeFolderMenu = () => {
        this.setState({ isContextFolderMenuOpen: false, isFolderBeingRenamed: false });
    }
    printFiles = (files) => {
        if(Array.isArray(files) && files.length) {
            return files.map((file,i) => {
                let iconPiece = getIcon(file.name.split('.').pop().toLowerCase());
                let tabs = file.path.split("/").length - 1;
                let tabChars = [];
                for(let tabI=0;tabI<tabs;tabI++) {
                    tabChars.push(<span key={tabI}> </span>);
                }
                return (
                    <li key={i} className='sub-link'>
                        <a href='#' 
                        onClick={() => this.props.loadFile(`${file.path}/${file.name}`)} 
                        onContextMenu={(e) => this.fileContextMenu(e,file.name,file.path,file.size,file.modified)}
                        title={file.name}>
                            {tabChars}{iconPiece}<span>{file.name}</span>
                        </a>
                    </li>
                );
            });
        }
    }
    printFolders = folders => {
        if(Array.isArray(folders) && folders.length) {
            return folders.map(folder => {
                let files = this.printFiles(folder.files);
                let subfolders = this.printFolders(folder.folders);
                let folderIcon = parseInt(folder.isOpen) ? 'icon folder open outline' : 'icon folder';
                let folderOpenStyle = {display: parseInt(folder.isOpen) ? 'block' : 'none'};

                let tabs = folder.root.split("/").length - 2;
                let tabChars = [];
                for(let tabI=0;tabI<tabs;tabI++) {
                    tabChars.push(<span key={tabI}> </span>);
                }
                return (
                    <div key={folder.name}>
                        <li className='sub-link'>
                            <a href='#' 
                            onClick={() => {this.props.toggleFolder(folder.root)}}
                            onContextMenu={(e) => this.folderContextMenu(e,folder.name,folder.root,folder.size)}
                            title={folder.name}>
                                {tabChars}<i className={folderIcon}></i><span>{folder.name}</span>
                            </a>
                        </li>
                        <div className="submenu" style={folderOpenStyle}>
                            {subfolders}
                            <span>{files}</span>
                        </div>
                    </div>
                );
            });
        }
    }
    render() {
        let folders = this.printFolders(this.props.folders);
        let files = this.printFiles(this.props.files);
        let iconPiece = null;
        if(this.state.fileMenuName) {
            iconPiece = getIcon(this.state.fileMenuName.split('.').pop().toLowerCase());
        }
        let dialogPositiveButtonClass = "ui red button positive";
        let dialogNegativeButtonClass = "ui red button negative";
        if(this.props.theme != "light") {
            dialogPositiveButtonClass += " inverted";
            dialogNegativeButtonClass += " inverted";
        }
        let domainLink = "/domain";
        let domainRoot = this.props.domainName;
        return (
            <nav>
                <ul>
                    <li id="module-mail"><a className="inbox dropzone" href="/mail" id="app-mail"><i className="icon inbox"></i><span>{this.state.w_inbox}</span><span id="counter-inbox-new"></span></a></li>
                    <div className="submenu" id="nav-mail-list"></div>                    
                    <li id="module-builder"><a href="/builder"><i className="icon world"></i><span>{this.state.w_website}</span></a></li>
                    <div className="submenu" id="nav-website-list"></div>
                    <li id="module-analytics"><a href="/analytics"><i className="icon pie chart"></i><span>{this.state.w_analytics}</span></a></li>
                    <li id="module-leads"><a href="/leads"><i className="icon users"></i><span>{this.state.w_leads}</span></a></li>
                    <div className="submenu" id="nav-lead-list"></div>
                </ul>
                <ul>
                    <li id="module-accounts" style={{ display: (this.props.isOwner) ? 'block' : 'none' }}><a href="/accounts"><i className="icon envelope"></i><span>{this.state.w_accounts}</span></a></li>
                    <li id="module-filter"><a href="/filter"><i className="icon ban"></i><span>{this.state.w_filter}</span></a></li>
                    <li id="module-files"><a href="/files"><i className="icon folder"></i><span>{this.state.w_files}</span></a></li>
                    <div className="submenu" id="nav-folders">
                        <div className="ui basic segment">
                            {folders}
                            {files}
                            <div className="ui small loader"></div>
                        </div>
                        <li className='sub-link'>
                            <a href='#' onClick={e => this.props.uploadFile('')}>
                                <i className="icon upload"></i><span>{this.state.w_uploadFile}</span>
                            </a>
                        </li>
                        <li className='sub-link'>
                            <a href='#' onClick={e => this.props.createFile('')}>
                                <i className="icon plus"></i><span>{this.state.w_createFile}</span>
                            </a>
                        </li>
                        <li className='sub-link'>
                            <a href='#' onClick={e => this.props.createFolder('')}>
                                <i className="icon plus"></i><span>{this.state.w_createFolder}</span>
                            </a>
                        </li>
                    </div>
                </ul>
                <Popover 
                anchorReference="anchorPosition" 
                anchorPosition={{ top: this.state.fileMenuTop, left: this.state.fileMenuLeft }}
                open={this.state.isContextFileMenuOpen}
                onClose={this.closeFileMenu} >
                    <div className="contextmenu">
                        <div className="title" >
                            <span>{iconPiece}</span>
                            <div style={{display: this.state.isFileBeingRenamed ? 'none' : 'inline-block'}}>{this.state.fileMenuName}</div>
                            <div style={{display: this.state.isFileBeingRenamed ? 'inline-block' : 'none'}}>
                                <div className="ui action input">
                                    <input type="text" placeholder={this.state.w_renamePlaceholder} style={{height: 24}}
                                    value={this.state.fileMenuRename} 
                                    onChange={(e) => this.setState({ fileMenuRename: e.target.value })} 
                                    onKeyPress={(e) => { if(e.which == 13) { this.renameFile() }} } />
                                    <div className="ui button" onClick={this.renameFile} style={{height: 24, fontSize: 12}}>
                                        <i className="icon check" style={{color: '#189a18'}}></i>{this.state.w_rename}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className="links">
                            <li>
                                <CopyToClipboard text={domainRoot + this.state.fileMenuPath + '/' + this.state.fileMenuName}>
                                    <a href="#" onClick={() => {this.setState({isContextFileMenuOpen: false})}}><i className="icon copy"></i><span>{this.state.w_copyURL}</span></a>
                                </CopyToClipboard>
                            </li>
                            <li><a href="#" onClick={() => this.props.downloadFile(`${this.state.fileMenuPath}/${this.state.fileMenuName}`)}><i className="icon download"></i><span>{this.state.w_download}</span></a></li>
                            <li><a href="#" onClick={() => this.setState({ isFileBeingRenamed: 1 - this.state.isFileBeingRenamed })}><i className="icon edit"></i><span>{this.state.w_rename}</span></a></li>
                            <li><a href="#" onClick={() => this.setState({ isFileDeleteModalOpen: true, isContextFileMenuOpen: false })} className="remove"><i className="icon trash"></i><span>{this.state.w_delete}</span></a></li>
                        </ul>
                        <div className="data">
                            <div>{this.state.w_size}: {this.state.fileMenuSize}</div>
                            <div>{this.state.w_lastmodified}: {this.state.fileMenuLastModified}</div>
                        </div>
                    </div>
                </Popover>
                <Popover 
                anchorReference="anchorPosition"
                anchorPosition={{ top: this.state.folderMenuTop, left: this.state.folderMenuLeft }}
                open={this.state.isContextFolderMenuOpen}
                onClose={this.closeFolderMenu} >
                    <div className="contextmenu">
                        <div className="title" >
                            <span><i className='icon folder' style={{color: '#ffca28'}}></i></span>
                            <div style={{display: this.state.isFolderBeingRenamed ? 'none' : 'inline-block'}}>{this.state.folderMenuName}</div>
                            <div style={{display: this.state.isFolderBeingRenamed ? 'inline-block' : 'none'}}>
                                <div className="ui action input">
                                    <input type="text" placeholder={this.state.w_renamePlaceholder} style={{height: 24}}
                                    value={this.state.folderMenuRename} 
                                    onChange={(e) => this.setState({ folderMenuRename: e.target.value })} 
                                    onKeyPress={(e) => { if(e.which == 13) { this.renameFolder() }} }
                                    />
                                    <div className="ui button" onClick={this.renameFolder} style={{height: 24, fontSize: 12}}>
                                        <i className="icon check" style={{color: '#189a18'}}></i>{this.state.w_rename}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className="links">
                            <li><a href="#" onClick={() => {this.setState({isContextFolderMenuOpen: false});this.props.uploadFile(this.state.folderMenuPath)}}><i className="icon upload"></i><span>{this.state.w_uploadFile}</span></a></li>
                            <li><a href="#" onClick={() => {this.setState({isContextFolderMenuOpen: false});this.props.createFile(this.state.folderMenuPath)}}><i className="icon plus"></i><span>{this.state.w_createFile}</span></a></li>
                            <li><a href="#" onClick={() => {this.setState({isContextFolderMenuOpen: false});this.props.createFolder(this.state.folderMenuPath)}}><i className="icon plus"></i><span>{this.state.w_createFolder}</span></a></li>
                            <li><a href="#" onClick={() => this.setState({ isFolderBeingRenamed: 1 - this.state.isFolderBeingRenamed })}><i className="icon edit"></i><span>{this.state.w_rename}</span></a></li>
                            <li><a href="#" onClick={() => this.setState({ isFolderDeleteModalOpen: true, isContextFolderMenuOpen: false })} className="remove"><i className="icon trash"></i><span>{this.state.w_delete}</span></a></li>
                        </ul>
                        <div className="data">
                            <div>{this.state.w_size}: {this.state.folderMenuSize}</div>
                        </div>
                    </div>
                </Popover>
                <Dialog className="dialog" maxWidth="xs" fullWidth={true}
                open={this.state.isFileDeleteModalOpen} 
                onClose={() => this.setState({isFileDeleteModalOpen: false})}>
                    <DialogTitle className="header">
                        <i className="icon trash"></i><span>{this.state.w_deleteFile}</span>
                    </DialogTitle>
                    <DialogContent className="content">
                        <div style={{padding: '4px 10px 14px'}}>
                            <p>{this.state.w_deleteQuestion} <span style={{fontWeight: 'bold'}}>{this.state.fileMenuPath}/{this.state.fileMenuName}</span>?</p>
                        </div>
                    </DialogContent>
                    <DialogActions className="actions">
                        <div className={dialogNegativeButtonClass} onClick={() => this.setState({isFileDeleteModalOpen: false})}>
                            <i className="icon cancel"></i>
                            <span>{this.state.w_exit}</span>
                        </div>
                        <div className={dialogPositiveButtonClass} onClick={this.deleteFile}>
                            <i className="icon trash"></i>
                            <span>{this.state.w_deleteFile}</span>
                        </div>
                    </DialogActions>
                </Dialog>
                <Dialog className="dialog" maxWidth="xs" fullWidth={true}
                open={this.state.isFolderDeleteModalOpen} 
                onClose={() => this.setState({isFolderDeleteModalOpen: false})}>
                    <DialogTitle className="header">
                        <i className="icon trash"></i><span>{this.state.w_deleteFolder}</span>
                    </DialogTitle>
                    <DialogContent className="content">
                        <div style={{padding: '4px 10px 14px'}}>
                            <p>{this.state.w_deleteQuestion} <span style={{fontWeight: 'bold'}}>{this.state.folderMenuPath}</span>?</p>
                        </div>
                    </DialogContent>
                    <DialogActions className="actions">
                        <div className={dialogNegativeButtonClass} onClick={() => this.setState({isFolderDeleteModalOpen: false})}>
                            <i className="icon cancel"></i>
                            <span>{this.state.w_exit}</span>
                        </div>
                        <div className={dialogPositiveButtonClass} onClick={this.deleteFolder}>
                            <i className="icon trash"></i>
                            <span>{this.state.w_deleteFolder}</span>
                        </div>
                    </DialogActions>
                </Dialog>
            </nav>
        )
    }
}
