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

const removeUserSuccess = (userId) => ({
    type: actionTypes.REMOVE_USER_SUCCESS,
    payload: userId
});

const editPermissionSuccess = (payload) => ({
    type: actionTypes.CHANGE_PERMISSION_SUCCESS,
    payload
});

export const setOrganization = organization => ({
    type: actionTypes.SET_ORGANIZATION,
    payload: organization,
})

export const fetchUsers = (organizationId) => dispatch => {
    requestAgent.get(Api.organization.getUsers({ organization: organizationId }))
        .then(({ body }) => {
            dispatch(fetchUserSuccess(body));
        });
}

export const inviteUser = (organizationId, {  email, firstname, lastname, permissions }) => dispatch => {
    requestAgent.post(Api.organization.inviteUser(organizationId), { email, firstname, lastname, permissions })
        .then(({ body }) => {
            const { success, user, message } = body;

            if (success) {
                dispatch(inviteUserSuccess(user));
            } else {
                dispatch(inviteUserError(message));
            }
        });
}

export const editPermissions = (organizationId, userId, permissions) => (dispatch, getState) => {
    requestAgent.patch(Api.organization.editPermissions(organizationId, userId), { permissions })
        .then(({ body }) => {
            const users = getState().organization.users
            users.find((u) => u._id === userId).organizationRoles.find(role => role.organization === organizationId).permissions = permissions;
            dispatch(editPermissionSuccess({
                userId,
                permissions
            }));
            dispatch(fetchUserSuccess([...users]));
        });
}

export const removeUser = (organizationId, userId) => dispatch => {
    requestAgent.delete(Api.organization.removeUser(organizationId, userId))
        .then(({ body }) => {
            dispatch(removeUserSuccess(userId))
        });
}