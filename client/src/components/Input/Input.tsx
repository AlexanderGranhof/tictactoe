import React, { FunctionComponent, useEffect, InputHTMLAttributes, DetailedHTMLProps } from "react";
import "./Input.scss";

interface InputProps {
    label: string,
    id: string
}

type FloatingLabelInputType = FunctionComponent<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & InputProps>

const Input: FloatingLabelInputType = ({label, id, ...props}) => {
    return (
        <div className="input-container">
            <input spellCheck={false} placeholder=" " id={id} {...props} type="text"/>
            <label htmlFor={id}>{label}</label>
        </div>
    )
}

export default Input;