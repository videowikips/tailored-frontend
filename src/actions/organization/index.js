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
            const { success, user } = body;

            if (success) {
                dispatch(inviteUserSuccess(user))
            }
        });
}

export const editPermissions = ({ email, permissions }) => dispatch => {
    requestAgent.post(Api.organization.editPermissions, { email, permissions })
        .then(({ body }) => {
            dispatch(editPermissionSuccess({
                email,
                permissions
            }));
        });
}

export const removeUser = (email) => dispatch => {
    requestAgent.post(Api.organization.removeUser, { email })
        .then(({ body }) => {
            dispatch(removeUserSuccess(email))
        });
}