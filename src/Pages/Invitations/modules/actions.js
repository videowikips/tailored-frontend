import requestAgent from '../../../shared/utils/requestAgent';
import NotificationService from '../../../shared/utils/NotificationService'
import Api from '../../../shared/api';
import { push } from 'connected-react-router';
import routes from '../../../shared/routes';
import * as actionTypes from './types';
import * as authActions from '../../../actions/authentication';
import * as organizationActions from '../../../actions/organization';

const moduleName = 'invitations';

const setLoading = loading => ({
    type: actionTypes.SET_LOADING,
    payload: loading, 
})

export const setOldPassword = passsword => ({
    type: actionTypes.SET_OLD_PASSWORD,
    payload: passsword,
})

export const setPassword = password => ({
    type: actionTypes.SET_PASSWORD,
    payload: password,
})

export const setPasswordLoading = loading => ({
    type: actionTypes.SET_PASSWORD_LOADING,
    payload: loading,
})

export const setPasswordConfirm = password => ({
    type: actionTypes.SET_PASSWORD_CONFIRM,
    payload: password,
})
const setUser = user => ({
    type: actionTypes.SET_USER,
    payload: user,
})
const setShowPasswordForm = show => ({
    type: actionTypes.SET_SHOW_PASSWORD_FORM,
    payload: show,
})

export const respondToInvitation = (organizationId, status, inviteToken, email) => (dispatch) => {
    dispatch(setLoading(true))
    requestAgent.post(Api.organization.respondToInvitation(organizationId), { inviteToken, status, email })
    .then((res) => {
        const { setPassword: shouldSetPassword, tempPass, user, token } = res.body;
        dispatch(authActions.authenticationSuccess({ user, token }))
        dispatch(setUser(user));
        const organization = user.organizationRoles.find(role => role.organization._id === organizationId).organization;
        dispatch(organizationActions.setOrganization(organization))

        NotificationService.success(`You've been added to ${organization.name} Successfully`)

        if (shouldSetPassword) {
            dispatch(setOldPassword(tempPass));
            dispatch(setShowPasswordForm(true));
        } else {
            dispatch(push(routes.organizationHome()));
        }

        dispatch(setLoading(false))
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        // dispatch(push(routes.home()))
        dispatch(setLoading(false))
    })
}

export const updatePassword = () => (dispatch, getState) => {
    const { password, passwordConfirm, oldPassword, user } = getState()[moduleName];
    dispatch(setPasswordLoading(true));
    requestAgent.patch(Api.user.updatePassword(user._id), { password, passwordConfirm, oldPassword })
    .then((res) => {
        console.log(res);
        dispatch(setPasswordLoading(false));
        dispatch(push(routes.organizationHome()));
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setPasswordLoading(false))
    })

}