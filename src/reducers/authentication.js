import * as actionTypes from '../actions/authentication/types';

const storedToken = localStorage.getItem('authToken');

const INITIAL_STATE = {
    isAuthenticated: !!storedToken,
    token: storedToken,
    errorMessage: null
}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.AUTHENTICATION_SUCCESS:
            const token  = action.payload;
            localStorage.setItem('authToken', token);
            
            return {
                ...state,
                isAuthenticated: true,
                errorMessage: null,
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