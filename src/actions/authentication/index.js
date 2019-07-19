import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';

const authenticationSuccess = (token) => ({
    type: actionTypes.AUTHENTICATION_SUCCESS,
    payload: token,
})

const authenticationFailed = (message) => ({
    type: actionTypes.AUTHENTICATION_FAILED,
    payload: message,
})

const signUpSuccess = ()  =>({
    type: actionTypes.SIGNUP_SUCCESS
})

const signUpFaild = (message) => ({
    type: actionTypes.SIGNUP_FAILED,
    payload: message
})

const validateToken = (isValid) => ({
    type: actionTypes.VALIDATE_TOKEN,
    payload: isValid
})

export const login = ({ email, password }) => dispatch => {
    requestAgent.post(Api.authentication.login, {
        email,
        password
    }).then(result => {
        const { success, token } = result.body;

        if (success) {
            dispatch(authenticationSuccess(token));
        } else {
            dispatch(authenticationFailed('Email or Password in invalid'));
        }
    });
}

export const signUp = ({ orgName, email, password }) => dispatch => {
        
    requestAgent.post(Api.authentication.register, {
        orgName,
        email,
        password
    }).then(result => {
        const { success, message } = result.body;

        if (success) {
            dispatch(signUpSuccess());
        } else {
            dispatch(signUpFaild(message));
        }
    })
}

export const isValidToken = () => dispatch => {
    requestAgent.get(Api.user.isValidToken).then(({body}) => {
        const { isValid } = body;
        dispatch(validateToken(isValid))
    })
}