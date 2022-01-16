import * as actionTypes from './actionsTypes'
import Axios from 'axios'
const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}
export const authSuccess = (idToken, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: idToken,
        userId: userId
    }
}
export const authFailed = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error
    }
}


export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, expirationTime * 1000)
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart())
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAgmvC0AIg01GQ5YbdmnZNdYAY2CSboZDY';
        if (!isSignup) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAgmvC0AIg01GQ5YbdmnZNdYAY2CSboZDY'
        }
        Axios.post(url, authData)
            .then(response => {
                const [token, userId, expiresIn] = [response.data.idToken, response.data.localId, response.data.expiresIn]
                const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', userId)
                dispatch(authSuccess(token, userId))
                dispatch(checkAuthTimeout(expiresIn))
            })
            .catch(err => {
                dispatch(authFailed(err.response.data.error))
            })
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        if (!token) dispatch(logout())
        else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date()) {
                dispatch(logout())
            } else {
                const userId = localStorage.getItem('userId')
                dispatch(authSuccess(token, userId))
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
            }

        }

    }
}