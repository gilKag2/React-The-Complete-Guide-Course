import React from 'react'

import classes from './input.module.css';

const Input = (props) => {
    let inputElement = null;
    let inputElementProps = { ...props.elementConfig, className: classes.InputElement, value: props.value }
    switch (props.elementtype) {
        case ('input'):
            console.log("here");
            inputElement = <input className={classes.InputElement} onChange={props.changed} {...inputElementProps} />
            break;
        case ('textarea'): inputElement = <textarea className={classes.InputElement} onChange={props.changed}{...inputElementProps} />
            break;
        case ('select'):
            inputElement = (
                <select className={classes.InputElement} onChange={props.changed} value={props.value}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>{option.displayValue}</option>
                    ))}
                </select>
            )
            break;
        default:
            inputElement = <input className={classes.InputElement} onChange={props.changed} {...inputElementProps} />

    }
    return (
        <div className={classes.Input}>
            <label className={classes.label}>{props.Label}</label>
            {inputElement}

        </div>
    )
}

export default Input;
