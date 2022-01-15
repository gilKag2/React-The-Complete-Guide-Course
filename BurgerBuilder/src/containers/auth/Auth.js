import React, { Component } from 'react'
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import { connect } from 'react-redux'

import classes from './Auth.module.css'
import { auth, setAuthRedirectPath } from '../../store/actions/index'
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
class Auth extends Component {

    state = {
        controls: this.setUpAuthForm(),
        isSignup: true,

    }
 
    componentDidMount() {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== "/"){
            this.props.onSetAuthRedirectPath()
        }
    }
    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        };
        this.setState({ controls: updatedControls })
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return { isSignup: !prevState.isSignup }
        })
    }
    checkValidity = (value, rules) => {
        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g
            isValid = pattern.test(value) && isValid
        }
        return isValid;
    }

    onSubmitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup)
    }

    render() {
        const formElements = []
        for (let key in this.state.controls) {
            formElements.push({
                id: key,
                config: this.state.controls[key]
            })
        }
        let form = formElements.map(formElement => (
            <Input key={formElement.id}
                changed={(event) => this.inputChangedHandler(event, formElement.id)}
                elementtype={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched} />
        ))
        if (this.props.loading) {
            form = <Spinner />
        }
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            )
        }
        let authRedirect = null
        if (this.props.isAuthenticated) {

            authRedirect = <Redirect to="/" />
        }
        return (
            <div className={classes.Auth}>
                {errorMessage}
                {authRedirect}
                <form onSubmit={this.onSubmitHandler}>
                    {form}
                    <Button btnType="Success">Submit</Button>
                </form>
                <Button btnType="Danger" clicked={this.switchAuthModeHandler}>Switch To {this.state.isSignup ? 'SignIn' : 'SignUp'}</Button>
            </div>
        )
    }

    setUpAuthForm() {
        return {

            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email',
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password',
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            },
        }
    }
}
const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(setAuthRedirectPath("/"))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Auth);