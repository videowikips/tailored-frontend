import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';

const fetchUserSuccess = (users) => ({
    type: actionTypes.FETCH_USER_SUCCESS,
    payload: users
});

const inviteUserSuccess = (user) => ({
    type: actionTypes.INVITE_USER_SUCCESS,
    payload: user
});

const inviteUserError = (message) => ({
    type: actionTypes.INVITE_USER_ERROR,
    payload: message
});

const removeUserSuccess = (email) => ({
    type: actionTypes.REMOVE_USER_SUCCESS,
    payload: email
});

const editPermissionSuccess = (payload) => ({
    type: actionTypes.CHANGE_PERMISSION_SUCCESS,
    payload
});

export const fetchUsers = () => dispatch => {
    requestAgent.get(Api.organization.getUsers)
        .then(({ body }) => {
            dispatch(fetchUserSuccess(body));
        });
}

export const inviteUser = ({ email, firstname, lastname, permissions }) => dispatch => {
    requestAgent.post(Api.organization.inviteUser, { email, firstname, lastname, permissions })
        .then(({ body }) => {
            const { success, user, message } = body;

            if (success) {
                dispatch(inviteUserSuccess(user));
            } else {
                dispatch(inviteUserError(message));
            }
        });
}

export const editPermissions = ({ email, permissions }) => (dispatch, getState) => {
    requestAgent.post(Api.organization.editPermissions, { email, permissions })
        .then(({ body }) => {
            const users = getState().organization.users
            users.find((u) => u.email === email).organizationRoles[0].permissions = permissions;
            dispatch(editPermissionSuccess({
                email,
                permissions
            }));
            dispatch(fetchUserSuccess([...users]));
        });
}

export const removeUser = (email) => dispatch => {
    requestAgent.post(Api.organization.removeUser, { email })
        .then(({ body }) => {
            dispatch(removeUserSuccess(email))
        });
}