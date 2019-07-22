import * as actionTypes from './types';
import * as orgActionTypes from '../organization/types';

import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';

const authenticationSuccess = (userData) => ({
    type: actionTypes.AUTHENTICATION_SUCCESS,
    payload: userData,
})

const authenticationFailed = (message) => ({
    type: actionTypes.AUTHENTICATION_FAILED,
    payload: message,
})

const signUpSuccess = () => ({
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

export const logout = () => ({
    type: actionTypes.LOGOUT,
})

export const login = ({ email, password }) => dispatch => {
    requestAgent.post(Api.authentication.login, {
        email,
        password
    }).then(result => {
        const { success, token, user } = result.body;

        if (success) {
            dispatch(authenticationSuccess({ token, user }));
            dispatch({
                type: orgActionTypes.SET_ORGANIZATION,
                payload: user.organizationRoles[0].organization
            })
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

export const isValidToken = () => (dispatch, getState) => {
    requestAgent.get(Api.user.isValidToken).then(({ body }) => {
        const { isValid } = body;
        const { user } = getState().authentication;
        dispatch(validateToken(isValid))
        console.log('isvalid token')
        if (user && user.organizationRoles) {
            dispatch({
                type: orgActionTypes.SET_ORGANIZATION,
                payload: user.organizationRoles[0].organization
            })
        }
    })
}