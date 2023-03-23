import React, { Component } from "react";

export default class Dropzone extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hightlight: false,
            w_dragmsg: 'Drag files here to upload' 
        }
        this.fileInputRef = React.createRef();

        this.openFileDialog = this.openFileDialog.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }
    openFileDialog() {
        if (this.props.disabled) return;
        this.fileInputRef.current.click();
    }
    onFilesAdded(evt) {
        if (this.props.disabled) return;
        let files = evt.target.files;
        if (this.props.onFilesAdded) {
            let array = this.fileListToArray(files);
            this.props.onFilesAdded(array);
        }
    }
    onDragOver(event) {
        event.preventDefault();
        if (this.props.disabled) return;
        this.setState({ hightlight: true });
    }
    onDragLeave(event) {
        this.setState({ hightlight: false });
    }
    onDrop(event) {
        event.preventDefault();
        if (this.props.disabled) return;
        let files = event.dataTransfer.files;
        if (this.props.onFilesAdded) {
            let array = this.fileListToArray(files);
            this.props.onFilesAdded(array);
        }
        this.setState({ hightlight: false });
    }
    fileListToArray(list) {
        let array = [];
        for (let i = 0; i < list.length; i++) {
            array.push(list.item(i));
        }
        return array;
    }
    componentDidUpdate(prevProps) {
        if(this.props.language != prevProps.language) {
            switch(this.props.language) {
                case "es":
                    this.setState({
                        w_dragmsg: 'Arrastra archivos aquí para subirlos'
                    });
                    break;
                default:
                    break;
            }
        }
    }

    render() {
        let dragLabel = 'Drag files here to upload';
        switch(this.props.language) {
            case "es":
                dragLabel = 'Arrastra archivos aquí para subirlos';
                break;
            default:
                break;
        }
        return (
            <div className={`dropzone ${this.state.hightlight ? "highlighted" : ""}`}
                style={{ cursor: this.props.disabled ? "default" : "pointer" }}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDrop}
                onClick={this.openFileDialog}>
                <input type="file" multiple ref={this.fileInputRef} onChange={this.onFilesAdded} />
                <i className="cloud upload icon big"></i>
                <span>{dragLabel}</span>
            </div>
        )
    }
}
