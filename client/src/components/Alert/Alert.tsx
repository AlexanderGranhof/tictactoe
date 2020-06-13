import React, { FunctionComponent } from "react";
import "./Alert.scss";
import { CSSTransition } from "react-transition-group";

interface AlertProps {
    message: string,
    show: boolean,
    className: string,
    onClose?: () => void
}

const Alert: FunctionComponent<AlertProps> = ({ show, className, message, onClose }) => {
    return (
        <CSSTransition
            in={show}
            unmountOnExit
            classNames="alert-message"
            timeout={500}
        >
            <div className={`alert-message ${className}`}>
                <span onClick={onClose} className="close-message">x</span>
                <h1 className="alert-text">{message}</h1>
            </div>
        </CSSTransition>
    )
};

export default Alert;