import * as actionTypes from '../actions/authentication/types';

const INITIAL_STATE = {
    isAuthenticated: false,
    token: null,
    errorMessage: null
}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.AUTHENTICATION_SUCCESS:
            const token  = action.payload;
            return {
                ...state,
                isAuthenticated: true,
                token
            }

        case actionTypes.AUTHENTICATION_FAILED:
            const message = action.payload;
            return {
                ...state,
                errorMessage: message
            }

        default:
            return state;
    }
}