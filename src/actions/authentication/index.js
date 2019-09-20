import * as actionTypes from './types';
import * as orgActionTypes from '../organization/types';

import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';
import { push } from 'connected-react-router';
import routes from '../../shared/routes';
import NotificationService from '../../shared/utils/NotificationService';

export const authenticationSuccess = (userData) => ({
    type: actionTypes.AUTHENTICATION_SUCCESS,
    payload: userData,
})

export const authenticationFailed = (message) => ({
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

const setGetUserDetailsLoading = loading => ({
    type: actionTypes.SET_GET_USER_DETAILS_LOADING,
    payload: loading,
})

const setUser = user => ({
    type: actionTypes.SET_USER,
    payload: user,
})

const setSignupLoading = loading => ({
    type: actionTypes.SET_SIGNUP_LOADING,
    payload: loading,
})

export const getUserDetails = () => (dispatch) => {
    dispatch(setGetUserDetailsLoading(true))
    requestAgent.get(Api.user.getUserDetails())
    .then((res) => {
        const userData = res.body;
        dispatch(setUser(userData));
        dispatch(setGetUserDetailsLoading(false));

    })
    .catch(err => {
        dispatch(push(routes.logout()));
    })
}

export const redirectToSwitchOrganization = (token, organization) => dispatch => {
    const { protocol, hostname } = window.location;
    const hostParts = hostname.split('.')
    window.location.href = `${protocol}//${organization.name}.${hostParts[hostParts.length - 2]}.${hostParts[hostParts.length - 1]}${routes.loginRedirect()}?t=${token}&o=${organization._id}`;
}

export const authenticateWithToken = (token, organizationId) => dispatch => {
    requestAgent.post(Api.authentication.refreshToken, {
        token,
    }).then(result => {
        const { success, token, user } = result.body;

        const defaultOrg = user.organizationRoles.find(r => r.organization._id === organizationId).organization;
        if (success) {
            dispatch({
                type: orgActionTypes.SET_ORGANIZATION,
                payload: defaultOrg
            })
            setTimeout(() => {
                dispatch(authenticationSuccess({ token, user }));
                // Redirect to subroute of organization
                dispatch(push(routes.organizationHome()))
            }, 500);
        }
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(push(routes.logout()));
    })
}

export const logout = () => ({
    type: actionTypes.LOGOUT,
})

export const login = ({ email, password }) => dispatch => {
    requestAgent.post(Api.authentication.login, {
        email,
        password,
        temp: true,
    }).then(result => {
        const { success, token, user } = result.body;

        const defaultOrg = user.organizationRoles[0].organization;
        if (success) {
            dispatch({
                type: orgActionTypes.SET_ORGANIZATION,
                payload: defaultOrg
            })
            setTimeout(() => {
                dispatch(authenticationSuccess({ token, user }));
                // Redirect to subroute of organization
                dispatch(redirectToSwitchOrganization(token, defaultOrg));
            }, 500);
        } else {
            dispatch(authenticationFailed('Email or Password in invalid'));
        }
    });
}

export const signUp = ({ orgName, email, password, logo }) => dispatch => {
    dispatch(setSignupLoading(true))
    const req = requestAgent.post(Api.authentication.register)
    .field('email', email)
    .field('password', password)
    .field('orgName', orgName);
    if (logo) {
        req.attach('logo', logo);
    }

    req.then(result => {
        const { success, message } = result.body;

        if (success) {
            dispatch(signUpSuccess());
            login({email, password})(dispatch)
        } else {
            dispatch(signUpFaild(message));
        }
        dispatch(setSignupLoading(false));

    })
    .catch((err) => {
        console.log(err);
        dispatch(setSignupLoading(false));
        NotificationService.responseError(err);
    })
}

export const isValidToken = () => (dispatch, getState) => {
    requestAgent.get(Api.user.isValidToken).then(({ body }) => {
        const { isValid, user } = body;
        dispatch(validateToken(isValid))
        console.log('isvalid token')
        if (user && user.organizationRoles) {
            dispatch(authenticationSuccess({ user }));
            // dispatch({
            //     type: orgActionTypes.SET_ORGANIZATION,
            //     payload: user.organizationRoles[0].organization
            // })
        }
    })
}