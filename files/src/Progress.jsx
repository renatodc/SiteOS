import React, { Component } from "react";

export default class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="uploadfile-bar-bg">
                <div className="uploadfile-bar" style={{ width: this.props.progress + "%", animationIterationCount: this.props.progress == 100 ? 0 : "infinite"}} />
            </div>
        );
    }
}