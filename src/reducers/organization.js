import * as actionTypes from '../actions/organization/types';

const INITIAL_STATE = {
    users: [],
    organization: null,
    permissionUpdateMessage: null,
    inviteUserSuccess: null,
    inviteUserMessage: null,
    removeUserSuccess: null
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.SET_ORGANIZATION:
            return { ...state, organization: action.payload };
        case actionTypes.FETCH_USER_SUCCESS:
            return {
                ...state,
                users: action.payload
            };

        case actionTypes.INVITE_USER_SUCCESS:
            return {
                ...state,
                inviteUserSuccess: true,
                users: [...state.users, action.payload]
            }

        case actionTypes.INVITE_USER_ERROR:
            console.log('INVITE_USER_ERROR');

            return {
                ...state,
                inviteUserSuccess: false,
                inviteUserMessage: action.payload
            }

        case actionTypes.CHANGE_PERMISSION_SUCCESS:
            return {
                ...state,
                permissionUpdateMessage: 'Permission Changed Successfully'
            }

        case actionTypes.REMOVE_USER_SUCCESS:
            const users = state.users.filter((user) => {
                return user._id !== action.payload
            });
            
            return {
                ...state,
                users,
                removeUserSuccess: true
            }

        default:
            return state;
    }
}