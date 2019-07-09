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

export const fetchUsers = () => dispatch => {
    requestAgent.get(Api.organization.getUsers)
        .then(({ body }) => {
            dispatch(fetchUserSuccess(body));
        });
}

export const inviteUser = ({ email, firstname, lastname, role }) => dispatch => {
    requestAgent.post(Api.organization.inviteUser, { email, firstname, lastname })
        .then(({ body }) => {
            dispatch(inviteUserSuccess({
                email,
                firstname,
                lastname,
                role
            }))
        });
}

export const changePermission = ({ email, role }) => dispatch => {

}

export const removeUser = (email) => dispatch => {
    requestAgent.post(Api.organization.removeUser, { email })
        .then(({ body }) => {
            dispatch(removeUserSuccess(email))
        });
}