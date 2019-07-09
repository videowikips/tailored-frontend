import * as actionTypes from '../actions/organization/types';

const INITIAL_STATE = {
    users: [],
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.FETCH_USER_SUCCESS:
            return {
                ...state,
                users: action.payload
            };

        case actionTypes.INVITE_USER_SUCCESS:
            return {
                ...state,
                users: [...state.users, action.payload]
            }

        default:
            return state;
    }
}