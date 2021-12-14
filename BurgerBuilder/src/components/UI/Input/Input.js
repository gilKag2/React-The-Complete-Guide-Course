import React from 'react'

import classes from './input.module.css';

const Input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (props.touched && props.invalid && props.shouldValidate) {
        inputClasses.push(classes.Invalid)
    }
    let inputElementProps = { ...props.elementConfig, className: inputClasses.join(' '), value: props.value }
    switch (props.elementtype) {
        case ('input'):
            inputElement = <input onChange={props.changed} {...inputElementProps} />
            break;
        case ('textarea'): inputElement = <textarea onChange={props.changed}{...inputElementProps} />
            break;
        case ('select'):
            inputElement = (
                <select className={inputClasses.join(' ')} onChange={props.changed} value={props.value}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>{option.displayValue}</option>
                    ))}
                </select>
            )
            break;
        default:
            inputElement = <input onChange={props.changed} {...inputElementProps} />
            break;
    }
    return (
        <div className={classes.Input}>
            <label className={classes.label}>{props.Label}</label>
            {inputElement}

        </div>
    )
}

export default Input;
