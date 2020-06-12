import React, { FunctionComponent, useState, useEffect } from "react";
import "./LoadingIcon.scss";

const LoadingIcon: FunctionComponent = props => {
    return (
        <div {...props} className="loading-icon">
            <span className="pointer" />
            <div className="group">
                <span className="line" />
                <span className="line" />
            </div>
            <div className="group vertical">
                <span className="line" />
                <span className="line" />
            </div>
        </div>
    )
};

export default LoadingIcon;