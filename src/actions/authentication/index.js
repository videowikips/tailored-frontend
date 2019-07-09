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

export const register = ({ orgName, email, password }) => dispatch => {

}