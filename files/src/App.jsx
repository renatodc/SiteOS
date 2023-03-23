import React, { Component } from 'react';
import TopBar from './TopBar';
import LeftMenu from './LeftMenu';
import Dropzone from './Dropzone';
import Progress from './Progress';
import MonacoEditor from 'react-monaco-editor';
import { configure, GlobalHotKeys } from 'react-hotkeys';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

const editorOptions = {
    selectOnLineNumbers: true,
    language: 'html',
    automaticLayout: true
}
const mainAPI = "../api/main.php";
const fileCabAPI = "../api/filecab.php";
const fileDownloadAPI = "../api/filedownload.php";
const folderCabAPI = "../api/foldercab.php";
const fileuploadAPI = "../api/fileupload.php";

const jsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
const FileType = {
    "TEXT": 0,
    "IMAGE": 1,
    "AUDIO": 2,
    "VIDEO": 3,
    "OTHER": 4
}
const keyMap = {
    SAVE: "ctrl+s"
}
configure({
    ignoreTags: []
});

export default class App extends Component {
    state = {
        files: [],
        folders: [],
        companyEmail: '',
        companyPhone: '',
        editorMounted: false,
        srcDoc: '',
        srcLink: '',
        srcFile: 'Files',
        domainName: '',
        subDomain: '',
        editor: null,
        imgSrc: '../img/data/loading.gif',
        audioSrc: '../img/data/audio.mp3',
        videoSrc: '../img/data/video.mp4',

        isOwner: false,
        logoPath: "../img/logo.png",

        folderPath: '',
        isCreateFolderDialogOpen: false,
        isCreateFileDialogOpen: false,
        isUploadFileDialogOpen: false,
        createFolderName: '',
        createFileName: '',

        uploadedFiles: [],
        isUploading: false,
        uploadProgress: {},
        successfullyUploaded: false,

        isSnackSuccessOpen: false,
        isSnackErrorOpen: false,
        snackMsg: '',

        monacoTheme: 'vs-light',
        theme: 'standard',

        language: 'en',
        w_loading: 'Loading',
        w_saving: 'Saving',
        w_placeholder: 'Click on a file to view its contents here',
        w_createFolder: 'Create Folder',
        w_folderName: 'Folder Name',
        w_fileName: 'File Name',
        w_createFolderErrorHeader: 'Folder Name Missing',
        w_createFolderErrorMessage: 'Please type in a name for your new folder.',
        w_createFolderWarningHeader: 'Folder Name Already Exists',
        w_createFolderWarningMessage: 'Please type in a different name for your new folder.',
        w_createFileErrorHeader: 'File Name Missing',
        w_createFileErrorMessage: 'Please type in a name for your new file.',
        w_createFileWarningHeader: 'File Name Already Exists',
        w_createFileWarningMessage: 'Please type in a different name for your new file.',
        w_createFile: 'Create File',
        w_uploadFile: 'Upload Files',
        w_file: 'File',
        w_browse: 'Browse',
        w_browsePlaceholder: 'Browse...',
        w_url: 'URL',
        w_copyURL: 'Copy URL',
        w_uploadFileErrorHeader: 'Files Missing',
        w_uploadFileErrorMessage: 'Please choose a file to upload.',
        w_uploadFileWarningHeader: 'Server Error',
        w_uploadFileWarningMessage: 'Uploading failed.',
        w_exit: 'Exit',
        w_clear: 'Clear',

        w_snack_save_pass: "Save successful",
        w_snack_save_fail: "Error saving file",
        w_snack_upload_pass: "Uploading successful",
        w_snack_upload_fail: "Uploading failed",
        w_snack_file_remove_pass: "File removed",
        w_snack_file_remove_fail: "Unable to remove file",
        w_snack_file_rename_pass: "File renamed",
        w_snack_file_rename_fail: "Unable to rename file",
        w_snack_file_create_pass: "File created",
        w_snack_file_create_fail: "Unable to create file",
        w_snack_folder_create_pass: "Folder created",
        w_snack_folder_remove_pass: "Folder removed",
        w_snack_folder_remove_fail: "Unable to remove folder",
        w_snack_folder_rename_pass: "Folder renamed",
        w_snack_folder_rename_fail: "Unable to rename folder"
    }
    // #region INITIALIZATION
    async componentDidMount() {
        // LOAD CUSTOMER INFO
        let req = await fetch(mainAPI);
        let res = await req.json();
        let mainCustomer = res.data;
        let companyEmail = mainCustomer.CompanyEmail;
        let companyPhone = mainCustomer.CompanyPhone;
        let domainName = mainCustomer.DomainName;
        let subDomain = mainCustomer.SubDomain;
        this.setState({ companyEmail, companyPhone, domainName, subDomain });
        
        this.loadDomainDirectory();

        let language = mainCustomer.CustomerLanguage;
        let theme = mainCustomer.CustomerTheme;
        let monacoTheme = "vs-light";
        switch(theme) {
            case "neonblue":
            case "neonred":
            case "neongreen":
                monacoTheme = "vs-dark";
                break;
        }
        let isOwner = parseInt(mainCustomer.IsOwner);
        this.setState({ language, theme, monacoTheme, isOwner });
        switch(language) {
            case "es":
                this.setState({
                    srcFile: 'Archivos',
                    w_loading: 'Cargando',
                    w_saving: 'Grabando',
                    w_placeholder: 'Haga clic en un archivo para ver su contenido aquí',
                    w_createFolder: 'Crear Carpeta',
                    w_folderName: 'Nombre de la Carpeta',
                    w_fileName: 'Nombre del Archivo',
                    w_createFolderErrorHeader: 'Nombre de Carpeta Vacía',
                    w_createFolderErrorMessage: 'Escriba un nombre para su nueva carpeta.',
                    w_createFolderWarningHeader: 'El nombre de la carpeta ya existe',
                    w_createFolderWarningMessage: 'Escriba un nombre diferente para su nueva carpeta.',  
                    w_createFileErrorHeader: 'Nombre de Archivo Vacío',
                    w_createFileErrorMessage: 'Escriba un nombre para su nuevo archivo.',
                    w_createFileWarningHeader: 'El nombre del archivo ya existe',
                    w_createFileWarningMessage: 'Escriba un nombre diferente para su nuevo archivo.',           
                    w_createFile: 'Crear Archivo',
                    w_uploadFile: 'Subir Archivos',
                    w_file: 'Archivo',
                    w_browse: 'Buscar',
                    w_browsePlaceholder: 'Buscar...',
                    w_url: 'Enlace',
                    w_copyURL: 'Copiar Enlace',
                    w_uploadFileErrorHeader: 'No Hay Archivos',
                    w_uploadFileErrorMessage: 'Por favor, elija un archivo para subir.',
                    w_uploadFileWarningHeader: 'Error de Servidor',
                    w_uploadFileWarningMessage: 'La subida ha fallado.',
                    w_exit: 'Salir',
                    w_clear: 'Limpiar',
                    
                    w_snack_save_pass: "Grabación exitosa",
                    w_snack_save_fail: "Error al grabar archivo",
                    w_snack_upload_pass: "Subida exitosa",
                    w_snack_upload_fail: "La subida ha fallado",
                    w_snack_file_remove_pass: "Archivo borrado",
                    w_snack_file_remove_fail: "No se pudo borrar el archivo",
                    w_snack_file_rename_pass: "Archivo renombrado",
                    w_snack_file_rename_fail: "No se pudo renombrar el archivo",
                    w_snack_file_create_pass: "Archivo creado",
                    w_snack_file_create_fail: "No se pudo crear el archivo",
                    w_snack_folder_create_pass: "Carpeta creada",
                    w_snack_folder_remove_pass: "Carpeta borrada",
                    w_snack_folder_remove_fail: "No se pudo borrar la carpeta",
                    w_snack_folder_rename_pass: "Carpeta renombrada",
                    w_snack_folder_rename_fail: "No se pudo renombrar la carpeta"
                });
                break;
            default:
                break;
        }
        if(mainCustomer.Logo) {
            this.state.logoPath = mainCustomer.Logo;
        }
        if(mainCustomer.CustomerBaseColor) {
            document.documentElement.style.setProperty('--color-primary', mainCustomer.CustomerBaseColor);
            document.documentElement.style.setProperty('--color-ui-bar-link', mainCustomer.CustomerBaseColor);
        }
    }
    loadDomainDirectory = async () => {
        document.querySelector("nav .ui.basic.segment .ui.loader").classList.add("active");
        // LOAD WEBSITE DOMAIN DIRECTORY
        let res = await fetch(folderCabAPI);
        let data = await res.json();
        let directory = data.data.directory;
        let files = directory.files;
        let folders = directory.folders;
        this.setState({ files, folders });
        document.querySelector("nav .ui.basic.segment .ui.loader").classList.remove("active");
    }
    // #endregion
    // #region HELPER METHODS
    recursiveFolderToggle = (folders,root) => {
        return folders.map(folder => {
            if(folder.root == root) {
                folder.isOpen = 1 - parseInt(folder.isOpen);
            }  
            folder.folders = this.recursiveFolderToggle(folder.folders, root);
            return folder;
        });
    }
    toggleFolder = root => {
        let folders = this.recursiveFolderToggle(this.state.folders,root);
        this.setState({folders});
    }
    editorDidMount = (editor, monaco) => {
        this.setState({editorMounted: true});
    }
    mountEditor = file => {
        if(this.state.editorMounted) {
            let extension = file.split('.').pop().toLowerCase();
            switch(extension) {
                case "css":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'css');
                    break;
                case "csharp":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'csharp');
                    break;
                case "html":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'html');
                    break;
                case "java":
                case "class":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'java');
                    break;
                case "js":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'javascript');
                    break;
                case "json":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'json');
                    break;
                case "ts":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'typescript');
                    break;
                case "php":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'php');
                    break;
                case "py":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'python');
                    break;
                case "sass":
                case "scss":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'scss');
                    break;
                case "sql":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'sql');
                    break;
                case "xml":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'xml');
                    break;
                case "txt":
                case "md":
                case "gitignore":
                case "log":
                case "lock":
                case "config":
                case "webfolders":
                    window.monaco.editor.setModelLanguage(window.monaco.editor.getModels()[0], 'markdown');
                    break;
            }
        }
    }
    getFileType = extension => {
        switch(extension) {
            case "css":
            case "csharp":
            case "html":
            case "java":
            case "class":
            case "js":
            case "jsx":
            case "json":
            case "ts":
            case "php":
            case "py":
            case "sass":
            case "scss":
            case "sql":
            case "xml":
            case "txt":
            case "md":
            case "gitignore":
            case "log":
            case "lock":
            case "config":
            case "webfolders":
                return FileType.TEXT;
            case "mp3":
            case "wav":
                return FileType.AUDIO;
            case "mp4":
            case "flv":
            case "wmv":
                return FileType.VIDEO;
            case "ico":
            case "jpg":
            case "jpeg":
            case "png":
            case "bmp":
            case "gif":
                return FileType.IMAGE;
            default:
                return FileType.OTHER;
        }
    }
    getFileTypePanel = fileType => {
        switch(fileType) {
            case FileType.TEXT:
                return "editor";
            case FileType.IMAGE:
                return "image";
            case FileType.AUDIO:
                return "audio"; 
            case FileType.VIDEO:
                return "video"; 
        }
    }
    triggerFileChange = () => {
        document.querySelector("#uploadfile").click();
    }
    triggerURLSelection = () => {
        document.querySelector("#uploadfile-url").select();
    }
    copyURL = () => {
        this.triggerURLSelection();
        document.execCommand("copy");
    }
    // #endregion
    // #region BASIC FILE METHODS
    downloadFile = async file => {
        document.querySelector(`.ui.segment.audio`).style.visibility = 'visible';
        document.querySelector(`.ui.dimmer.audio.save`).classList.add("active");
        let res = await fetch(fileDownloadAPI, {
            method: 'POST',
            body: JSON.stringify({file})
        });
        let blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = file.split("/").pop();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        document.querySelector(`.ui.dimmer.audio.save`).classList.remove("active");
        document.querySelector(`.ui.segment.audio`).style.visibility = 'hidden';
    }
    loadFile = async file => {
        let extension = file.split('.').pop().toLowerCase();
        let fileType = this.getFileType(extension);
        let fileTypePanel = this.getFileTypePanel(fileType);
        let srcLink = "";
        if(this.state.domainName) {
            srcLink = `https://${this.state.domainName}${file}`;
        }
        let srcFile = file;
        this.setState({ srcLink, srcFile });

        document.querySelector(`.ui.segment.placeholder`).style.visibility = 'hidden';
        document.querySelector(`.ui.segment.editor`).style.visibility = 'hidden';
        document.querySelector(`.ui.segment.image`).style.visibility = 'hidden';
        document.querySelector(`.ui.segment.audio`).style.visibility = 'hidden';
        document.querySelector(`.ui.segment.video`).style.visibility = 'hidden';

        if(fileType != FileType.OTHER) {
            document.querySelector(`.ui.segment.${fileTypePanel}`).style.visibility = 'visible';
            document.querySelector(`.ui.dimmer.${fileTypePanel}.load`).classList.add("active");
        } else {
            this.downloadFile(file);
            document.querySelector(`.ui.segment.placeholder`).style.visibility = 'visible';
            return true;
        }

        switch(fileType) {
            case FileType.TEXT:
                let res = await fetch(fileDownloadAPI, {
                    method: 'PUT',
                    headers: jsonHeaders,
                    body: JSON.stringify({file})
                });
                let data = await res.json();
                let srcDoc = data.data.file;
                this.setState({ srcDoc });
                this.mountEditor(file);
                break;
            case FileType.IMAGE:
                let imgSrc = srcLink;
                this.setState({ imgSrc });
                break;
            case FileType.AUDIO:
                let audioSrc = srcLink;
                this.setState({ audioSrc });
                break;
            case FileType.VIDEO:
                let videoSrc = srcLink;
                this.setState({ videoSrc });
                break;
        }

        if(fileType != FileType.OTHER) {
            document.querySelector(`.ui.dimmer.${fileTypePanel}.load`).classList.remove("active");
        }

    }
    saveFile = async () => {
        let srcDoc = window.monaco.editor.getModels()[0].getValue();
        let file = this.state.srcFile; 
        if(file == "Files" || !file) {
            return false;
        }
        let payload = { file, srcDoc }
        document.querySelector(".ui.dimmer.editor.save").classList.add("active");
        let res = await fetch(fileCabAPI, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify(payload)
        });
        res = await res.json();
        document.querySelector(".ui.dimmer.editor.save").classList.remove("active");
        if(parseInt(res.success)) {
            this.setState({ srcDoc, isSnackSuccessOpen: true, snackMsg: this.state.w_snack_save_pass});
        } else {
            this.setState({ srcDoc, isSnackErrorOpen: true, snackMsg: this.state.w_snack_save_fail});
        }  
    }
    // #endregion
    // #region UPLOAD METHODS
    onFilesAdded = (files) => {
        this.setState(prevState => ({
            uploadedFiles: prevState.uploadedFiles.concat(files)
        }));
    }
    uploadFiles = async () => {
        document.querySelector(".dialog.uploadfile .ui.form").classList.remove("error");
        document.querySelector(".dialog.uploadfile .ui.form").classList.remove("warning");
        if(!this.state.uploadedFiles.length) {
            document.querySelector(".dialog.uploadfile .ui.form").classList.add("error");
            return false;
        }
        this.setState({ uploadProgress: {}, isUploading: true });
        let promises = [];
        this.state.uploadedFiles.forEach(file => {
            promises.push(this.sendRequest(file));
        });
        try {
            await Promise.all(promises);
            this.setState({ successfullyUploaded: true, isUploading: false, isSnackSuccessOpen: true, snackMsg: this.state.w_snack_upload_pass });
            this.loadDomainDirectory();
        } catch (e) {
            document.querySelector(".dialog.uploadfile .ui.form").classList.add("warning");
        }
    }    
    sendRequest(file) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.upload.addEventListener("progress", event => {
                if (event.lengthComputable) {
                let copy = { ...this.state.uploadProgress };
                copy[file.name] = {
                    state: "pending",
                    percentage: (event.loaded / event.total) * 100
                };
                this.setState({ uploadProgress: copy });
                }
            });
            req.upload.addEventListener("load", event => {
                let copy = { ...this.state.uploadProgress };
                copy[file.name] = { state: "done", percentage: 100 };
                this.setState({ uploadProgress: copy });
                resolve(req.response);
            });
            req.upload.addEventListener("error", event => {
                let copy = { ...this.state.uploadProgress };
                copy[file.name] = { state: "error", percentage: 0 };
                this.setState({ uploadProgress: copy });
                reject(req.response);
            });

            let formData = new FormData();
            formData.append("files[]", file, file.name);
            formData.append('folder',this.state.folderPath);
            req.open("POST", fileuploadAPI);
            req.send(formData);
        });
    }
    renderProgress(file) {
        let uploadProgress = this.state.uploadProgress[file.name];
        return (
            <div className="uploadfile-bar-wrapper">
                <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
                <i className="icon check circle" 
                    style={{ color: "#4caf50", opacity: uploadProgress && uploadProgress.state === "done" ? 1 : 0.2 }}></i>
            </div>
        );
    }
    openUploadFileDialog = (folderPath = '') => {
        this.setState({ folderPath, isUploadFileDialogOpen: true });
    }
    closeUploadFileDialog = () => {
        this.setState({ isUploadFileDialogOpen: false, uploadedFiles: [], successfullyUploaded: false });
    }
    // #endregion
    // #region FILE METHODS
    removeFile = async (path, file) => {
        let payload = {
            path,
            file
        }    
        let res = await fetch(fileCabAPI, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });
        res = await res.json();
        if(parseInt(res.success)) {
            this.loadDomainDirectory();
        } else {
            this.setState({ isSnackErrorOpen: true, snackMsg: this.state.w_snack_file_remove_fail});
        }     
    }
    renameFile = async (path, oldFileName, newFileName) => {
        let payload = {
            path,
            oldFileName,
            newFileName
        }    
        let res = await fetch(fileCabAPI, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
        res = await res.json();       
        if(parseInt(res.success)) {
            this.loadDomainDirectory();
        } else {
            this.setState({ isSnackErrorOpen: true, snackMsg: this.state.w_snack_file_rename_fail});            
        }      
    }
    openCreateFileDialog = (folderPath = '') => {
        this.setState({ folderPath, isCreateFileDialogOpen: true });
    }
    closeCreateFileDialog = () => {
        this.setState({ isCreateFileDialogOpen: false, folderPath: '' });
    }
    createFile = async () => {
        document.querySelector(".dialog.createfile .ui.form").classList.remove("error");
        document.querySelector(".dialog.createfile .ui.form").classList.remove("warning");
        if(this.state.createFileName == '') {
            document.querySelector(".dialog.createfile .ui.form").classList.add("error");
            return false;
        }
        let payload = {
            srcDoc: "",
            file: `${this.state.folderPath}/${this.state.createFileName}`,
            create: 1
        }   
        document.querySelector("#create-file-name").classList.add("loading"); 
        let res = await fetch(fileCabAPI, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify(payload)
        });
        res = await res.json();
        document.querySelector("#create-file-name").classList.remove("loading");
        switch(parseInt(res.success)) {
            case 1:
                this.setState({ createFileName: '' });
                this.closeCreateFileDialog();
                this.loadDomainDirectory();
                break;
            case 2:
                document.querySelector(".dialog.createfile .ui.form").classList.add("warning");
                break;
            case 0:
                this.setState({ isSnackErrorOpen: true, snackMsg: this.state.w_snack_file_create_fail });
                break;
        }
    }
    createFileNameChange = e => {
        let createFileName = e.target.value;
        this.setState({ createFileName });
    }
    // #endregion
    // #region FOLDER METHODS
    openCreateFolderDialog = (folderPath = '') => {
        this.setState({ folderPath, isCreateFolderDialogOpen: true });
    }
    closeCreateFolderDialog = () => {
        this.setState({ isCreateFolderDialogOpen: false, folderPath: '' });
    }
    createFolder = async () => {
        document.querySelector(".dialog.createfolder .ui.form").classList.remove("error");
        document.querySelector(".dialog.createfolder .ui.form").classList.remove("warning");
        if(this.state.createFolderName == '') {
            document.querySelector(".dialog.createfolder .ui.form").classList.add("error");
            return false;
        }
        let payload = {
            path: this.state.folderPath,
            folder: this.state.createFolderName
        }    
        document.querySelector("#create-folder-name").classList.add("loading");
        let res = await fetch(folderCabAPI, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify(payload)
        });
        res = await res.json();
        document.querySelector("#create-folder-name").classList.remove("loading");
        if(parseInt(res.success)) {
            this.setState({ createFolderName: '' });
            this.closeCreateFolderDialog();
            this.loadDomainDirectory();
        } else {
            document.querySelector(".dialog.createfolder .ui.form").classList.add("warning");
        }
    }
    createFolderNameChange = e => {
        let createFolderName = e.target.value;
        this.setState({ createFolderName });
    }
    removeFolder = async (path) => {
        let payload = { path }    
        let res = await fetch(folderCabAPI, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });
        res = await res.json();
        if(parseInt(res.success)) {
            this.loadDomainDirectory();
        } else {
            this.setState({ isSnackErrorOpen: true, snackMsg: this.state.w_snack_folder_remove_fail });
        } 
    }
    renameFolder = async (path, newFolderName) => {
        let pathPrefix = path.substring(0,path.lastIndexOf('/')+1);
        let newPath = pathPrefix + newFolderName;        
        let payload = {
            oldPath: path,
            newPath
        }    
        let res = await fetch(folderCabAPI, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
        res = await res.json();
        if(parseInt(res.success)) {
            this.loadDomainDirectory();
        } else {
            this.setState({ isSnackErrorOpen: true, snackMsg: this.state.w_snack_folder_rename_fail });            
        }
    }
    // #endregion
    render() {
        let dialogPositiveButtonClass = "ui green button positive";
        let dialogButtonClass = "ui principal button positive";
        let dialogNegativeButtonClass = "ui red button negative";
        if(this.state.theme != "light") {
            dialogPositiveButtonClass += " inverted";
            dialogButtonClass += " inverted";
            dialogNegativeButtonClass += " inverted";
        }
        let keyHandlerEditor = {
            SAVE: (event) => {
                event.preventDefault();
                this.saveFile();
            }
        }
        return (
            <div>
                <GlobalHotKeys keyMap={keyMap} handlers={keyHandlerEditor} />
                <TopBar saveFile={this.saveFile} 
                fileName={this.state.srcFile.split("/").pop()} 
                companyEmail={this.state.companyEmail} 
                companyPhone={this.state.companyPhone}
                uploadFile={this.openUploadFileDialog}
                logoPath={this.state.logoPath}
                language={this.state.language}
                theme={this.state.theme}></TopBar>
                <div className="ui-body">
                    <div className="ui-left">
                        <LeftMenu loadFile={this.loadFile}
                        toggleFolder={this.toggleFolder}
                        files={this.state.files} 
                        folders={this.state.folders}
                        createFolder={this.openCreateFolderDialog}
                        createFile={this.openCreateFileDialog}
                        uploadFile={this.openUploadFileDialog}
                        downloadFile={this.downloadFile}
                        domainName={this.state.domainName}
                        subDomain={this.state.subDomain}
                        removeFile={this.removeFile}
                        renameFile={this.renameFile}
                        removeFolder={this.removeFolder}
                        renameFolder={this.renameFolder}
                        isOwner={this.state.isOwner}
                        language={this.state.language}
                        theme={this.state.theme}></LeftMenu>
                    </div>
                    <div className="ui-center">
                        <div id="web-canvas">
                            <div className="ui segment editor"> 
                                <div className="ui dimmer editor load">
                                    <div className="ui text loader">{this.state.w_loading}</div>
                                </div>
                                <div className="ui dimmer editor save">
                                    <div className="ui text loader">{this.state.w_saving}</div>
                                </div>
                                <MonacoEditor
                                    height="100%"
                                    theme={this.state.monacoTheme}
                                    language="html"
                                    value={this.state.srcDoc}
                                    options={editorOptions}
                                    editorDidMount={this.editorDidMount}
                                />
                            </div>
                            <div className="ui segment placeholder">
                                <div className="ui icon header">
                                    <i className="icon folder"></i>
                                    {this.state.w_placeholder}
                                </div>
                            </div>
                            <div className="ui segment image"> 
                                <div className="ui dimmer image load">
                                    <div className="ui text loader">{this.state.w_loading}</div>
                                </div>
                                <img src={this.state.imgSrc} />
                            </div>
                            <div className="ui segment audio"> 
                                <div className="ui dimmer audio load">
                                    <div className="ui text loader">{this.state.w_loading}</div>
                                </div>
                                <div className="ui dimmer audio save">
                                    <div className="ui text loader">{this.state.w_saving}</div>
                                </div>
                                <audio controls src={this.state.audioSrc}>
                                </audio>
                            </div>
                            <div className="ui segment video"> 
                                <div className="ui dimmer video load">
                                    <div className="ui text loader">{this.state.w_loading}</div>
                                </div>
                                <video controls src={this.state.videoSrc}>
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog className="dialog uploadfile" open={this.state.isUploadFileDialogOpen} onClose={this.closeUploadFileDialog} maxWidth="xs" fullWidth={true}>
                    <DialogTitle className="header">
                        <i className="icon upload"></i><span>{this.state.w_uploadFile}</span>
                    </DialogTitle>
                    <DialogContent className="content">
                        <div className="ui form">
                            <div className="field" id="uploadfile-field">
                                <label style={{ display: this.state.folderPath ? 'block' : 'none' }}>{this.state.folderPath}</label>
                                <Dropzone onFilesAdded={this.onFilesAdded} language={this.state.language} 
                                disabled={this.state.isUploading || this.state.successfullyUploaded} />
                            </div>
                            <div>
                                {this.state.uploadedFiles.map(file => {
                                    return (
                                        <div key={file.name} className="uploadfile-row">
                                        <span className="uploadfile-name">{file.name}</span>
                                        {this.renderProgress(file)}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="ui error message">
                                <div className="header">{this.state.w_uploadFileErrorHeader}</div>
                                <p>{this.state.w_uploadFileErrorMessage}</p>
                            </div>
                            <div className="ui warning message">
                                <div className="header">{this.state.w_uploadFileWarningHeader}</div>
                                <p>{this.state.w_uploadFileWarningMessage}</p>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions className="actions">
                        <div className={dialogNegativeButtonClass} onClick={this.closeUploadFileDialog}>
                            <i className="icon cancel"></i>
                            <span>{this.state.w_exit}</span>
                        </div>
                        <div className={dialogButtonClass} onClick={() => this.setState({ uploadedFiles: [], successfullyUploaded: false })}
                        style={{ display: this.state.successfullyUploaded ? 'inline-block' : 'none' }}>
                            <i className="icon ban"></i>
                            <span>{this.state.w_clear}</span>
                        </div>
                        <div className={dialogPositiveButtonClass} disabled={this.state.uploadedFiles.length < 0 || this.state.isUploading} onClick={this.uploadFiles}
                        style={{ display: !this.state.successfullyUploaded ? 'inline-block' : 'none' }}>
                            <i className="icon upload"></i>
                            <span>{this.state.w_uploadFile}</span>
                        </div>
                    </DialogActions>
                </Dialog>
                <Dialog className="dialog createfile" open={this.state.isCreateFileDialogOpen} onClose={this.closeCreateFileDialog} maxWidth="xs" fullWidth={true}>
                    <DialogTitle className="header">
                        <i className="icon file alternate outline"></i><span>{this.state.w_createFile}</span>
                    </DialogTitle>
                    <DialogContent className="content">
                        <div className="ui form">
                            <div className="field create-file-name-field">
                                <label style={{ display: this.state.folderPath ? 'block' : 'none' }}>{this.state.folderPath}</label>
                                <div className="ui input left icon" id="create-file-name">
                                    <i className="file alternate outline icon"></i>
                                    <input type="text" 
                                    className="text createfile" 
                                    placeholder={this.state.w_fileName}
                                    value={this.state.createFileName}
                                    onChange={this.createFileNameChange}
                                    onKeyUp={(e) => { if(e.which == 13) { this.createFile() } }} />
                                </div>
                            </div>
                            <div className="ui error message">
                                <div className="header">{this.state.w_createFileErrorHeader}</div>
                                <p>{this.state.w_createFileErrorMessage}</p>
                            </div>
                            <div className="ui warning message">
                                <div className="header">{this.state.w_createFileWarningHeader}</div>
                                <p>{this.state.w_createFileWarningMessage}</p>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions className="actions">
                        <div className={dialogNegativeButtonClass} onClick={this.closeCreateFileDialog}>
                            <i className="icon cancel"></i>
                            <span>{this.state.w_exit}</span>
                        </div>
                        <div className={dialogPositiveButtonClass} onClick={this.createFile}>
                            <i className="icon plus"></i>
                            <span>{this.state.w_createFile}</span>
                        </div>
                    </DialogActions>
                </Dialog>
                <Dialog className="dialog createfolder" open={this.state.isCreateFolderDialogOpen} onClose={this.closeCreateFolderDialog} maxWidth="xs" fullWidth={true}>
                    <DialogTitle className="header">
                        <i className="icon folder"></i><span>{this.state.w_createFolder}</span>
                    </DialogTitle>
                    <DialogContent className="content">
                        <div className="ui form">
                            <div className="field create-folder-name-field">
                                <label style={{ display: this.state.folderPath ? 'block' : 'none' }}>{this.state.folderPath}</label>
                                <div className="ui input left icon" id="create-folder-name">
                                    <i className="folder icon"></i>
                                    <input type="text" 
                                    className="text createfolder" 
                                    placeholder={this.state.w_folderName}
                                    value={this.state.createFolderName} 
                                    onChange={this.createFolderNameChange} 
                                    onKeyUp={(e) => { if(e.which == 13) { this.createFolder() } }} />
                                </div>
                            </div>
                            <div className="ui error message">
                                <div className="header">{this.state.w_createFolderErrorHeader}</div>
                                <p>{this.state.w_createFolderErrorMessage}</p>
                            </div>
                            <div className="ui warning message">
                                <div className="header">{this.state.w_createFolderWarningHeader}</div>
                                <p>{this.state.w_createFolderWarningMessage}</p>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions className="actions">
                        <div className={dialogNegativeButtonClass} onClick={this.closeCreateFolderDialog}>
                            <i className="icon cancel"></i>
                            <span>{this.state.w_exit}</span>
                        </div>
                        <div className={dialogPositiveButtonClass} onClick={this.createFolder}>
                            <i className="icon plus"></i>
                            <span>{this.state.w_createFolder}</span>
                        </div>
                    </DialogActions>
                </Dialog>
                <Snackbar open={this.state.isSnackSuccessOpen}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={5000}
                    onClose={() => { this.setState({isSnackSuccessOpen: false}) }}>
                    <Alert onClose={() => { this.setState({isSnackSuccessOpen: false}) }} severity="success" variant="filled">
                        {this.state.snackMsg}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.isSnackErrorOpen}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={5000}
                    onClose={() => { this.setState({isSnackErrorOpen: false}) }}>
                    <Alert onClose={() => { this.setState({isSnackErrorOpen: false}) }} severity="error" variant="filled">
                        {this.state.snackMsg}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}