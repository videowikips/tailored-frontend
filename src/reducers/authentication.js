import * as actionTypes from '../actions/authentication/types';

const storedToken = localStorage.getItem('authToken');

const INITIAL_STATE = {
    isAuthenticated: false,
    user: null,
    token: storedToken,
    errorMessage: null,
    signUpMessage: null,
    signUpSuccess: null
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.LOGOUT:
            localStorage.removeItem('authToken');
            return { ...INITIAL_STATE };

        case actionTypes.AUTHENTICATION_SUCCESS:
            const { token, user } = action.payload;
            localStorage.setItem('authToken', token);

            return {
                ...state,
                isAuthenticated: true,
                errorMessage: null,
                token,
                user
            }

        case actionTypes.AUTHENTICATION_FAILED:
            const message = action.payload;
            return {
                ...state,
                errorMessage: message
            }

        case actionTypes.VALIDATE_TOKEN:
            const isValid = action.payload;
            const t = isValid ? state.token : null;

            return {
                ...state,
                isAuthenticated: isValid,
                token: t
            }

        case actionTypes.SIGNUP_SUCCESS:
            return {
                ...state,
                signUpSuccess: true,
                signUpMessage: 'You have successfully signed up. Please login to continue'
            }

        case actionTypes.SIGNUP_FAILED:
            return {
                ...state,
                signUpSuccess: false,
                signUpMessage: action.payload || 'Something went error, please try again later'
            }

        default:
            return state;
    }
}